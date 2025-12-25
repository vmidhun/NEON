import React, { useState, useEffect, useMemo } from 'react';
import { Employee, LeaveRequest, UserRole } from '../types';
import { api } from '../services/api';
import DashboardCard from './DashboardCard';
import { CheckCircle, XCircle, AlertTriangle, Calendar, Filter } from 'lucide-react';

interface ManagerDashboardProps {
  currentUser: Employee;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ currentUser }) => {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<LeaveRequest[]>([]);
  const [viewMode, setViewMode] = useState<'Weak' | 'Month'>('Weak');
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Parallel fetch
        const [users, leaves, pending] = await Promise.all([
          api.getUsers(),
          api.getTeamLeaves(),
          api.getPendingLeaves() // This API should return leaves requiring MY approval ideally
        ]);

        // Filter users for my team
        const myTeam = users.filter((u: Employee) => u.teamId === currentUser.teamId);
        setTeamMembers(myTeam);
        setTeamLeaves(leaves); // Assuming backend filters for team
        setPendingApprovals(pending);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser.teamId]);

  // --- Logic for Heatmap ---
  const dates = useMemo(() => {
    const days = viewMode === 'Weak' ? 7 : 30;
    const result = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, [viewMode]);

  const getLeaveStatusForDate = (userId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const leave = teamLeaves.find(l => {
      const start = new Date(l.startDate).toISOString().split('T')[0];
      const end = new Date(l.endDate).toISOString().split('T')[0];
      return (l.userId as any)._id === userId && dateStr >= start && dateStr <= end;
    });
    return leave ? leave.leaveType : null;
  };

  const getCellColor = (type: string | null) => {
    switch (type) {
      case 'Annual': return 'bg-blue-200';
      case 'Sick': return 'bg-rose-200';
      case 'Casual': return 'bg-amber-200';
      case 'LossOfPay': return 'bg-slate-300';
      case 'Maternity': return 'bg-purple-200';
      default: return 'bg-slate-50';
    }
  };

  const handleApproval = async (id: string, status: 'Approved' | 'Rejected', isLop = false) => {
    try {
      // If 'Approve as LOP' logic exists, usually it's a separate flag or status update
      // For now, we simulate just calling update status.
      if (isLop) {
        alert("Marking as LOP needs backend support. Approving normally for demo.");
      }
      await api.updateLeaveStatus(id, status);
      const pending = await api.getPendingLeaves();
      setPendingApprovals(pending);
    } catch (err) {
      alert('Action failed');
    }
  };

  // --- Risks Logic ---
  const risks = useMemo(() => {
    const list = [];
    // 1. Continuous Leave > 5 days
    teamMembers.forEach(member => {
      const leaves = teamLeaves.filter(l => (l.userId as any)._id === member._id);
      leaves.forEach(l => {
        if (l.daysCount > 5) {
          list.push({ type: 'Long Leave', msg: `${member.name} has >5 days continous leave.` });
        }
      });
    });
    // 2. High LOP Requests (Mock logic)
    pendingApprovals.forEach(req => {
      if (req.daysCount > 15) {
        list.push({ type: 'High LOP', msg: `Request from ${(req.userId as any).name} exceeds 15 days (Needs HR).` });
      }
    });
    return list;
  }, [teamMembers, teamLeaves, pendingApprovals]);


  return (
    <div className="space-y-6">
      {/* Header Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Team Overview</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{currentUser.teamId}</span>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button onClick={() => setViewMode('Weak')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${viewMode === 'Weak' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Week View</button>
          <button onClick={() => setViewMode('Month')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${viewMode === 'Month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Month View</button>
        </div>
      </div>

      {/* Heatmap */}
      <DashboardCard title="Leave Heatmap">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left min-w-[150px] font-medium text-slate-500 border-b border-r border-slate-100 bg-slate-50 sticky left-0 z-10">Employee</th>
                {dates.map((date, i) => (
                  <th key={i} className="p-2 text-center border-b border-slate-100 font-normal text-slate-500 min-w-[40px]">
                    <div className="text-xs uppercase">{date.toLocaleDateString(undefined, { weekday: 'narrow' })}</div>
                    <div className="font-bold">{date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member._id}>
                  <td className="p-3 border-r border-slate-100 bg-white sticky left-0 z-10 font-bold text-slate-700 flex items-center gap-2">
                    <img src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}`} className="w-6 h-6 rounded-full" />
                    {member.name}
                  </td>
                  {dates.map((date, i) => {
                    const type = getLeaveStatusForDate(member._id, date);
                    return (
                      <td key={i} className="p-1 border border-slate-50 relative group">
                        <div className={`w-full h-8 rounded ${getCellColor(type)}`}></div>
                        {type && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                            {type}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {teamMembers.length === 0 && <tr><td colSpan={dates.length + 1} className="p-4 text-center text-slate-500">No team members found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500 justify-center">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-200 rounded"></span> Annual</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-200 rounded"></span> Sick</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-200 rounded"></span> Casual</div>
        </div>
      </DashboardCard>

      {/* Bottom Section: Approvals and Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Approvals */}
        <DashboardCard title={`Pending Approvals (${pendingApprovals.length})`}>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {pendingApprovals.length === 0 ? (
              <p className="text-slate-500 text-center py-4">All caught up!</p>
            ) : (
              pendingApprovals.map(req => (
                <div key={req._id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={(req.userId as any).avatarUrl || `https://ui-avatars.com/api/?name=${(req.userId as any).name}`} className="w-8 h-8 rounded-full" />
                      <div>
                                  <p className="font-bold text-slate-800 text-sm">{(req.userId as any).name}</p>
                                  <p className="text-xs text-slate-500">{(req.userId as any).designation}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="block font-bold text-blue-600 text-sm">{req.daysCount} Days</span>
                                <span className="text-xs text-slate-500">{new Date(req.startDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100 text-sm text-slate-600 mb-3">
                              <span className="font-semibold text-xs text-slate-400 uppercase mr-2">{req.leaveType}</span>
                              {req.reason}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleApproval(req._id, 'Approved')} className="flex-1 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 font-medium">Approve</button>
                              <button onClick={() => handleApproval(req._id, 'Rejected')} className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-sm hover:bg-slate-50 font-medium">Reject</button>
                              <button onClick={() => handleApproval(req._id, 'Approved', true)} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded text-sm hover:bg-amber-200 font-medium">LOP</button>
                            </div>
                          </div>
                        ))
            )}
          </div>
        </DashboardCard>

        {/* Risk & Conflicts */}
        <DashboardCard title="Risk & Conflicts">
          {risks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
              <CheckCircle size={48} className="mb-2 text-emerald-200" />
              <p>No risks detected.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {risks.map((risk, i) => (
                <div key={i} className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                              <h4 className="font-bold text-red-700 text-sm">{risk.type}</h4>
                              <p className="text-sm text-red-600">{risk.msg}</p>
                            </div>
                          </div>
                        ))}
              </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default ManagerDashboard;