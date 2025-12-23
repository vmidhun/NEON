import { API_BASE_URL } from '../AuthContext';

const getHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const api = {
    // Projects
    getProjects: async () => {
        const res = await fetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },
    createProject: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create project');
        return res.json();
    },
    updateProject: async (id: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update project');
        return res.json();
    },
    deleteProject: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete project');
        return true;
    },

    // Tasks
    getTasks: async () => {
        const res = await fetch(`${API_BASE_URL}/tasks`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
    },
    createTask: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create task');
        return res.json();
    },
    updateTask: async (id: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
    },
    deleteTask: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete task');
        return true;
    },

    // Teams
    getTeams: async () => {
        const res = await fetch(`${API_BASE_URL}/teams`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch teams');
        return res.json();
    },
    createTeam: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/teams`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create team');
        return res.json();
    },
    deleteTeam: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/teams/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete team');
        return true;
    },

    // Users (Team Members)
    getUsers: async () => {
        const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },
    createUser: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create user');
        return res.json();
    },
    updateUser: async (id: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    },
    deleteUser: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete user');
        return true;
    },

    // Clients and Jobs (Helpers for form dropdowns)
    getClients: async () => {
        const res = await fetch(`${API_BASE_URL}/clients`, { headers: getHeaders() });
        return res.ok ? res.json() : [];
    },
    getJobs: async () => {
        const res = await fetch(`${API_BASE_URL}/jobs`, { headers: getHeaders() });
        return res.ok ? res.json() : [];
    }
};
