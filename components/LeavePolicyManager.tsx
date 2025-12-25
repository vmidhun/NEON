import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface LeaveType {
  _id: string;
  name: string;
  description: string;
  annualQuota: number;
  isPaid: boolean;
  color: string;
  // Extended fields
  accrualRate?: string; // e.g. "Monthly"
  maxContinuousDays?: number;
  encashmentAllowed?: boolean;
}

const LeavePolicyManager: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeaveType>>({});
  const [isCreating, setIsCreating] = useState(false);

  const fetchLeaveTypes = async () => {
    setLoading(true);
    try {
      const data = await api.get('/policies/leave-types');
      setLeaveTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the policy.')) return;
    try {
      await api.delete(`/policies/leave-types/${id}`);
      fetchLeaveTypes();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.post('/policies/leave-types', editForm);
      } else if (isEditing) {
        await api.put(`/policies/leave-types/${isEditing}`, editForm);
      }
      setIsEditing(null);
      setIsCreating(false);
      setEditForm({});
      fetchLeaveTypes();
    } catch (err) {
      alert('Failed to save');
    }
  };

  const startEdit = (type: LeaveType) => {
    setIsEditing(type._id);
    setEditForm(type);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditForm({
      name: '',
      description: '',
      annualQuota: 12,
      isPaid: true,
      color: '#00AEEF',
      accrualRate: 'Monthly',
      maxContinuousDays: 5,
      encashmentAllowed: false
    });
    setIsEditing(null);
  };

  const renderForm = () => (
      <div className="space-y-3">
        <input 
            type="text" 
            placeholder="Policy Name"
            className="w-full p-2 border rounded text-sm font-bold"
            value={editForm.name || ''}
            onChange={e => setEditForm({...editForm, name: e.target.value})}
        />
        <input 
            type="text" 
             placeholder="Description"
            className="w-full p-2 border rounded text-xs"
            value={editForm.description || ''}
            onChange={e => setEditForm({...editForm, description: e.target.value})}
        />
        <div className="flex gap-2">
            <div className="flex-1">
                <label className="text-[10px] uppercase text-slate-500 font-bold">Quota (Days/Yr)</label>
                <input 
                    type="number" 
                    className="w-full p-2 border rounded text-sm"
                    value={editForm.annualQuota}
                    onChange={e => setEditForm({...editForm, annualQuota: parseInt(e.target.value)})}
                />
            </div>
             <div className="flex-1">
                 <label className="text-[10px] uppercase text-slate-500 font-bold">Accrual</label>
                 <select className="w-full p-2 border rounded text-sm bg-white" 
                    value={editForm.accrualRate}
                    onChange={e => setEditForm({...editForm, accrualRate: e.target.value})}
                >
                     <option>Monthly</option>
                     <option>Quarterly</option>
                     <option>Yearly</option>
                 </select>
             </div>
        </div>
        
         <div className="flex gap-2">
            <div className="flex-1">
                 <label className="text-[10px] uppercase text-slate-500 font-bold">Max Continuous</label>
                 <input 
                    type="number" 
                    className="w-full p-2 border rounded text-sm"
                    value={editForm.maxContinuousDays}
                    onChange={e => setEditForm({...editForm, maxContinuousDays: parseInt(e.target.value)})}
                />
            </div>
             <div className="flex-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Color</label>
                  <input type="color" className="w-full h-9 rounded cursor-pointer border-0" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} />
            </div>
         </div>

         <div className="flex gap-4 pt-2">
             <label className="flex items-center gap-2 text-sm text-slate-700">
                <input 
                    type="checkbox" 
                    checked={editForm.isPaid}
                    onChange={e => setEditForm({...editForm, isPaid: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                />
                Paid Leave
            </label>
             <label className="flex items-center gap-2 text-sm text-slate-700">
                <input 
                    type="checkbox" 
                    checked={editForm.encashmentAllowed}
                    onChange={e => setEditForm({...editForm, encashmentAllowed: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                />
                Encashable
            </label>
         </div>

        <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => { setIsEditing(null); setIsCreating(false); }} className="p-2 text-slate-500 hover:bg-slate-100 rounded">
                <X size={16} />
            </button>
            <button onClick={handleSave} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Check size={16} />
            </button>
        </div>
    </div>
  );

  if (loading) return <div>Loading policies...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-lg font-medium text-slate-800">Leave Policies</h3>
           <p className="text-sm text-slate-500">Define leave types and rules.</p>
        </div>
        <button 
            onClick={startCreate}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
        >
            <Plus size={16} />
            Add Policy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Creation Card */}
        {isCreating && (
             <div className="bg-white p-4 rounded-xl border-2 border-blue-500 shadow-lg relative animate-in fade-in zoom-in duration-200">
                {renderForm()}
            </div>
        )}

        {leaveTypes.map(type => (
          <div key={type._id} className={`bg-white p-4 rounded-xl border shadow-sm relative group ${isEditing === type._id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
            {isEditing === type._id ? (
                renderForm()
            ) : (
                <>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></span>
                            <h4 className="font-bold text-slate-800">{type.name}</h4>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(type)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(type._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 h-8 line-clamp-2">{type.description || 'No description provided.'}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                            <span className="text-slate-500">Quota</span>
                            <span className="font-medium text-slate-700">{type.annualQuota} Days/Year</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                             <span className="text-slate-500">Max Continuous</span>
                             <span className="font-medium text-slate-700">{type.maxContinuousDays || 5} Days</span>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${type.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {type.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                         {type.encashmentAllowed && (
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600">
                                 Encashable
                             </span>
                         )}
                    </div>
                </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeavePolicyManager;
