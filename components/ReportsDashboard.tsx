import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from './DashboardCard';
import { PROJECTS } from '../constants';
import { Employee } from '../types';

interface ReportsDashboardProps {
  currentUser: Employee;
}

const data = [
  { name: PROJECTS[0].name, value: 400 },
  { name: PROJECTS[1].name, value: 300 },
  { name: PROJECTS[2].name, value: 300 },
  { name: 'Internal Training', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ currentUser }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Project Hours Distribution (This Month)">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
        <DashboardCard title="Timesheet Generation">
            <form className="space-y-4">
                <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-slate-700">Report Type</label>
                    <select id="reportType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option>Client-based Timesheet</option>
                        <option>Project-based Timesheet</option>
                        <option>Individual Timesheet</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="dateRange" className="block text-sm font-medium text-slate-700">Date Range</label>
                    <input type="date" id="dateRange" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"/>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                     <button type="button" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                        Generate Report
                    </button>
                    <button type="button" className="px-4 py-2 rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors">
                        Export as PDF
                    </button>
                </div>
            </form>
        </DashboardCard>
    </div>
  );
};

export default ReportsDashboard;