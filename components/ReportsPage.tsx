import React from 'react';
import DashboardCard from './DashboardCard';

const ReportsPage: React.FC = () => {
  return (
     <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    Export CSV
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    Download PDF
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Project Performance">
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">Chart Visualization Placeholder</p>
                </div>
            </DashboardCard>
             <DashboardCard title="Resource Utilization">
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">Chart Visualization Placeholder</p>
                </div>
            </DashboardCard>
             <DashboardCard title="Time Logs Analysis">
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">Chart Visualization Placeholder</p>
                </div>
            </DashboardCard>
             <DashboardCard title="Budget vs Actual">
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">Chart Visualization Placeholder</p>
                </div>
            </DashboardCard>
        </div>
     </div>
  );
};

export default ReportsPage;
