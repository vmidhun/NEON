# NEO Timesheet & Project Management

A sophisticated platform for time and project management, emphasizing a world-class user experience. It streamlines daily employee workflows, provides proactive planning for managers, and generates actionable reports.

## Table of Contents
- [Features](#features)
  - [User Roles & Dashboards](#user-roles--dashboards)
  - [Employee Dashboard](#employee-dashboard)
  - [Scrum Master Dashboard](#scrum-master-dashboard)
  - [Reports Dashboard (HR/Admin)](#reports-dashboard-hradmin)
  - [Admin Dashboard](#admin-dashboard)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [AI Integration (Google Gemini API)](#ai-integration-google-gemini-api)

## Features

### User Roles & Dashboards
The application supports multiple user roles, each with a tailored dashboard experience:
*   **Employee:** Manages personal tasks, logs time, and checks daily progress.
*   **Scrum Master:** Oversees team activities and progress.
*   **HR:** Generates reports and manages leave.
*   **Admin:** Configures system modules and master data.

### Employee Dashboard
*   **Check-in/Check-out:** Start and end the workday, tracking total time.
*   **AI-Powered Daily Plan:** Utilize the Gemini API to generate a suggested daily work plan, allocating hours to pending tasks based on an 8-hour workday and project priorities.
*   **Task Management:** View assigned tasks, log hours, and update task statuses (To Do, In Progress, Completed).
*   **Time Logging Modal:** A dedicated interface for logging hours with notes, showing allocated vs. logged hours and progress.
*   **Hours Summary:** A visual bar chart comparing logged hours against required daily hours (8 hours).
*   **Leave Balance:** Displays current annual, sick, and casual leave balances.

### Scrum Master Dashboard
*   **Team Standup View:** Provides an overview of team members' check-in status and daily progress (logged hours vs. required).
*   **Progress Tracking:** Visual representation of each team member's logged hours against their daily target.

### Reports Dashboard (HR/Admin)
*   **Project Hours Distribution:** A pie chart visualizing how hours are distributed across different projects for a given month.
*   **Timesheet Generation:** A form to generate various types of timesheets (Client-based, Project-based, Individual) for specified date ranges.
*   **Export Functionality:** Option to export generated timesheets as PDF.

### Admin Dashboard
*   **Module Configuration:** Toggle the availability of core platform modules like Time & Attendance, Leave Management, and Payroll Integration.
*   **Master Data Management:** Interfaces to manage foundational data such as Clients, Projects, and Jobs.

## Technologies Used
*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **AI:** Google Gemini API SDK (`@google/genai`)
*   **Module Bundling:** ES Modules with `esm.sh` for dependencies.

## Setup and Installation

To run this application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd neo-timesheet-app
    ```
2.  **Install dependencies:**
    This project uses ESM (ECMAScript Modules) directly in the browser via `importmap`. Therefore, there's no traditional `npm install` for frontend dependencies. However, if you are running a Node.js environment for the backend or local development server, you would typically run:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up your Google Gemini API Key:**
    The application uses the Google Gemini API for AI-powered features (e.g., daily plan suggestions). You need to obtain an API key from Google AI Studio.
    Create a `.env` file in the project root with your API key:
    ```
    API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    ```
    *Note: The `process.env.API_KEY` is assumed to be pre-configured and accessible in the execution context.*
4.  **Open `index.html`:**
    Since this is a simple static site using ESM, you can often just open `index.html` directly in your browser or serve it with a simple static file server (e.g., `npx serve .` if you have Node.js installed).

## AI Integration (Google Gemini API)

The application integrates with the Google Gemini API to provide intelligent task allocation suggestions.
The `suggestDailyPlan` function in `services/geminiService.ts` sends a list of pending tasks to the `gemini-2.5-flash` model. The model then returns a structured JSON array suggesting allocated hours for each task, aiming for an approximate 8-hour workday.

The API key for Gemini is loaded from `process.env.API_KEY` and is critical for these features to function. If the API key is not configured, AI features will be disabled.