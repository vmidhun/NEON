import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Employee, UserRole } from '../types';
import { useAuth } from '../AuthContext';

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.Employee);
  const [inviteTeam, setInviteTeam] = useState('');

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const isAdmin = user?.role === UserRole.Admin;

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [uData, tData] = await Promise.all([
            api.getUsers(),
            api.getTeams()
        ]);
        setUsers(uData);
        setTeams(tData);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Default password for invited users could be set backend or here
          await api.createUser({ 
              name: inviteName, 
              email: inviteEmail, 
              role: inviteRole,
              teamId: inviteTeam,
              password: 'password123', // constant default for now
              avatarUrl: `https://i.pravatar.cc/150?u=${inviteEmail}`
          });
          setShowInviteModal(false);
          setInviteName('');
          setInviteEmail('');
          fetchData();
      } catch (err) {
          alert('Failed to invite user');
      }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.createTeam({ name: newTeamName });
          setShowTeamModal(false);
          setNewTeamName('');
          fetchData();
      } catch (err) {
          alert('Failed to create team');
      }
  };

  const handleDeleteTeam = async (id: string) => {
      if(!window.confirm("Are you sure? This might affect users in this team.")) return;
      try {
          await api.deleteTeam(id);
          fetchData();
      } catch(err) {
          alert("Failed to delete team");
      }
  };

    const handleDeleteUser = async (id: string) => {
      if(!window.confirm("Are you sure you want to remove this user?")) return;
      try {
          await api.deleteUser(id);
          fetchData();
      } catch(err) {
          alert("Failed to delete user");
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
        <div className="flex gap-2">
            {isAdmin && (
                <>
                    <button 
                        onClick={() => setShowTeamModal(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                    >
                    Manage Teams
                    </button>
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                    >
                    + Invite Member
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Teams List (Inline or separate view? Let's just list active teams if interesting, or skip visualizing teams directly and focus on members with team filtering?) 
          Let's just show members grid for now as requested.
      */}

      {isLoading ? <p>Loading team...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((employee) => (
            <div key={employee.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md relative group">
                <div className="mb-4 relative">
                    <img 
                        src={employee.avatarUrl || 'https://i.pravatar.cc/150'} 
                        alt={employee.name} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-slate-50"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{employee.name}</h3>
                 <p className="text-xs text-slate-500 mb-2">{employee.email}</p>
                {isAdmin ? (
                    <select 
                        value={employee.role} 
                        onChange={async (e) => {
                             try {
                                 await api.updateUser(employee.id, { role: e.target.value });
                                 fetchData();
                             } catch(err) { alert('Failed to update role'); }
                        }}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                ) : (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        {employee.role}
                    </span>
                )}
                
                {isAdmin && (
                    <button 
                        onClick={() => handleDeleteUser(employee.id)}
                        className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                )}

                <div className="w-full pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-xs text-slate-400">
                        {teams.find(t => t.id === employee.teamId || t._id === employee.teamId)?.name || 'No Team'}
                    </span>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-4">Invite New Member</h3>
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" className="w-full border rounded-lg p-2" value={inviteName} onChange={e => setInviteName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input type="email" className="w-full border rounded-lg p-2" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select className="w-full border rounded-lg p-2" value={inviteRole} onChange={e => setInviteRole(e.target.value as UserRole)}>
                                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Team</label>
                            <select className="w-full border rounded-lg p-2" value={inviteTeam} onChange={e => setInviteTeam(e.target.value)}>
                                <option value="">Select Team...</option>
                                {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send Invite</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-4">Manage Teams</h3>
                <div className="mb-6 space-y-2 max-h-48 overflow-y-auto">
                    {teams.map(t => (
                        <div key={t._id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                            <span>{t.name}</span>
                            <button onClick={() => handleDeleteTeam(t._id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleCreateTeam} className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Create New Team</label>
                    <div className="flex gap-2">
                        <input type="text" className="flex-1 border rounded-lg p-2" placeholder="e.g. Bravo Squad" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} required />
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
                    </div>
                </form>
                 <div className="flex justify-end gap-3 pt-4 mt-2">
                     <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Done</button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
