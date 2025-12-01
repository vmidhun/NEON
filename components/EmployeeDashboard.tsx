
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task, TimeLog, TaskStatus } from '../types';
import { ALL_TASKS, REQUIRED_DAILY_HOURS, ClockIcon, SparklesIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from '../constants';
import DashboardCard from './DashboardCard';
import TaskItem from './TaskItem';
import TimeLogModal from './TimeLogModal';
import { suggestDailyPlan } from '../services/geminiService';

const EmployeeDashboard: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [dailyPlan, setDailyPlan] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [selectedTaskForLog, setSelectedTaskForLog] = useState<Task | null>(null);
  const [isLoadingAiPlan, setIsLoadingAiPlan] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const totalLoggedHours = useMemo(() => {
    return timeLogs.reduce((acc, log) => acc + log.loggedHours, 0);
  }, [timeLogs]);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    // Initially, the plan is empty. User can generate one.
    setDailyPlan([]); 
  };
  
  const handleCheckout = () => {
      if(totalLoggedHours < REQUIRED_DAILY_HOURS) {
          if(!window.confirm(`You have only logged ${totalLoggedHours.toFixed(2)} hours. Are you sure you want to check out?`)) {
              return;
          }
      }
      setIsCheckedIn(false);
      // Reset for next day
      setCheckInTime(null);
      setDailyPlan([]);
      setTimeLogs([]);
  };

  const handleGeneratePlan = useCallback(async () => {
    setIsLoadingAiPlan(true);
    setAiError(null);
    try {
      const suggestedPlan = await suggestDailyPlan(ALL_TASKS);
      const newPlan = suggestedPlan.map(p => {
        const originalTask = ALL_TASKS.find(t => t.id === p.id);
        return originalTask ? { ...originalTask, allocatedHours: p.allocatedHours ?? 0, status: TaskStatus.ToDo } : null;
      }).filter((t): t is Task => t !== null);
      setDailyPlan(newPlan);
    } catch (error) {
        if(error instanceof Error) {
            setAiError(error.message);
        } else {
            setAiError("An unknown error occurred.");
        }
    } finally {
      setIsLoadingAiPlan(false);
    }
  }, []);

  const handleLogTimeClick = (task: Task) => {
    setSelectedTaskForLog(task);
    setShowTimeLogModal(true);
  };

  const handleLogTime = (taskId: string, hours: number, notes: string) => {
    const newLog: TimeLog = {
      id: `log_${Date.now()}`,
      taskId,
      loggedHours: hours,
      notes,
      date: new Date().toISOString(),
    };
    setTimeLogs(prev => [...prev, newLog]);
    setDailyPlan(prev => prev.map(task => 
        task.id === taskId && task.status === TaskStatus.ToDo ? { ...task, status: TaskStatus.InProgress } : task
    ));
  };
  
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
      setDailyPlan(prev => prev.map(task =>
          task.id === taskId ? { ...task, status } : task
      ));
  };

  const getLoggedHoursForTask = (taskId: string) => {
    return timeLogs
      .filter(log => log.taskId === taskId)
      .reduce((acc, log) => acc + log.loggedHours, 0);
  };

  const chartData = [{
    name: 'Hours',
    Logged: totalLoggedHours,
    Required: REQUIRED_DAILY_HOURS
  }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {showTimeLogModal && selectedTaskForLog && (
        <TimeLogModal
          task={selectedTaskForLog}
          onClose={() => setShowTimeLogModal(false)}
          onLogTime={handleLogTime}
          loggedHoursForTask={getLoggedHoursForTask(selectedTaskForLog.id)}
        />
      )}

      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <DashboardCard>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Your Daily Dashboard</h2>
              <p className="text-slate-500">
                {isCheckedIn && checkInTime
                  ? `Checked in at ${checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : "Welcome! Let's get your day started."}
              </p>
            </div>
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <ClockIcon className="w-6 h-6" />
                Check In
              </button>
            ) : (
                <button
                onClick={handleCheckout}
                className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all transform hover:scale-105"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                Check Out
              </button>
            )}
          </div>
        </DashboardCard>
        
        {isCheckedIn && (
          <DashboardCard title="Today's Plan">
            {dailyPlan.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">Your daily plan is empty.</p>
                    <button onClick={handleGeneratePlan} disabled={isLoadingAiPlan} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoadingAiPlan ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5"/>
                                Generate Suggested Plan with AI
                            </>
                        )}
                    </button>
                    {aiError && <p className="text-red-500 text-sm mt-4">{aiError}</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    {dailyPlan.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onLogTimeClick={handleLogTimeClick}
                            onStatusChange={handleStatusChange}
                            loggedHours={getLoggedHoursForTask(task.id)}
                        />
                    ))}
                </div>
            )}
          </DashboardCard>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <DashboardCard title="Hours Summary">
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide/>
                    <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}/>
                    <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
                    <Bar dataKey="Logged" fill="#3b82f6" radius={[4, 4, 4, 4]} background={{ fill: '#e2e8f0', radius: 4 }}/>
                    <Bar dataKey="Required" fill="#94a3b8" radius={[4, 4, 4, 4]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
                <p className="text-3xl font-bold">{totalLoggedHours.toFixed(2)} <span className="text-lg font-normal text-slate-500">/ {REQUIRED_DAILY_HOURS} hrs</span></p>
                <p className="text-sm text-slate-500">Total hours logged today</p>
            </div>
        </DashboardCard>
        
        <DashboardCard title="Leave Balance">
            <div className="flex justify-around text-center">
                <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-slate-500">Annual</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-slate-500">Sick</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-slate-500">Casual</p>
                </div>
            </div>
        </DashboardCard>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
