import { API_BASE_URL } from '../AuthContext';

const getHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const api = {
    // Uploads
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                // Content-Type is set automatically for FormData
            },
            body: formData
        });
        if (!res.ok) throw new Error('Failed to upload file');
        return res.json();
    },
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
    bulkUpdateUsers: async (userIds: string[], updates: any) => {
        const res = await fetch(`${API_BASE_URL}/users/bulk`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ userIds, updates })
        });
        if (!res.ok) throw new Error('Failed to update users');
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
    },

    // --- Leave Management ---
    applyLeave: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/leaves/apply`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to apply leave');
        return res.json();
    },
    getMyLeaves: async () => {
        const res = await fetch(`${API_BASE_URL}/leaves/my`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch my leaves');
        return res.json();
    },
    getMyBalance: async () => {
        const res = await fetch(`${API_BASE_URL}/leaves/balance/my`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch balance');
        return res.json();
    },
    getPendingLeaves: async () => {
        const res = await fetch(`${API_BASE_URL}/leaves/pending`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch pending leaves');
        return res.json();
    },
    updateLeaveStatus: async (id: string, status: 'Approved' | 'Rejected', rejectionReason?: string) => {
        const res = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status, rejectionReason }),
        });
        if (!res.ok) throw new Error('Failed to update leave status');
        return res.json();
    },
    getTeamLeaves: async () => {
        const res = await fetch(`${API_BASE_URL}/leaves/calendar`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch team leaves');
        return res.json();
    },

    // --- Time Logs ---
    getTimeLogs: async () => {
        const res = await fetch(`${API_BASE_URL}/timelogs`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch time logs');
        return res.json();
    },
    createTimeLog: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/timelogs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create time log');
        return res.json();
    },

    // --- Timesheets ---
    getTimesheets: async (params?: any) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        const res = await fetch(`${API_BASE_URL}/timesheets${qs}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch timesheets');
        return res.json();
    },
    submitTimesheet: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/timesheets/submit`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to submit timesheet');
        return res.json();
    },
    updateTimesheetStatus: async (id: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}/timesheets/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update timesheet status');
        return res.json();
    },

    // --- Generic Helpers (for new modules) ---
    get: async (endpoint: string) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
        if (!res.ok) throw new Error(`GET ${endpoint} failed`);
        return res.json();
    },
    post: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`POST ${endpoint} failed`);
        return res.json();
    },
    put: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`PUT ${endpoint} failed`);
        return res.json();
    },
    delete: async (endpoint: string) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
        return true;
    },
};
