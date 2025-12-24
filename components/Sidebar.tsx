import { HomeIcon, FolderIcon, ClipboardIcon, UserGroupIcon, ChartBarIcon, CogIcon } from '../constants';
import { Calendar } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, activePage, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, id: 'dashboard' },
    { name: 'Projects', icon: FolderIcon, id: 'projects' },
    { name: 'Tasks', icon: ClipboardIcon, id: 'tasks' },
    { name: 'Team', icon: UserGroupIcon, id: 'team' },
    { name: 'Leaves', icon: Calendar, id: 'leaves' },
    { name: 'Reports', icon: ChartBarIcon, id: 'reports' },
    { name: 'Settings', icon: CogIcon, id: 'settings' },
  ];

  return (
    <aside className="w-72 bg-[#1e293b] text-slate-300 hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-700/50 shadow-2xl z-50">
      <div className="h-20 flex items-center px-8 border-b border-slate-700/50 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
            N
          </div>
          <span className="text-xl font-black text-white tracking-tight">NEON</span>
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
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-300 group hover:translate-x-1">
                <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-blue-400 flex items-center justify-center text-[10px] font-bold">?</div>
                Help Center
            </a>
        </div>
      </nav>

      <div className="p-4 bg-[#020617] border-t border-slate-800">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="flex-1">
             <p className="text-[10px] font-medium text-slate-500 mb-0.5 uppercase tracking-wider">Current Workspace</p>
             <p className="text-sm font-bold text-white truncate">Neon Dev Team</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
