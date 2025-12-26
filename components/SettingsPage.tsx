import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { UserRole } from '../types';
import { JOBS, PROJECTS, CLIENTS } from '../constants';
import { User, Bell, Settings, Database, Activity, Calendar, Shield } from 'lucide-react';
import HRPolicyConfiguration from './HRPolicyConfiguration';
import { useAuth } from '../AuthContext';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface SettingsPageProps {
    currentUserRole: UserRole;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUserRole }) => {
    const { plan, entitlements, refreshEntitlements } = useAuth();
    const [currentTab, setCurrentTab] = useState('profile');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Manager);
    const isAdmin = currentUserRole === UserRole.Admin;
    const [permissions, setPermissions] = useState<Record<string, Record<string, string[]>>>({});

    React.useEffect(() => {
        if (isAdmin && currentTab === 'roles') {
            const fetchPermissions = async () => {
                const token = localStorage.getItem('jwtToken');
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/tenant/permissions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setPermissions(data || {});
                    }
                } catch (err) {
                    console.error("Failed to fetch permissions", err);
                }
            };
            fetchPermissions();
        }
    }, [isAdmin, currentTab]);

    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    React.useEffect(() => {
        if (isAdmin && currentTab === 'roles') {
            const fetchPermissions = async () => {
                const token = localStorage.getItem('jwtToken');
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/tenant/permissions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setPermissions(data || {});
                    }
                } catch (err) {
                    console.error("Failed to fetch permissions", err);
                }
            };
            fetchPermissions();
        }
    }, [isAdmin, currentTab]);

    const savePermissions = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/tenant/permissions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(permissions)
            });
            if (res.ok) {
                setModalConfig({
                    isOpen: true,
                    title: 'Success',
                    message: 'Permissions saved successfully.',
                    type: 'success'
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    title: 'Error',
                    message: 'Failed to save permissions. Please try again.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error("Failed to save permissions", err);
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'An unexpected error occurred while saving permissions.',
                type: 'error'
            });
        }
    };

  return (
      <div className="space-y-6">
          {/* Horizontal Tabs */}
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                  <button
                      onClick={() => setCurrentTab('profile')}
                      className={`${currentTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                  >
                      <User className="w-4 h-4" />
                      Profile
                  </button>

                  <button
                      onClick={() => setCurrentTab('notifications')}
                      className={`${currentTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                  >
                      <Bell className="w-4 h-4" />
                      Notifications
                  </button>

                  {isAdmin && (
                      <>
                          <button
                              onClick={() => setCurrentTab('subscription')}
                              className={`${currentTab === 'subscription' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                              <CreditCard className="w-4 h-4" />
                              Subscription
                          </button>
                          <button
                              onClick={() => setCurrentTab('policies')}
                              className={`${currentTab === 'policies' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                              <Calendar className="w-4 h-4" />
                              Leave & Attendance
                          </button>
                          <button
                              onClick={() => setCurrentTab('system')}
                              className={`${currentTab === 'system' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                              <Settings className="w-4 h-4" />
                              System
                          </button>
                          <button
                              onClick={() => setCurrentTab('data')}
                              className={`${currentTab === 'data' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                              <Database className="w-4 h-4" />
                              Data Management
                          </button>
                          <button
                              onClick={() => setCurrentTab('roles')}
                              className={`${currentTab === 'roles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                              <Shield className="w-4 h-4" />
                              Roles & Permissions
                          </button>
                      </>
                  )}
              </nav>
          </div>

          <div className="max-w-4xl mx-auto py-6">
              {/* Profile Tab */}
              {currentTab === 'profile' && (
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
              {currentTab === 'notifications' && (
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

              {/* Subscription Tab */}
              {currentTab === 'subscription' && isAdmin && (
                  <div className="space-y-6">
                      <DashboardCard title="Current Subscription">
                          {plan ? (
                              <div>
                                  <div className="flex justify-between items-start mb-6">
                                      <div>
                                          <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                                          <p className="text-slate-500">Billing: {plan.billingType} ({plan.priceCurrency} {plan.priceAmount}/mo)</p>
                                      </div>
                                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wide">Active</span>
                                  </div>

                                  <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">Plan Entitlements</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {entitlements && Object.entries(entitlements).map(([key, feature]: [string, any]) => (
                                          <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                              <span className="text-sm font-medium text-slate-700 capitalize">{key.replace(/_/g, ' ')}</span>
                                              {feature.type === 'BOOLEAN' ? (
                                                  feature.value ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />
                                              ) : (
                                                  <span className="text-sm font-bold text-slate-900">{feature.value}</span>
                                              )}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ) : (
                              <p className="text-slate-500">No active subscription plan found.</p>
                          )}
                      </DashboardCard>
                  </div>
              )}

              {/* Policies Tab (Admin/HR) */}
              {currentTab === 'policies' && isAdmin && (
                  <HRPolicyConfiguration />
              )}

              {/* System Tab (Admin Only) */}
              {currentTab === 'system' && isAdmin && (
                  <div className="space-y-6">
                      <DashboardCard title="Module Configuration">
                          <p className="text-slate-600 mb-4">Enable or disable platform modules. Modules not included in your plan cannot be enabled.</p>

                          <div className="space-y-4">
                              {[
                                  { key: 'project_management', label: 'Project Management', desc: 'Manage projects, tasks, and client deliverables', icon: Activity, color: 'text-indigo-600' },
                                  { key: 'leave_management', label: 'Leave Management', desc: 'Employee leave requests, approvals, and balances', icon: Activity, color: 'text-green-600' },
                                  { key: 'timesheet', label: 'Timesheets', desc: 'Track employee work hours and log time against tasks', icon: Activity, color: 'text-amber-600' },
                                  { key: 'team_standup', label: 'Daily Stand-up', desc: 'Automated daily stand-up meetings and status tracking', icon: Activity, color: 'text-blue-600' },
                                  { key: 'reports', label: 'Reports & Analytics', desc: 'View comprehensive reports on team performance', icon: Activity, color: 'text-purple-600' }
                              ].map((module) => {
                                  // Check plan allowance and current status
                                  const ent = entitlements?.[module.key];
                                  const isPlanAllowed = ent?.planAllowed === true;
                                  const isEnabled = ent?.value === true;

                                  return (
                                      <div key={module.key} className={`flex items-center justify-between p-3 rounded-lg border ${isPlanAllowed ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
                                          <div className="flex items-center gap-3">
                                              <module.icon className={`w-5 h-5 ${module.color}`} />
                                              <div>
                                                  <span className="font-medium block text-slate-800">{module.label}</span>
                                                  <span className="text-xs text-slate-500">{module.desc}</span>
                                                  {!isPlanAllowed && <span className="ml-2 text-[10px] uppercase font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Plan Upgrade Required</span>}
                                              </div>
                                          </div>
                                          <label className="inline-flex items-center cursor-pointer">
                                              <input
                                                  type="checkbox"
                                                  className="sr-only peer"
                                                  checked={isEnabled}
                                                  disabled={!isPlanAllowed}
                                                  onChange={async (e) => {
                                                      const newValue = e.target.checked;
                                                      // Calculate new disabledModules list
                                                      // If we are enabling, we remove from disabled list.
                                                      // If we are disabling, we add to disabled list.
                                                      // But wait, we don't have the current 'disabledModules' list in FE state directly,
                                                      // we only have the *resolved* 'value' from entitlements.

                                                      // To do this correctly without fetching current settings first:
                                                      // We can assume that if planAllowed is true, but value is false, it MUST be in disabled list.
                                                      // But simpler way: Fetch current settings, modify, push back.
                                                      // Or just maintain a local state of overrides?

                                                      // Let's assume we do a quick fetch-modify-save or just rely on the fact that 
                                                      // we want to Toggle.

                                                      // For robust implementation, let's fetch settings first in the component on mount?
                                                      // Or just implement a `toggleModule` endpoint?
                                                      // Since I only have `updateSettings` which takes a list, fetching first is safer.

                                                      // Actually, let's just make an API call to a specific toggle endpoint or fetch-update here.
                                                      const token = localStorage.getItem('jwtToken');
                                                      try {
                                                          // 1. Get current settings
                                                          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/tenant/settings`, {
                                                              headers: { 'Authorization': `Bearer ${token}` }
                                                          });
                                                          const settings = await res.json();
                                                          let disabled = settings.disabledModules || [];

                                                          if (newValue && disabled.includes(module.key)) {
                                                              disabled = disabled.filter((k: string) => k !== module.key);
                                                          } else if (!newValue && !disabled.includes(module.key)) {
                                                              disabled.push(module.key);
                                                          }

                                                          // 2. Save
                                                          await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/tenant/settings`, {
                                                              method: 'PUT',
                                                              headers: {
                                                                  'Content-Type': 'application/json',
                                                                  'Authorization': `Bearer ${token}`
                                                              },
                                                              body: JSON.stringify({ disabledModules: disabled })
                                                          });

                                                          // 3. Refresh Context
                                                          // window.location.reload(); // Simplest way to refresh entitlements in context for now, or use refreshEntitlements() if available
                                                          refreshEntitlements();

                                                      } catch (err) {
                                                          console.error("Failed to update module config", err);
                                                          setModalConfig({
                                                              isOpen: true,
                                                              title: 'Error',
                                                              message: 'Failed to update module configuration.',
                                                              type: 'error'
                                                          });
                                                      }
                                                  }}
                                              />
                                              <div className={`relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isPlanAllowed ? 'peer-checked:bg-blue-600' : 'cursor-not-allowed opacity-50'}`}></div>
                                          </label>
                                      </div>
                                  );
                              })}
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
              {currentTab === 'data' && isAdmin && (
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

              {/* Roles & Permissions Tab */}
              {currentTab === 'roles' && isAdmin && (
                  <div className="space-y-6">
                      <DashboardCard title="Role Definitions & Permissions">
                          <p className="text-slate-600 mb-6">
                              Configure capabilities for each user role. These settings control what users can access and modify.
                          </p>

                          {/* Role Selector */}
                          <div className="mb-6 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select User Role</label>
                                  <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                                      {[UserRole.Manager, UserRole.HR, UserRole.Employee, UserRole.Accountant].map((role) => (
                                          <button
                                              key={role}
                                              onClick={() => setSelectedRole(role)}
                                              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${selectedRole === role ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                                          >
                                              {role}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-sm font-medium text-slate-800">Custom Permission Set</p>
                                  <p className="text-xs text-slate-500">Editing permissions for <span className="text-blue-600 font-bold">{selectedRole}</span></p>
                              </div>
                          </div>

                          {/* Interactive Grid */}
                          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm relative">
                              {/* Loading Overlay? */}
                              <table className="min-w-full text-sm text-left">
                                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                                      <tr>
                                          <th className="p-4 border-b">Module / Feature</th>
                                          <th className="p-4 border-b text-center w-24">View</th>
                                          <th className="p-4 border-b text-center w-24">Create</th>
                                          <th className="p-4 border-b text-center w-24">Edit</th>
                                          <th className="p-4 border-b text-center w-24">Delete</th>
                                          <th className="p-4 border-b text-center w-24">Approve</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                      {[
                                          { id: 'projects', label: 'Projects' },
                                          { id: 'tasks', label: 'Tasks' },
                                          { id: 'timesheet', label: 'Timesheets' },
                                          { id: 'leaves', label: 'Leave Requests' },
                                          { id: 'team', label: 'Team Members' },
                                          { id: 'settings', label: 'Tenant Settings' },
                                      ].map((module) => (
                                          <tr key={module.id} className="hover:bg-slate-50/50 transition-colors">
                                              <td className="p-4 font-bold text-slate-700">{module.label}</td>
                                              {['view', 'create', 'edit', 'delete', 'approve'].map((action) => {
                                                  // Permissions State Logic
                                                  // We need an object state: permissions[role][module][action] -> boolean
                                                  // Since this is getting complex, I'll inject the logic here:

                                                  // Check if we have an override in local state 'permissions', else fall back to default
                                                  const rolePerms = permissions[selectedRole] || {};
                                                  const modulePerms = rolePerms[module.id] || [];

                                                  // Default logic if no override
                                                  const isDefaultChecked =
                                                      (selectedRole === UserRole.Manager && ['view', 'create', 'edit', 'approve'].includes(action)) ||
                                                      (selectedRole === UserRole.HR && ['view', 'create', 'edit', 'approve'].includes(action) && module.id !== 'settings') ||
                                                      (selectedRole === UserRole.Employee && (action === 'view' || (action === 'create' && module.id === 'leaves'))) ||
                                                      (selectedRole === UserRole.Accountant && action === 'view');

                                                  const isChecked = modulePerms.length > 0 ? modulePerms.includes(action) : isDefaultChecked;

                                                  const isDisabled = (module.id === 'settings' && selectedRole !== UserRole.Admin) ||
                                                      (action === 'approve' && module.id === 'settings');

                                                  return (
                                                      <td key={action} className="p-4 text-center">
                                                          <div className="flex justify-center">
                                                              <input
                                                                  type="checkbox"
                                                                  className={`w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                  checked={!isDisabled && isChecked}
                                                                  disabled={isDisabled}
                                                                  onChange={() => {
                                                                      // Logic to update state
                                                                      const newPermissions = { ...permissions };
                                                                      if (!newPermissions[selectedRole]) newPermissions[selectedRole] = {};

                                                                      // If this module didn't have overrides yet, we should probably initialize it with defaults first? 
                                                                      // Or just assume if it's new, we start from scratch? 
                                                                      // Better: Initialize with current checked state.
                                                                      if (!newPermissions[selectedRole][module.id]) {
                                                                          // Populate with defaults first if not present
                                                                          const defaults = ['view', 'create', 'edit', 'delete', 'approve'].filter(act => {
                                                                              return (selectedRole === UserRole.Manager && ['view', 'create', 'edit', 'approve'].includes(act)) ||
                                                                                  (selectedRole === UserRole.HR && ['view', 'create', 'edit', 'approve'].includes(act) && module.id !== 'settings') ||
                                                                                  (selectedRole === UserRole.Employee && (act === 'view' || (act === 'create' && module.id === 'leaves'))) ||
                                                                                  (selectedRole === UserRole.Accountant && act === 'view');
                                                                          });
                                                                          newPermissions[selectedRole][module.id] = defaults;
                                                                      }

                                                                      const currentActions = newPermissions[selectedRole][module.id];
                                                                      if (currentActions.includes(action)) {
                                                                          newPermissions[selectedRole][module.id] = currentActions.filter(a => a !== action);
                                                                      } else {
                                                                          newPermissions[selectedRole][module.id] = [...currentActions, action];
                                                                      }
                                                                      setPermissions(newPermissions);
                                                                  }}
                                                              />
                                                          </div>
                                                      </td>
                                                  );
                                              })}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                                  <button
                                      onClick={savePermissions}
                                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow hover:bg-blue-700 transition-all hover:scale-105"
                                  >
                                      Save Permissions
                                  </button>
                              </div>
                          </div>
                      </DashboardCard>

                      <DashboardCard title="Advanced Policies">
                          <p className="text-sm text-slate-500 mb-4">Fine-tune system behavior. These settings apply globally.</p>
                          <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                  <div>
                                      <h5 className="font-semibold text-slate-800">Strict Project Visibility</h5>
                                      <p className="text-xs text-slate-500 mt-1">If enabled, Employees can ONLY see projects they are explicitly assigned to.</p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" defaultChecked />
                                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                  <div>
                                      <h5 className="font-semibold text-slate-800">Manager Self-Approval</h5>
                                      <p className="text-xs text-slate-500 mt-1">Allow managers to approve their own leave requests.</p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" />
                                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                              </div>
                          </div>
                      </DashboardCard>
                  </div>
              )}
          </div>

          {/* Modal Overlay */}
          {modalConfig.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all scale-100">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modalConfig.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {modalConfig.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{modalConfig.title}</h3>
                      <p className="text-slate-600 mb-6">{modalConfig.message}</p>
                      <button
                          onClick={closeModal}
                          className="w-full py-2.5 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                      >
                          Close
                      </button>
                  </div>
              </div>
          )}
    </div>
  );
};

export default SettingsPage;
