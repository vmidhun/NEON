import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Employee, UserRole } from '../types';
import { useAuth } from '../AuthContext';
import EmployeeFullProfile from './EmployeeFullProfile';
import { LayoutGrid, Network, ChevronRight, ChevronDown } from 'lucide-react';

// Compact Tree Node Component
const OrgTreeNode: React.FC<{
    employee: Employee;
    allUsers: Employee[];
    level?: number;
    onSelect: (e: Employee) => void;
}> = ({ employee, allUsers, level = 0, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Find direct reports
    const directReports = allUsers.filter(u => u.reportingManagerId === employee._id || u.reportingManagerId === employee.id);
    const hasChildren = directReports.length > 0;

    return (
        <div className="flex flex-col select-none">
            <div
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 ${level === 0 ? 'bg-slate-50/50' : ''}`}
                style={{ marginLeft: `${level * 24}px` }}
                onClick={() => onSelect(employee)}
            >
                <div
                    className="p-1 rounded-md hover:bg-slate-200 text-slate-400 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : <span className="w-3.5 h-3.5 block" />}
                </div>

                <div className="relative">
                    <img
                        src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}`}
                        alt={employee.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    {/* Role Indicator Dot */}
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${employee.role === UserRole.Admin ? 'bg-purple-500' :
                            employee.role === UserRole.HR ? 'bg-pink-500' :
                                employee.role === UserRole.ScrumMaster ? 'bg-amber-500' :
                                    'bg-emerald-500'
                            }`}
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{employee.name}</span>
                    <span className="text-xs text-slate-500">{(employee as any).designation || employee.role}</span>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="relative">
                    {/* Vertical Guide Line */}
                    <div
                        className="absolute w-px bg-slate-200 bottom-0 top-0"
                        style={{ left: `${(level * 24) + 18}px` }}
                    />
                    {directReports.map(report => (
                        <OrgTreeNode
                            key={report._id || report.id}
                            employee={report}
                            allUsers={allUsers}
                            level={level + 1}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.Employee);
  const [inviteTeam, setInviteTeam] = useState('');

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const isAdmin = user?.role === UserRole.Admin;

    const [selectedMember, setSelectedMember] = useState<Employee | null>(null);
    const [focusedNode, setFocusedNode] = useState<Employee | null>(null);
    const [inviteFile, setInviteFile] = useState<File | null>(null);

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
          let uploadedAvatarUrl = `https://i.pravatar.cc/150?u=${inviteEmail}`;
          if (inviteFile) {
              const uploadRes = await api.uploadFile(inviteFile);
              uploadedAvatarUrl = uploadRes.url;
          }

          // Default password for invited users could be set backend or here
          await api.createUser({ 
              name: inviteName, 
              email: inviteEmail, 
              role: inviteRole,
              teamId: inviteTeam,
              password: 'password123', // constant default for now
              avatarUrl: uploadedAvatarUrl
          });
          setShowInviteModal(false);
          setInviteName('');
          setInviteEmail('');
          setInviteFile(null);
          fetchData();
      } catch (err) {
          console.error(err);
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

    // Find root nodes for the tree (users with no manager or manager not in list)
    const rootUsers = users.filter(u =>
        !u.reportingManagerId || !users.find(m => m._id === u.reportingManagerId || m.id === u.reportingManagerId)
    );

  return (
    <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* View Toggle */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Grid View"
                      >
                          <LayoutGrid size={18} />
                      </button>
                      <button
                          onClick={() => setViewMode('tree')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'tree' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Tree Structure"
                      >
                          <Network size={18} />
                      </button>
                  </div>

                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                  <div className="flex gap-2 ml-auto sm:ml-0">
                      {isAdmin && (
                          <>
                              <button
                                  onClick={() => setShowTeamModal(true)}
                                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
                              >
                                  Manage Teams
                              </button>
                              <button
                                  onClick={() => setShowInviteModal(true)}
                                  className="px-4 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#008CCF] transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
                              >
                                  + Invite Member
                              </button>
                          </>
                      )}
                  </div>
              </div>
          </div>

      {isLoading ? <p>Loading team...</p> : (
              viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {users.map((employee) => (
                          <div
                              key={employee._id || employee.id}
                              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md relative group cursor-pointer"
                              onClick={() => setSelectedMember(employee)}
                          >
                              <div className="mb-4 relative">
                                  <img 
                                      src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}`}
                                      alt={employee.name}
                                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-50"
                                  />
                                  <span className={`absolute bottom-0 right-0 w-5 h-5 border-4 border-white rounded-full ${employee.role === UserRole.Admin ? 'bg-purple-500' :
                                      employee.role === UserRole.HR ? 'bg-pink-500' :
                                          employee.role === UserRole.ScrumMaster ? 'bg-amber-500' :
                                              'bg-emerald-500'
                                      }`}></span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-800 mb-1">{employee.name}</h3>
                              <p className="text-xs text-slate-500 mb-2">{(employee as any).designation || employee.role}</p>

                              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${employee.role === UserRole.Admin ? 'bg-purple-50 text-purple-600' :
                                  employee.role === UserRole.HR ? 'bg-pink-50 text-pink-600' :
                                      employee.role === UserRole.ScrumMaster ? 'bg-amber-50 text-amber-600' :
                                          'bg-emerald-50 text-emerald-600'
                                  }`}>
                                  {employee.role}
                              </span>

                              {isAdmin && (
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(employee._id || employee.id!); }}
                                      className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
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
              ) : (
                  <div className="bg-slate-50 rounded-xl shadow-inner border border-slate-200 p-8 min-h-[600px] flex justify-center overflow-x-auto relative">
                      {/* Organization Chart Visualization */}
                      {(() => {
                          // Default to CEO/Root if no focus
                          const activeNode = focusedNode || rootUsers[0] || users[0];
                          if (!activeNode) return <p className="text-slate-400">No data available.</p>;

                          const manager = users.find(u => u._id === activeNode.reportingManagerId || u.id === activeNode.reportingManagerId);
                          const directReports = users.filter(u => u.reportingManagerId === activeNode._id || u.reportingManagerId === activeNode.id);

                          const Card = ({ u, isFocused = false, isManager = false }: { u: Employee, isFocused?: boolean, isManager?: boolean }) => (
                              <div
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setFocusedNode(u);
                                  }}
                                  className={`
                                        relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-white w-48 shrink-0
                                        ${isFocused ? 'border-[#00AEEF] shadow-lg scale-105 z-10' : 'border-slate-100 hover:border-[#00AEEF]/50 shadow-sm hover:shadow-md'}
                                        ${isManager ? 'opacity-80 scale-90' : ''}
                                    `}
                              >
                                  <div className="relative mb-2">
                                      <img
                                          src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                                          alt={u.name}
                                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                      />
                                      <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${u.role === UserRole.Admin ? 'bg-purple-500' :
                                          u.role === UserRole.HR ? 'bg-pink-500' :
                                              u.role === UserRole.ScrumMaster ? 'bg-amber-500' : 'bg-emerald-500'
                                          }`} />
                                  </div>
                                  <h4 className="font-bold text-slate-800 text-sm truncate w-full text-center">{u.name}</h4>
                                  <p className="text-xs text-slate-500 truncate w-full text-center mb-2">{(u as any).designation || u.role}</p>

                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMember(u);
                                      }}
                                      className="text-[10px] font-bold text-[#00AEEF] bg-blue-50 px-2 py-1 rounded-full hover:bg-[#00AEEF] hover:text-white transition-colors"
                                  >
                                      View Profile
                                  </button>
                              </div>
                          );

                          return (
                              <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">

                                  {/* Level 1: Manager */}
                                  {manager ? (
                                      <div className="flex flex-col items-center">
                                          <Card u={manager} isManager />
                                          <div className="h-8 w-px bg-slate-300 my-1"></div>
                                      </div>
                                  ) : (
                                      <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">Top of Hierarchy</div>
                                  )}

                                  {/* Level 2: Active Node */}
                                  <div className="relative">
                                      <Card u={activeNode} isFocused />
                                      {directReports.length > 0 && (
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-8 w-px bg-slate-300"></div>
                                      )}
                                  </div>

                                  {/* Level 3: Direct Reports */}
                                  {directReports.length > 0 ? (
                                      <div className="relative pt-4">
                                          {/* Connecting line for multiple children */}
                                          {directReports.length > 1 && (
                                              <div className="absolute top-0 left-12 right-12 h-px bg-slate-300"></div>
                                          )}
                                          {directReports.length > 1 && (
                                              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-px bg-slate-300 -mt-4"></div>
                                          )}

                                          <div className="flex gap-6 items-start justify-center">
                                              {directReports.map((report, idx) => (
                                                  <div key={report._id || report.id} className="relative flex flex-col items-center">
                                                      {/* Connector to horizontal bar */}
                                                      {directReports.length > 1 && (
                                                          <div className="h-4 w-px bg-slate-300 -mt-4 mb-4"></div>
                                                      )}
                                                      <Card u={report} />
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="text-slate-400 text-sm italic mt-4">No direct reports</div>
                                  )}

                              </div>
                          );
                      })()}
                  </div>
              )
          )}

          {selectedMember && (
              <EmployeeFullProfile
                  employee={selectedMember}
                  users={users} // Changed from allUsers to users to match prop name
                  teams={teams}
                  isOpen={!!selectedMember}
                  onClose={() => setSelectedMember(null)}
                  onUpdate={() => { fetchData(); }}
                  canEdit={isAdmin || user?.role === UserRole.HR}
              />
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
                          <div>
                              <label className="block text-sm font-medium mb-1">Profile Picture</label>
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => setInviteFile(e.target.files ? e.target.files[0] : null)}
                                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
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
