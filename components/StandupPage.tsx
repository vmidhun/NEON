import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Task, TaskStatus, UserRole, Employee } from '../types';
import { useAuth } from '../AuthContext';
import { Calendar, User, CheckCircle, Circle, AlertCircle, Clock, Plus, BarChart2 } from 'lucide-react';

const StandupPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const isManager = user?.role === UserRole.Manager || user?.role === UserRole.Admin || user?.role === UserRole.TenantAdmin;

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // In a real app, these would be filtered by date and team on the server
            const [allTasks, allUsers] = await Promise.all([
                api.getTasks(),
                api.getUsers()
            ]);
            setTasks(allTasks); // Client-side filtering in this mockup
            if (isManager) {
                // Filter users for "My Team" - Mock logic
                setTeamMembers(allUsers.filter((u: Employee) => u.teamId === user?.teamId || u.reportingManagerId === user?.id));
            }
        } catch (err) {
            console.error("Failed to fetch standup data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
        try {
            // Optimistic update
            const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
            setTasks(updatedTasks);
            
            // API call would go here
            // await api.updateTask(taskId, { status: newStatus });
            
            // To simulate success for now
            console.log(`Updated task ${taskId} to ${newStatus}`);
        } catch (err) {
            console.error("Failed to update task", err);
            // Revert on failure
            fetchData();
        }
    };

    const getTasksForUser = (userId: string) => {
        // Mock filter: In reality, tasks should be linked to dates or deadlines
        // For now, showing all assigned tasks
        return tasks.filter(t => t.assignedTo === userId || (!t.assignedTo && userId === user?.id)); // Fallback for demo
    };

    const renderTaskItem = (task: Task, readOnly: boolean = false) => {
        const statusColors = {
            [TaskStatus.ToDo]: 'bg-slate-100 text-slate-600 border-slate-200',
            [TaskStatus.InProgress]: 'bg-blue-50 text-blue-600 border-blue-200',
            [TaskStatus.Completed]: 'bg-green-50 text-green-600 border-green-200',
            [TaskStatus.Blocked]: 'bg-red-50 text-red-600 border-red-200',
        };

        const StatusIcon = {
            [TaskStatus.ToDo]: Circle,
            [TaskStatus.InProgress]: Clock,
            [TaskStatus.Completed]: CheckCircle,
            [TaskStatus.Blocked]: AlertCircle,
        }[task.status] || Circle;

        return (
            <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm mb-2 hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                    <span className="font-medium text-slate-800 text-sm">{task.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                           {task.allocatedHours}h
                        </span>
                        {task.job?.name && (
                            <span className="text-xs text-slate-400">
                                {task.job?.project?.client?.name} / {task.job?.project?.name}
                            </span>
                        )}
                        {task.isAiGenerated && (
                            <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded border border-purple-200">
                                AI Generated
                            </span>
                        )}
                    </div>
                </div>

                {!readOnly && (
                    <div className="flex items-center gap-1">
                        {Object.values(TaskStatus).map((status) => {
                             const Icon = {
                                [TaskStatus.ToDo]: Circle,
                                [TaskStatus.InProgress]: Clock,
                                [TaskStatus.Completed]: CheckCircle,
                                [TaskStatus.Blocked]: AlertCircle,
                            }[status];
                            
                            const isActive = task.status === status;
                            
                            return (
                                <button
                                    key={status}
                                    title={`Mark as ${status}`}
                                    onClick={() => handleTaskStatusUpdate(task.id, status as TaskStatus)}
                                    className={`p-1.5 rounded-full transition-all ${
                                        isActive 
                                            ? statusColors[status as TaskStatus] 
                                            : 'text-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon size={16} />
                                </button>
                            );
                        })}
                    </div>
                )}
                 {readOnly && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[task.status]}`}>
                        <StatusIcon size={12} />
                        {task.status}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart2 className="text-blue-600" />
                        Daily Stand-up
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Track daily progress and blockers.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <Calendar size={18} className="text-slate-500" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 outline-none"
                        />
                    </div>
                    {isManager && (
                         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus size={16} />
                            Plan Tasks with AI
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading stand-up data...</div>
            ) : isManager ? (
                // Manager View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.length > 0 ? teamMembers.map(member => (
                        <div key={member._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                    {member.avatarUrl ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover"/> : member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{member.name}</h3>
                                    <p className="text-xs text-slate-500">{member.designation || 'Team Member'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50/50 flex-1">
                                {getTasksForUser(member._id).length > 0 ? (
                                    getTasksForUser(member._id).map(task => renderTaskItem(task))
                                ) : (
                                    <div className="text-center py-8 text-slate-400 text-sm italic">
                                        No tasks assigned for today.
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-slate-100 bg-white text-xs text-center text-blue-600 font-medium cursor-pointer hover:bg-blue-50 transition-colors">
                                + Assign Task
                            </div>
                        </div>
                    )) : (
                         <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <User size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No team members found.</p>
                            <p className="text-sm text-slate-400">Add employees to your team to start tracking.</p>
                        </div>
                    )}
                </div>
            ) : (
                // Employee View (Self)
                 <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <User size={20} className="text-blue-500" />
                             My Tasks for {new Date(selectedDate).toLocaleDateString()}
                        </h3>
                        <div className="space-y-3">
                             {getTasksForUser(user?.id || '').length > 0 ? (
                                getTasksForUser(user?.id || '').map(task => renderTaskItem(task))
                             ) : (
                                 <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                                    No tasks for today. Enjoy your day!
                                 </div>
                             )}
                        </div>
                         <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Add a Self-Task</h4>
                            <div className="flex gap-2">
                                <input type="text" placeholder="What are you working on?" className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none border-slate-200" />
                                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StandupPage;
