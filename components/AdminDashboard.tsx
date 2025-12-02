import React from 'react';
import DashboardCard from './DashboardCard';
import { JOBS, PROJECTS, CLIENTS } from '../constants';
import { Employee } from '../types';

interface AdminDashboardProps {
  currentUser: Employee;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Module Configuration">
                <p className="text-slate-600 mb-4">Enable or disable platform modules.</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Time & Attendance</span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                            <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium">Leave Management</span>
                         <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                            <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium">Payroll Integration</span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </DashboardCard>
            <DashboardCard title="Master Data Management">
                <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md">Manage Clients ({CLIENTS.length})</button>
                    <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md">Manage Projects ({PROJECTS.length})</button>
                    <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md">Manage Jobs ({JOBS.length})</button>
                </div>
            </DashboardCard>
        </div>
    );
};

export default AdminDashboard;