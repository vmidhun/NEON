import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { api } from '../services/api';
import { Project, Client, Job } from '../types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [pData, cData, jData] = await Promise.all([
            api.getProjects(),
            api.getClients(),
            api.getJobs()
        ]);
        setProjects(pData);
        setClients(cData);
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

  const handleCreateProject = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProjectName || !newProjectClient) return;
      try {
          await api.createProject({ name: newProjectName, clientId: newProjectClient });
          setShowModal(false);
          setNewProjectName('');
          setNewProjectClient('');
          fetchData();
      } catch (err) {
          alert('Failed to create project');
      }
  };

  const handleDeleteProject = async (id: string) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          await api.deleteProject(id);
          fetchData();
      } catch(err) {
          alert("Failed to delete project");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
        <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          + New Project
        </button>
      </div>
      
      {isLoading ? (
          <p>Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
            <DashboardCard key={project.id} title={project.name}>
                <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Client</span>
                    <span className="font-medium text-slate-700">{project.client?.name || 'Unknown'}</span>
                </div>
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Active Jobs</p>
                    <ul className="space-y-2">
                    {jobs.filter(j => j.project?.id === project.id).map(job => (
                        <li key={job.id} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {job.name}
                        </li>
                    ))}
                    {jobs.filter(j => j.project?.id === project.id).length === 0 && (
                        <li className="text-xs text-slate-400 italic">No active jobs</li>
                    )}
                    </ul>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button onClick={() => handleDeleteProject(project.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                </div>
                </div>
            </DashboardCard>
            ))}
        </div>
      )}

      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold mb-4">Create New Project</h3>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Project Name</label>
                          <input 
                            type="text" 
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Client</label>
                          <select 
                            value={newProjectClient}
                            onChange={e => setNewProjectClient(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                          >
                              <option value="">Select a Client...</option>
                              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Project</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProjectsPage;
