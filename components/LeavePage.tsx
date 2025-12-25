import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../AuthContext';
import { LeaveRequest, LeaveBalance, LeaveType, UserRole } from '../types';
import { Calendar, Clock, CheckCircle, XCircle, FileText, Plus, ChevronLeft, ChevronRight, User, AlertTriangle, UploadCloud, Info } from 'lucide-react';

const LeavePage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-leaves' | 'calendar' | 'approvals' | 'allocation'>('my-leaves');
    
    // Data State
    const [balance, setBalance] = useState<LeaveBalance | null>(null);
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
    const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Apply Modal State
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyStep, setApplyStep] = useState(1);

    const [applyForm, setApplyForm] = useState({
        leaveType: 'Annual',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        reason: '',
        reasonCategory: 'Personal',
        isEmergency: false, // Added field
        // Policy specific
        expectedDeliveryDate: '',
        childHandoverDate: '',
        weddingDate: '',
        emergencyIntimationMethod: 'Call',
        emergencyTime: '',
        attachments: [] as File[]
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

    const calculateDays = useMemo(() => {
        if (!applyForm.startDate || !applyForm.endDate) return 0;
        const start = new Date(applyForm.startDate);
        const end = new Date(applyForm.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return applyForm.isHalfDay ? 0.5 : diffDays;
    }, [applyForm.startDate, applyForm.endDate, applyForm.isHalfDay]);

    const projectedBalance = useMemo(() => {
        if (!balance) return 0;
        const type = applyForm.leaveType.toLowerCase() as keyof LeaveBalance;
        const currentBal = (balance as any)[type] || 0;
        return currentBal - calculateDays;
    }, [balance, applyForm.leaveType, calculateDays]);

    const handleApply = async () => {
        try {
            // In a real app, upload files first, then send URLs.
            // For now, we just send basic data.
            await api.applyLeave({
                leaveType: applyForm.leaveType,
                startDate: applyForm.startDate,
                endDate: applyForm.endDate,
                reason: `${applyForm.reason} [Category: ${applyForm.reasonCategory}]${applyForm.isEmergency ? ' [EMERGENCY]' : ''}`,
                isEmergency: applyForm.isEmergency,
                emergencyReportedVia: applyForm.emergencyIntimationMethod as any,
                emergencyReportedAt: applyForm.emergencyTime
            });
            setShowApplyModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            alert('Failed to apply for leave');
        }
    };

    const resetForm = () => {
        setApplyForm({
            leaveType: 'Annual',
            startDate: '',
            endDate: '',
            isHalfDay: false,
            reason: '',
            reasonCategory: 'Personal',
            isEmergency: false,
            expectedDeliveryDate: '',
            childHandoverDate: '',
            weddingDate: '',
            emergencyIntimationMethod: 'Call',
            emergencyTime: '',
            attachments: []
        });
        setApplyStep(1);
    }

    const handleApproval = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await api.updateLeaveStatus(id, status);
            fetchData(); 
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

    const renderApplyStep1 = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Leave Type</label>
                    <select
                        className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none"
                        value={applyForm.leaveType}
                        onChange={e => setApplyForm({ ...applyForm, leaveType: e.target.value })}
                    >
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Casual">Casual Leave</option>
                        <option value="LossOfPay">Loss Of Pay</option>
                        <option value="Maternity">Maternity Leave</option>
                        <option value="Marriage">Marriage Leave</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Start Date</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            value={applyForm.startDate}
                            onChange={e => setApplyForm({ ...applyForm, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">End Date</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            value={applyForm.endDate}
                            onChange={e => setApplyForm({ ...applyForm, endDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="halfDay"
                            checked={applyForm.isHalfDay}
                            onChange={e => setApplyForm({ ...applyForm, isHalfDay: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="halfDay" className="text-sm text-slate-700">Half Day</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="emergency"
                            checked={applyForm.isEmergency}
                            onChange={e => setApplyForm({ ...applyForm, isEmergency: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="emergency" className="text-sm text-red-700 font-medium">Emergency Request</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Reason Category</label>
                    <select
                        className="w-full border rounded-lg p-2.5 bg-slate-50 mb-3"
                        value={applyForm.reasonCategory}
                        onChange={e => setApplyForm({ ...applyForm, reasonCategory: e.target.value })}
                    >
                        <option value="Personal">Personal</option>
                        <option value="Medical">Medical</option>
                        <option value="Family">Family Function</option>
                        <option value="Travel">Travel/Vacation</option>
                        <option value="Other">Other</option>
                    </select>
                    <textarea
                        className="w-full border rounded-lg p-3 h-24 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                        placeholder="Briefly describe why you need leave..."
                        value={applyForm.reason}
                        onChange={e => setApplyForm({ ...applyForm, reason: e.target.value })}
                    ></textarea>
                </div>
            </div>

            {/* Sidebar info */}
            <div className="md:col-span-1 bg-slate-50 rounded-xl p-4 border border-slate-100 h-fit">
                <h4 className="font-bold text-slate-700 mb-4">Balance Summary</h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Current Balance</span>
                        <span className="font-bold text-slate-800">
                            {(balance as any)?.[applyForm.leaveType.toLowerCase()] || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Requesting</span>
                        <span className="font-bold text-blue-600">{calculateDays} Days</span>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Projected Balance</span>
                        <span className={`font-bold ${projectedBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {projectedBalance}
                        </span>
                    </div>
                </div>

                {projectedBalance < 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-xs text-red-700 leading-tight">
                            Insufficient balance. Access days will be marked as <strong>Loss of Pay (LOP)</strong>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderApplyStep2 = () => {
        const needsPolicyAction = ['Maternity', 'Marriage', 'Sick'].includes(applyForm.leaveType);

        if (!needsPolicyAction) {
            return (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No Policy Actions Required</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                        Your selected leave type "{applyForm.leaveType}" does not require additional policy documentation. You can proceed to review.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border border-blue-100">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm">Policy Requirement: {applyForm.leaveType}</h4>
                        <p className="text-xs text-blue-600 mt-1">Please provide the following details as per company policy.</p>
                    </div>
                </div>

                {applyForm.leaveType === 'Maternity' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Expected Delivery Date</label>
                            <input type="date" className="w-full border rounded-lg p-2.5"
                                value={applyForm.expectedDeliveryDate}
                                onChange={e => setApplyForm({ ...applyForm, expectedDeliveryDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Medical Proof</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer">
                                <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500">Click to upload doc</p>
                            </div>
                        </div>
                    </div>
                )}

                {applyForm.leaveType === 'Marriage' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Wedding Date</label>
                            <input type="date" className="w-full border rounded-lg p-2.5"
                                value={applyForm.weddingDate}
                                onChange={e => setApplyForm({ ...applyForm, weddingDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Invitation Card</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer">
                                <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500">Upload Card</p>
                            </div>
                        </div>
                    </div>
                )}

                {applyForm.leaveType === 'Sick' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Prior Intimation Method</label>
                            <select className="w-full border rounded-lg p-2.5"
                                value={applyForm.emergencyIntimationMethod}
                                onChange={e => setApplyForm({ ...applyForm, emergencyIntimationMethod: e.target.value })}
                            >
                                <option>Call</option>
                                <option>Whatsapp/SMS</option>
                                <option>Email</option>
                                <option>None</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Time of Intimation</label>
                            <input type="time" className="w-full border rounded-lg p-2.5"
                                value={applyForm.emergencyTime}
                                onChange={e => setApplyForm({ ...applyForm, emergencyTime: e.target.value })}
                            />
                            <p className="text-xs text-slate-400 mt-1">Policy: Must be before 9:30 AM</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const renderApplyStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-center font-bold text-xl text-slate-800">Review Request</h3>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="grid grid-cols-2 gap-y-4">
                    <div>
                        <p className="text-sm text-slate-500">Leave Type</p>
                        <p className="font-bold text-slate-800">{applyForm.leaveType}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Duration</p>
                        <p className="font-bold text-slate-800">{calculateDays} Days</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">From</p>
                        <p className="font-medium text-slate-700">{applyForm.startDate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">To</p>
                        <p className="font-medium text-slate-700">{applyForm.endDate}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-slate-500">Reason</p>
                        <p className="font-medium text-slate-700">{applyForm.reason} <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{applyForm.reasonCategory}</span></p>
                    </div>
                </div>

                {projectedBalance < 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                            <AlertTriangle size={16} /> Warning: This request exceeds your balance by {Math.abs(projectedBalance)} days. These will be marked as LOP.
                        </p>
                    </div>
                )}
            </div>

            {/* Approver Logic Mock */}
            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">RM</div>
                <div>
                    <p className="text-sm text-slate-500">Request will be sent to</p>
                    <p className="font-bold text-slate-800">Your Reporting Manager</p>
                </div>
            </div>
        </div>
    );

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
                {(user?.role === UserRole.Admin || user?.role === UserRole.HR || user?.role === UserRole.Manager) && (
                    <button 
                        onClick={() => setActiveTab('approvals')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'approvals' ? 'bg-white text-[#00AEEF] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Approvals
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'my-leaves' && renderMyLeaves()}
                {activeTab === 'approvals' && renderApprovals()}
                {activeTab === 'calendar' && renderCalendar()}
            </div>

            {/* Multi-Step Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Apply for Leave</h3>
                                <p className="text-xs text-slate-500">Step {applyStep} of 3</p>
                            </div>
                            <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {applyStep === 1 && renderApplyStep1()}
                            {applyStep === 2 && renderApplyStep2()}
                            {applyStep === 3 && renderApplyStep3()}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            {applyStep > 1 ? (
                                <button
                                    onClick={() => setApplyStep(s => s - 1)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg flex items-center gap-2 font-medium"
                                >
                                    <ChevronLeft size={18} /> Back
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowApplyModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            )}

                            {applyStep < 3 ? (
                                <button
                                    onClick={() => setApplyStep(s => s + 1)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                                    disabled={!applyForm.startDate || !applyForm.endDate || !applyForm.reason}
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-medium"
                                >
                                    <CheckCircle size={18} /> Submit Request
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeavePage;
