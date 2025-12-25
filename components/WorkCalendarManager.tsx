import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Edit2, Calendar as CalIcon, Clock, X, Check, Link } from 'lucide-react';
import { CLIENTS, PROJECTS } from '../constants';

interface WorkCalendar {
  _id: string;
  name: string;
  workingDays: number[];
  holidayIds: string[];
  timezone: string;
  linkedEntity?: {
      type: 'Client' | 'Project';
      id: string;
      name: string;
  };
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WorkCalendarManager: React.FC = () => {
  const [calendars, setCalendars] = useState<WorkCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<WorkCalendar>>({});

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const data = await api.get('/policies/calendars');
      setCalendars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this calendar?')) return;
    try {
      await api.delete(`/policies/calendars/${id}`);
      fetchCalendars();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.post('/policies/calendars', editForm);
      } else if (isEditing) {
        await api.put(`/policies/calendars/${isEditing}`, editForm);
      }
      setIsEditing(null);
      setIsCreating(false);
      setEditForm({});
      fetchCalendars();
    } catch (err) {
      alert('Failed to save');
    }
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditForm({
      name: '',
      workingDays: [1, 2, 3, 4, 5], // Mon-Fri default
      timezone: 'UTC'
    });
    setIsEditing(null);
  };

  const startEdit = (cal: WorkCalendar) => {
    setIsEditing(cal._id);
    setEditForm(cal);
    setIsCreating(false);
  };

  const toggleDay = (dayIndex: number) => {
    const currentDays = editForm.workingDays || [];
    if (currentDays.includes(dayIndex)) {
      setEditForm({ ...editForm, workingDays: currentDays.filter(d => d !== dayIndex) });
    } else {
      setEditForm({ ...editForm, workingDays: [...currentDays, dayIndex].sort() });
    }
  };

  const handleLinkChange = (type: 'Client' | 'Project', id: string) => {
      if (!id) {
          const { linkedEntity, ...rest } = editForm;
          setEditForm(rest);
          return;
      }
      const name = type === 'Client' ? CLIENTS.find(c => c.id === id)?.name : PROJECTS.find(p => p.id === id)?.name;
      setEditForm({
          ...editForm,
          linkedEntity: { type, id, name: name || 'Unknown' }
      });
  };

  const renderForm = () => (
      <div className="space-y-4">
        <input 
            type="text" 
            placeholder="Calendar Name" 
            className="w-full p-2 border rounded text-sm font-bold"
            value={editForm.name || ''}
            onChange={e => setEditForm({...editForm, name: e.target.value})}
        />
        
        <div>
            <label className="text-[10px] uppercase text-slate-500 font-bold block mb-2">Working Days</label>
            <div className="flex justify-between">
                {DAYS.map((day, idx) => (
                    <button
                        key={day}
                        onClick={() => toggleDay(idx)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                            (editForm.workingDays || []).includes(idx)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                    >
                        {day.charAt(0)}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <div>
                 <label className="text-[10px] uppercase text-slate-500 font-bold">Timezone</label>
                 <select 
                    className="w-full p-2 border rounded text-sm mt-1 bg-white"
                    value={editForm.timezone}
                    onChange={e => setEditForm({...editForm, timezone: e.target.value})}
                 >
                    <option value="UTC">UTC (Universal)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                 </select>
            </div>
            <div>
                 <label className="text-[10px] uppercase text-slate-500 font-bold">Link To (Override)</label>
                 <select 
                    className="w-full p-2 border rounded text-sm mt-1 bg-white"
                    value={editForm.linkedEntity?.id || ''}
                    onChange={e => {
                        const val = e.target.value;
                        if (!val) handleLinkChange('Client', ''); // reset
                        else if (val.startsWith('c_')) handleLinkChange('Client', val);
                        else handleLinkChange('Project', val);
                    }}
                 >
                    <option value="">None (Global)</option>
                    <optgroup label="Clients">
                        {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                    <optgroup label="Projects">
                        {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                 </select>
            </div>
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

  if (loading) return <div>Loading calendars...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-lg font-medium text-slate-800">Work Calendars</h3>
           <p className="text-sm text-slate-500">Define working days and holidays.</p>
        </div>
        <button 
            onClick={startCreate}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
        >
            <Plus size={16} />
            Add Calendar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Creation Card */}
        {isCreating && (
             <div className="bg-white p-4 rounded-xl border-2 border-blue-500 shadow-lg relative animate-in fade-in zoom-in duration-200">
                {renderForm()}
            </div>
        )}

        {calendars.map(cal => (
            <div key={cal._id} className={`bg-white p-4 rounded-xl border shadow-sm relative group ${isEditing === cal._id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                {isEditing === cal._id ? (
                    renderForm()
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`p-2 rounded-lg ${cal.linkedEntity ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {cal.linkedEntity ? <Link size={18} /> : <CalIcon size={18} />}
                                </span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{cal.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {cal.timezone}</span>
                                        {cal.linkedEntity && (
                                            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                                                For: {cal.linkedEntity.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(cal)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(cal._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        
                        <div>
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-2">Work Week</p>
                             <div className="flex justify-between">
                                {DAYS.map((day, idx) => (
                                    <span 
                                        key={day}
                                        className={`text-[10px] font-bold ${
                                            cal.workingDays.includes(idx) ? 'text-slate-800' : 'text-slate-300'
                                        }`}
                                    >
                                        {day.charAt(0)}
                                    </span>
                                ))}
                             </div>
                        </div>
                    </>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default WorkCalendarManager;
