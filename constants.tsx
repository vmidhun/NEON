
import React from 'react';
import { Client, Project, Job, Task, TaskStatus, Employee, UserRole } from './types';

export const REQUIRED_DAILY_HOURS = 8;

// Mock Data
export const CLIENTS: Client[] = [
  { id: 'cli_1', name: 'Innovate Corp' },
  { id: 'cli_2', name: 'Quantum Solutions' },
  { id: 'cli_3', name: 'Stellar Goods' },
];

export const PROJECTS: Project[] = [
  { id: 'proj_1', name: 'Project Phoenix', client: CLIENTS[0] },
  { id: 'proj_2', name: 'Orion Platform', client: CLIENTS[1] },
  { id: 'proj_3', name: 'RetailNext', client: CLIENTS[2] },
];

export const JOBS: Job[] = [
  { id: 'job_1', name: 'Backend Development', project: PROJECTS[0] },
  { id: 'job_2', name: 'UI/UX Design', project: PROJECTS[0] },
  { id: 'job_3', name: 'API Integration', project: PROJECTS[1] },
  { id: 'job_4', name: 'Mobile App', project: PROJECTS[2] },
  { id: 'job_5', name: 'Database Migration', project: PROJECTS[1] },
];

export const ALL_TASKS: Task[] = [
  { id: 'task_1', name: 'Implement user authentication', job: JOBS[0], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Liam G.' },
  { id: 'task_2', name: 'Design dashboard wireframes', job: JOBS[1], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Self' },
  { id: 'task_3', name: 'Connect to third-party payment gateway', job: JOBS[2], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Liam G.' },
  { id: 'task_4', name: 'Build product listing page', job: JOBS[3], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Self' },
  { id: 'task_5', name: 'Optimize database queries', job: JOBS[4], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Liam G.' },
  { id: 'task_6', name: 'Finalize login page UI', job: JOBS[1], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Self' },
  { id: 'task_7', name: 'Setup CI/CD pipeline', job: JOBS[0], allocatedHours: 0, status: TaskStatus.ToDo, assignedBy: 'Liam G.' },
];

export const EMPLOYEES: Employee[] = [
    { id: 'emp_1', name: 'Alex Doe', role: UserRole.Employee, avatarUrl: 'https://i.pravatar.cc/150?u=emp_1', teamId: 'team_alpha' },
    { id: 'emp_2', name: 'Liam Gallagher', role: UserRole.ScrumMaster, avatarUrl: 'https://i.pravatar.cc/150?u=emp_2', teamId: 'team_alpha' },
    { id: 'emp_3', name: 'Jane Smith', role: UserRole.Employee, avatarUrl: 'https://i.pravatar.cc/150?u=emp_3', teamId: 'team_alpha' },
    { id: 'emp_4', name: 'Chen Wang', role: UserRole.Employee, avatarUrl: 'https://i.pravatar.cc/150?u=emp_4', teamId: 'team_alpha' },
    { id: 'emp_5', name: 'Priya Sharma', role: UserRole.HR, avatarUrl: 'https://i.pravatar.cc/150?u=emp_5', teamId: 'hr_dept' },
    { id: 'emp_6', name: 'Sam Jones', role: UserRole.Admin, avatarUrl: 'https://i.pravatar.cc/150?u=emp_6', teamId: 'admin_dept' },
];

// SVG Icons
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.455L17.25 14.25l.398 1.197a3.375 3.375 0 002.455 2.455L21 18.75l-1.197.398a3.375 3.375 0 00-2.455 2.455z" />
  </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ArrowRightOnRectangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
