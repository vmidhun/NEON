import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { api } from '../services/api';
import { Task, Job, UserRole } from '../types';
import { useAuth } from '../AuthContext';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskJob, setNewTaskJob] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(0);

  const canManageTasks = user?.role === UserRole.Admin || user?.role === UserRole.ScrumMaster;

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [tData, jData] = await Promise.all([
            api.getTasks(),
            api.getJobs()
        ]);
        setTasks(tData);
        setJobs(jData);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskName || !newTaskJob) return;
      try {
          await api.createTask({ 
              name: newTaskName, 
              jobId: newTaskJob, 
              allocatedHours: Number(newTaskHours),
              assignedBy: user?.name,
              status: 'To Do'
          });
          setShowModal(false);
          setNewTaskName('');
          setNewTaskJob('');
          setNewTaskHours(0);
          fetchData();
      } catch (err) {
          alert('Failed to create task');
      }
  };

  const handleDeleteTask = async (id: string) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          await api.deleteTask(id);
          fetchData();
      } catch(err) {
          alert("Failed to delete task");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">All Tasks</h2>
        <div className="flex gap-2">
             {canManageTasks && (
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                >
                + New Task
                </button>
             )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {isLoading ? <p>Loading tasks...</p> : (
            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 relative group">
                        <TaskItem 
                            task={task} 
                            // View-only for generic list, or could add status update logic here
                            onLogTimeClick={() => {}}
                            onStatusChange={() => {}}
                            loggedHours={0}
                        />
                         {canManageTasks && (
                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="absolute top-4 right-4 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Delete
                            </button>
                         )}
                    </div>
                ))}
                {tasks.length === 0 && <p className="text-slate-500 italic">No tasks found.</p>}
            </div>
        )}
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold mb-4">Create New Task</h3>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Task Name</label>
                          <input 
                            type="text" 
                            value={newTaskName}
                            onChange={e => setNewTaskName(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Job / Feature Context</label>
                          <select 
                            value={newTaskJob}
                            onChange={e => setNewTaskJob(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                          >
                              <option value="">Select a Job...</option>
                              {jobs.map(j => <option key={j.id} value={j.id}>{j.name} ({j.project?.name})</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Allocated Hours</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={newTaskHours}
                            onChange={e => setNewTaskHours(Number(e.target.value))}
                            className="w-full border rounded-lg p-2"
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Task</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default TasksPage;
