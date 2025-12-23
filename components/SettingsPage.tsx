import React from 'react';
import DashboardCard from './DashboardCard';
import { UserRole } from '../types';

interface SettingsPageProps {
    currentUserRole: UserRole;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUserRole }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>

      <DashboardCard title="Profile Settings">
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                     <input type="text" className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-slate-50 border" placeholder="John Doe" />
                </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                     <input type="email" className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-slate-50 border" placeholder="john@example.com" />
                </div>
            </div>
            <button type="button" className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                Save Changes
            </button>
        </form>
      </DashboardCard>
      
      <DashboardCard title="Notifications">
          <div className="space-y-3">
             <div className="flex items-center justify-between py-2">
                 <div>
                     <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                     <p className="text-xs text-slate-500">Receive daily summaries and alerts</p>
                 </div>
                 <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
             </div>
             <div className="flex items-center justify-between py-2 border-t border-slate-100">
                 <div>
                     <p className="text-sm font-medium text-slate-800">Desktop Push Notifications</p>
                     <p className="text-xs text-slate-500">Get notified about new tasks live</p>
                 </div>
                 <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
             </div>
          </div>
      </DashboardCard>

      {currentUserRole === UserRole.Admin && (
          <DashboardCard title="Admin Controls">
               <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h4 className="text-red-700 font-bold mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-600 mb-4">Irreversible actions for system administrators.</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Reset System Data
                    </button>
               </div>
          </DashboardCard>
      )}
    </div>
  );
};

export default SettingsPage;
