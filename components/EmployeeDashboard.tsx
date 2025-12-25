import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task, TimeLog, TaskStatus, Employee, LeaveBalance, LeaveRequest } from '../types';
import { ALL_TASKS, REQUIRED_DAILY_HOURS, ClockIcon, SparklesIcon, ArrowRightOnRectangleIcon } from '../constants';
import DashboardCard from './DashboardCard';
import TaskItem from './TaskItem';
import TimeLogModal from './TimeLogModal';
import { suggestDailyPlan } from '../services/geminiService';
import { api } from '../services/api';

interface EmployeeDashboardProps {
  currentUser: Employee;
  onNavigate: (page: string) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ currentUser, onNavigate }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [dailyPlan, setDailyPlan] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [selectedTaskForLog, setSelectedTaskForLog] = useState<Task | null>(null);
  const [isLoadingAiPlan, setIsLoadingAiPlan] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Leave Management State
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);

  // Derived State
  const totalLoggedHours = useMemo(() => {
    return timeLogs.reduce((acc, log) => acc + log.loggedHours, 0);
  }, [timeLogs]);

  const isOnLeaveToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return myLeaves.find(l =>
      l.status === 'Approved' &&
      new Date(l.startDate).toISOString().split('T')[0] <= today &&
      new Date(l.endDate).toISOString().split('T')[0] >= today
    );
  }, [myLeaves]);

  const upcomingHolidays = [
    { name: "Christmas", date: "2025-12-25" },
    { name: "New Year", date: "2026-01-01" },
    { name: "Republic Day", date: "2026-01-26" }
  ];

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const [balance, team, my] = await Promise.all([
          api.getMyBalance(),
          api.getTeamLeaves(),
          api.getMyLeaves()
        ]);
        setLeaveBalance(balance);
        setTeamLeaves(team);
        setMyLeaves(my);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      }
    };
    fetchLeaveData();
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setDailyPlan([]); 
  };
  
  const handleCheckout = () => {
      if(totalLoggedHours < REQUIRED_DAILY_HOURS) {
          if(!window.confirm(`You have only logged ${totalLoggedHours.toFixed(2)} hours. Are you sure you want to check out?`)) {
              return;
          }
      }
    setIsCheckedIn(false);
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
    <div className="space-y-6">
      {/* Header Section */}
      <DashboardCard className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-blue-100">{currentUser.designation || 'Employee'} • {currentUser.teamId || 'No Project'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('leaves')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-all"
            >
              Apply Leave
            </button>
            <button onClick={() => window.alert('Short Break Requested')} className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-all">
              Request Break
            </button>
            {!isCheckedIn ? (
              <button onClick={handleCheckIn} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">
                <ClockIcon className="w-5 h-5" /> Check In
              </button>
            ) : (
              <button onClick={handleCheckout} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">
                <ArrowRightOnRectangleIcon className="w-5 h-5" /> Check Out
              </button>
            )}
          </div>
        </div>
      </DashboardCard>

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

          {/* Today's Plan */}
          <DashboardCard title="Today's Plan">
            {isOnLeaveToday && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
                <SparklesIcon className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-bold">You are on leave today ({isOnLeaveToday.leaveType})</p>
                  <p className="text-sm">Enjoy your time off! Tasks are paused.</p>
                </div>
              </div>
            )}

            {isCheckedIn ? (
              dailyPlan.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">Your daily plan is empty.</p>
                  <button onClick={handleGeneratePlan} disabled={isLoadingAiPlan} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                    {isLoadingAiPlan ? 'Generating...' : <><SparklesIcon className="w-5 h-5" /> AI Suggest Plan</>}
                  </button>
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
              )
            ) : (
              <div className="text-center py-12 text-slate-500">
                <ClockIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Check in to view or generate your daily plan.</p>
              </div>
            )}
          </DashboardCard>

          {/* Who's on Leave */}
          <DashboardCard title="Who's on Leave (Next 7 Days)">
            {teamLeaves.length === 0 ? (
              <p className="text-slate-500">Everyone is available this week.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamLeaves.slice(0, 6).map((leave, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <img
                      src={(leave.userId as any).avatarUrl || `https://ui-avatars.com/api/?name=${(leave.userId as any).name}`}
                      className="w-10 h-10 rounded-full object-cover grayscale"
                      alt="User"
                    />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{(leave.userId as any).name}</p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-amber-600">{leave.leaveType}</span>
                        <span className="mx-1">•</span>
                        {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Leave Snapshot */}
          <DashboardCard title="Leave Snapshot">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Planned</p>
                <p className="text-xl font-bold text-blue-700">{leaveBalance?.annual || 0} <span className="text-xs text-slate-400 font-normal">bal</span></p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Sick</p>
                <p className="text-xl font-bold text-rose-700">{leaveBalance?.sick || 0} <span className="text-xs text-slate-400 font-normal">bal</span></p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Floating</p>
                <p className="text-xl font-bold text-indigo-700">2 <span className="text-xs text-slate-400 font-normal">bal</span></p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Used</p>
                <p className="text-xl font-bold text-slate-700">{(leaveBalance as any)?.used || 3}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Upcoming Holidays</h4>
              <ul className="space-y-3">
                {upcomingHolidays.map((h, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">{h.name}</span>
                    <span className="font-medium text-slate-800">{new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DashboardCard>

          {/* Timesheet Summary */}
          <DashboardCard title="Timesheet Summary">
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                  <Bar dataKey="Logged" fill="#3b82f6" radius={[4, 4, 4, 4]} background={{ fill: '#f1f5f9', radius: 4 }} barSize={30} />
                  <Bar dataKey="Required" fill="#94a3b8" radius={[4, 4, 4, 4]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-3xl font-bold text-slate-800">{totalLoggedHours.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {REQUIRED_DAILY_HOURS}h</span></p>
              <p className="text-xs text-slate-500">Logged vs Required (Today)</p>
            </div>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;