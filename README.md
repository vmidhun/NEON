# NEO Company Management System

NEO is a comprehensive Enterprise Resource Planning (ERP) platform designed to streamline workforce management, project tracking, and HR operations. It combines world-class UX with powerful administration tools to support organizations of varying complexities.

## 🌟 Key Features

### 🏢 HR & Policy Administration
*   **Leave Policy Management**: configurable leave types (e.g., Annual, Sick, Casual) with annual quotas, carry-over rules, and paid/unpaid status.
*   **Work Calendar Configuration**: Define multiple work calendars (e.g., "Standard", "US Support", "Part-Time") with custom working days (Mon-Fri, Sun-Thu, etc.) and region-specific holidays.
*   **User Management**: centralized directory for managing employees, roles, profiles, and team hierarchies.

### 📅 Project & Time Tracking
*   **Project Management**: Manage Clients, Projects, and Jobs.
*   **Advanced Configuration**: Link Projects to specific **Work Calendars** to enforce schedule rules and configure **Timesheet Policies** (Weekly/Bi-Weekly/Monthly submissions, Client Approval requirements).
*   **Task Management**: Create and assign tasks with hour allocations.
*   **Time Logging**: Employees can log time against assigned tasks with notes.

### ⏱️ Timesheet Management
*   **Employee Portal**:
    *   View weekly timesheet periods.
    *   Real-time validation against the project's work calendar (e.g., "Logged 35h, Required 40h").
    *   One-click submission for approval.
*   **Manager Approval**: Dashboard for managers to review, approve, or reject submitted timesheets with comments.

### 👥 Role-Specific Dashboards
*   **Employee**: Personal task list, "Who's on Leave" widget, daily plan suggestions, and leave balance summary.
*   **Manager**: Team overview, member activity tracking, and approval queues for leaves and timesheets.
*   **HR**: Organization-wide reports, leave balance tracking, and compliance tools.
*   **Admin**: Full system control, module toggles, and master data management.

### 🤖 AI Integration
*   **Smart Planning**: Powered by **Google Gemini 1.5 Flash**, the system analyzes an employee's pending tasks and suggests an optimal daily schedule to meet the 8-hour workday goal.

---

## 🛠️ Technology Stack

**Frontend**
*   **Framework**: React 18 with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts

**Backend**
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB Atlas (Mongoose ODM)
*   **Services**: Google Gemini API (AI), Multer (File Uploads)

---

## 🚀 Setup & Installation

The project consists of a React frontend (`NEON`) and a Node/Express backend (`neoback_end`).

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI
*   Google Gemini API Key

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd neoback_end
npm install
```

Create a `.env` file in `neoback_end/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the development server (runs both backend and frontend concurrently):
```bash
npm run dev
```

### 2. Frontend Setup (Standalone)
If you wish to run the frontend separately:
```bash
cd NEON
npm install
npm run dev
```

*Note: The frontend is configured to proxy API requests to `http://localhost:3000` via Vite configuration or Environment Variables.*

---

## 📚 API Documentation

The backend exposes RESTful endpoints for all modules. Key resources include:

*   `/api/auth`: Authentication (Login/Me)
*   `/api/users`: Employee directory operations
*   `/api/projects`: Project and configuration management
*   `/api/tasks`: Task assignment and tracking
*   `/api/leaves`: Leave applications and approvals
*   `/api/policies`: Configuration for Leave Types and Work Calendars
*   `/api/timesheets`: Submission and approval workflows

---

## 🎨 Design Philosophy
NEO prioritizes a "Rigid yet Beautiful" design system.
*   **Functional Density**: Information is presented clearly without wasted space.
*   **Visual Hierarchy**: Uses typography and color (e.g., slate/blue palette) to guide attention.
*   **Feedback**: Interactive states and micro-animations provide immediate user feedback.

---

© 2025 NEO Interaction Design. All rights reserved.