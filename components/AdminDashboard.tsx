import React from 'react';
import DashboardCard from './DashboardCard';
import { JOBS, PROJECTS, CLIENTS } from '../constants';
import { Employee } from '../types';

interface AdminDashboardProps {
  currentUser: Employee;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <DashboardCard title="Overview">
                <p className="text-slate-500">Admin Dashboard widgets coming soon...</p>
            </DashboardCard>
        </div>
    );
};

export default AdminDashboard;