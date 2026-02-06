# 📋 LOVABLE PROMPT SEQUENCE - EMPLOYER MODULE RECREATION

**Clear, Sequential Order of Prompts to Give Lovable**

---

## 🎯 THE EXACT PROMPT SEQUENCE

Follow this order **EXACTLY**. Give each prompt one at a time, wait for Lovable to complete, then move to the next.

---

### **PROMPT #1: PROJECT CONTEXT & SETUP**

```
I want you to build the complete Employer Module for C3 Wizard - a social 
security contribution management system for St. Kitts & Nevis.

TECHNOLOGY STACK:
- Frontend: React + TypeScript + Vite
- UI: Shadcn/UI components + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Edge Functions)
- Payment: CyberSource gateway
- External API: BIMA Government API

PROJECT CONTEXT:
This is a recreation of a legacy ASP.NET system. We need 1:1 functional 
parity with modern architecture.

⚠️ CRITICAL DATABASE REQUIREMENTS:

1. USE OPTIMIZED SCHEMA ONLY:
   - Legacy database has tables like: MasterEmployee, MasterCompany, Process_C3Header, etc.
   - New optimized schema uses: c3_employees, c3_companies, c3_contribution_headers, etc.
   - **YOU MUST USE THE OPTIMIZED SCHEMA (c3_* tables)**
   - Legacy schema is ONLY for reference to understand business logic
   - Reference: knowledge/23_optimised_schema_mapping.md and 
                knowledge/24_legacy_to_optimised_field_mapping.md

2. DATA-DRIVEN ARCHITECTURE:
   - **NEVER hardcode rates, thresholds, or configuration values**
   - Fetch all rates from: c3_system_rates table
   - Fetch levy tiers from: c3_levy_tiers table
   - Fetch security questions from: c3_security_questions table
   - Fetch menu permissions from: c3_user_granular_permissions table
   - Even the $18,720 threshold should ideally be configurable (query from database)

3. BACKEND-FIRST ARCHITECTURE (CRITICAL FOR FUTURE MIGRATION):
   - **ALL BUSINESS LOGIC MUST BE SERVER-SIDE (Supabase Edge Functions)**
   - **FRONTEND IS ONLY FOR UI/UX** - NO calculations, NO business rules
   - This system will be migrated to .NET Core in the future
   - Server-side logic = Easy migration (just rewrite Edge Functions as .NET APIs)
   - Client-side logic = Hard migration (must hunt through React components)
   
   MUST BE SERVER-SIDE:
   - ✅ All C3 contribution calculations
   - ✅ All validation rules (age check, SSN format, etc.)
   - ✅ All data transformations
   - ✅ All business rules (bonus exemptions, caps, etc.)
   - ✅ BIMA API calls
   - ✅ Payment gateway integration
   - ✅ Report generation logic
   
   FRONTEND ONLY DOES:
   - ❌ Display data from backend
   - ❌ Collect user input
   - ❌ Call backend APIs
   - ❌ Show loading/error states
   - ❌ Client-side form validation (for UX only, server validates)

4. KNOWLEDGE BASE FILES:
   I have uploaded knowledge base files in the /knowledge folder:
   - knowledge/04_database_schema.md - OPTIMIZED schema structure
   - knowledge/23_optimised_schema_mapping.md - Legacy to optimized mapping
   - knowledge/24_legacy_to_optimised_field_mapping.md - Column mappings
   - knowledge/05_contribution_calculations.md - Calculation formulas
   - knowledge/11_bima_integration.md - BIMA API documentation
   - knowledge/03_user_roles_permissions.md - Role/permission structure

Please acknowledge you understand:
1. This is a government compliance system (precision is CRITICAL)
2. You will use ONLY the optimized schema (c3_* tables)
3. All configuration will be data-driven (fetched from database)
4. ALL business logic will be server-side (Supabase Edge Functions)
5. Frontend is ONLY for UI/UX (no calculations or business rules)
6. Legacy schema is for reference only, not implementation
```

**WAIT for Lovable to acknowledge understanding**

---

### **PROMPT #2: CRITICAL CALCULATION CORRECTION**

```
⚠️ CRITICAL CORRECTION BEFORE WE START:

There is a documented error in knowledge/05_contribution_calculations.md 
that has been corrected.

Please read and use this PRIMARY reference for ALL calculations:
📄 _reference/VERIFIED_C3_CALCULATIONS.md

KEY CORRECTION:
- December bonus exemption threshold: $18,720 (NOT $28,000)
- This was verified against actual legacy C# code

ALL calculation logic must match VERIFIED_C3_CALCULATIONS.md EXACTLY.

The calculations involve:
- Social Security (SS): 5% employee (capped $750), 5% employer (no cap)
- Employment Insurance (EI): 1% both (capped $150 each)
- Employee Levy: Progressive tiers (0%-5% based on wage brackets)
- Employer Levy: 3% (wages + bonus)
- Severance Pay (PE): 5% both (employee capped $750, employer no cap)

Please confirm you will implement calculations in Supabase Edge Functions 
(NOT in frontend) and use the verified formulas.
```

**WAIT for Lovable to confirm**

---

### **PROMPT #3: COMPLETE EMPLOYER MODULE SPECIFICATION**

Now give Lovable the **COMPLETE SPECIFICATION** in one large prompt:

```
Build the complete Employer Portal with the following modules.

I'll provide the full specification now. Please implement ALL modules 
according to these exact requirements.

═══════════════════════════════════════════════════════════════════════
ARCHITECTURE: BACKEND-FIRST (FOR .NET CORE MIGRATION)
═══════════════════════════════════════════════════════════════════════

⚠️ CRITICAL: This system will be migrated to .NET Core in the future.
To make migration easy, ALL business logic MUST be server-side.

ARCHITECTURE PATTERN:

┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React + TypeScript)                                   │
│ ────────────────────────────────────────────────────────────── │
│ RESPONSIBILITIES:                                               │
│ • Display UI components                                         │
│ • Collect user input (forms, grids)                            │
│ • Call backend APIs (Edge Functions)                           │
│ • Show loading/error states                                     │
│ • Client-side validation (UX only, for immediate feedback)     │
│                                                                  │
│ ❌ NO BUSINESS LOGIC HERE ❌                                    │
│ ❌ NO calculations                                              │
│ ❌ NO validation enforcement                                    │
│ ❌ NO data transformations                                      │
└─────────────────────────────────────────────────────────────────┘
            │
            │ API Calls (fetch/REST)
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Supabase Edge Functions = Deno TypeScript)            │
│ ────────────────────────────────────────────────────────────── │
│ RESPONSIBILITIES:                                               │
│ • ALL C3 contribution calculations (9-step pipeline)           │
│ • ALL validation rules (age, SSN, date checks)                 │
│ • ALL business rules (bonus exemptions, age exemptions)        │
│ • Data transformations (holiday pay distribution)              │
│ • BIMA API integration                                          │
│ • Payment gateway integration                                   │
│ • Report generation                                             │
│ • Fetch system rates from database                             │
│ • Fetch levy tiers from database                               │
│ • Calculate totals, aggregates                                  │
│                                                                  │
│ ✅ ALL BUSINESS LOGIC HERE ✅                                   │
└─────────────────────────────────────────────────────────────────┘
            │
            │ Database Queries
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE (Supabase PostgreSQL)                                  │
│ ────────────────────────────────────────────────────────────── │
│ • c3_companies, c3_employees, c3_users                         │
│ • c3_contribution_headers, c3_contribution_details             │
│ • c3_system_rates (rates & caps - DATA-DRIVEN)                 │
│ • c3_levy_tiers (progressive tiers - DATA-DRIVEN)              │
│ • c3_payments, c3_user_granular_permissions                    │
└─────────────────────────────────────────────────────────────────┘

MIGRATION PATH TO .NET CORE:

Phase 1 (Current): React → Supabase Edge Functions → PostgreSQL
Phase 2 (Future):  React → .NET Core Web API → PostgreSQL
                         ↑
                   Just replace Edge Functions with .NET APIs
                   Frontend code stays the same!

If logic is in frontend React = Must rewrite entire frontend
If logic is in backend = Just rewrite Edge Functions to .NET
                          (Frontend unchanged!)

═══════════════════════════════════════════════════════════════════════
DATABASE SCHEMA REFERENCE (OPTIMIZED vs LEGACY)
═══════════════════════════════════════════════════════════════════════

⚠️ USE OPTIMIZED SCHEMA ONLY - Legacy names shown for reference

| Legacy Table Name | Optimized Table Name | Purpose |
|-------------------|---------------------|---------|
| MasterCompany | c3_companies | Company/Employer master |
| SECUsers | c3_users | User accounts |
| Users (additional) | c3_user_profiles | Extended user profiles |
| UserPermission | c3_user_granular_permissions | Menu access control |
| MasterEmployee | c3_employees | Employee master |
| Process_C3Header | c3_contribution_headers | C3 form headers |
| Process_Contribution_Details | c3_contribution_details | Per-employee wage details |
| Master_Rate_Setting | c3_system_rates | Calculation rates & caps |
| Deductions_Tax_Table_Details | c3_levy_tiers | Progressive levy tiers |
| Payments | c3_payments | Payment records |
| DECEMBER_BONUS_EXEMPTED_CONTRIBUTION | c3_december_bonus_settings | Bonus exemption rules |
| SecurityQuestion | c3_security_questions | Security questions list |

**REMEMBER**: 
- All your queries MUST use c3_* table names
- Legacy table names are ONLY for understanding business logic
- See knowledge/23_optimised_schema_mapping.md for complete mapping

═══════════════════════════════════════════════════════════════════════
MODULE 1: AUTHENTICATION & REGISTRATION
═══════════════════════════════════════════════════════════════════════

REFERENCE: _reference/LEGACY_AUTH_FLOW.md

1.1 USER LOGIN (/login)
   Fields:
   - Email (email format validation)
   - Password (show/hide toggle)
   - Remember Me (checkbox)
   - Forgot Password link
   
   On Submit:
   - Authenticate via Supabase Auth
   - Query: SELECT u.*, c.company_id, r.role_name 
            FROM c3_users u 
            JOIN c3_companies c ON u.company_id = c.id
            JOIN c3_roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()
   - Store in session: userId, companyId, roleId, companyName
   - Redirect to /employer/dashboard

1.2 EMPLOYER REGISTRATION (/register)
   MULTI-STEP WIZARD:
   
   Step 1: Company Information
   - Registration Number (6 digits, validates against BIMA)
   - Trade Name
   - Email
   - Password (min 8 chars, 1 uppercase, 1 number)
   - Confirm Password
   
   [Verify Registration Number] button:
   - Call BIMA Edge Function
   - BIMA API: GET /Employer/getERMasterDetails/{regNo}
   - Auto-fill: Company Name, Contact Person, Address
   - Environment var: ENABLE_BIMA_INTEGRATION (if false, skip validation)
   
   Step 2: Security Questions
   - Security Question 1 (dropdown from c3_security_questions)
   - Answer 1
   - Security Question 2 (different from Q1)
   - Answer 2
   
   Step 3: Email Verification
   - Generate 6-digit OTP
   - Send email using template: verifictionTemplate.html
   - User enters OTP
   - Verify and activate account
   
   Database Actions on Success:
   ```sql
   -- 1. Create Supabase Auth user
   INSERT INTO auth.users (email, encrypted_password) 
   
   -- 2. Create company
   INSERT INTO c3_companies (
     reg_number, trade_name, company_name, email, address,
     contact_person, phone, is_deleted, created_at
   ) VALUES (...)
   
   -- 3. Create user record
   INSERT INTO c3_users (
     id, company_id, username, email, password_hash,
     role_id, is_deleted, created_at
   ) VALUES (
     auth.uid(), {company_id}, {email}, {email}, {hash},
     3, false, NOW()  -- RoleId 3 = Employer
   )
   
   -- 4. Create user profile
   INSERT INTO c3_user_profiles (
     user_id, security_question_1_id, security_answer_1,
     security_question_2_id, security_answer_2
   ) VALUES (...)
   
   -- 5. Create default permissions
   INSERT INTO c3_user_granular_permissions (
     company_id, menu_item_name, administrative
   ) VALUES 
     ({company_id}, 'DASHBOARD', true),
     ({company_id}, 'EMPLOYER DETAILS', true),
     ({company_id}, 'EMPLOYEE', true),
     ({company_id}, 'USER MANAGEMENT', true),
     ({company_id}, 'PAYROLL PROCESS', true),
     ({company_id}, 'WAGES / CONTRIBUTION', true),
     ({company_id}, 'REPORTS', true),
     ({company_id}, 'SETTINGS', true)
   ```

1.3 PASSWORD RESET (/reset-password)
   - Email input
   - Send reset link via Supabase Auth
   - Reset password form

═══════════════════════════════════════════════════════════════════════
MODULE 2: EMPLOYER DASHBOARD
═══════════════════════════════════════════════════════════════════════

2.1 LAYOUT (/employer/dashboard)
   
   SIDEBAR (Left):
   - Company logo (from c3_companies.logo_url or default)
   - Company name
   - Dynamic Navigation Menu (fetched from c3_user_granular_permissions)
   - User profile section (bottom)
   - Logout button
   
   Dynamic Menu Query:
   ```sql
   SELECT DISTINCT menu_item_name 
   FROM c3_user_granular_permissions 
   WHERE company_id = {session.companyId} 
     AND administrative = true
   ORDER BY menu_item_name
   ```
   
   Menu Item Mapping:
   - 'DASHBOARD' → /employer/dashboard
   - 'EMPLOYER DETAILS' → /employer/company
   - 'EMPLOYEE' → /employer/employees
   - 'PAYROLL PROCESS' → /employer/payroll
   - 'WAGES / CONTRIBUTION' → /employer/wages
   - 'REPORTS' → /employer/reports
   - 'SETTINGS' → /employer/settings
   
   TOP BAR:
   - Page title (dynamic based on route)
   - Breadcrumb navigation
   - Notifications bell icon (badge count)
   - User avatar dropdown (Profile, Settings, Logout)

2.2 DASHBOARD WIDGETS
   
   Widget 1: Statistics Cards (4 cards)
   ```sql
   -- Total Employees
   SELECT COUNT(*) FROM c3_employees 
   WHERE company_id = {companyId} AND is_deleted = false
   
   -- Active C3 Forms (not finalized)
   SELECT COUNT(*) FROM c3_contribution_headers 
   WHERE company_id = {companyId} AND is_finalized = false
   
   -- Pending Payments
   SELECT COUNT(*) FROM c3_contribution_headers ch
   LEFT JOIN c3_payments p ON ch.id = p.c3_header_id
   WHERE ch.company_id = {companyId} 
     AND ch.is_finalized = true
     AND (p.id IS NULL OR p.payment_status != 'AUTHORIZED')
   
   -- Total Paid This Year
   SELECT COALESCE(SUM(p.payment_amount), 0) 
   FROM c3_payments p
   JOIN c3_contribution_headers ch ON p.c3_header_id = ch.id
   WHERE ch.company_id = {companyId} 
     AND ch.year = {currentYear}
     AND p.payment_status = 'AUTHORIZED'
   ```
   
   Widget 2: Recent C3 Forms (table, last 5)
   Query:
   ```sql
   SELECT 
     ch.id, ch.month, ch.year,
     COUNT(cd.id) as employee_count,
     SUM(cd.ss_employee + cd.ss_employer + cd.ei_employee + 
         cd.ei_employer + cd.levy_employee + cd.levy_employer + 
         cd.pe_employee + cd.pe_employer) as total_contribution,
     ch.is_finalized,
     ch.is_submitted,
     p.payment_status
   FROM c3_contribution_headers ch
   LEFT JOIN c3_contribution_details cd ON ch.id = cd.c3_header_id
   LEFT JOIN c3_payments p ON ch.id = p.c3_header_id
   WHERE ch.company_id = {companyId}
   GROUP BY ch.id, p.payment_status
   ORDER BY ch.year DESC, ch.month DESC
   LIMIT 5
   ```
   
   Columns: Period (Month/Year) | Employees | Total Contribution | Status | Actions
   Actions: [View] [Edit] [Delete] (if not finalized)
   
   Widget 3: Quick Actions (3 buttons)
   - "Create New C3" → /employer/payroll
   - "Manage Employees" → /employer/employees
   - "View Reports" → /employer/reports

═══════════════════════════════════════════════════════════════════════
MODULE 3: EMPLOYEE MANAGEMENT
═══════════════════════════════════════════════════════════════════════

REFERENCE: knowledge/11_bima_integration.md (for employee import)

3.1 EMPLOYEE LIST (/employer/employees)
   
   Data Grid:
   ```sql
   SELECT 
     id, social_security_number, first_name, middle_name, last_name,
     date_of_birth, hire_date, pay_period, is_director, 
     is_director_only, is_levy_exempt, annual_salary, is_deleted
   FROM c3_employees
   WHERE company_id = {companyId} AND is_deleted = false
   ORDER BY last_name, first_name
   ```
   
   Columns:
   - SSN | Full Name | Birth Date | Hire Date | Pay Period | Status | Actions
   
   Features:
   - Search (by name or SSN)
   - Filter (Active/All)
   - Sort by columns
   - Pagination (20 per page)
   - [Add Employee] button
   - [Import from BIMA] button
   
   Actions per row: [Edit] [Delete]

3.2 ADD/EDIT EMPLOYEE FORM (Modal or /employer/employees/new)
   
   Form Fields:
   
   SECTION: Personal Information
   - Social Security Number * (9 digits, unique validation)
   - First Name *
   - Middle Name
   - Last Name *
   - Date of Birth * (must be 16+ years old)
   - Gender (dropdown: Male/Female/Other)
   
   SECTION: Employment Information
   - Hire Date *
   - Pay Period * (dropdown: Weekly/Biweekly/Monthly)
   - Occupation
   - Is Director (checkbox)
   - Is Director Only (checkbox - enables Annual Salary field)
   - Annual Salary (number, required if Is Director Only = true)
   - Is Levy Exempt (checkbox)
   
   SECTION: Contact Information
   - Email (format validation, optional)
   - Phone
   - Mobile
   - Street Address
   - City
   - State
   - Country (dropdown)
   - Postal Code
   
   Validation:
   - SSN: 9 digits, unique per company
   - Age: Calculate from date_of_birth, 16 ≤ age ≤ 80
   - If is_director_only = true, annual_salary is required
   - Email: Valid format if provided
   
   On Save:
   ```sql
   INSERT INTO c3_employees (
     company_id, social_security_number, first_name, middle_name, last_name,
     date_of_birth, gender, hire_date, pay_period, occupation,
     is_director, is_director_only, annual_salary, is_levy_exempt,
     email, phone, mobile, street_address, city, state, country, postal_code,
     is_deleted, created_at, created_by
   ) VALUES (...)
   
   -- For updates:
   UPDATE c3_employees SET ... WHERE id = {id} AND company_id = {companyId}
   ```

3.3 IMPORT FROM BIMA (Modal)
   
   Form:
   - Social Security Number *
   - First Name *
   - Last Name *
   - Date of Birth *
   
   [Search BIMA] button:
   - Call BIMA Edge Function
   - API: GET /Employee/getIpDetailsByQuery/{ssn},{birthDate},{firstName},,{lastName}
   - Environment: ENABLE_BIMA_INTEGRATION
   
   On Success:
   - Display employee details in preview
   - Auto-fill all matching fields
   - [Confirm Import] → Open Add Employee form with pre-filled data
   
   On Error:
   - Show message: "Employee not found in BIMA. Please enter manually."
   - Allow manual entry

═══════════════════════════════════════════════════════════════════════
MODULE 4: C3 PAYROLL PROCESSING ⭐ MOST CRITICAL MODULE
═══════════════════════════════════════════════════════════════════════

REFERENCE: _reference/VERIFIED_C3_CALCULATIONS.md (PRIMARY)

4.1 PERIOD SELECTION (/employer/payroll)
   
   Form:
   - Month (dropdown: January-December, 1-12)
   - Year (dropdown: currentYear - 2 to currentYear + 1)
   - [Create C3] or [Edit Existing] button
   
   On Click:
   ```sql
   -- Check if C3 exists
   SELECT * FROM c3_contribution_headers 
   WHERE company_id = {companyId} 
     AND month = {month} 
     AND year = {year}
   ```
   
   If exists: Load headers and details for editing
   If new: 
   ```sql
   INSERT INTO c3_contribution_headers (
     company_id, month, year, is_finalized, is_submitted, created_at
   ) VALUES ({companyId}, {month}, {year}, false, false, NOW())
   RETURNING id
   ```

4.2 WAGES GRID (/employer/payroll/edit/{c3_header_id})
   
   ⚠️ THIS IS THE CORE FUNCTIONALITY
   
   Load all active employees:
   ```sql
   SELECT 
     e.id, e.social_security_number, e.first_name, e.last_name,
     e.date_of_birth, e.is_director, e.is_director_only, 
     e.annual_salary, e.is_levy_exempt,
     cd.week1_wages, cd.week2_wages, cd.week3_wages, cd.week4_wages, cd.week5_wages,
     cd.worked_week1, cd.worked_week2, cd.worked_week3, cd.worked_week4, cd.worked_week5,
     cd.holiday_pay, cd.bonus
   FROM c3_employees e
   LEFT JOIN c3_contribution_details cd ON e.id = cd.employee_id AND cd.c3_header_id = {c3_header_id}
   WHERE e.company_id = {companyId} AND e.is_deleted = false
   ORDER BY e.last_name, e.first_name
   ```
   
   DATA GRID COLUMNS:
   
   READONLY:
   - Employee Name (First + Last)
   - SSN (Social Security Number)
   - Age (calculated from date_of_birth as of now)
   
   EDITABLE (User Input):
   - Week 1 Wage ($, number input)
   - Week 2 Wage ($)
   - Week 3 Wage ($)
   - Week 4 Wage ($)
   - Week 5 Wage ($)
   - Worked Week 1 (checkbox)
   - Worked Week 2 (checkbox)
   - Worked Week 3 (checkbox)
   - Worked Week 4 (checkbox)
   - Worked Week 5 (checkbox)
   - Holiday Pay ($)
   - Bonus ($)
   
   CALCULATED (Readonly, auto-update on blur):
   - Total Wages
   - SS Employee
   - SS Employer
   - EI Employee
   - EI Employer
   - Levy Employee
   - Levy Employer
   - PE Employee
   - PE Employer
   - Total Employee Deduction
   - Total Employer Contribution
   - Grand Total
   
   SPECIAL RULES:
   - If is_director_only = true:
     * Auto-calculate and pre-fill Week 1-4 wages from annual_salary:
       weekly_wage = (annual_salary / 12) / 4
     * Make wage fields READONLY (greyed out)
     * Week 5 = 0
   
   - On ANY field blur (when user tabs out):
     * Call Edge Function: calculate-c3-contributions
     * Update calculated fields in UI
     * Auto-save row to database
   
4.3 CALCULATION ENGINE (Supabase Edge Function)
   
   Function Name: calculate-c3-contributions
   
   ⚠️ CRITICAL: Implement EXACTLY as in _reference/VERIFIED_C3_CALCULATIONS.md
   
   ⚠️ DATA-DRIVEN REQUIREMENTS:
   - **DO NOT hardcode any rates** (5%, 3%, 1%, etc.)
   - **DO NOT hardcode any caps** ($750, $150, etc.)
   - **DO NOT hardcode the $18,720 threshold**
   - **FETCH ALL VALUES from c3_system_rates and c3_levy_tiers tables**
   - Rates change over time - must be configurable by admins
   
   Input (from UI):
   ```typescript
   {
     employee_id: number,
     week1_wages: number,
     week2_wages: number,
     week3_wages: number,
     week4_wages: number,
     week5_wages: number,
     worked_week1: boolean,
     worked_week2: boolean,
     worked_week3: boolean,
     worked_week4: boolean,
     worked_week5: boolean,
     holiday_pay: number,
     bonus: number,
     contribution_month: number (1-12),
     contribution_year: number,
     c3_header_id: number
   }
   ```
   
   Processing Steps (IN THIS EXACT ORDER):
   
   Step 1: Fetch Employee Data
   ```sql
   SELECT date_of_birth, is_director_only, annual_salary, is_levy_exempt
   FROM c3_employees WHERE id = {employee_id}
   ```
   
   Step 2: Calculate Age
   ```typescript
   const age = today.year - birthDate.year;
   if (today.month < birthDate.month || 
       (today.month === birthDate.month && today.day < birthDate.day)) {
     age--;
   }
   ```
   
   Step 3: Auto-Calculate Director Wages (if needed)
   ```typescript
   if (is_director_only && annual_salary) {
     const monthly = annual_salary / 12;
     const weekly = monthly / 4;
     week1_wages = weekly;
     week2_wages = weekly;
     week3_wages = weekly;
     week4_wages = weekly;
     week5_wages = 0;
   }
   ```
   
   Step 4: Distribute Holiday Pay
   ```typescript
   const nonWorkingWeeks = [];
   if (!worked_week1) nonWorkingWeeks.push(1);
   if (!worked_week2) nonWorkingWeeks.push(2);
   if (!worked_week3) nonWorkingWeeks.push(3);
   if (!worked_week4) nonWorkingWeeks.push(4);
   if (!worked_week5) nonWorkingWeeks.push(5);
   
   if (nonWorkingWeeks.length > 0 && holiday_pay > 0) {
     const perWeek = holiday_pay / nonWorkingWeeks.length;
     nonWorkingWeeks.forEach(weekNum => {
       // Add holiday pay to that week's wages
     });
   }
   ```
   
   Step 5: Calculate Total Wages
   ```typescript
   const totalWages = week1_wages + week2_wages + week3_wages + 
                       week4_wages + week5_wages;
   ```
   
   Step 6: Fetch System Rates
   ```sql
   SELECT * FROM c3_system_rates 
   ORDER BY effective_date DESC LIMIT 1
   ```
   
   Step 7: Fetch Levy Tiers
   ```sql
   SELECT * FROM c3_levy_tiers ORDER BY min_wage ASC
   ```
   
   Step 8: Get YTD Wages (for December bonus calculation)
   ```sql
   SELECT SUM(week1_wages + week2_wages + week3_wages + 
               week4_wages + week5_wages) as ytd
   FROM c3_contribution_details cd
   JOIN c3_contribution_headers ch ON cd.c3_header_id = ch.id
   WHERE cd.employee_id = {employee_id}
     AND ch.year = {contribution_year}
     AND ch.month < {contribution_month}
   ```
   
   Step 9: Calculate Each Contribution Component
   
   ⚠️ USE EXACT FORMULAS FROM VERIFIED_C3_CALCULATIONS.md
   
   ```typescript
   // SS Employee: 5% capped at $750, age 16-62
   let ss_employee = 0;
   if (age >= 16 && age <= 62) {
     const calculated = totalWages * rates.soc_ee_rate;
     ss_employee = Math.min(calculated, rates.soc_ee_pay_limit);
   }
   ss_employee = Math.round(ss_employee * 100) / 100;
   
   // SS Employer: 5%, NO CAP
   const ss_employer = Math.round(totalWages * rates.soc_er_rate * 100) / 100;
   
   // EI Employee: 1% capped at $150
   const ei_employee_calc = totalWages * rates.eib_rate;
   const ei_employee = Math.round(Math.min(ei_employee_calc, rates.eib_pay_limit) * 100) / 100;
   
   // EI Employer: 1% capped at $150
   const ei_employer_calc = totalWages * rates.eib_rate;
   const ei_employer = Math.round(Math.min(ei_employer_calc, rates.eib_pay_limit) * 100) / 100;
   
   // Levy Employee: Progressive tiers + December bonus rule
   let levy_employee = 0;
   if (!is_levy_exempt) {
     let wageBase = totalWages;
     
     // ⚠️ CRITICAL: December bonus exemption check
     // Threshold: $18,720 (NOT $28,000)
     if (contribution_month === 12 && bonus > 0 && ytdWages < 18720) {
       wageBase = totalWages - bonus;  // Exclude bonus from levy
     }
     
     // Find applicable tier
     for (const tier of levyTiers) {
       if (wageBase >= tier.min_wage && 
           (tier.max_wage === null || wageBase < tier.max_wage)) {
         levy_employee = wageBase * tier.levy_rate;
         break;
       }
     }
   }
   levy_employee = Math.round(levy_employee * 100) / 100;
   
   // Levy Employer: 3% of (wages + bonus), NO CAP
   const levy_employer = Math.round((totalWages + bonus) * rates.employer_levy_rate * 100) / 100;
   
   // PE Employee: 5% capped at $750
   const pe_employee_calc = totalWages * rates.severance_rate;
   const pe_employee = Math.round(Math.min(pe_employee_calc, rates.soc_ee_pay_limit) * 100) / 100;
   
   // PE Employer: 5%, NO CAP
   const pe_employer = Math.round(totalWages * rates.severance_rate * 100) / 100;
   
   // Totals
   const total_employee_deduction = ss_employee + ei_employee + levy_employee + pe_employee;
   const total_employer_contribution = ss_employer + ei_employer + levy_employer + pe_employer;
   const grand_total = total_employee_deduction + total_employer_contribution;
   ```
   
   Step 10: Save to Database
   ```sql
   INSERT INTO c3_contribution_details (
     c3_header_id, employee_id,
     week1_wages, week2_wages, week3_wages, week4_wages, week5_wages,
     worked_week1, worked_week2, worked_week3, worked_week4, worked_week5,
     holiday_pay, bonus, total_wages,
     ss_employee, ss_employer, ei_employee, ei_employer,
     levy_employee, levy_employer, pe_employee, pe_employer,
     created_at, updated_at
   ) VALUES (...)
   ON CONFLICT (c3_header_id, employee_id) DO UPDATE SET
     week1_wages = EXCLUDED.week1_wages,
     week2_wages = EXCLUDED.week2_wages,
     ... (all fields)
     updated_at = NOW()
   ```
   
   Return to UI:
   ```typescript
   {
     total_wages: number,
     ss_employee: number,
     ss_employer: number,
     ei_employee: number,
     ei_employer: number,
     levy_employee: number,
     levy_employer: number,
     pe_employee: number,
     pe_employer: number,
     total_employee_deduction: number,
     total_employer_contribution: number,
     grand_total: number
   }
   ```

4.4 SUMMARY & FINALIZE
   
   Summary Totals (below grid):
   ```sql
   SELECT 
     COUNT(*) as employee_count,
     SUM(total_wages) as total_wages,
     SUM(ss_employee + ss_employer) as total_ss,
     SUM(ei_employee + ei_employer) as total_ei,
     SUM(levy_employee + levy_employer) as total_levy,
     SUM(pe_employee + pe_employer) as total_pe,
     SUM(ss_employee + ei_employee + levy_employee + pe_employee) as total_employee,
     SUM(ss_employer + ei_employer + levy_employer + pe_employer) as total_employer,
     SUM(ss_employee + ss_employer + ei_employee + ei_employer + 
         levy_employee + levy_employer + pe_employee + pe_employer) as grand_total
   FROM c3_contribution_details
   WHERE c3_header_id = {c3_header_id}
   ```
   
   Display:
   - Employee Count: {employee_count}
   - Total Wages: ${total_wages}
   - Total SS: ${total_ss}
   - Total EI: ${total_ei}
   - Total Levy: ${total_levy}
   - Total PE: ${total_pe}
   - Total Employee Deduction: ${total_employee}
   - Total Employer Contribution: ${total_employer}
   - **GRAND TOTAL: ${grand_total}**
   
   Action Buttons:
   
   [Save Draft] - Keep is_finalized = false
   
   [Finalize C3] - Set is_finalized = true
   Validation before finalize:
   - All active employees must have wage data
   - No negative values
   - If holiday_pay > 0, must have at least one non-worked week
   
   On Finalize:
   ```sql
   UPDATE c3_contribution_headers 
   SET is_finalized = true, 
       finalization_date = NOW(),
       updated_at = NOW()
   WHERE id = {c3_header_id}
   ```
   
   [Submit to BIMA] (if ENABLE_BIMA_INTEGRATION = true)
   - Generate BIMA payload (see knowledge/11_bima_integration.md)
   - Call BIMA API: POST /C3/c3BulkSubmit/...
   - Update is_submitted = true
   - Save BIMA response

═══════════════════════════════════════════════════════════════════════
MODULE 5: PAYMENT PROCESSING
═══════════════════════════════════════════════════════════════════════

5.1 PAYMENT PAGE (/employer/payments or /employer/payroll/{id}/pay)
   
   Display C3 Summary:
   ```sql
   SELECT 
     ch.id, ch.month, ch.year,
     SUM(cd.ss_employee + cd.ss_employer + cd.ei_employee + 
         cd.ei_employer + cd.levy_employee + cd.levy_employer + 
         cd.pe_employee + cd.pe_employer) as total_due,
     p.payment_status, p.payment_amount, p.payment_date
   FROM c3_contribution_headers ch
   LEFT JOIN c3_contribution_details cd ON ch.id = cd.c3_header_id
   LEFT JOIN c3_payments p ON ch.id = p.c3_header_id
   WHERE ch.id = {c3_header_id}
   GROUP BY ch.id, p.payment_status, p.payment_amount, p.payment_date
   ```
   
   Show:
   - C3 Period: {Month} / {Year}
   - Total Amount Due: ${total_due}
   - Payment Status: {payment_status or 'Pending'}
   
   Payment Methods:
   
   OPTION 1: Pay Online (CyberSource)
   - [Pay Now] button
   - Integrate CyberSource payment gateway
   - On success:
     ```sql
     INSERT INTO c3_payments (
       c3_header_id, payment_amount, payment_date,
       payment_method, payment_status, 
       payment_gateway_transaction_id,
       created_at
     ) VALUES (
       {c3_header_id}, {total_due}, NOW(),
       'CyberSource', 'AUTHORIZED', {transactionId}, NOW()
     )
     ```
   - Send payment confirmation email
   - If ENABLE_BIMA_INTEGRATION: Post payment to BIMA
   
   OPTION 2: Record Offline Payment
   Form:
   - Payment Date (date picker)
   - Payment Method (dropdown: Check, Cash, Bank Transfer)
   - Receipt Number (text)
   - Notes (textarea, optional)
   
   On Save:
   ```sql
   INSERT INTO c3_payments (
     c3_header_id, payment_amount, payment_date,
     payment_method, payment_status, receipt_number, notes,
     created_at
   ) VALUES (
     {c3_header_id}, {total_due}, {date},
     {method}, 'Offline Payment', {receipt}, {notes}, NOW()
   )
   ```

═══════════════════════════════════════════════════════════════════════
MODULE 6: REPORTS
═══════════════════════════════════════════════════════════════════════

6.1 REPORTS PAGE (/employer/reports)
   
   3 REPORT TYPES:
   
   REPORT 1: C3 Summary Report
   Filters:
   - From Month/Year (dropdown)
   - To Month/Year (dropdown)
   
   Query:
   ```sql
   SELECT 
     ch.month, ch.year,
     COUNT(DISTINCT cd.employee_id) as employee_count,
     SUM(cd.total_wages) as total_wages,
     SUM(cd.ss_employee + cd.ss_employer + cd.ei_employee + 
         cd.ei_employer + cd.levy_employee + cd.levy_employer + 
         cd.pe_employee + cd.pe_employer) as total_contributions,
     p.payment_status
   FROM c3_contribution_headers ch
   JOIN c3_contribution_details cd ON ch.id = cd.c3_header_id
   LEFT JOIN c3_payments p ON ch.id = p.c3_header_id
   WHERE ch.company_id = {companyId}
     AND (ch.year > {fromYear} OR (ch.year = {fromYear} AND ch.month >= {fromMonth}))
     AND (ch.year < {toYear} OR (ch.year = {toYear} AND ch.month <= {toMonth}))
   GROUP BY ch.month, ch.year, p.payment_status
   ORDER BY ch.year DESC, ch.month DESC
   ```
   
   Display: Table with columns
   [Export PDF] button - use jsPDF library
   
   REPORT 2: Employee Contribution Report
   Filters:
   - Period: Month/Year (dropdown)
   - Employees: Multi-select (all employees by default)
   
   Query:
   ```sql
   SELECT 
     e.first_name, e.last_name, e.social_security_number,
     cd.total_wages, cd.ss_employee, cd.ss_employer,
     cd.ei_employee, cd.ei_employer, cd.levy_employee, cd.levy_employer,
     cd.pe_employee, cd.pe_employer,
     (cd.ss_employee + cd.ss_employer + cd.ei_employee + cd.ei_employer + 
      cd.levy_employee + cd.levy_employer + cd.pe_employee + cd.pe_employer) as total
   FROM c3_employees e
   JOIN c3_contribution_details cd ON e.id = cd.employee_id
   JOIN c3_contribution_headers ch ON cd.c3_header_id = ch.id
   WHERE ch.company_id = {companyId}
     AND ch.month = {month}
     AND ch.year = {year}
     AND e.id IN ({selectedEmployeeIds})
   ORDER BY e.last_name, e.first_name
   ```
   
   [Export Excel] button - use xlsx library
   
   REPORT 3: Payment History
   Filters:
   - From Date (date picker)
   - To Date (date picker)
   
   Query:
   ```sql
   SELECT 
     p.payment_date, ch.month, ch.year,
     p.payment_amount, p.payment_method,
     p.payment_gateway_transaction_id, p.payment_status
   FROM c3_payments p
   JOIN c3_contribution_headers ch ON p.c3_header_id = ch.id
   WHERE ch.company_id = {companyId}
     AND p.payment_date BETWEEN {fromDate} AND {toDate}
   ORDER BY p.payment_date DESC
   ```
   
   [Export PDF] button

═══════════════════════════════════════════════════════════════════════
MODULE 7: SETTINGS
═══════════════════════════════════════════════════════════════════════

7.1 SETTINGS PAGE (/employer/settings)
   
   TAB 1: Company Profile
   Form:
   - Trade Name
   - Company Name
   - Email
   - Phone
   - Address fields (Street, City, State, Country, Postal)
   - Company Logo Upload (max 2MB, PNG/JPG)
   
   [Save Changes] button
   
   TAB 2: User Management
   List of users for this company:
   ```sql
   SELECT u.id, u.email, u.username, r.role_name, u.is_deleted
   FROM c3_users u
   JOIN c3_roles r ON u.role_id = r.id
   WHERE u.company_id = {companyId}
   ORDER BY u.created_at DESC
   ```
   
   [Add User] button - Modal form
   Actions per user: [Edit Permissions] [Deactivate]
   
   TAB 3: Notification Preferences
   Checkboxes:
   - Email notifications for C3 due dates
   - Payment confirmation emails
   - Monthly reminders
   
   [Save Preferences] button

═══════════════════════════════════════════════════════════════════════
UI/UX REQUIREMENTS
═══════════════════════════════════════════════════════════════════════

COLOR SCHEME:
- Primary: #0b64a0 (blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Error: #ef4444 (red)
- Background: #f9fafb (light grey)

COMPONENTS:
- Use Shadcn/UI components throughout
- Tables: Use data table component with sort, filter, pagination
- Forms: Proper labels, inline validation, error messages
- Buttons: Primary (blue), Secondary (grey), Destructive (red)
- Modals: For confirmations and forms
- Toasts: For success/error notifications
- Loading states: Spinners during API calls

RESPONSIVE:
- Mobile-friendly (min-width: 375px)
- Tablet-friendly (768px)
- Desktop (1024px and above)
- Sidebar collapses to hamburger menu on mobile

ACCESSIBILITY:
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader friendly

═══════════════════════════════════════════════════════════════════════
ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════════

Required:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- ENABLE_BIMA_INTEGRATION (true/false)
- BIMA_API_BASE_URL
- BIMA_API_USERNAME
- BIMA_API_PASSWORD
- CYBERSOURCE_MERCHANT_ID
- CYBERSOURCE_API_KEY

═══════════════════════════════════════════════════════════════════════
SECURITY & RLS
═══════════════════════════════════════════════════════════════════════

Implement Row Level Security (RLS) policies:

1. Companies: Users can only see their own company
2. Employees: Users can only see employees from their company
3. C3 Headers: Users can only see C3s from their company
4. C3 Details: Users can only see details from their company's C3s
5. Payments: Users can only see payments for their company's C3s

Example RLS policy:
```sql
CREATE POLICY "Users can view own company employees"
ON c3_employees FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM c3_users WHERE id = auth.uid()
  )
);
```

═══════════════════════════════════════════════════════════════════════
TESTING REQUIREMENTS
═══════════════════════════════════════════════════════════════════════

⚠️ MANDATORY: All 5 calculation test cases from VERIFIED_C3_CALCULATIONS.md 
must pass EXACTLY before deployment.

TEST CASE 1: Standard Employee
Input: Wages=$3,200, Age=35, Bonus=$0
Expected: Grand Total=$992.00

TEST CASE 2: High Earner (Caps)
Input: Wages=$20,000, Age=45
Expected: SS Employee=$750, EI Employee=$150

TEST CASE 3: December Bonus Below Threshold
Input: Month=12, Wages=$2,500, Bonus=$500, YTD=$15,000
Expected: Levy Employee=$80 (bonus excluded)

TEST CASE 4: December Bonus Above Threshold
Input: Month=12, Wages=$2,500, Bonus=$500, YTD=$20,000
Expected: Levy Employee=$150 (bonus included)

TEST CASE 5: Age Exemption
Input: Wages=$5,000, Age=70
Expected: SS Employee=$0

═══════════════════════════════════════════════════════════════════════

Please confirm you understand all requirements and will implement 
the Employer Module according to these exact specifications.

Pay special attention to:
1. Module 4 (C3 Payroll) - calculation precision is CRITICAL
2. BIMA integration toggles (ENABLE_BIMA_INTEGRATION)
3. $18,720 threshold for December bonus exemption
4. RLS policies for data isolation
5. All 5 test cases must pass

Do you understand and are ready to begin implementation?
```

**WAIT for Lovable to confirm understanding and ask any clarification questions**

---

### **PROMPT #4: START IMPLEMENTATION** (After Lovable confirms)

```
Perfect! Please start implementation in this order:

PHASE 1: Foundation (Implement First)
1. Authentication system (Login, Register, Password Reset)
2. Dashboard layout with dynamic menu
3. Employer registration with BIMA integration

Once Phase 1 is done and tested, I'll ask you to continue with:

PHASE 2: Core Functionality
4. Employee management with BIMA import
5. C3 Payroll processing with calculation engine ⭐

PHASE 3: Supporting Features
6. Payment processing
7. Reports
8. Settings

Let's start with Phase 1. Begin with the authentication system.

Create:
- Login page (/login)
- Registration wizardd (/register)
- Password reset (/reset-password)
- Protected route wrapper
- Session management

Use Supabase Auth for authentication and implement according to 
_reference/LEGACY_AUTH_FLOW.md.

Please show me the login page first.
```

---

## 📝 SUMMARY

**Give Lovable these 4 prompts IN ORDER:**

1. **Project Context** - Explains what C3 Wizard is
2. **Calculation Correction** - Highlights the $18,720 fix
3. **Complete Specification** - The ENTIRE employer module spec (largest prompt)
4. **Start Implementation** - Tells Lovable to begin with Phase 1

After each phase completes, test it, then tell Lovable to continue with the next phase.

**Total: 4 prompts to give, then iterative testing and feedback.**
