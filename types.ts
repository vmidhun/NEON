
export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum UserRole {
  Employee = 'Employee',
  ScrumMaster = 'Scrum Master',
  HR = 'HR',
  Admin = 'Admin',
}

export interface Client {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  client: Client;
}

export interface Job {
  id: string;
  name: string;
  project: Project;
}

export interface Task {
  id: string;
  name: string;
  job: Job;
  allocatedHours: number;
  status: TaskStatus;
  assignedBy?: string;
}

export interface TimeLog {
  id: string;
  taskId: string;
  loggedHours: number;
  notes: string;
  date: string;
}

export interface Employee {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    teamId: string;
}
