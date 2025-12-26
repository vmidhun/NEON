# Plans, Modules & Limits Architecture

## 1. Concepts & Requirements

### 1.1 Plans

Create a global **Plan** model:

- Each plan defines:
  - `name` (e.g., Starter, Pro, Enterprise).
  - `code` (e.g., STARTER, PRO).
  - `billingType`:
    - `TRIAL`
    - `PAID`
    - `DISCOUNTED`
  - Price:
    - `priceCurrency` (e.g., INR).
    - `priceAmount` (e.g., 999 per month).
  - `isActive` flag to enable/disable the plan.

Characteristics:

- Plans are global (not tenant‑scoped).
- Plans are templates; tenants are attached via **TenantSubscription**.

### 1.2 Features / Modules / Limits

Create a **PlanFeature** model that defines what a plan allows.

Each PlanFeature has:

- `plan` – reference to Plan.
- `key` – string identifier for the feature/limit.
- `type` – one of:
  - `BOOLEAN` – module on/off.
  - `NUMERIC` – numeric limit.
- Value fields:
  - `boolValue` (for BOOLEAN features).
  - `numericValue` (for NUMERIC features).

#### 1.2.1 Module Feature Keys (BOOLEAN)

Switchable module keys (typical examples):

- `project_management`
- `leave_management`
- `timesheet`
- `team_standup`
- `reports`

If `boolValue` is `true`, the module is enabled for that plan; if `false`, module is unavailable.

#### 1.2.2 Limit Feature Keys (NUMERIC)

Numeric limit keys (examples):

- `max_employees`
- `max_projects`
- `max_reports` (optional)
- `max_timesheets` (optional)
- `max_standup_sessions` (optional)

These define the maximum allowed entities per tenant under that plan.

### 1.3 Tenant Subscription

Create a **TenantSubscription** model linking each tenant to a plan.

Fields:

- `tenant` – ref to Tenant.
- `plan` – ref to Plan.
- `status`:
  - `TRIAL`
  - `ACTIVE`
  - `PAST_DUE`
  - `CANCELLED`
- `trialStart`, `trialEnd` – only relevant for trial.
- Discount info (optional):
  - `discountType` – `NONE`, `PERCENT`, `FIXED`.
  - `discountValue` – numeric.

Rules:

- Each tenant should have **one active subscription**.
- Subscription is the single source of truth for:
  - Which plan a tenant is on.
  - Whether they are trial/paid/discounted.
  - What modules and limits apply (via the plan’s features).

### 1.4 Tenant Usage Snapshot (Optional But Recommended)

Create a **TenantUsage** model to track usage counts for efficient limit checks.

Fields:

- `tenant`
- `employeesCount`
- `projectsCount`
- `lastRefreshedAt`

## 2. Mongoose Schemas (High‑Level)

### 2.1 Plan Schema

```javascript
const PlanSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // e.g. STARTER, PRO
  billingType: {
    type: String,
    enum: ['TRIAL', 'PAID', 'DISCOUNTED'],
    default: 'PAID',
  },
  priceCurrency: { type: String, default: 'INR' },
  priceAmount: { type: Number, required: true }, // price per billing period
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
```

### 2.2 PlanFeature Schema

```javascript
const PlanFeatureSchema = new Schema({
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', index: true },
  key: { type: String, required: true }, // 'project_management', 'max_employees', etc.
  type: { type: String, enum: ['BOOLEAN', 'NUMERIC'], required: true },
  boolValue: { type: Boolean, default: null },
  numericValue: { type: Number, default: null },
}, { timestamps: true });

PlanFeatureSchema.index({ plan: 1, key: 1 }, { unique: true });
```

### 2.3 TenantSubscription Schema

```javascript
const TenantSubscriptionSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true, unique: true },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
  status: {
    type: String,
    enum: ['TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED'],
    default: 'TRIAL',
  },
  trialStart: Date,
  trialEnd: Date,
  discountType: {
    type: String,
    enum: ['NONE', 'PERCENT', 'FIXED'],
    default: 'NONE',
  },
  discountValue: { type: Number, default: 0 },
}, { timestamps: true });
```

### 2.4 TenantUsage Schema

```javascript
const TenantUsageSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true, unique: true },
  employeesCount: { type: Number, default: 0 },
  projectsCount: { type: Number, default: 0 },
  lastRefreshedAt: Date,
}, { timestamps: true });
```
