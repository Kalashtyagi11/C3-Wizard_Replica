# 3. User Roles & Permissions

## Role Overview

C3 Wizard supports three distinct user roles, each with specific capabilities and data access permissions. Role-based access control (RBAC) is enforced through Supabase Row Level Security (RLS) policies.

---

## Role Definitions

### 1. Administrator (admin)

**Purpose**: System operators and St. Kitts & Nevis Social Security Board staff who manage the entire system

**User Table Fields**:
```typescript
{
  id: uuid,
  email: string,
  role: 'admin',
  is_active: boolean,
  // No company_id - admins are system-wide
}
```

**Capabilities**:

#### User Management
- ✅ View all employer and self-employed users
- ✅ Activate/deactivate user accounts
- ✅ Reset user passwords
- ✅ View user login history
- ❌ Cannot delete users (soft delete only)

#### Rate Configuration
- ✅ Update contribution rates (SS, EI, Levy, PE percentages)
- ✅ Set maximum contribution caps
- ✅ Configure penalty rates
- ✅ Set effective dates for rate changes
- ✅ View rate change history

#### Payment Reconciliation
- ✅ View all payment transactions across all companies
- ✅ Match payments with bank statements
- ✅ Upload reconciliation CSV files
- ✅ Mark payments as reconciled
- ✅ Add reconciliation notes
- ✅ Generate reconciliation reports

#### Reporting & Analytics
- ✅ View system-wide dashboards
- ✅ Generate aggregate reports (total contributions, payment status)
- ✅ Export data for all companies
- ✅ Access audit logs for all user actions
- ✅ View BIMA sync status (if enabled)

#### System Configuration
- ✅ Configure payment gateway settings (CyberSource, PayPal)
- ✅ Manage email templates
- ✅ Enable/disable BIMA integration
- ✅ Configure system-wide settings

**Data Access Scope**: **All companies, all users**

**RLS Policy Example**:
```sql
-- Admins can view all C3 headers
CREATE POLICY "Admins view all C3 headers"
ON c3_contribution_headers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM c3_users
    WHERE c3_users.id = auth.uid() 
    AND c3_users.role = 'admin'
  )
);
```

---

### 2. Employer (employer)

**Purpose**: Business owners, HR managers, or payroll administrators managing employee contributions

**User Table Fields**:
```typescript
{
  id: uuid,
  email: string,
  role: 'employer',
  company_id: uuid,          // Links to c3_companies table
  is_active: boolean,
}
```

**Capabilities**:

#### Company Profile Management
- ✅ View company information
- ✅ Update company details (name, address, contact)
- ✅ Update registration number (with validation)
- ❌ Cannot change company ID or delete company

#### Employee Management
- ✅ Add new employees
- ✅ Edit employee details (name, SSN, address, etc.)
- ✅ Set employee flags (director-only, employee-director, levy-exempt)
- ✅ Soft delete employees (mark as terminated)
- ✅ Import employees from BIMA (if integration enabled)
- ✅ Import employees from Excel/CSV
- ❌ Cannot view employees of other companies
- ❌ Cannot hard delete employees

#### C3 Form Generation & Management
- ✅ Generate new C3 forms for any month/year
- ✅ Enter wages for each employee (weeks 1-5)
- ✅ Enter holiday pay amounts
- ✅ Enter bonus amounts
- ✅ Set work period flags (which weeks worked)
- ✅ Auto-calculate contributions
- ✅ Save as draft (edit later)
- ✅ Review C3before submission
- ✅ Submit C3 (locks form from editing)
- ❌ Cannot edit submitted C3 forms
- ❌ Cannot delete submitted C3 forms
- ❌ Cannot view other companies' C3 forms

#### Director Payroll
- ✅ Add non-working directors
- ✅ Enter director annual salary
- ✅ Auto-calculate weekly director wages
- ✅ Generate director-specific C3 forms
- ✅ Process director contributions separately

#### Payment Processing
- ✅ View submitted C3 forms pending payment
- ✅ Pay via CyberSource (credit/debit card)
- ✅ Pay via PayPal
- ✅ Record offline payments (bank transfer, check, cash)
- ✅ View payment history for own company
- ✅ Download payment receipts (PDF)
- ✅ View payment status (pending, completed, failed)
- ❌ Cannot process payments for other companies
- ❌ Cannot access reconciliation tools

#### Reporting
- ✅ Generate employee contribution reports
- ✅ Generate C3 submission history
- ✅ Generate payment transaction history
- ✅ Export reports to PDF/Excel
- ❌ Cannot view system-wide reports
- ❌ Cannot access other companies' data

#### Profile Management
- ✅ Update own password
- ✅ Update email (with verification)
- ✅ Enable/disable MFA
- ❌ Cannot change role

**Data Access Scope**: **Own company only**

**RLS Policy Example**:
```sql
-- Employers can only view employees in their company
CREATE POLICY "Employers view own employees"
ON c3_employees
FOR SELECT
USING (
  company_id IN (
    SELECT company_id
    FROM c3_users
    WHERE c3_users.id = auth.uid()
    AND c3_users.role = 'employer'
  )
);

-- Employers can only insert employees with their company_id
CREATE POLICY "Employers insert own employees"
ON c3_employees
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id
    FROM c3_users
    WHERE c3_users.id = auth.uid()
    AND c3_users.role = 'employer'
  )
);
```

---

### 3. Self-Employed (self_employed)

**Purpose**: Freelancers, contractors, sole proprietors contributing on their own behalf

**User Table Fields**:
```typescript
{
  id: uuid,
  email: string,
  role: 'self_employed',
  self_employed_profile_id: uuid,  // Links to c3_self_employed_profiles
  is_active: boolean,
  // No company_id - self-employed work for themselves
}
```

**Capabilities**:

#### Personal Profile Management
- ✅ View own profile
- ✅ Update personal details (name, SSN, address, contact)
- ✅ Update category/occupation
- ❌ Cannot change SSN after initial registration (requires admin)

#### Self-Contribution Management
- ✅ Generate C3 forms for self-contributions
- ✅ Enter income for contribution period
- ✅ Auto-calculate self-contribution amounts
- ✅ Save as draft
- ✅ Submit C3 form
- ❌ Cannot edit submitted C3 forms

#### Payment Processing
- ✅ View own submitted C3 forms pending payment
- ✅ Pay via CyberSource (credit/debit card)
- ✅ Pay via PayPal
- ✅ Record offline payments
- ✅ View own payment history
- ✅ Download payment receipts
- ❌ Cannot view other users' payments

#### Reporting
- ✅ Generate personal contribution history
- ✅ Generate payment history
- ✅ Export own data to PDF/Excel
- ❌ Cannot view system-wide reports

#### Profile Management
- ✅ Update own password
- ✅ Update email (with verification)
- ✅ Enable/disable MFA

**Data Access Scope**: **Own data only**

**RLS Policy Example**:
```sql
-- Self-employed can only view their own profile
CREATE POLICY "Self-employed view own profile"
ON c3_self_employed_profiles
FOR SELECT
USING (
  id IN (
    SELECT self_employed_profile_id
    FROM c3_users
    WHERE c3_users.id = auth.uid()
    AND c3_users.role = 'self_employed'
  )
);

-- Self-employed can only view their own C3 headers
CREATE POLICY "Self-employed view own C3 headers"
ON c3_contribution_headers
FOR SELECT
USING (
  user_id = auth.uid()
  AND for_self_employed = true
);
```

---

## Permission Matrix

| Feature | Admin | Employer | Self-Employed |
|---------|-------|----------|---------------|
| **User Management** |
| View all users | ✅ | ❌ | ❌ |
| Activate/deactivate users | ✅ | ❌ | ❌ |
| Reset passwords | ✅ | ❌ | ❌ |
| **Company Management** |
| View all companies | ✅ | ❌ | ❌ |
| View own company | ❌ | ✅ | N/A |
| Update company profile | ❌ | ✅ | N/A |
| **Employee Management** |
| View all employees (all companies) | ✅ | ❌ | ❌ |
| View own employees | ❌ | ✅ | N/A |
| Add/edit employees | ❌ | ✅ | N/A |
| Delete/terminate employees | ❌ | ✅ | N/A |
| Import from BIMA | ❌ | ✅ | N/A |
| **Self-Employed Profile** |
| View all profiles | ✅ | N/A | ❌ |
| View own profile | N/A | N/A | ✅ |
| Update own profile | N/A | N/A | ✅ |
| **C3 Form Generation** |
| View all C3 forms | ✅ | ❌ | ❌ |
| View own company C3 forms | ❌ | ✅ | ❌ |
| View own C3 forms | ❌ | N/A | ✅ |
| Generate C3 (employer) | ❌ | ✅ | N/A |
| Generate C3 (self-employed) | ❌ | N/A | ✅ |
| Edit draft C3 | ❌ | ✅ | ✅ |
| Submit C3 | ❌ | ✅ | ✅ |
| Delete draft C3 | ❌ | ✅ | ✅ |
| Edit submitted C3 | ❌ | ❌ | ❌ |
| **Payment Processing** |
| Pay own C3 forms | ❌ | ✅ | ✅ |
| View all payments | ✅ | ❌ | ❌ |
| View own payments | ❌ | ✅  | ✅ |
| Reconcile payments | ✅ | ❌ | ❌ |
| **Rate Configuration** |
| View rates | ✅ | ✅ | ✅ |
| Update rates | ✅ | ❌ | ❌ |
| **Reporting** |
| System-wide reports | ✅ | ❌ | ❌ |
| Own company reports | ❌ | ✅ | N/A |
| Personal reports | ❌ | N/A | ✅ |
| **System Settings** |
| Configure payment gateways | ✅ | ❌ | ❌ |
| Configure BIMA integration | ✅ | ❌ | ❌ |
| Manage email templates | ✅ | ❌ | ❌ |
| **Audit Logs** |
| View all audit logs | ✅ | ❌ | ❌ |
| View own activity logs | ❌ | ✅ | ✅ |

---

## Role Assignment & Registration

### Registration Flow by Role

#### Admin Registration
- **Who can create**: Only existing admins (first admin created via direct database insert)
- **Fields**: Email, password, first name, last name
- **No** company association
- **Activated by**: Existing admin (must be manually activated)

#### Employer Registration
- **Who can create**: Self-registration (public)
- **Fields**: 
  - Company: Name, registration number, address, phone
  - User: Email, password, first name, last name
- **Company** created automatically during registration
- **Activated by**: Email verification link

#### Self-Employed Registration
- **Who can create**: Self-registration (public)
- **Fields**:
  - Personal: First name, last name, SSN, address, phone
  - Category/Occupation
  - Email, password
- **Profile** created automatically during registration
- **Activated by**: Email verification link

---

## Multi-User Scenarios

### Sub-Users for Employers (Future Enhancement)
Currently out of scope, but architecture supports:
- Primary employer (company owner)
- Secondary users (HR staff, accountants)
- Permission delegation (view-only vs full access)

### Implementation:
```typescript
// Future c3_users enhancement
{
  parent_user_id: uuid | null,  // References primary employer
  can_edit: boolean,             // Permission flags
  can_submit: boolean,
  can_pay: boolean,
}
```

---

## Role Switching

Users **cannot** switch roles. Each user account has one fixed role:
- Admin is always admin
- Employer is always employer (for their company)
- Self-employed is always self-employed

**Special Case**: An individual could have:
- Account A: Employer role (for their business)
- Account B: Self-employed role (for side income)
- Different email addresses required

---

## Security Considerations

### Role Verification
Every protected API call/query must verify:
1. User is authenticated (JWT valid)
2. User role has permission for action
3. Data belongs to user's scope (RLS enforces this)

### Privilege Escalation Prevention
- Role is stored in `c3_users` table
- **Cannot** be updated by user (only admin can change roles via direct SQL)
- Frontend checks role from `auth.user()` metadata
- Backend RLS policies check `c3_users.role` directly

### Session Management
- JWT contains `user_id` only (not role)
- Role fetched from database on each policy check
- If role changes, takes effect immediately (no stale sessions)

---

## Navigation & UI by Role

### Admin Dashboard
```
📊 Dashboard          → System analytics
👥 Users               → User management
💰 Reconciliation      → Payment reconciliation
⚙️ Rates               → Contribution rates
📄 Reports             → System reports
🔒 Audit Logs          → Activity logs
⚙️ Settings            → System settings
```

### Employer Dashboard
```
📊 Dashboard          → Company overview
👷 Employees           → Employee list
📝 C3 Forms            → C3 form management
💳 Payments            → Payment processing
📜 Transaction History → Payment history
📄 Reports             → Company reports
🏢 Company Profile     → Company details
```

### Self-Employed Dashboard
```
📊 Dashboard          → Personal overview
📝 My C3 Forms         → C3 form management
💳 Payments            → Payment processing
📜 Transaction History → Payment history
📄 Reports             → Personal reports
👤 My Profile          → Personal details
```

---

**Next**: See [04_database_schema.md](04_database_schema.md) for complete database structure and relationships.
