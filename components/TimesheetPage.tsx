import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Employee, Project, TimeLog, LeaveRequest } from '../types';
import { useAuth } from '../AuthContext';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, CheckCircle, Smartphone, AlertTriangle } from 'lucide-react';
import TimeLogModal from './TimeLogModal';

interface Timesheet {
    _id: string;
    userId: string;
    periodStartDate: string;
    periodEndDate: string;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    approverId?: string;
    timeLogs: TimeLog[];
    rejectionReason?: string;
}

const TimesheetPage: React.FC = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [logs, setLogs] = useState<TimeLog[]>([]);
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]); 

    const isManager = user?.role === 'Manager' || user?.role === 'Admin';
    const [managerView, setManagerView] = useState(false);

    // Helper to get week range
    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay()); // Sunday
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Saturday
        return { start, end };
    };

    const period = useMemo(() => getWeekRange(currentDate), [currentDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lData, tData, leaveData] = await Promise.all([
                api.getTimeLogs(),
                api.getTasks(),
                api.getMyLeaves()
            ]);
            setLogs(lData);
            setTasks(tData);
            setMyLeaves(leaveData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    const getDailyTotal = (dateStr: string) => {
        return logs
            .filter(l => new Date(l.date).toISOString().split('T')[0] === dateStr)
            .reduce((acc, curr) => acc + curr.loggedHours, 0);
    };

    const getLeaveStatusForDate = (dateStr: string) => {
        const leave = myLeaves.find(l => {
             const start = new Date(l.startDate).toISOString().split('T')[0];
             const end = new Date(l.endDate).toISOString().split('T')[0];
             return dateStr >= start && dateStr <= end && l.status === 'Approved';
        });
        return leave ? leave.leaveType : null;
    };

    // Calculate Weekly Total
    const weeklyTotal = logs.filter(l => {
        const d = new Date(l.date);
        return d >= period.start && d <= period.end;
    }).reduce((acc, curr) => acc + curr.loggedHours, 0);

    const periodStats = useMemo(() => {
        let required = 0;
        let logged = 0;
        let leaveHours = 0;
        let warnings = [];

        for(let i=0; i<7; i++) {
             const d = new Date(period.start);
             d.setDate(period.start.getDate() + i);
             const dateStr = d.toISOString().split('T')[0];
             const isWeekend = d.getDay() === 0 || d.getDay() === 6;
             
             if (!isWeekend) {
                 const daily = getDailyTotal(dateStr);
                 const leaveType = getLeaveStatusForDate(dateStr);
                 
                 logged += daily;
                 if (leaveType) {
                     leaveHours += 8; // Assuming full day leave
                 } else {
                     required += 8;
                     if (daily < 8 && d <= new Date()) {
                         warnings.push(`Under-logged on ${d.toLocaleDateString()}`);
                     }
                 }
             }
        }
        return { required, logged, leaveHours, warnings };
    }, [period, logs, myLeaves]);

    const handleSubmitTimesheet = async () => {
        if (periodStats.warnings.length > 0) {
             if(!window.confirm(`You have warnings:\n${periodStats.warnings.join('\n')}\nSubmit anyway?`)) return;
        }

        if (!window.confirm(`Submit timesheet for ${period.start.toLocaleDateString()} - ${period.end.toLocaleDateString()}? Total Hours: ${weeklyTotal}`)) return;
        
        const periodLogs = logs.filter(l => {
            const d = new Date(l.date);
            return d >= period.start && d <= period.end;
        });

        if (periodLogs.length === 0) {
            alert('No logs to submit for this period.');
            return;
        }

        try {
            await api.submitTimesheet({
                userId: user?.id,
                periodStartDate: period.start,
                periodEndDate: period.end,
                timeLogIds: periodLogs.map(l => l._id)
            });
            alert('Timesheet submitted successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to submit timesheet.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Timesheets</h2>
                    <p className="text-slate-500">Track your work hours and submit for approval.</p>
                </div>
                {isManager && (
                    <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                        <button 
                            onClick={() => setManagerView(false)}
                            className={`px-3 py-1.5 rounded-md transition-all ${!managerView ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            My Timesheet
                        </button>
                        <button 
                            onClick={() => setManagerView(true)}
                            className={`px-3 py-1.5 rounded-md transition-all ${managerView ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Approvals
                        </button>
                    </div>
                )}
            </div>

            {!managerView ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Calendar Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Calendar Nav */}
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <button onClick={() => navigateWeek('prev')} className="p-1 hover:bg-slate-200 rounded"><ChevronLeft /></button>
                                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                                        <Calendar size={18} />
                                        <span>{period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}</span>
                                    </div>
                                    <button onClick={() => navigateWeek('next')} className="p-1 hover:bg-slate-200 rounded"><ChevronRight /></button>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <button 
                                        onClick={handleSubmitTimesheet}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium text-sm disabled:bg-slate-300"
                                        disabled={periodStats.warnings.length > 0 && false} // Just a visual indicator usually
                                    >
                                        Submit Timesheet
                                    </button>
                                 </div>
                            </div>
        
                            {/* Weekly Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-4 mb-4">
                                     {Array.from({ length: 7 }).map((_, i) => {
                                         const d = new Date(period.start);
                                         d.setDate(period.start.getDate() + i);
                                         const dateStr = d.toISOString().split('T')[0];
                                         const isToday = new Date().toISOString().split('T')[0] === dateStr;
                                         const dailyHours = getDailyTotal(dateStr);
                                         const leaveType = getLeaveStatusForDate(dateStr);
                                         
                                         return (
                                             <div key={i} className={`relative flex flex-col justify-between p-3 rounded-lg border h-32 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                                                 <div>
                                                     <div className="text-xs text-slate-500 uppercase font-bold mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                     <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>{d.getDate()}</div>
                                                 </div>
                                                 
                                                 <div className="space-y-1">
                                                     {leaveType && (
                                                         <div className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded truncate">
                                                             {leaveType}
                                                         </div>
                                                     )}
                                                     
                                                      {dailyHours > 0 ? (
                                                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                              <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((dailyHours/8)*100, 100)}%`}}></div>
                                                          </div>
                                                      ) : (
                                                          !leaveType && d.getDay() !== 0 && d.getDay() !== 6 && <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
                                                      )}
                                                      <div className="text-right text-xs font-medium text-slate-600">{dailyHours}h</div>
                                                 </div>
                                             </div>
                                         );
                                     })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                             <h3 className="font-bold text-slate-800 mb-4">Week Summary</h3>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span className="text-slate-500">Required</span>
                                         <span className="font-medium">{periodStats.required}h</span>
                                     </div>
                                     <div className="w-full bg-slate-100 rounded-full h-2">
                                         <div className="bg-slate-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span className="text-slate-500">Logged</span>
                                         <span className="font-medium">{periodStats.logged}h</span>
                                     </div>
                                     <div className="w-full bg-slate-100 rounded-full h-2">
                                         <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((periodStats.logged/periodStats.required || 1)*100, 100)}%` }}></div>
                                     </div>
                                 </div>
                                  <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span className="text-slate-500">Leave</span>
                                         <span className="font-medium">{periodStats.leaveHours}h</span>
                                     </div>
                                     <div className="w-full bg-slate-100 rounded-full h-2">
                                         <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${Math.min((periodStats.leaveHours/40)*100, 100)}%` }}></div>
                                     </div>
                                 </div>
                             </div>

                             {periodStats.warnings.length > 0 && (
                                 <div className="mt-6 bg-red-50 border border-red-100 p-3 rounded-lg">
                                     <h4 className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
                                         <AlertTriangle size={14}/> Attention needed
                                     </h4>
                                     <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                                         {periodStats.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                     </ul>
                                     <button className="text-xs text-red-700 font-bold underline mt-2">Fix Entries</button>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>
            ) : (
                // Manager View
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Approvals</h3>
                     <p className="text-slate-500 italic">Coming soon: Full approval workflow UI.</p>
                </div>
            )}
        </div>
    );
};

export default TimesheetPage;
