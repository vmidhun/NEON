
export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum UserRole {
  Employee = 'Employee',
  Manager = 'Manager',
  HR = 'HR',
  Admin = 'Admin',
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
  employmentType?: 'Full-time' | 'Contract' | 'Intern';
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

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'LossOfPay';

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
