import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { UserRole } from '../types';
import { JOBS, PROJECTS, CLIENTS } from '../constants';
import { User, Bell, Settings, Database, Activity, Calendar } from 'lucide-react';
import HRPolicyConfiguration from './HRPolicyConfiguration';

interface SettingsPageProps {
    currentUserRole: UserRole;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUserRole }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const isAdmin = currentUserRole === UserRole.Admin;

  return (
      <div className="space-y-6">
          {/* Horizontal Tabs */}
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                      onClick={() => setActiveTab('profile')}
                      className={`${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                      <User className="w-4 h-4" />
                      Profile
                  </button>

                  <button
                      onClick={() => setActiveTab('notifications')}
                      className={`${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                      <Bell className="w-4 h-4" />
                      Notifications
                  </button>

                  {isAdmin && (
                      <>
                          <button
                              onClick={() => setActiveTab('policies')}
                              className={`${activeTab === 'policies' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                          >
                              <Calendar className="w-4 h-4" />
                              Leave & Attendance
                          </button>
                          <button
                              onClick={() => setActiveTab('system')}
                              className={`${activeTab === 'system' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                          >
                              <Settings className="w-4 h-4" />
                              System
                          </button>
                          <button
                              onClick={() => setActiveTab('data')}
                              className={`${activeTab === 'data' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                          >
                              <Database className="w-4 h-4" />
                              Data Management
                          </button>
                      </>
                  )}
              </nav>
          </div>

          <div className="max-w-4xl mx-auto py-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
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
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                  <DashboardCard title="Notification Preferences">
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
              )}
              {/* Policies Tab (Admin/HR) */}
              {activeTab === 'policies' && isAdmin && (
                  <HRPolicyConfiguration />
              )}

              {/* System Tab (Admin Only) */}
              {/* System Tab (Admin Only) */}
              {activeTab === 'system' && isAdmin && (
                  <div className="space-y-6">
                      <DashboardCard title="Module Configuration">
                          <p className="text-slate-600 mb-4">Enable or disable platform modules globally.</p>
                          <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <Activity className="w-5 h-5 text-indigo-600" />
                                      <div>
                                          <span className="font-medium block text-slate-800">Time & Attendance</span>
                                          <span className="text-xs text-slate-500">Track check-ins and daily logs</span>
                                      </div>
                                  </div>
                                  <label className="inline-flex items-center cursor-pointer">
                                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                      <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <Activity className="w-5 h-5 text-green-600" />
                                      <div>
                                          <span className="font-medium block text-slate-800">Leave Management</span>
                                          <span className="text-xs text-slate-500">Employee leave requests and approvals</span>
                                      </div>
                                  </div>
                                  <label className="inline-flex items-center cursor-pointer">
                                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                      <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <Activity className="w-5 h-5 text-amber-600" />
                                      <div>
                                          <span className="font-medium block text-slate-800">Payroll Integration</span>
                                          <span className="text-xs text-slate-500">Connect with payroll processing systems</span>
                                      </div>
                                  </div>
                                  <label className="inline-flex items-center cursor-pointer">
                                      <input type="checkbox" value="" className="sr-only peer" />
                                      <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                              </div>
                          </div>
                      </DashboardCard>

                      <DashboardCard title="Danger Zone">
               <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                              <h4 className="text-red-700 font-bold mb-2">Reset System Data</h4>
                              <p className="text-sm text-red-600 mb-4">This will permanently delete all data. This action cannot be undone.</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                  Reset Data
                              </button>
                          </div>
                      </DashboardCard>
                  </div>
              )}

              {/* Data Management Tab (Admin Only) */}
              {activeTab === 'data' && isAdmin && (
                  <DashboardCard title="Master Data Management">
                      <div className="space-y-4">
                          <p className="text-slate-600">Manage global lists and configurations.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <button className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all hover:shadow-md">
                                  <span className="text-2xl font-bold text-slate-800 mb-1">{CLIENTS.length}</span>
                                  <span className="text-sm font-medium text-slate-600">Clients</span>
                                  <span className="text-xs text-slate-400 mt-2">Manage Clients</span>
                              </button>
                              <button className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all hover:shadow-md">
                                  <span className="text-2xl font-bold text-slate-800 mb-1">{PROJECTS.length}</span>
                                  <span className="text-sm font-medium text-slate-600">Projects</span>
                                  <span className="text-xs text-slate-400 mt-2">Manage Projects</span>
                              </button>
                              <button className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all hover:shadow-md">
                                  <span className="text-2xl font-bold text-slate-800 mb-1">{JOBS.length}</span>
                                  <span className="text-sm font-medium text-slate-600">Jobs</span>
                                  <span className="text-xs text-slate-400 mt-2">Manage Jobs</span>
                    </button>
                          </div>
                      </div>
          </DashboardCard>
              )}
          </div>
    </div>
  );
};

export default SettingsPage;
