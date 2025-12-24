import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../AuthContext';
import { LeaveRequest, LeaveBalance, LeaveType, UserRole } from '../types';
import { Calendar, Clock, CheckCircle, XCircle, FileText, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';

const LeavePage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-leaves' | 'calendar' | 'approvals' | 'allocation'>('my-leaves');
    
    // Data State
    const [balance, setBalance] = useState<LeaveBalance | null>(null);
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
    const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyForm, setApplyForm] = useState({
        leaveType: 'Annual',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'my-leaves') {
                const [bal, leaves] = await Promise.all([
                    api.getMyBalance(),
                    api.getMyLeaves()
                ]);
                setBalance(bal);
                setMyLeaves(leaves);
            } else if (activeTab === 'approvals') {
                const pending = await api.getPendingLeaves();
                setPendingLeaves(pending);
            } else if (activeTab === 'calendar') {
                const teamData = await api.getTeamLeaves();
                setTeamLeaves(teamData);
            }
        } catch (err) {
            console.error("Error fetching leave data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.applyLeave(applyForm);
            setShowApplyModal(false);
            setApplyForm({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' }); // Reset
            fetchData(); // Refresh my leaves
        } catch (err) {
            alert('Failed to apply for leave');
        }
    };

    const handleApproval = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await api.updateLeaveStatus(id, status);
            fetchData(); // Refresh pending list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-100';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    // Render Components
    const renderMyLeaves = () => (
        <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Annual Leave', val: balance?.annual || 0, color: 'text-blue-600', icon: Calendar },
                    { label: 'Sick Leave', val: balance?.sick || 0, color: 'text-rose-600', icon: Plus },
                    { label: 'Casual Leave', val: balance?.casual || 0, color: 'text-amber-600', icon: Clock },
                    { label: 'Loss Of Pay', val: balance?.lossOfPay || 0, color: 'text-slate-600', icon: FileText }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{item.label}</p>
                            <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
                        </div>
                        <div className={`p-3 rounded-full ${item.color.replace('text-', 'bg-').replace('600', '50')}`}>
                            <item.icon size={20} className={item.color} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">My Requests</h3>
                <button 
                    onClick={() => setShowApplyModal(true)}
                    className="px-4 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#008CCF] shadow-sm font-medium flex items-center gap-2"
                >
                    <Plus size={18} /> Apply Leave
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Days</th>
                            <th className="px-6 py-3">Reason</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myLeaves.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No leave history found.</td></tr>
                        ) : (
                            myLeaves.map(leave => (
                                <tr key={leave._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-700">{leave.leaveType}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{leave.daysCount}</td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderApprovals = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pending Approvals</h3>
            <div className="grid gap-4">
                {pendingLeaves.length === 0 ? (
                    <p className="text-slate-400">No pending requests.</p>
                ) : (
                    pendingLeaves.map(req => (
                        <div key={req._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <img 
                                    src={(req.userId as any).avatarUrl || `https://ui-avatars.com/api/?name=${(req.userId as any).name}`} 
                                    className="w-10 h-10 rounded-full object-cover"
                                    alt="User"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-800">{(req.userId as any).name}</h4>
                                    <p className="text-sm text-slate-500 mb-1">{(req.userId as any).designation || 'Employee'}</p>
                                    <div className="flex gap-2 text-sm mt-2">
                                        <span className="font-medium text-slate-700">{req.leaveType}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-600">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-600 font-bold">{req.daysCount} Days</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                                        <span className="font-semibold text-xs uppercase text-slate-400 block mb-1">Reason</span>
                                        {req.reason}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 justify-center min-w-[120px]">
                                <button 
                                    onClick={() => handleApproval(req._id, 'Approved')}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleApproval(req._id, 'Rejected')}
                                    className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium text-sm"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderCalendar = () => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Team Availability</h3>
            {/* 
                For Planning Phase: A simple list or basic grid. 
                Improvement: Use a library like react-big-calendar or fullcalendar later.
                For now, let's just list who is away in the next 30 days.
            */}
            {teamLeaves.length === 0 ? (
                 <p className="text-slate-400">Everyone is present! (No approved leaves found)</p>
            ) : (
                <div className="space-y-3">
                    {teamLeaves.map(leave => (
                        <div key={leave._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="w-2 h-12 bg-amber-400 rounded-full"></div>
                             <img 
                                src={(leave.userId as any).avatarUrl || `https://ui-avatars.com/api/?name=${(leave.userId as any).name}`} 
                                className="w-10 h-10 rounded-full object-cover grayscale"
                                alt="User"
                            />
                            <div>
                                <h4 className="font-bold text-slate-700">{(leave.userId as any).name}</h4>
                                <p className="text-xs text-slate-500">
                                    Away for <span className="font-bold">{leave.leaveType}</span> from {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Leave Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
                <button 
                    onClick={() => setActiveTab('my-leaves')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'my-leaves' ? 'bg-white text-[#00AEEF] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    My Leaves
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-white text-[#00AEEF] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Team Calendar
                </button>
                {(user?.role === UserRole.Admin || user?.role === UserRole.HR || user?.role === UserRole.ScrumMaster || user?.hierarchyLevel <= 2) && (
                    <button 
                        onClick={() => setActiveTab('approvals')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'approvals' ? 'bg-white text-[#00AEEF] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Approvals
                        {/* Ideally a badge count here */}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'my-leaves' && renderMyLeaves()}
                {activeTab === 'approvals' && renderApprovals()}
                {activeTab === 'calendar' && renderCalendar()}
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Apply for Leave</h3>
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Leave Type</label>
                                <select 
                                    className="w-full border rounded-lg p-2 bg-slate-50"
                                    value={applyForm.leaveType}
                                    onChange={e => setApplyForm({...applyForm, leaveType: e.target.value})}
                                >
                                    <option value="Annual">Annual Leave</option>
                                    <option value="Sick">Sick Leave</option>
                                    <option value="Casual">Casual Leave</option>
                                    <option value="LossOfPay">Loss Of Pay</option>
                                    <option value="Maternity">Maternity Leave</option>
                                    <option value="Paternity">Paternity Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border rounded-lg p-2"
                                        value={applyForm.startDate}
                                        onChange={e => setApplyForm({...applyForm, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border rounded-lg p-2"
                                        value={applyForm.endDate}
                                        onChange={e => setApplyForm({...applyForm, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Reason</label>
                                <textarea 
                                    className="w-full border rounded-lg p-2 h-24"
                                    placeholder="Briefly describe why you need leave..."
                                    value={applyForm.reason}
                                    onChange={e => setApplyForm({...applyForm, reason: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LeavePage;
