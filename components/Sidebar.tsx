import React from 'react';
import { HomeIcon, FolderIcon, ClipboardIcon, UserGroupIcon, ChartBarIcon, CogIcon } from '../constants';
import { Calendar, Clock, ListChecks } from 'lucide-react';
import { UserRole, Employee } from '../types';
import { useAuth } from '../AuthContext';

interface SidebarProps {
  currentRole: UserRole;
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser: Employee;
  availableRoles: UserRole[];
  onRoleChange: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, activePage, onNavigate, currentUser, availableRoles, onRoleChange }) => {
  const { entitlements, logout } = useAuth();

  // Helper to check if a feature is enabled (default to true if no entitlements loaded yet, or handle gracefully)
  const isEnabled = (key: string) => {
    if (!entitlements) return true; // Optimistic default or false? Better to default true until loaded to avoid flickering, or use specific logic.
    // But if we have entitlements, we check.
    // Keys: project_management, leave_management, timesheet, team_standup, reports
    return entitlements[key]?.value === true;
  };

  const allMenuItems = [
    { name: 'Dashboard', icon: HomeIcon, id: 'dashboard', show: true },
    { name: 'Projects', icon: FolderIcon, id: 'projects', show: isEnabled('project_management') },
    { name: 'Tasks', icon: ClipboardIcon, id: 'tasks', show: isEnabled('project_management') }, // Tasks usually part of PM
    { name: 'Timesheets', icon: Clock, id: 'timesheets', show: isEnabled('timesheet') },
    { name: 'Stand-up', icon: ListChecks, id: 'standup', show: isEnabled('team_standup') },
    { name: 'Team', icon: UserGroupIcon, id: 'team', show: true }, // Core feature? Or maybe gate?
    { name: 'Leaves', icon: Calendar, id: 'leaves', show: isEnabled('leave_management') },
    { name: 'Reports', icon: ChartBarIcon, id: 'reports', show: isEnabled('reports') },
    { name: 'Settings', icon: CogIcon, id: 'settings', show: true },
  ];

  const menuItems = allMenuItems.filter(item => item.show);

  return (
    <aside className="w-72 bg-[#1e293b] text-slate-300 hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-700/50 shadow-2xl z-50">
      <div className="h-20 flex items-center px-8 border-b border-slate-700/50 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
            N
          </div>
          <span className="text-xl font-black text-white tracking-tight">NEON 2.0</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto bg-[#0f172a]">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 translate-x-1' 
                : 'hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} />
            {item.name}
            {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
            )}
          </button>
        )})}

        <div className="pt-8 mt-8 border-t border-slate-800">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Support</p>
          <button
            onClick={() => onNavigate('help')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group hover:translate-x-1 ${activePage === 'help' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${activePage === 'help' ? 'border-blue-400 text-blue-400' : 'border-slate-600 group-hover:border-blue-400'}`}>?</div>
                Help Center
          </button>
        </div>
      </nav>

      <div className="p-4 bg-[#020617] border-t border-slate-800 space-y-4">
        {/* Role Switcher for Admin */}
        {currentUser.email === 'midhun@neointeraction.com' && (
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
            <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-wider">View Role As</p>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="w-full text-xs font-medium bg-slate-800 border-none text-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500"
            >
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{(currentUser as any).designation || currentUser.role}</p>
            </div>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-red-400 hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
