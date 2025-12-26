
export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Blocked = 'Blocked'
}

export enum UserRole {
  Employee = 'Employee',
  Manager = 'Manager',
  HR = 'HR',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  TenantAdmin = 'TenantAdmin',
  Accountant = 'Accountant'
}

export interface Team {
  _id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  client: Client;
  workCalendarId?: string;
  timesheetConfig?: {
    submissionFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
    requireClientApproval: boolean;
  };
}

export interface Job {
  id: string;
  name: string;
  project: Project;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  job: Job;
  project?: Project;
  allocatedHours: number;
  status: TaskStatus;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignedBy?: string;
  assignedTo?: string; // Employee ID
  isAiGenerated?: boolean;
}

export interface TimeLog {
  id: string;
  taskId: string;
  loggedHours: number;
  notes: string;
  date: string;
}

export interface PersonalInfo {
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  nationality?: string;
  personalEmail?: string;
  mobileNumber?: string;
  secondaryNumber?: string;
  currentAddress?: string;
  permanentAddress?: string;
  linkedinProfile?: string;
}

export interface EmploymentDetails {
  empId?: string;
  doj?: string;
  confirmationDate?: string;
  employmentType?: 'Full-time' | 'Contract' | 'Intern' | 'Probation' | 'Client-Policy';
  employmentStatus?: 'Active' | 'Notice Period' | 'Terminated' | 'Sabbatical';
  officialDesignation?: string;
  workLocation?: string;
}

export interface FinancialDetails {
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panCardNumber?: string;
  aadhaarNumber?: string;
  uanNumber?: string;
  pfAccountNumber?: string;
}

export interface Documents {
  resumeUrl?: string;
  offerLetterUrl?: string;
  appointmentLetterUrl?: string;
  idProofUrl?: string;
  photoUrl?: string;
}

// ... (existing interfaces)

export interface LeaveBalance {
    _id: string;
    year: number;
    annual: number;
    sick: number;
    casual: number;
    maternity: number;
    paternity: number;
    lossOfPay: number;
    carriedOver: number;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'LossOfPay' | 'Marriage' | 'Floating' | 'Holiday';

export interface LeaveRequest {
    _id: string;
    userId: string | Employee; // Populated or ID
    leaveType: LeaveType;
    startDate: string; // Date string
    endDate: string;
    daysCount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    approverId?: string;
    rejectionReason?: string;
    isLossOfPay: boolean;
    createdAt?: string;

    // Emergency fields
    isEmergency?: boolean;
    emergencyReportedVia?: 'Phone' | 'Email' | 'Chat';
    emergencyReportedAt?: string;
    attachments?: string[]; // URLs
}

export interface EmergencyContact {
// ...
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface Employee {
    _id: string; // Mongoose ID
    id?: string; // Optional legacy support
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    teamId?: string; // Optional as some might not be in a team yet
    designation?: string;
    hierarchyLevel?: number;
    reportingManagerId?: string;

    // HRMS Sections
    personalInfo?: PersonalInfo;
    employmentDetails?: EmploymentDetails;
    financialDetails?: FinancialDetails;
    documents?: Documents;
    emergencyContacts?: EmergencyContact[];
}

export interface StandupSession {
    id: string;
    date: string;
    teamId: string;
    createdBy: string;
    tasks: {
        taskId: string;
        employeeId: string;
        status: TaskStatus;
        notes?: string;
    }[];
}
