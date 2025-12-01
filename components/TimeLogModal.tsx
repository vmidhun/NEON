import React, { useState } from 'react';
import { Task } from '../types';

interface TimeLogModalProps {
  task: Task;
  onClose: () => void;
  onLogTime: (taskId: string, hours: number, notes: string) => void;
  loggedHoursForTask: number;
}

const TimeLogModal: React.FC<TimeLogModalProps> = ({ task, onClose, onLogTime, loggedHoursForTask }) => {
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');

  const remainingHours = task.allocatedHours - loggedHoursForTask;
  const isOverAllocated = remainingHours < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedHours = parseFloat(hours);
    if (!isNaN(loggedHours) && loggedHours > 0) {
      onLogTime(task.id, loggedHours, notes);
      onClose();
    }
  };

  const progress = task.allocatedHours > 0 ? (loggedHoursForTask / task.allocatedHours) * 100 : 0;
  const progressBarColor = isOverAllocated ? 'bg-red-500' : 'bg-blue-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-enter" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Log Time</h2>
        <p className="text-slate-600 mb-6">For task: <span className="font-semibold">{task.name}</span></p>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500">Project</p>
            <p className="font-medium text-slate-800">{task.job.project.name}</p>
            <p className="text-sm text-slate-500 mt-2">Client</p>
            <p className="font-medium text-slate-800">{task.job.project.client.name}</p>
        </div>

        <div className="mb-4 text-sm">
            <p>Allocated Hours: <span className="font-bold">{task.allocatedHours.toFixed(2)} hrs</span></p>
            <p>Logged Hours: <span className="font-bold">{loggedHoursForTask.toFixed(2)} hrs</span></p>
            <p className="mb-2">Remaining: 
                <span className={`font-bold ${isOverAllocated ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingHours.toFixed(2)} hrs
                </span>
            </p>
            {task.allocatedHours > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className={`${progressBarColor} h-2 rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
            )}
            {task.allocatedHours === 0 && (
                <p className="text-xs text-slate-500 italic mt-2">No allocated hours set for this task.</p>
            )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-1">Hours Logged</label>
            <input
              id="hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g., 1.5"
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add details about the work done..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300" disabled={!hours || parseFloat(hours) <= 0}>
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeLogModal;