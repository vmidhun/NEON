# System Overview: Multi-Tenant HR SaaS

## Context

We have a **multi‑tenant HR SaaS** platform built with **Express + MongoDB/Mongoose**.

Tenant‑side features (used by Tenant Admin/Manager/Employee) include:

- Employee & leave management.
- Project & task management.
- Timesheets.
- Team stand‑up calendar.
- Reports / analytics.
- AI‑assisted task generation.

Now we need to implement a **Super Admin control plane** with:

- **Plans** (pricing packages).
- **Module toggles** (on/off modules per plan).
- **Usage limits** (numeric limits per plan, e.g., max employees).
- **Tenant subscriptions** (attach a plan to a tenant).
- **Super admin dashboard** with tenants, plans, and subscription stats.

Super Admin is **not** an HR user; they should not see any tenant HR data (employees, leaves, projects, etc.). Their scope is **only** global account and billing configuration.
