# 2. System Architecture

## Architecture Overview

C3 Wizard follows a **modern three-tier architecture** with clean separation of concerns, designed for current Supabase implementation with a clear migration path to ASP.NET Core.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  React 18 + TypeScript + Tailwind CSS + shadcn/ui          │
│  - Role-based routing                                       │
│  - Form validation & business logic                         │
│  - State management (Zustand/React Query)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓↑ HTTP/REST + WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│              Supabase (Backend as a Service)                │
│  - PostgreSQL Database                                      │
│  - Row Level Security (RLS) policies                        │
│  - Edge Functions (serverless API)                          │
│  - Realtime subscriptions                                   │
│  - Auth (JWT + Email + OTP)                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                         │
│  - Payment Gateways (CyberSource, PayPal)                   │
│  - Email Service (SendGrid/Resend via Edge Functions)       │
│  - PDF Generation (jsPDF/react-pdf)                         │
│  - BIMA API (optional - St. Kitts & Nevis SSB)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend (Presentation Layer)

#### Core Framework
- **React 18.3**: Component-based UI library
- **TypeScript**: Type-safe JavaScript for maintainability
- **Vite**: Fast build tool and development server

#### UI Components & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library

 (buttons, forms, dialogs, tables)
- **Lucide React**: Icon library
- **Recharts/Chart.js**: Data visualization for dashboards

#### State Management
- **Zustand**: Lightweight state management for global state
- **React Query (TanStack Query)**: Server state management, caching, and data fetching
- **React Hook Form**: Form state management with validation

#### Routing & Navigation
- **React Router v6**: Client-side routing with role-based guards
- **Protected Routes**: Admin, Employer, Self-Employed route protection

#### Data Handling
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting
- **numeral**: Number and currency formatting

---

### Backend (Application Layer)

#### Database
- **Supabase PostgreSQL**: Primary database
  - Schema: `c3_*` prefixed tables
  - Row Level Security (RLS) for multi-tenancy
  - Soft delete pattern (`is_active`, `is_deleted`)
  - Audit columns (`created_at`, `updated_at`, `created_by`, `updated_by`)

#### Authentication
- **Supabase Auth**:
  - Email/password authentication
  - JWT token-based sessions
  - Email OTP for multi-factor authentication
  - Password reset via email

#### API Layer
- **Supabase Client SDK**: Direct database queries from frontend
- **Supabase Edge Functions** (Deno): 
  - Payment gateway integration
  - Email sending
  - BIMA API calls
  - Complex calculations requiring server-side processing
  - PDF generation

#### Real-time Features
- **Supabase Realtime**: 
  - Admin dashboard updates (payment status changes)
  - Multi-user collaboration warnings (if two admins editing same data)

---

### Integration Services

#### Payment Gateways
1. **CyberSource** (Primary)
   - REST API integration
   - Tokenized card storage
   - PCI DSS compliant
   - Configuration via Supabase Edge Function

2. **PayPal** (Alternative)
   - PayPal Checkout SDK
   - PayPal account or card payments

3. **Offline Payments**
   - Manual entry in UI
   - Bank transfer, check, cash, journal voucher
   - Reconciliation workflow

#### Email Service
- **Provider**: SendGrid or Resend (via Edge Functions)
- **Templates**:
  - Registration confirmation
  - Password reset
  - OTP codes
  - Payment receipts
  - C3 submission confirmations

#### PDF Generation
- **Library**: jsPDF or react-pdf
- **Documents**:
  - C3 contribution forms
  - Payment receipts
  - Contribution summaries
  - Employee reports

#### BIMA Integration (Optional)
- **Purpose**: Sync with St. Kitts & Nevis Social Security Board
- **Features**:
  - Import employee data from BIMA
  - Post payments to BIMA
  - Retrieve BIMA receipt numbers
  - Validate contributions
- **Implementation**: Supabase Edge Function calling BIMA REST API

---

## Architecture Patterns

### Frontend Patterns

#### 1. Component Architecture
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Input, etc.)
│   ├── forms/           # Reusable form components
│   ├── layouts/         # Layout components (DashboardLayout, AuthLayout)
│   └── shared/          # Shared components (DataTable, Charts, etc.)
├── features/
│   ├── auth/            # Authentication feature
│   ├── employer/        # Employer-specific features
│   ├── self-employed/   # Self-employed features
│   ├── admin/           # Admin features
│   └── c3-form/         # C3 form generation (shared)
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   ├── calculations.ts  # Contribution calculation logic
│   ├── validation.ts    # Zod schemas
│   └── utils.ts         # Utility functions
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   ├── useC3Form.ts     # C3 form management hook
│   └── usePayment.ts    # Payment processing hook
├── stores/
│   ├── authStore.ts     # Auth state (Zustand)
│   └── uiStore.ts       # UI state (toasts, modals)
└── types/
    ├── database.ts      # Supabase generated types
    └── models.ts        # Application models
```

#### 2. Route Structure
```
/                           → Landing page
/login                      → Login page
/register                   → Registration (employer/self-employed)
/forgot-password            → Password reset
/verify-email               → Email verification

/employer/
├── /dashboard              → Dashboard overview
├── /employees              → Employee list
├── /employees/add          → Add employee
├── /employees/:id/edit     → Edit employee
├── /c3-forms               → C3 form list
├── /c3-forms/generate      → Generate new C3
├── /c3-forms/:id/edit      → Edit draft C3
├── /c3-forms/:id/review    → Review before submit
├── /payments               → Payment processing
├── /payment-history        → Transaction history
├── /reports                → Reports
└── /profile                → Company profile

/self-employed/
├── /dashboard              → Dashboard overview
├── /c3-forms               → My C3 forms
├── /c3-forms/generate      → Generate C3
├── /payments               → Payment processing
├── /payment-history        → Transaction history
└── /profile                → Personal profile

/admin/
├── /dashboard              → Admin dashboard
├── /users                  → User management
├── /reconciliation         → Payment reconciliation
├── /rates                  → Contribution rate management
├── /reports                → System-wide reports
├── /audit-logs             → Audit trail
└── /settings               → System settings
```

---

### Backend Patterns

#### 1. Database Design Patterns
- **Multi-tenancy**: Row Level Security (RLS) with company/user scoping
- **Soft Delete**: `is_deleted` flag (never hard delete)
- **Audit Trail**: All tables have `created_at`, `updated_at`, `created_by`, `updated_by`
- **Optimistic Concurrency**: `version` column for conflict detection on updates

#### 2. Row Level Security (RLS) Policies

**Example: Employers can only see their own employees**
```sql
CREATE POLICY "Employers can view own employees"
ON c3_employees
FOR SELECT
USING (
  company_id IN (
    SELECT company_id 
    FROM c3_users 
    WHERE id = auth.uid() AND role = 'employer'
  )
);
```

**Example: Admins can view all data**
```sql
CREATE POLICY "Admins can view all employees"
ON c3_employees
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM c3_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 3. Edge Function Patterns

**Calculation Engine** (Server-side for consistency):
```typescript
// supabase/functions/calculate-contributions/index.ts
export default async function calculateContributions(wageData, rates) {
  const ss_employee = calculateSS(wageData.totalWages, rates.ss_employee, rates.max_ss_employee);
  const levy_employee = calculateLevyProgressive(wageData.totalWages, rates.levyTiers);
  // ... all calculations
  return contributionBreakdown;
}
```

**Payment Processing**:
```typescript
// supabase/functions/process-payment/index.ts
export default async function processPayment(paymentData) {
  // Call CyberSource or PayPal API
  const result = await cyberSource.processPayment(paymentData);
  
  // Store in database
  await supabase.from('c3_payments').insert({
    c3_header_id: paymentData.c3HeaderId,
    amount: result.amount,
    gateway_transaction_id: result.transactionId,
    status: result.status
  });
  
  // Send receipt email
  await sendEmail({
    to: paymentData.userEmail,
    template: 'payment_receipt',
    data: result
  });
  
  return result;
}
```

---

## Security Architecture

### Authentication Flow
```
1. User enters email + password
   ↓
2. Supabase Auth validates credentials
   ↓
3. JWT token issued (24hr expiry)
   ↓
4. Frontend stores token in localStorage
   ↓
5. Token sent in Authorization header for all requests
   ↓
6. RLS policies check auth.uid() and user role
```

### Data Access Control

| Role | Data Scope | Implementation |
|------|-----------|----------------|
| Admin | All companies, all users | RLS policy checks `role = 'admin'` |
| Employer | Own company only | RLS policy checks `company_id = user's company` |
| Self-Employed | Own data only | RLS policy checks `user_id = auth.uid()` |

### Sensitive Data Protection
- **SSN**: Encrypted at rest using Supabase Vault (or pgcrypto)
- **Passwords**: Hashed by Supabase Auth (bcrypt)
- **Payment Tokens**: Stored encrypted, never logged
- **Audit Logs**: Immutable, no delete permissions

---

## Migration Strategy: Supabase → ASP.NET Core

### Why This Approach?

1. **Speed**: Lovable + Supabase allows rapid MVP development
2. **Testing**: Validate all business logic before .NET investment
3. **Client Approval**: Show working system quickly to secure budget
4. **Risk Mitigation**: Prove concept before committing to .NET rewrite

### Migration Architecture

```
Phase 1: Supabase (Current)
┌─────────┐         ┌──────────┐
│ React   │ ←─────→ │ Supabase │
│ Frontend│         │ Backend  │
└─────────┘         └──────────┘

Phase 2: Hybrid (Migration)
┌─────────┐         ┌──────────┐         ┌──────────┐
│ React   │ ←─────→ │ ASP.NET  │ ←─────→ │ MS-SQL   │
│ Frontend│         │ Core API │         │ Server   │
└─────────┘         └──────────┘         └──────────┘
                    ↓ (reads only during migration)
                    ┌──────────┐
                    │ Supabase │
                    │ (legacy) │
                    └──────────┘

Phase 3: Final
┌─────────┐         ┌──────────┐         ┌──────────┐
│ React   │ ←─────→ │ ASP.NET  │ ←─────→ │ MS-SQL   │
│ Frontend│         │ Core API │         │ Server   │
└─────────┘         └──────────┘         └──────────┘
```

### Migration Preparation in Current Build

To ensure smooth migration, we:

1. **Keep Business Logic in TypeScript**: All calculations in `/lib/calculations.ts` can be ported to C#
2. **Define TypeScript Interfaces**: Can be directly converted to C# models/DTOs
3. **Document All Formulas**: See `16_calculation_formulas_reference.md`
4. **Use Standard SQL**: No PostgreSQL-specific features in complex queries
5. **Abstract Database Calls**: Use service layer pattern (easy to swap Supabase for Axios)

---

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load routes and heavy components
- **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
- **Virtual Scrolling**: For large employee lists (100+ rows)
- **Debounced Search**: Reduce API calls on search input

### Database Optimization
- **Indexes**: On frequently queried columns (company_id, user_id, ssn, period_month/year)
- **Materialized Views**: For complex dashboard queries
- **Connection Pooling**: Supabase Postgres handles automatically
- **Pagination**: Always paginate large result sets

### Caching Strategy
- **React Query**: Cache employee lists, rate settings (revalidate on mutation)
- **localStorage**: User preferences, last accessed C3 form
- **CDN**: Static assets (images, fonts)

---

## Monitoring & Logging

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Supabase Dashboard**: Database query performance

### Audit Logging
All critical actions logged to `c3_audit_logs`:
- User authentication attempts
- C3 form submissions
- Payment transactions
- Rate configuration changes
- User management actions (admin)

---

## Scalability Considerations

### Current Scale (Lovable + Supabase)
- **Users**: Up to 10,000 concurrent users
- **Transactions**: 100,000 C3 forms per month
- **Database**: 100 GB (Supabase Pro plan supports this)

### Future Scale (ASP.NET + MS-SQL)
- **Horizontal Scaling**: Multiple API servers behind load balancer
- **Database Scaling**: MS-SQL Always On availability groups
- **Caching Layer**: Redis for session and computed data
- **File Storage**: Azure Blob Storage for PDFs and uploads

---

## Development Workflow

### Local Development
```bash
# 1. Start Vite dev server
npm run dev

# 2. Supabase local development (optional)
supabase start

# 3. Run type generation (after schema changes)
npm run generate-types
```

### Environment Management
- **Local**: `.env.local` (git-ignored)
- **Staging**: Supabase staging project
- **Production**: Supabase production project

---

## Quality Assurance

### Testing Strategy
1. **Unit Tests**: All calculation functions (`lib/calculations.ts`)
2. **Integration Tests**: API calls and database operations
3. **E2E Tests**: Critical user flows (Playwright or Cypress)
4. **Visual Tests**: Component visual regression (Chromatic)

### CI/CD Pipeline
```
1. Code Push → GitHub
   ↓
2. Run Tests (Jest + Playwright)
   ↓
3. Build Production Bundle
   ↓
4. Deploy to Vercel/Netlify
   ↓
5. Run Supabase Migrations
   ↓
6. Smoke Tests on Production
```

---

**Next**: See [03_user_roles_permissions.md](03_user_roles_permissions.md) for detailed role definitions and access control.
