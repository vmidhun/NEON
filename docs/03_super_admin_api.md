# Super Admin API Specification

All Super Admin routes should be under a `/super` namespace and protected by `SUPER_ADMIN` role. Super Admin should not access tenant HR features.

## 1. Plan Management APIs

Implement:

- `GET /api/v1/super/plans`
  - List plans with pagination & filters (active/inactive).
- `POST /api/v1/super/plans`
  - Create a new plan.
  - Body:
    ```json
    {
      "name": "Starter",
      "code": "STARTER",
      "billingType": "PAID",
      "priceCurrency": "INR",
      "priceAmount": 999
    }
    ```
- `PATCH /api/v1/super/plans/:planId`
  - Update `name`, `priceAmount`, `billingType`, `isActive`.

- `GET /api/v1/super/plans/:planId/features`
  - List all features for a plan.
- `POST /api/v1/super/plans/:planId/features`
  - Bulk create/update features.
  - Body:
    ```json
    [
      { "key": "project_management", "type": "BOOLEAN", "boolValue": true },
      { "key": "leave_management", "type": "BOOLEAN", "boolValue": true },
      { "key": "timesheet", "type": "BOOLEAN", "boolValue": false },
      { "key": "team_standup", "type": "BOOLEAN", "boolValue": false },
      { "key": "reports", "type": "BOOLEAN", "boolValue": false },
      { "key": "max_employees", "type": "NUMERIC", "numericValue": 20 },
      { "key": "max_projects", "type": "NUMERIC", "numericValue": 5 }
    ]
    ```
- `PATCH /api/v1/super/plans/:planId/features/:featureId`
  - Update a specific feature.

## 2. Tenant Subscription Management APIs

- `GET /api/v1/super/tenants`
  - For each tenant, return:
    - Tenant name.
    - Tenant status (active/suspended).
    - Subscription status (TRIAL/ACTIVE/PAST_DUE/CANCELLED).
    - Plan code/name.

- `PATCH /api/v1/super/tenants/:tenantId/status`
  - Enable/disable tenant.
  - Disabled tenants cannot log in or access tenant APIs.

- `GET /api/v1/super/tenants/:tenantId/subscription`
  - Return current subscription object (plan, status, trial, discount).

- `POST /api/v1/super/tenants/:tenantId/subscription`
  - Attach or change a plan for a tenant.
  - Body example:
    ```json
    {
      "planId": "64f123abc...",
      "status": "ACTIVE",
      "trialStart": null,
      "trialEnd": null,
      "discountType": "PERCENT",
      "discountValue": 20
    }
    ```

## 3. Super Admin Dashboard APIs

- `GET /api/v1/super/metrics/overview`
  - Returns:
    - `totalTenants`
    - `activeTenants`
    - `trialTenants`
    - `paidTenants` (ACTIVE & not TRIAL)
    - `tenantsByPlan` – array of `{ planCode, planName, count }`
    - (optional) aggregated revenue metrics using plan prices.
