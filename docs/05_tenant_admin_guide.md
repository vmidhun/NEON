# Tenant Admin – Role & Capabilities

## 1. Overview

The **Tenant Admin** is the highest‑privileged user **inside a single tenant** (company account).  
They are responsible for configuring how their organization uses the system, managing users, roles, policies, and modules for that tenant.

Tenant Admins **cannot** change global plans/pricing or manage other tenants (that is Super Admin scope).

---

## 2. Responsibilities (High Level)

- Configure the tenant’s environment (modules, policies, defaults).
- Manage all users and roles within the tenant.
- Control access to HR data, projects, timesheets, stand‑ups, and reports via permissions.
- Monitor usage and ensure the tenant operates within its plan limits.

---

## 3. Tenant Admin Permissions

### 3.1 Tenant Settings & Configuration

- View and update **tenant‑level settings**, including:
  - Company profile (name, logo, basic info).
  - Default time zone and working hours.
  - Work calendars and holiday lists.
- Configure **modules** available to tenant users, within plan entitlements:
  - Employee & Leave Management.
  - Project Management.
  - Timesheets.
  - Team Stand‑up.
  - Reports / Analytics.
  - AI task generation (if included in the plan).
- Configure **default leave policies** and map them to:
  - Employment types (Full‑time, Intern, Probation, Client‑policy).
  - Locations / departments (optional).

> Note: Turning modules on/off is limited by the tenant’s assigned plan; modules not included in the plan cannot be enabled.

---

### 3.2 User & Role Management (RBAC Inside Tenant)

- Create, invite, update, and deactivate users under the tenant.
- Link each user to one or more **tenant roles**, such as:
  - Tenant Admin
  - HR User
  - Accountant
  - Manager
  - Employee
- Configure **role‑based permissions** (RBAC) for each role:
  - Employees: view/edit self‑only data.
  - Managers: view/manage their team’s data.
  - HR: full HR data access (within tenant).
  - Accountant: access to financial/LOP‑relevant data.
- Define which role can:
  - View / create / update / delete employees.
  - View / create / update / delete projects and tasks.
  - Submit / approve / reject leaves and timesheets.
  - Access different categories of reports.

---

## 4. Data Visibility Rules

Tenant Admin ensures the following visibility rules are enforced:

### 4.1 Employee User

- Can:
  - View and edit their own profile, leaves, timesheets, and tasks.
  - View only projects they are assigned to (or explicitly shared).
- Cannot:
  - View other employees’ detailed personal information.
  - View other employees’ projects, tasks, or leave details unless explicitly shared via role/permission.

### 4.2 Manager

- Can:
  - View and manage employees who report to them (their **team**).
  - View and approve team members’ leave requests and timesheets.
  - View and manage tasks and stand‑up items for their team.
  - View projects they own or that are assigned to them/their team.
- Cannot:
  - Access other teams’ data unless granted broader permissions by Tenant Admin.

### 4.3 HR User

- Can:
  - View and edit all employee records within the tenant.
  - Configure and manage leave policies, balances, and adjustments.
  - View tenant‑wide leave usage and HR reports.
- Cannot:
  - Change global plan, pricing, or cross‑tenant settings.

### 4.4 Accountant

- Can:
  - View payroll‑relevant information such as LOP, attendance summaries, and aggregated financial reports.
  - Export relevant data (subject to plan permissions).
- Cannot:
  - Edit HR profiles or manage projects/tasks.
  - See sensitive HR fields (e.g., appraisal comments) unless explicitly allowed.

---

## 5. Tenant‑Level Permission Matrix (Summary)

> Legend: **V** = View, **C** = Create, **U** = Update, **D** = Delete, **A** = Approve  
> Scope terms: **Self** = own data, **Team** = direct reports, **All** = all employees in tenant.

| Resource / Action                             | Tenant Admin | HR User      | Accountant         | Manager             | Employee            |
|----------------------------------------------|-------------|-------------|--------------------|---------------------|---------------------|
| Tenant settings (calendars, policies)        | V C U       | V           | -                  | -                   | -                   |
| Manage roles & permissions                   | V C U D     | -           | -                  | -                   | -                   |
| Users: create/invite/deactivate              | V C U D     | V C U       | -                  | Team V              | Self V              |
| Assign roles to users                        | V C U       | -           | -                  | -                   | -                   |
| Employee profile – view                      | V (All)     | V (All)     | Limited V (All)    | V (Team)            | V (Self)            |
| Employee profile – edit                      | V U (All)   | V U (All)   | -                  | U (Team, limited)   | U (Self, limited)   |
| Leave policy config                          | V C U D     | V C U       | -                  | -                   | -                   |
| Leave balances – view                        | V (All)     | V (All)     | V (summary)        | V (Team)            | V (Self)            |
| Leave balances – adjust                      | V C U       | V C U       | -                  | -                   | -                   |
| Leave requests – submit                      | -           | -           | -                  | -                   | C U D (own)         |
| Leave requests – view                        | V (All)     | V (All)     | V (summary)        | V (Team)            | V (Self)            |
| Leave requests – approve / reject            | A (All)     | A (All/special) | -              | A (Team)            | -                   |
| Projects – view                              | V (All)     | V (All)     | -                  | V (Team/Owned)      | V (Assigned)        |
| Projects – create/update/delete              | V C U D     | -           | -                  | C U D (Team/Owned)  | -                   |
| Tasks – view                                 | V (All)     | V (All)     | -                  | V (Team)            | V (Self/Assigned)   |
| Tasks – create/update/delete                 | V C U D     | -           | -                  | C U D (Team)        | C U D (Own, config) |
| Timesheets – view                            | V (All)     | V (All)     | V (export)         | V (Team)            | V (Self)            |
| Timesheets – submit/update                   | -           | -           | -                  | -                   | C U (Self)          |
| Timesheets – approve                         | A (All)     | A (All)     | -                  | A (Team)            | -                   |
| Stand‑up sessions – create/manage            | V C U D     | -           | -                  | C U D (Team)        | -                   |
| Stand‑up tasks – view/update                 | V (All)     | V (All)     | -                  | V U (Team)          | V U (Self)          |
| Reports/Analytics – view                     | V (All)     | V (All)     | V (financial)      | V (Team)            | V (Self/basic)      |
| Export data (CSV/Excel)                      | V (All)     | V (All)     | V (financial)      | V (Team, limited)   | -                   |

Tenant Admin can fine‑tune permissions by editing role definitions and assigning users to roles.

---

## 6. Interaction with Plans & Limits

Although Tenant Admin cannot change the **plan** itself, they must operate within the plan entitlements:

- Can:
  - See which modules (Reports, Timesheet, Stand‑up, etc.) are enabled by the plan.
  - Turn on/off modules **within** what the plan allows.
  - Manage users, roles, and data up to the plan’s numeric limits (e.g., max employees, max projects).
- Cannot:
  - Increase numeric limits or enable modules that are not part of the current plan.
  - Change pricing or switch plans (this is done by Super Admin or billing flow).

When a limit is reached (e.g., max employees), Tenant Admin sees an appropriate error or upgrade prompt and can manage existing records (edit/deactivate) but cannot exceed the limit.

---

## 7. Summary

The Tenant Admin is the **owner of configuration and access control within a single tenant**.  
They:

- Control which modules are active for their organization.
- Define and assign roles and permissions to HR, Accountant, Managers, and Employees.
- Ensure employees and managers only see the data they are supposed to see.
- Keep the tenant compliant with plan limits and internal policies.

This role is central to making the application safe, compliant, and tailored to each tenant’s business structure.
