# Tenant Entitlements & Middleware Technical Spec

Tenant APIs for:

- Reports.
- Timesheets.
- Team stand‑up.
- Project management.
- Employee leave management.

must read **plan entitlements** and enforce them.

## 1. Entitlement Helper

Implement a helper service:

```javascript
async function getTenantEntitlements(tenantId) {
// 1. Load TenantSubscription for tenantId
// 2. Load Plan + PlanFeature records
// 3. Map into a simple object:

return {
project_management: { type: 'BOOLEAN', value: true },
leave_management: { type: 'BOOLEAN', value: true },
timesheet: { type: 'BOOLEAN', value: false },
team_standup: { type: 'BOOLEAN', value: false },
reports: { type: 'BOOLEAN', value: false },
max_employees: { type: 'NUMERIC', value: 20 },
max_projects: { type: 'NUMERIC', value: 5 }
};
}
```

- Add caching per tenant with a short TTL (e.g., 5–10 minutes) to avoid repeated DB lookups.

## 2. Middleware / Guards

Create generic middleware to enforce feature flags and limits.

**Feature flag enforcement**

```javascript
function ensureFeatureEnabled(featureKey) {
return async (req, res, next) => {
const tenantId = req.context.tenantId;
const entitlements = await getTenantEntitlements(tenantId);
const feature = entitlements[featureKey];
if (!feature || feature.type !== 'BOOLEAN' || !feature.value) {
  return res.status(403).json({
    error: 'FEATURE_DISABLED',
    message: `Feature ${featureKey} is not enabled for this plan.`
  });
}
next();
};
}
```

**Limit enforcement**

```javascript
async function checkLimitAndThrow(tenantId, featureKey, currentUsageGetter) {
const entitlements = await getTenantEntitlements(tenantId);
const feature = entitlements[featureKey];

if (!feature || feature.type !== 'NUMERIC') return;

const limit = feature.value;
if (typeof limit !== 'number') return;

const currentUsage = await currentUsageGetter();

if (currentUsage >= limit) {
const error = new Error('LIMIT_REACHED');
error.statusCode = 403;
error.meta = {
featureKey,
limit,
currentUsage,
};
throw error;
}
}
```

## 3. Tenant‑Facing Entitlements Endpoint

Add:

- `GET /api/v1/tenant/entitlements`

Response example:

```json
{
"plan": {
"name": "Starter",
"code": "STARTER",
"billingType": "TRIAL"
},
"features": {
"project_management": { "type": "BOOLEAN", "value": true },
"leave_management": { "type": "BOOLEAN", "value": true },
"timesheet": { "type": "BOOLEAN", "value": false },
"team_standup": { "type": "BOOLEAN", "value": false },
"reports": { "type": "BOOLEAN", "value": false },
"max_employees": { "type": "NUMERIC", "value": 20 },
"max_projects": { "type": "NUMERIC", "value": 5 }
}
}
```

Frontend can use this to:

- Show/hide modules (Reports, Timesheet, Team Stand‑up).
- Display “Upgrade plan” UI when trying to access disabled modules or hitting limits.
