import React, { useState } from 'react';
import LeavePolicyManager from './LeavePolicyManager';
import WorkCalendarManager from './WorkCalendarManager';
import { Users, FileText, Settings, Calendar } from 'lucide-react';

const HRPolicyConfiguration: React.FC = () => {
    const [activeTab, setActiveTab] = useState('leave-structure');

    const renderEmployeeCategories = () => (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Employee Categories</h3>
             <div className="space-y-4">
                 {['Intern', 'Probation', 'Full-time', 'Contract'].map((cat) => (
                     <div key={cat} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors bg-slate-50">
                         <div className="flex justify-between mb-2">
                             <h4 className="font-bold text-slate-700">{cat}</h4>
                             <button className="text-xs text-blue-600 font-bold uppercase hover:underline">Edit Rules</button>
                         </div>
                         <p className="text-xs text-slate-500">
                             {cat === 'Intern' ? '1 Leave/Month, No Accumulation' : cat === 'Full-time' ? 'Standard 18 Leaves + Floating + Holidays' : 'Standard Rules Apply'}
                         </p>
                     </div>
                 ))}
             </div>
        </div>
    );

    const renderAdvancedRules = () => (
         <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Global Rules</h3>
                 <div className="space-y-3">
                     <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                         <span className="text-sm font-medium text-slate-700">LOP after entitlement exhaustion</span>
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked/>
                     </label>
                     <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                         <span className="text-sm font-medium text-slate-700">LOP {'>'} 15 Days requires HR + Manager Approval</span>
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked/>
                     </label>
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                         <span className="text-sm font-medium text-slate-700">Leaves during Notice Period extends Notice Period</span>
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                     </label>
                 </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Unauthorized Absence (UA) Rules</h3>
                 <div className="flex gap-4 items-center">
                     <select className="p-2 border rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100">
                         <option>Notify Manager</option>
                         <option>Mark as LOP immediately</option>
                         <option>Escalate to HR</option>
                     </select>
                     <p className="text-sm text-slate-500">Action to take when UA is detected.</p>
                 </div>
             </div>
         </div>
    );

    return (
        <div className="space-y-6">
            {/* Tabs */}
             <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'leave-structure', label: 'Leave Structure', icon: FileText },
                    { id: 'employee-categories', label: 'Employee Categories', icon: Users },
                    { id: 'advanced-rules', label: 'Advanced Rules', icon: Settings },
                    { id: 'work-calendars', label: 'Work Calendars', icon: Calendar },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="animate-in fade-in duration-300">
                {activeTab === 'leave-structure' && <LeavePolicyManager />}
                {activeTab === 'employee-categories' && renderEmployeeCategories()}
                {activeTab === 'advanced-rules' && renderAdvancedRules()}
                {activeTab === 'work-calendars' && <WorkCalendarManager />}
            </div>
        </div>
    );
};

export default HRPolicyConfiguration;
