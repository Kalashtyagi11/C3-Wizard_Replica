# C3 Wizard Recreation - Project Status & Execution Timeline

**Prepared for**: Management Review  
**Date**: February 3, 2026  
**Developer**: Kalash  
**Project**: St. Kitts & Nevis Social Security Contribution Management System

---

## 📊 Executive Summary

| Metric | Status |
|--------|--------|
| **Overall Progress** | 45% Complete |
| **Database Migration** | ✅ 100% Complete |
| **User Authentication** | ✅ 100% Complete |
| **Core Portals** | 🔄 In Progress |
| **Development Complete** | February 13, 2026 |
| **Bug Fix & Polish** | February 14-26, 2026 |

---

## ✅ Completed Work: February 2, 2026 (Sunday)

### Authentication System & Legacy User Migration

**Work Completed:**

| Task | Details | Complexity |
|------|---------|------------|
| **Legacy Password Decryption** | Reverse-engineered AES-256-CBC encryption with PBKDF2 key derivation (1000 iterations, SHA-1). Converted 1,024 legacy passwords to BCrypt hashes compatible with Supabase Auth. | 🔴 **High** |
| **User Migration Edge Function** | Built `migrate-legacy-users` function handling batch processing, duplicate detection, and error recovery. Migrated 1,024 of 1,025 users (99.9%). | 🔴 **High** |
| **Role Mapping Architecture** | Implemented 12 legacy roles → 3 app roles (Admin/Employer/Self-Employed) with fallback logic for edge cases. | 🟡 **Medium** |
| **JWT-Based Login Flow** | Direct REST API calls to bypass Supabase client hangs; session management with localStorage persistence. | 🟡 **Medium** |
| **Registration Forms** | Employer & Self-Employed registration with BIMA API validation for SSN/Registration Number verification. | 🟡 **Medium** |

**Key Challenges Overcome:**
- Legacy system used non-standard AES encryption with custom salt ("Ivan Medvedev") - required reverse engineering
- Direct `auth.users` table writes needed for password migration (Supabase doesn't expose this normally)
- Role resolution required dual-path lookup (UUID first, then email fallback for legacy users)

---

## 📅 Development Phase: February 3 – February 13, 2026

### Day 1: February 3 (Monday) – Admin Dashboard & Analytics

**Objective:** Build the Admin Portal landing page with real-time analytics

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Summary Cards | Total employers, self-employed, NW directors with paid/unpaid counts | Admin Manual §5.1 |
| Payment Status Panel | Current month breakdown by user category | Admin Manual §5.2 |
| Payment Overview Charts | Yearly comparison graphs (Paid vs Unpaid) for all 3 categories | Admin Manual §5.3 |
| Recent Activity Feed | Latest C3 submissions, payments, and user registrations | Admin Manual §5 |

**Technical Implementation:**
- Aggregate queries against `c3_contribution_headers`, `c3_payments`, `c3_self_employed_contributions`
- Recharts integration for bar/line graphs
- Real-time data refresh using React Query

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| Complex aggregate queries across multiple tables | 🟡 Medium | Pre-optimize with database views or materialized aggregations |
| Chart responsiveness on different screen sizes | 🟢 Low | Use Recharts responsive container |

---

### Day 2: February 4 (Tuesday) – Admin: Employer & Self-Employed Management

**Objective:** Complete user management interfaces for Admin oversight

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Employer List | Searchable/filterable table with registration number, contact person, email | Admin Manual §7 |
| Employer Profile Edit | Update company details, address, contact information | Admin Manual §7 |
| Employer Users Management | View/edit users under employer, activate/deactivate, reset password | Admin Manual §7 |
| Employee List View | View employees under each employer | Admin Manual §7 |
| Company Relationship Mapping | Map/unmap child companies to parent companies | Admin Manual §7 |
| Self-Employed List | SSN-based search, edit personal info, activate/deactivate | Admin Manual §8 |

**Technical Implementation:**
- CRUD operations on `c3_companies`, `c3_users`, `c3_employees`
- Parent-child company relationship via `parent_company_id` foreign key
- Password reset via Supabase Auth `resetPasswordForEmail()`

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| Company hierarchy logic (parent-child mapping) | 🟡 Medium | Recursive queries or self-referential joins |
| Bulk user status updates | 🟢 Low | Batch update with transaction |

---

### Day 3: February 5 (Wednesday) – Admin: Payment Tracking & Reconciliation

**Objective:** Implement payment monitoring and CyberSource reconciliation

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Payment Details Page | Transaction logs with status filters (All/Authorized/Declined/Pending) | Admin Manual §10 |
| Payment Filtering | By employer/self-employed, date range, payment status | Admin Manual §10 |
| PDF Receipt Download | Generate payment receipts for completed transactions | Admin Manual §10 |
| Reconciliation Interface | CSV upload for CyberSource bank statements | Admin Manual §11 |
| Manual Reconciliation | Select transactions and mark as reconciled with reason | Admin Manual §11 |
| Column Customization | Allow admin to show/hide reconciliation columns | Admin Manual §11 |

**Technical Implementation:**
- Query `c3_payments` with complex filters
- CSV parsing for reconciliation file upload
- Match `transaction_id` between payment records and bank statements

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| CSV format variations from CyberSource | 🟡 Medium | Flexible parser with column mapping |
| Large payment history performance | 🟢 Low | Pagination and indexed queries |

---

### Day 4: February 6 (Thursday) – Employer: Employee Management & BIMA Integration

**Objective:** Build complete employee CRUD with BIMA API verification

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Employee List | SSN/name search, department, salary, pay period display | Employer Manual §8 |
| Add Employee | SSN + DOB + Name verification against BIMA before save | Employer Manual §8 |
| Edit Employee | Update address, salary, employment status, termination date | Employer Manual §8 |
| Delete Employee | Soft delete with confirmation dialog | Employer Manual §8 |
| Import from BIMA | Bulk import employees linked to employer in BIMA database | Employer Manual §8 |
| Export to Excel | Download employee list as Excel/CSV | Employer Manual §8 |

**Technical Implementation:**
- BIMA API integration via `validate-registration` Edge Function
- `c3_employees` CRUD with company_id filtering
- Excel export using client-side library (xlsx or similar)

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| BIMA API availability/timeout | 🔴 **High** | Retry logic with exponential backoff; cache valid SSNs |
| SSN validation must match exact name/DOB | 🟡 Medium | Clear error messaging for mismatches |

---

### Day 5: February 7 (Friday) – Employer Dashboard & Holiday/Bonus Management

**Objective:** Complete employer dashboard and specialized payment modules

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Employer Dashboard | C3 submission history, quick actions, payment status summary | Employer Manual §6 |
| Holiday Pay Management | Add/edit/delete holiday pay records with date ranges | Employer Manual §8.2 |
| Bonus Management | Employee bonus entry with payment date and amount | Employer Manual §8.4 |
| C3 Import from BIMA | Import last 6 months of submitted C3 from BIMA | Employer Manual §6 |

**Technical Implementation:**
- Dashboard aggregates from `c3_contribution_headers` filtered by `company_id`
- `c3_holiday_payments` and `c3_bonus_payments` CRUD
- Holiday pay date distribution logic (split amount across weeks)

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| Holiday pay distribution across C3 weeks | 🟡 Medium | Clear algorithm matching legacy behavior |
| Bonus exemption rules (December special case) | 🟡 Medium | Check `c3_bonus_exemptions` for period |

---

### Day 6-7: February 8-9 (Sat-Sun) – C3 Generation Wizard: Core Logic

**Objective:** Build the critical C3 wage entry wizard with calculation engine

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Period Selection | Month/Year picker with existing C3 detection | Employer Manual §8.3 |
| Employee Selection | Select employees for C3, auto-populate from roster | Employer Manual §8.3 |
| Weekly Wage Entry Grid | 5-week wage input per employee with worked/sick/maternity flags | Employer Manual §8.3 |
| Social Security Calculation | 11% combined (5.5% employee + 5.5% employer) with age exemptions | Knowledge §5 |
| Levy Calculation (Tiered) | Progressive tiers: 3.5% up to $6,500, 10% $6,500-$8,000, 12% above $8,000 | Admin Manual §6.3 |
| Severance Calculation | 1% employer contribution on total wages | Knowledge §5 |
| Nil Return Support | Generate zero-wage C3 for periods with no activity | Employer Manual §8.3 |

**Technical Implementation:**
- Multi-step form wizard with state persistence
- Real-time calculation as wages are entered
- Fetch rates from `c3_system_rates` and `c3_levy_tiers`

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| **Levy tier calculation must match legacy exactly** | 🔴 **Critical** | Test against documented examples in Admin Manual §6.3 |
| **SS age exemptions (under 16 / over 62)** | 🔴 **Critical** | Calculate age from DOB at C3 period date |
| **December bonus exemptions** | 🟡 Medium | Check `c3_bonus_exemptions` flags for the period |
| Holiday pay distribution across weeks | 🟡 Medium | Implement same split logic as legacy |

---

### Day 8: February 10 (Monday) – C3 Generation: Holiday, Bonus & Director Integration

**Objective:** Integrate holiday pay, bonuses, and NW Director handling into C3

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Holiday Pay in C3 | Auto-include holiday payments in wage grid, show in remarks | Employer Manual §8.3 |
| Bonus in C3 | Add bonus during C3 generation, apply exemption rules | Employer Manual §8.3 |
| Non-Working Director C3 | Separate C3 flow for directors (Levy only, no SS) | Employer Manual §9 |
| Schedule Number Logic | Auto-increment schedule for multiple C3s in same period | Employer Manual §8.3 |
| Overwrite Detection | Warn if C3 exists for period, offer create new schedule | Employer Manual §8.3 |

**Technical Implementation:**
- Join `c3_holiday_payments` and `c3_bonus_payments` by employee_id and date range
- Director flag on `c3_employees.is_director` changes calculation rules
- Schedule number auto-increment per company/period

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| NW Director has different calculation rules | 🟡 Medium | Separate calculation path for `is_director_only` |
| Bonus exemption flags vary by period | 🟡 Medium | Always check `c3_bonus_exemptions` table |

---

### Day 9: February 11 (Tuesday) – C3 Preview, PDF Generation & Submission

**Objective:** Complete C3 review, official PDF report, and BIMA submission

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| C3 Preview Screen | Summary of all employees, wages, contributions before save | Employer Manual §8.3 |
| Contribution Summary | Total wages, SS, Levy, Severance, Penalties breakdown | Employer Manual §8.3 |
| PDF Report Generation | Official "Statement of Wages and Contributions" format | Employer Manual §8.3 |
| Save C3 (Draft) | Store C3 locally without submitting to BIMA | Employer Manual §8.3 |
| Submit to BIMA | Lock C3 and send to Social Security Board API | Employer Manual §8.3 |
| Unsubmit (Admin Only) | Allow admin to return C3 to employer for correction | Admin Manual §9.1 |

**Technical Implementation:**
- jsPDF for PDF generation matching legacy format exactly
- Update `is_submitted`, `submitted_at`, `submitted_by` fields
- BIMA API integration for submission endpoint

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| **PDF layout must match official government form** | 🔴 **Critical** | Pixel-perfect comparison with legacy output |
| BIMA submission API integration | 🟡 Medium | Edge function with proper error handling |

---

### Day 10: February 12 (Wednesday) – Self-Employed Portal & Payment Processing

**Objective:** Complete Self-Employed portal and payment gateway integration

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Personal Details Page | View/edit self-employed profile information | SE Manual §7 |
| Self-Employed C3 Generation | Weekly wage entry (5 weeks), 10% contribution calculation | SE Manual §8 |
| Self-Employed C3 Preview | Contribution summary with PDF preview | SE Manual §8 |
| Payment Modal | Credit/Debit card entry with CyberSource integration | SE Manual §6 |
| Save Card Option | Store tokenized card for future payments | SE Manual §6 |
| Payment Receipt Download | PDF receipt after successful payment | SE Manual §9 |

**Technical Implementation:**
- Self-employed uses combined 10% rate (not split employee/employer)
- CyberSource payment gateway Edge Function
- Tokenized card storage in `c3_saved_cards`

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| CyberSource sandbox testing | 🟡 Medium | Test with sandbox credentials; log all responses |
| Self-employed wage categories different calculation | 🟡 Medium | Use `c3_wage_categories` for rate lookup |

---

### Day 11: February 13 (Thursday) – Final Integration, Settings & Polish

**Objective:** Complete all remaining admin settings and system integration

| Deliverable | Description | Reference |
|-------------|-------------|-----------|
| Admin Settings: C3 Rates | CRUD for SS rates, age limits, penalty rates | Admin Manual §12.1 |
| Admin Settings: Levy Tiers | CRUD for tiered levy thresholds by pay period | Admin Manual §12.4 |
| Admin Settings: Bonus Exemptions | Configure December bonus exemption flags | Admin Manual §12.2 |
| Admin Settings: Self-Employed Categories | Wage category A/B/C with weekly income/contribution | Admin Manual §12.3 |
| CyberSource Settings | Payment gateway configuration | Admin Manual §12.5 |
| User Permissions Integration | Dynamic sidebar based on `c3_user_permissions` | Architecture |
| Email Notifications | Welcome email, OTP, payment receipt via Resend | Knowledge §12 |
| Login History & Audit Trail | View user login/logout times and audit logs | Admin Manual §14 |
| Final Database Alignment | Ensure all hooks use optimized `c3_*` tables | Migration |

**Technical Implementation:**
- Settings CRUD on `c3_system_rates`, `c3_levy_tiers`, `c3_bonus_exemptions`, `c3_wage_categories`
- Permission-based menu filtering using `useUserPermissions` hook
- Resend API integration for transactional emails

**Potential Challenges:**
| Challenge | Risk | Mitigation |
|-----------|------|------------|
| Permission system complexity | 🟡 Medium | Test with different role configurations |
| Email template styling | 🟢 Low | Use simple HTML with inline CSS |

---

## 🔧 Bug Fix & Testing Phase: February 14 – February 26, 2026

### Testing Responsibilities

| Role | Responsibility |
|------|----------------|
| **AI Developer** | Fix all bugs reported by tester, ensure code quality |
| **Tester (User)** | Validate against legacy system, report discrepancies, UAT |

### Developer Availability

| Period | Availability | Activity |
|--------|--------------|----------|
| Feb 14-15 (Sat-Sun) | **Full** | Bug fixes from initial testing round |
| Feb 16-18 (Mon-Wed) | **Limited (1hr/day)** | Critical fixes only |
| Feb 18 (Tue) | **Unavailable** | Engagement ceremony |
| Feb 19 (Wed) | **Unavailable** | Wedding day |
| Feb 20 (Thu) | **Unavailable** | Post-wedding |
| Feb 21-26 (Fri-Wed) | **Full** | Final bug fixes, UI polish, deployment preparation |

### Expected Testing Focus Areas

| Area | Priority | Validation Method |
|------|----------|-------------------|
| C3 Calculations | 🔴 **Critical** | Compare outputs with legacy system side-by-side |
| Levy Tier Math | 🔴 **Critical** | Test with documented examples from manual |
| Payment Processing | 🔴 **Critical** | CyberSource sandbox transactions |
| BIMA API Integration | 🟡 High | Verify SSN/registration validation |
| PDF Report Format | 🟡 High | Visual comparison with legacy reports |
| User Roles & Permissions | 🟡 High | Test each role's access restrictions |
| Holiday/Bonus Distribution | 🟡 Medium | Verify wage grid calculations |

---

## ⚠️ Risk Assessment

### Critical Modules (Require Exact Legacy Match)

| Module | Risk Level | Validation Required |
|--------|------------|---------------------|
| C3 Contribution Calculations | 🔴 **Critical** | Must match legacy outputs exactly |
| Levy Tier Calculations | 🔴 **Critical** | Test against all 3 example scenarios in manual |
| PDF Report Generation | 🔴 **High** | Official government form format |
| Payment Processing | 🔴 **High** | Financial accuracy critical |

### External Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| BIMA API Credentials | Client | ✅ Configured | API availability |
| CyberSource Sandbox | Client | ⬜ Pending | Required for payment testing |
| Resend API Key | Client | ✅ Configured | Email delivery |
| Domain Verification | Client | ⬜ Pending | Email deliverability |

---

## 📋 Feature Completion Checklist

### Admin Portal (Target: 100% by Feb 13)

- [ ] Dashboard with analytics charts
- [ ] Employer management (list, edit, users, employees)
- [ ] Self-employed management (list, edit, activate)
- [ ] C3 Contribution oversight (view, unsubmit)
- [ ] Payment tracking with filters
- [ ] Reconciliation (CSV upload, manual)
- [ ] Settings (C3 rates, levy tiers, bonus exemptions)
- [ ] User management (admin users, roles)
- [ ] Reports & logs

### Employer Portal (Target: 100% by Feb 13)

- [ ] Dashboard with C3 history
- [ ] Employer details & child company management
- [ ] Employee CRUD with BIMA validation
- [ ] Holiday pay management
- [ ] Bonus management
- [ ] C3 Generation wizard (wage entry, calculations)
- [ ] C3 Preview & PDF generation
- [ ] C3 Submission to BIMA
- [ ] Payment processing
- [ ] Non-Working Director C3
- [ ] Import C3 from file/BIMA

### Self-Employed Portal (Target: 100% by Feb 13)

- [ ] Dashboard with contribution history
- [ ] Personal details view/edit
- [ ] Self-employed C3 generation
- [ ] C3 Preview & PDF
- [ ] Payment processing
- [ ] Payment history

---

## 📝 Notes

1. **Calculation Accuracy is Paramount**: The C3, SS, Levy, and Severance calculations are the core business logic. Any discrepancy with legacy system outputs is a blocker.

2. **Database Alignment**: All new code uses the optimized `c3_*` tables in the `public` schema. The legacy schema remains available for reference.

3. **Testing Strategy**: Developer builds features; Tester validates against legacy. Issues are reported and fixed in dedicated testing phase.

---

## 📞 Contact

**Developer**: Kalash  
**Project Start**: January 21, 2026  
**Development Complete**: February 13, 2026  
**Final Delivery**: February 26, 2026

---

*Last Updated: February 3, 2026 - Post Authentication Migration*
