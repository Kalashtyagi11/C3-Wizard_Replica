# 🎯 LOVABLE IMPLEMENTATION GUIDE - STEP BY STEP

**For: C3 Wizard Recreation - Employer Module**  
**Start Here**: Follow this guide sequentially, don't skip steps!

---

## 📚 BEFORE YOU START

Make sure you have:
- [x] Access to Lovable.dev interface
- [x] Your Supabase project created
- [x] Knowledge base files uploaded to Lovable (in `knowledge/` folder)
- [x] Database schema migrated to Supabase

---

## 🚀 STEP-BY-STEP IMPLEMENTATION SEQUENCE

### **PHASE 1: SETUP & KNOWLEDGE BASE** (Day 1 Morning)

#### Step 1: Upload Knowledge Files to Lovable

Tell Lovable:
```
I have uploaded the following knowledge base files to help you understand 
the C3 Wizard system. Please read and acknowledge:

1. knowledge/00_index.md - Overview
2. knowledge/01_purpose_scope.md - System purpose
3. knowledge/02_system_architecture.md - Architecture
4. knowledge/03_user_roles_permissions.md - Roles & permissions
5. knowledge/04_database_schema.md - Database structure
6. knowledge/05_contribution_calculations.md - Calculation formulas
7. knowledge/11_bima_integration.md - Government API integration
8. knowledge/23_optimised_schema_mapping.md - Legacy to new table mapping
9. knowledge/24_legacy_to_optimised_field_mapping.md - Column mappings

Please confirm you understand the C3 Wizard is a social security 
contribution management system for St. Kitts & Nevis.
```

**Expected Response**: Lovable should acknowledge understanding the system.

---

#### Step 2: Critical Calculation Correction

**IMMEDIATELY after Step 1**, tell Lovable:

```
⚠️ CRITICAL CORRECTION:

There is an error in knowledge/05_contribution_calculations.md that has been corrected.

The December bonus exemption threshold is $18,720 (NOT $28,000).

Please read this updated calculation reference:
_reference/VERIFIED_C3_CALCULATIONS.md

This document contains:
- ✅ 100% verified formulas from legacy C# code
- ✅ Correct $18,720 threshold
- ✅ Complete 9-step calculation pipeline
- ✅ Test cases with expected outputs

Use VERIFIED_C3_CALCULATIONS.md as your PRIMARY source for all calculation logic.
```

**Expected Response**: Lovable should acknowledge the correction and confirm it will use the verified calculations.

---

### **PHASE 2: AUTHENTICATION & USER MANAGEMENT** (Day 1 Afternoon)

#### Step 3: Build Authentication System

```
Now let's build the authentication system for the Employer Portal.

REQUIREMENT:
Build a complete authentication system using Supabase Auth that matches 
the legacy system behavior.

REFERENCE: Read _reference/LEGACY_AUTH_FLOW.md for detailed specifications.

KEY REQUIREMENTS:
1. User login with email/password
2. Password reset functionality
3. OTP-based email verification for new registrations
4. Session management using Supabase Auth
5. Role-based access control (Employer role = RoleId 3)

TABLES TO USE:
- auth.users (Supabase built-in)
- c3_users (links auth.users to our system)
- c3_user_profiles (user profile data)
- c3_roles (role definitions)

WORKFLOW:
1. User Registration:
   - Capture: Email, Password, Security Questions
   - Send OTP email (template: verifictionTemplate)
   - Verify OTP before activating account
   - Create entry in c3_users linked to auth.users

2. User Login:
   - Authenticate via Supabase Auth
   - Fetch user profile and company_id
   - Store in session: userId, companyId, roleId
   - Redirect to dashboard

DELIVERABLES:
- Login page (/login)
- Registration page (/register)
- Email verification page (/verify)
- Password reset page (/reset-password)
- Supabase Edge Functions for email sending

Please build these screens with professional UI using Shadcn/UI components.
```

**Expected Delivery**: Lovable should create the authentication screens and backend logic.

---

#### Step 4: Test Authentication

```
Please create a way for me to test the authentication:
1. Add a test user registration form
2. Show console logs for OTP codes (for testing)
3. Create a simple dashboard placeholder to redirect after login

I will test and confirm it works before we proceed to the next module.
```

**Action**: Test the authentication. Don't proceed until login works!

---

### **PHASE 3: EMPLOYER REGISTRATION** (Day 2 Morning)

#### Step 5: Build Employer Registration with BIMA Integration

```
Now build the Employer Registration flow.

REQUIREMENTS:
An employer (company) registers with their SSB Registration Number.

BIMA INTEGRATION:
The system must validate the registration number against the BIMA 
(Government) API to auto-fill company details.

REFERENCE: knowledge/11_bima_integration.md

REGISTRATION FLOW:

SCREEN 1: Basic Information
Fields:
- Registration Number (6 digits, validates against BIMA)
- Trade Name
- Email Address
- Password
- Confirm Password

On "Verify Registration Number" button click:
- Call BIMA API: GET /Employer/getERMasterDetails/{regNo}
- Auto-fill: Company Name, Contact Person, Address
- Validate email matches BIMA record

SCREEN 2: Security Questions
- Question 1 + Answer
- Question 2 + Answer

SCREEN 3: Email Verification
- Send OTP to registered email
- User enters 6-digit code
- On success: Activate account, redirect to login

DATABASE ACTIONS:
1. INSERT INTO c3_companies (reg_number, trade_name, email, address...)
2. INSERT INTO auth.users (via Supabase Auth)
3. INSERT INTO c3_users (link auth user to company)
4. INSERT INTO c3_user_granular_permissions (default menu permissions):
   - 'DASHBOARD', 'EMPLOYER DETAILS', 'EMPLOYEE', 'USER MANAGEMENT',
     'PAYROLL PROCESS', 'WAGES / CONTRIBUTION', 'REPORTS', 'SETTINGS'

BIMA CONFIGURATION:
Create environment variables:
- BIMA_API_BASE_URL
- BIMA_API_USERNAME
- BIMA_API_PASSWORD
- ENABLE_BIMA_INTEGRATION (toggle for testing)

If BIMA is disabled, skip validation and allow manual entry.

DELIVERABLES:
- Employer registration form (multi-step wizard)
- BIMA API integration (Supabase Edge Function)
- Email OTP verification
- Default permissions assignment

Use beautiful, step-by-step wizard UI with progress indicator.
```

**Expected Delivery**: Complete employer registration flow with BIMA integration.

---

### **PHASE 4: DASHBOARD & LAYOUT** (Day 2 Afternoon)

#### Step 6: Build Main Dashboard and Layout

```
Build the main Employer Dashboard with dynamic menu based on permissions.

LAYOUT REQUIREMENTS:

1. SIDEBAR (Left):
   - Company logo (uploaded or default)
   - Navigation menu (dynamically loaded based on permissions)
   - User profile section (bottom)
   - Logout button

2. TOP BAR:
   - Page title
   - Breadcrumb navigation
   - Notifications icon
   - User avatar with dropdown

3. MAIN CONTENT AREA:
   - Dashboard widgets/cards

DYNAMIC MENU LOGIC:
DO NOT hardcode menu items. Fetch from database based on user's company.

Query:
```sql
SELECT DISTINCT menu_item_name 
FROM c3_user_granular_permissions 
WHERE company_id = {logged_in_company_id} 
  AND administrative = true
```

Menu Mapping:
- 'DASHBOARD' → /employer/dashboard
- 'EMPLOYER DETAILS' → /employer/company
- 'EMPLOYEE' → /employer/employees
- 'PAYROLL PROCESS' → /employer/payroll
- 'WAGES / CONTRIBUTION' → /employer/wages
- 'REPORTS' → /employer/reports
- 'SETTINGS' → /employer/settings

DASHBOARD WIDGETS:

1. Statistics Cards:
   - Total Employees: Count from c3_employees WHERE company_id = X
   - Pending C3 Forms: Count from c3_contribution_headers WHERE is_finalized = false
   - Outstanding Payments: Sum from c3_payments WHERE status != 'AUTHORIZED'

2. Recent C3 Forms Table:
   - Columns: Period (Month/Year), Employees, Total Contribution, Status, Actions
   - Query: Last 5 C3 forms for this company
   - Actions: View, Edit, Delete (if not finalized)

3. Quick Action Buttons:
   - "Create New C3" → Navigate to /employer/payroll
   - "Manage Employees" → Navigate to /employer/employees
   - "View Reports" → Navigate to /employer/reports

DELIVERABLES:
- Responsive sidebar layout
- Dynamic menu loading
- Dashboard with widgets
- Protected routes (require authentication)

Use modern, professional design with the company's primary color: #0b64a0 (blue)
```

**Expected Delivery**: Complete dashboard layout with working navigation.

---

### **PHASE 5: EMPLOYEE MANAGEMENT** (Day 3)

#### Step 7: Build Employee Management Module

```
Build the Employee Management module with BIMA import capability.

SCREEN 1: Employee List

Display all employees for the logged-in company.

Data Grid Columns:
- Social Security Number (SSN)
- Full Name (First + Last)
- Birth Date
- Hire Date
- Status (Active/Inactive badge)
- Actions: [Edit] [Delete]

Query:
```sql
SELECT id, social_security_number, first_name, last_name, 
       date_of_birth, hire_date, is_deleted
FROM c3_employees
WHERE company_id = {logged_in_company_id}
  AND is_deleted = false
ORDER BY last_name, first_name
```

Features:
- Search/filter employees
- Sort by columns
- Pagination (20 per page)
- "Add Employee" button → Opens form
- "Import from BIMA" button → Opens import dialog

---

SCREEN 2: Add/Edit Employee Form

Fields (from legacy MasterEmployee → c3_employees):

**Personal Information:**
- Social Security Number (9 digits, unique validation)
- First Name *
- Middle Name (optional)
- Last Name *
- Date of Birth * (validates age >= 16)
- Gender (dropdown: Male/Female/Other)

**Employment Information:**
- Hire Date *
- Pay Period (dropdown: Weekly/Biweekly/Monthly)
- Occupation
- Is Director (checkbox)
- Is Director Only (checkbox - if checked, show Annual Salary field)
- Annual Salary (for directors only, number input)
- Is Levy Exempt (checkbox)

**Contact Information:**
- Email (optional, format validation)
- Phone
- Mobile
- Address (Street, City, State, Country, Postal Code)

VALIDATION RULES:
- SSN: Must be 9 digits, unique per company
- Age: Calculate from date_of_birth, must be 16-80
- If "Is Director Only" = true, "Annual Salary" is required
- Email: Valid format if provided

---

SCREEN 3: Import from BIMA Dialog

When user clicks "Import from BIMA":

Step 1: Search Form
Fields:
- Social Security Number *
- First Name *
- Last Name *
- Date of Birth *

Step 2: Call BIMA API
```
GET /Employee/getIpDetailsByQuery/{ssn},{birthDate},{firstName},,{lastName}
```

Step 3: Display Results
If found:
- Show employee details in a preview
- "Confirm Import" button → Auto-fills the Add Employee form
- User can review and save

If not found:
- Show error: "Employee not found in BIMA. Please enter manually."
- Close dialog, allow manual entry

---

DELIVERABLES:
- Employee list page with data grid
- Add/Edit employee form (modal or separate page)
- BIMA import functionality
- CRUD operations (Create, Read, Update, Soft Delete)
- Form validation matching legacy rules

Use professional form layout with proper error messages.
```

**Expected Delivery**: Complete employee management with BIMA import.

---

### **PHASE 6: C3 PAYROLL PROCESSING** (Day 4-5)

#### Step 8: Build C3 Form Creation (The Core Module)

```
This is the MOST CRITICAL module. Build the C3 monthly payroll contribution form.

REFERENCE DOCUMENTS:
- _reference/VERIFIED_C3_CALCULATIONS.md (PRIMARY - use this for all calculations)
- knowledge/11_bima_integration.md (for BIMA submission)

---

WORKFLOW:

STEP 1: Select Period
- Month (dropdown: 1-12)
- Year (dropdown: current year ± 2 years)
- Button: "Create C3" or "Edit Existing"

Check if C3 exists:
```sql
SELECT * FROM c3_contribution_headers 
WHERE company_id = {company_id} 
  AND month = {month} 
  AND year = {year}
```

If exists: Load for editing
If new: Create header with is_finalized = false

---

STEP 2: Employee Wages Grid

Show all active employees in an editable data grid.

COLUMNS (one row per employee):

Readonly Columns:
- Employee Name
- SSN
- Age (calculated from birth date)

Editable Columns (user input):
- Week 1 Wage ($)
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

Calculated Columns (readonly, auto-update on input change):
- Total Wages
- SS Employee
- SS Employer
- EI Employee
- EI Employer
- Levy Employee
- Levy Employer
- PE Employee
- PE Employer
- **Total Employee Deduction**
- **Total Employer Contribution**
- **Grand Total**

---

CALCULATION ENGINE (CRITICAL):

**DO NOT implement calculations in UI. Use Supabase Edge Function.**

Create Edge Function: `calculate-c3-contributions`

Input:
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
  contribution_month: number,
  contribution_year: number
}
```

Output:
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

CALCULATION STEPS (implement exactly as in VERIFIED_C3_CALCULATIONS.md):
1. Calculate employee age
2. Auto-calculate director wages if is_director_only = true
3. Distribute holiday pay to non-working weeks
4. Calculate total wages
5. Fetch system rates from c3_system_rates
6. Fetch levy tiers from c3_levy_tiers  
7. Get YTD wages for December bonus exemption check
8. Calculate all 8 contribution components:
   - SS Employee (5%, capped $750, age 16-62)
   - SS Employer (5%, no cap)
   - EI Employee (1%, capped $150)
   - EI Employer (1%, capped $150)
   - Levy Employee (progressive tiers, December bonus rule with $18,720 threshold)
   - Levy Employer (3%, includes bonus)
   - PE Employee (5%, capped $750)
   - PE Employer (5%, no cap)
9. Return breakdown

**CRITICAL**: Use $18,720 YTD threshold for December bonus exemption (NOT $28,000)!

---

AUTO-SAVE:
On each field blur (when user tabs out):
- Call calculation Edge Function
- Update readonly calculated fields in UI
- Save to c3_contribution_details table

```sql
INSERT INTO c3_contribution_details (
  c3_header_id, employee_id,
  week1_wages, week2_wages, week3_wages, week4_wages, week5_wages,
  worked_week1, worked_week2, worked_week3, worked_week4, worked_week5,
  holiday_pay, bonus,
  ss_employee, ss_employer, ei_employee, ei_employer,
  levy_employee, levy_employer, pe_employee, pe_employer
) VALUES (...)
ON CONFLICT (c3_header_id, employee_id) DO UPDATE SET ...
```

---

STEP 3: Summary & Actions

Summary Totals (aggregate from all employees):
```sql
SELECT 
  COUNT(*) as employee_count,
  SUM(ss_employee + ss_employer + ei_employee + ei_employer + 
      levy_employee + levy_employer + pe_employee + pe_employer) as grand_total,
  SUM(ss_employee + ei_employee + levy_employee + pe_employee) as total_employee,
  SUM(ss_employer + ei_employer + levy_employer + pe_employer) as total_employer
FROM c3_contribution_details
WHERE c3_header_id = {c3_header_id}
```

Action Buttons:
1. **Save Draft**: Keep is_finalized = false
2. **Finalize**: Set is_finalized = true, finalization_date = NOW()
3. **Submit to BIMA** (if enabled):
   - Generate BIMA payload
   - Call BIMA API: POST /C3/c3BulkSubmit/...
   - Update is_submitted = true, save BIMA response

VALIDATIONS BEFORE FINALIZE:
- All active employees must have wage data
- No negative values
- If holiday_pay > 0, must have at least one non-worked week

---

DELIVERABLES:
- C3 period selection screen
- Employee wages data grid (editable + calculated columns)
- Calculation Edge Function (matches VERIFIED_C3_CALCULATIONS.md)
- Auto-save functionality
- Summary totals
- Finalize and BIMA submission logic

This is the CORE of the system. Test thoroughly with the test cases 
from VERIFIED_C3_CALCULATIONS.md before proceeding!

TESTING REQUIRED:
Run all 5 test cases from _reference/VERIFIED_C3_CALCULATIONS.md:
1. Standard employee ($3,200 wages)
2. High earner with caps ($20,000 wages)
3. December bonus below $18,720 YTD
4. December bonus above $18,720 YTD
5. Age exemption (age 70)

All calculations must match expected outputs EXACTLY.
```

**Expected Delivery**: Complete C3 payroll processing with verified calculations.

**⚠️ STOP HERE AND TEST THOROUGHLY BEFORE PROCEEDING!**

---

### **PHASE 7: PAYMENT PROCESSING** (Day 6)

#### Step 9: Build Payment Processing Module

```
Build the payment module for C3 contributions.

REQUIREMENTS:
Employers must pay their C3 contributions online or record offline payments.

PAYMENT DISPLAY:
- Show C3 Period: {Month} / {Year}
- Total Amount Due: ${grand_total from c3_contribution_headers}
- Payment Status: Pending / Authorized / Failed

PAYMENT METHODS:

1. ONLINE PAYMENT (CyberSource Gateway):
   - Integrate CyberSource payment gateway
   - On successful authorization:
     ```sql
     INSERT INTO c3_payments (
       c3_header_id, payment_amount, payment_status,
       payment_gateway_transaction_id, payment_method, payment_date
     ) VALUES (
       {id}, {amount}, 'AUTHORIZED', {transactionId}, 'CyberSource', NOW()
     )
     ```
   - Post payment to BIMA (if enabled):
     ```
     POST /Payment/PostPayment
     {
       "payerId": {company.reg_number},
       "month": {month},
       "year": {year},
       "scheduleNo": 1,
       "paymentAmount": {amount},
       "paymentDate": {date},
       "paymentMethod": "CyberSource",
       "transactionId": {id}
     }
     ```
   - Send payment confirmation email to employer

2. OFFLINE PAYMENT (Manual Record):
   - Fields: Payment Date, Method (Check/Cash/Bank Transfer), Receipt Number
   - Set payment_status = 'Offline Payment'
   - Admin verification required

DELIVERABLES:
- Payment page showing amount due
- CyberSource payment integration
- Offline payment recording form
- Payment confirmation email
- Payment history table

Use secure payment processing with proper error handling.
```

**Expected Delivery**: Complete payment processing module.

---

### **PHASE 8: REPORTS MODULE** (Day 7)

#### Step 10: Build Reports Module

```
Build the Reports module with PDF/Excel export.

AVAILABLE REPORTS:

1. C3 SUMMARY REPORT:
   Filters:
   - Date Range: From Month/Year - To Month/Year
   
   Shows:
   - All C3 forms within date range
   - Totals per month
   
   Columns: Period, Employee Count, Total Wages, Total Contributions, Payment Status
   
   Export: PDF (using jsPDF library)

2. EMPLOYEE CONTRIBUTION REPORT:
   Filters:
   - Period: Month/Year
   - Employees: Multi-select dropdown
   
   Shows:
   - Per-employee breakdown of all contribution components
   
   Columns: Employee Name, SSN, Wages, SS (Ee+Er), EI (Ee+Er), Levy (Ee+Er), PE (Ee+Er), Total
   
   Export: Excel (using xlsx library)

3. PAYMENT HISTORY:
   Filters:
   - Date Range: From - To
   
   Shows:
   - All payments with transaction details
   
   Columns: Payment Date, C3 Period, Amount, Method, Transaction ID, Status
   
   Export: PDF

DELIVERABLES:
- Reports page with filters
- Data visualization (optional: charts)
- PDF export functionality
- Excel export functionality
- Print-friendly layouts

Use professional report layouts with company branding.
```

**Expected Delivery**: Complete reports module with exports.

---

### **PHASE 9: SETTINGS & POLISH** (Day 8)

#### Step 11: Build Settings Module

```
Build the Settings module for company configuration.

SETTINGS SECTIONS:

1. COMPANY PROFILE:
   - Edit company details (Trade Name, Address, Contact)
   - Upload company logo (max 2MB, PNG/JPG)
   - Save button

2. USER MANAGEMENT:
   - List users for this company
   - Add new user (email, role, permissions)
   - Assign granular permissions (which menus they can access)
   - Deactivate users

3. NOTIFICATION PREFERENCES:
   - Email notifications for C3 due dates (checkbox)
   - Payment confirmation emails (checkbox)
   - Monthly reminders (checkbox)

DELIVERABLES:
- Settings page with tabs/sections
- Company profile editing
- Logo upload functionality
- User management interface
- Notification preferences

Use clean, organized settings UI.
```

**Expected Delivery**: Complete settings module.

---

### **PHASE 10: TESTING & QA** (Day 9-10)

#### Step 12: Comprehensive Testing

```
Perform complete end-to-end testing:

1. CREATE TEST DATA:
   - Register test employer company
   - Add 5-10 test employees
   - Create C3 forms for 3 months

2. TEST WORKFLOWS:
   - Registration → Verification → Login
   - Add/Edit/Delete employees
   - Create C3 form
   - Calculate contributions (verify against test cases)
   - Finalize C3
   - Process payment
   - Generate reports

3. CALCULATION VERIFICATION:
   Run all 5 test cases from VERIFIED_C3_CALCULATIONS.md:
   - Verify each test case produces expected results
   - Check rounding to 2 decimal places
   - Verify December bonus logic
   - Verify age exemptions
   - Verify caps applied correctly

4. CROSS-BROWSER TESTING:
   - Chrome
   - Firefox
   - Safari
   - Edge

5. RESPONSIVE TESTING:
   - Desktop (1920x1080)
   - Tablet (768px)
   - Mobile (375px)

6. PERFORMANCE:
   - Page load times < 3 seconds
   - Calculation response < 1 second
   - Database queries optimized

DELIVERABLES:
- Test results document
- Bug fixes for any issues found
- Performance optimization report
```

**Expected Delivery**: Fully tested, production-ready employer module.

---

## ✅ FINAL CHECKLIST

Before declaring complete:

- [ ] Authentication works (login, register, password reset)
- [ ] Employer registration with BIMA validation works
- [ ] Dashboard displays correct data
- [ ] Dynamic menu based on permissions works
- [ ] Employee CRUD operations work
- [ ] BIMA employee import works
- [ ] C3 form creation and editing work
- [ ] **ALL CALCULATIONS MATCH TEST CASES EXACTLY**
- [ ] Auto-save functionality works
- [ ] C3 finalization works
- [ ] BIMA submission works (or gracefully handled if disabled)
- [ ] Payment processing works
- [ ] Reports generate correctly
- [ ] PDF/Excel exports work
- [ ] Settings page works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All forms have proper validation
- [ ] Error messages are user-friendly
- [ ] Loading states implemented
- [ ] Success/error toasts work
- [ ] Row-level security (RLS) prevents cross-company data access

---

## 🎯 KEY SUCCESS METRICS

Your Lovable implementation is ONLY successful if:

1. ✅ Existing employers can register with BIMA validation
2. ✅ C3 calculations produce IDENTICAL results to legacy system
3. ✅ BIMA integration works exactly as before
4. ✅ All legacy database data is accessible
5. ✅ NO loss of functionality compared to legacy
6. ✅ UI is modern and responsive (better than legacy)
7. ✅ All 5 calculation test cases pass
8. ✅ Users can complete full workflow: Register → Add Employees → Create C3 → Pay → View Reports

---

## 📞 WHAT IF YOU GET STUCK?

If Lovable gets confused or produces incorrect code:

1. **Reference the knowledge docs**: Point Lovable back to specific knowledge files
2. **Be very specific**: Instead of "fix the calculation", say "the SS Employee calculation should be totalWages × 0.05, capped at $750"
3. **Use test cases**: Show Lovable the expected input and output from VERIFIED_C3_CALCULATIONS.md
4. **Break it down**: If a complex module isn't working, break it into smaller pieces
5. **Reset if needed**: If Lovable is completely confused, start that specific module fresh

---

**GOOD LUCK! Follow this guide step by step and you'll have a working Employer Module! 🚀**

---

**Last Updated**: February 5, 2026  
**Total Estimated Time**: 8-10 days for complete Employer Module  
**Difficulty**: High (due to complex calculations and BIMA integration)
