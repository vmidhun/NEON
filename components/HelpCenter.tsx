import React from 'react';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types';
import { BookOpen, CheckCircle, Shield, Users, Clock, Calendar, Briefcase, FileText, Settings } from 'lucide-react';

interface HelpCenterProps {
    currentUserRole?: UserRole;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ currentUserRole }) => {
    const { user } = useAuth();
    // Use passed role for "View As" support, fallback to actual user role
    const effectiveRole = currentUserRole || user?.role || UserRole.Employee;

    const renderEmployeeDocs = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Clock className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Time & Attendance</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Tracking Time:</strong> Use the "Timesheets" tab to log your daily work hours against assigned projects.</p>
                    <p><strong>Submitting:</strong> At the end of the week, click "Submit for Approval" to send your timesheet to your manager.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-green-600">
                    <Calendar className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Leave Management</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Applying for Leave:</strong> Navigate to "Leaves" and click "+ Apply Leave". Select the leave type (Sick, Casual, etc) and dates.</p>
                    <p><strong>Checking Status:</strong> Your dashboard shows pending requests. You'll be notified when your manager approves or rejects them.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-purple-600">
                    <Briefcase className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Tasks & Projects</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>My Tasks:</strong> View tasks assigned to you in the "Tasks" module. Update their status (To Do &rarr; In Progress &rarr; Done) as you work.</p>
                    <p><strong>Assigned Projects:</strong> You can only see details for projects you are actively assigned to.</p>
                </div>
            </div>
        </div>
    );

    const renderManagerDocs = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <Users className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Team Oversight</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Monitoring:</strong> Use the Manager Dashboard to see who is on leave today and track active tasks across your team.</p>
                    <p><strong>Stand-ups:</strong> Review daily stand-up submissions from your direct reports in the "Stand-up" module.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-orange-600">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Approvals</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Timesheets:</strong> Review weekly timesheets from your team. Ensure hours are logged correctly against projects before approving.</p>
                    <p><strong>Leave Requests:</strong> Approve or reject leave requests. The system automatically checks specific leave balances.</p>
                </div>
            </div>
        </div>
    );

    const renderHRDocs = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-pink-600">
                    <Settings className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Policy Configuration</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Leave Policies:</strong> Define quotas (e.g., 12 Casual Leaves/year) and rules for different employee types.</p>
                    <p><strong>Holiday Calendars:</strong> Set up the official holiday list for the organization in the Settings page.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Users className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">User Management</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                    <p><strong>Onboarding:</strong> Create new user accounts and assign basic roles (Employee, Manager).</p>
                    <p><strong>Employee Database:</strong> View and update profile details for all employees in the organization.</p>
                </div>
            </div>
        </div>
    );

    const renderAdminDocs = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Tenant Admin Controls</h2>
                
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-500" />
                        System Configuration
                    </h3>
                    <ul className="list-disc ml-5 space-y-2 text-slate-600">
                        <li><strong>Module Management:</strong> Enable or disable modules (e.g., Reports, Stand-ups) via <em>Settings &gt; System</em>. Note: You can only enable modules allowed by your active Plan.</li>
                        <li><strong>General Settings:</strong> Configure company name, logo, timezone, and working hours.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" />
                        Advanced User Management
                    </h3>
                    <ul className="list-disc ml-5 space-y-2 text-slate-600">
                        <li><strong>Role Assignment:</strong> Assign privileged roles like <strong>HR</strong> and <strong>Accountant</strong>.</li>
                        <li><strong>Access Control:</strong> You are responsible for ensuring users have the correct access levels (e.g., Managers seeing the right teams).</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-700 mb-3">Subscription & Limits</h3>
                    <p className="text-slate-600 mb-2">Your tenant is bound by the limits of your subscription plan.</p>
                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold block">Plan Limits:</span>
                            Limit on total active employees and projects.
                        </div>
                        <div>
                            <span className="font-semibold block">Upgrades:</span>
                            Contact Super Admin to upgrade your plan if you hit these limits.
                        </div>
                    </div>
                </section>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Permission Matrix Reference</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                            <tr>
                                <th className="p-2 border-b">Action</th>
                                <th className="p-2 border-b">Admin</th>
                                <th className="p-2 border-b">HR</th>
                                <th className="p-2 border-b">Manager</th>
                                <th className="p-2 border-b">Employee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr><td className="p-2">User Mgmt</td><td className="p-2 font-semibold text-green-600">Full</td><td className="p-2">Create/Edit</td><td className="p-2">View Team</td><td className="p-2">View Self</td></tr>
                            <tr><td className="p-2">Settings</td><td className="p-2 font-semibold text-green-600">Full</td><td className="p-2">View</td><td className="p-2">-</td><td className="p-2">-</td></tr>
                            <tr><td className="p-2">Leave Approval</td><td className="p-2 text-green-600">All</td><td className="p-2">All</td><td className="p-2">Team</td><td className="p-2">-</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Super Admin sees admin docs + extra note
    const renderSuperAdminDocs = () => (
        <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-purple-900 mb-6">
                <h3 className="font-bold text-lg mb-2">Super Admin Mode</h3>
                <p>You have full access to manage Tenants, Plans, and System Metrics. This view shows you what Tenant Admins see.</p>
            </div>
            {renderAdminDocs()}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Help Center</h1>
                        <p className="text-slate-500">
                            Guide for <strong>{effectiveRole}</strong>
                        </p>
                    </div>
                </div>
                <p className="text-slate-600 text-lg">
                    Welcome to the NEON Help Center. Below you will find guides and resources tailored to your role.
                </p>
            </div>

            {effectiveRole === UserRole.Employee && renderEmployeeDocs()}
            {effectiveRole === UserRole.Manager && renderManagerDocs()}
            {effectiveRole === UserRole.HR && renderHRDocs()}
            {(effectiveRole === UserRole.Admin || effectiveRole === UserRole.TenantAdmin) && renderAdminDocs()}
            {effectiveRole === UserRole.SuperAdmin && renderSuperAdminDocs()}
        </div>
    );
};

export default HelpCenter;
