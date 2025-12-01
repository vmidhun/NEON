
import React from 'react';
import { Task, TaskStatus } from '../types';
import { ClockIcon, CheckCircleIcon, PlusCircleIcon } from '../constants';

interface TaskItemProps {
  task: Task;
  onLogTimeClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  loggedHours: number;
}

const getStatusBadgeClass = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Completed:
      return 'bg-green-100 text-green-800';
    case TaskStatus.InProgress:
      return 'bg-yellow-100 text-yellow-800';
    case TaskStatus.ToDo:
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onLogTimeClick, onStatusChange, loggedHours }) => {
  const progress = task.allocatedHours > 0 ? (loggedHours / task.allocatedHours) * 100 : 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-slate-800">{task.name}</p>
          <p className="text-sm text-slate-500">{task.job.project.name} / {task.job.project.client.name}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm text-slate-600 mb-1">
            <span>Progress</span>
            <span>{loggedHours.toFixed(1)} / {task.allocatedHours.toFixed(1)} hrs</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex gap-4">
            <button onClick={() => onLogTimeClick(task)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                <PlusCircleIcon className="w-5 h-5" />
                Log Time
            </button>
            {task.status !== TaskStatus.Completed && (
                 <button onClick={() => onStatusChange(task.id, TaskStatus.Completed)} className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition-colors">
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark as Done
                </button>
            )}
        </div>
        {task.assignedBy && <p className="text-slate-400">From: {task.assignedBy}</p>}
      </div>
    </div>
  );
};

export default TaskItem;
