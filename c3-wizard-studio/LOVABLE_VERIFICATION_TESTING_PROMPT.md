# 🔍 EMPLOYER MODULE COMPLETION VERIFICATION & TESTING PROMPT

**Give this to Lovable AFTER you believe the Employer Module is complete**

---

## PROMPT FOR LOVABLE

```
I need you to perform a comprehensive verification of the Employer Module 
to ensure it's 100% complete and matches the verified visual designs and legacy functionality.

═══════════════════════════════════════════════════════════════════════
PART 0: VISUAL & FUNCTIONAL SOURCE OF TRUTH
═══════════════════════════════════════════════════════════════════════

⚠️ **VISUAL REFERENCE**: 
Open `PRDs/Employer_C3_wizard_screens.pdf`
You MUST visually compare every implemented screen against this PDF. The layout, fields, and workflow must match.

⚠️ **FUNCTIONAL REFERENCE**:
The behavior/logic must match the legacy system as documented in the `/knowledge` and `/_reference` folders.
- Backend logic: `_reference/VERIFIED_C3_CALCULATIONS.md`
- Database structure: `knowledge/04_database_schema.md` (Optimized)
- Field logic: Derived from Legacy API/Frontend analysis provided in prompts.

**INSTRUCTION:**
For every screen below, answer TWO questions:
1. **Visual Match?** (Does it look like the PDF?)
2. **Functional Match?** (Does it work like the legacy system?)

═══════════════════════════════════════════════════════════════════════
PART 1: COMPLETENESS & PARITY VERIFICATION
═══════════════════════════════════════════════════════════════════════

Please verify that ALL of the following screens and features have been 
implemented. For each item, respond with:
- ✅ COMPLETE (if fully implemented, looks like PDF, and works)
- ⚠️ PARTIAL (if partially implemented or visual mismatch)
- ❌ MISSING (if not implemented)

---

MODULE 1: AUTHENTICATION & REGISTRATION
───────────────────────────────────────

Screen 1.1: Login Page (/login)
Required elements:
- [ ] Email input field (with validation)
- [ ] Password input field (with show/hide toggle)
- [ ] Remember Me checkbox
- [ ] Forgot Password link
- [ ] Login button
- [ ] Redirect to registration link
- [ ] Supabase Auth integration working
- [ ] Session management (stores userId, companyId, roleId)
- [ ] Redirect to dashboard on successful login
- [ ] Error messages for invalid credentials

Status: ___________
Notes: ___________

Screen 1.2: Employer Registration (/register)
Step 1 - Company Information:
- [ ] Registration Number input (6 digits)
- [ ] Trade Name input
- [ ] Email input
- [ ] Password input (validation: min 8 chars, 1 uppercase, 1 number)
- [ ] Confirm Password input
- [ ] "Verify Registration Number" button
- [ ] BIMA API integration (with ENABLE_BIMA_INTEGRATION toggle)
- [ ] Auto-fill company details from BIMA response
- [ ] Manual entry option if BIMA disabled

Step 2 - Security Questions:
- [ ] Security Question 1 dropdown (from c3_security_questions)
- [ ] Security Answer 1 input
- [ ] Security Question 2 dropdown (different from Q1)
- [ ] Security Answer 2 input

Step 3 - Email Verification:
- [ ] 6-digit OTP generation
- [ ] Email sending (using verifictionTemplate.html)
- [ ] OTP input field
- [ ] Verify button
- [ ] Account activation on successful verification
- [ ] Database records created (c3_companies, c3_users, c3_user_profiles)
- [ ] Default permissions created in c3_user_granular_permissions

Status: ___________
Notes: ___________

Screen 1.3: Password Reset (/reset-password)
- [ ] Email input for reset request
- [ ] Supabase password reset email sent
- [ ] Reset password form
- [ ] New password validation
- [ ] Successful password update

Status: ___________
Notes: ___________

---

MODULE 2: EMPLOYER DASHBOARD
───────────────────────────────────────

Screen 2.1: Main Layout
Sidebar:
- [ ] Company logo (uploaded or default)
- [ ] Company name display
- [ ] Dynamic navigation menu (from c3_user_granular_permissions)
- [ ] Menu items render based on database permissions
- [ ] User profile section at bottom
- [ ] Logout button
- [ ] Responsive (collapses to hamburger on mobile)

Top Bar:
- [ ] Page title (dynamic based on route)
- [ ] Breadcrumb navigation
- [ ] Notifications icon with badge
- [ ] User avatar dropdown (Profile, Settings, Logout)

Status: ___________
Notes: ___________

Screen 2.2: Dashboard Widgets (/employer/dashboard)
Statistics Cards:
- [ ] Total Employees count (from c3_employees)
- [ ] Active C3 Forms count (is_finalized = false)
- [ ] Pending Payments count
- [ ] Total Paid This Year sum

Recent C3 Forms Table:
- [ ] Shows last 5 C3 forms
- [ ] Columns: Period, Employee Count, Total Contribution, Status, Actions
- [ ] View button per row
- [ ] Edit button per row (if not finalized)
- [ ] Delete button per row (if not finalized)

Quick Action Buttons:
- [ ] "Create New C3" → /employer/payroll
- [ ] "Manage Employees" → /employer/employees
- [ ] "View Reports" → /employer/reports

Status: ___________
Notes: ___________

---

MODULE 3: EMPLOYEE MANAGEMENT
───────────────────────────────────────

Screen 3.1: Employee List (/employer/employees)
Data Grid:
- [ ] Shows all employees for logged-in company
- [ ] Columns: SSN, Full Name, Birth Date, Hire Date, Status, Actions
- [ ] Search functionality (by name or SSN)
- [ ] Filter (Active/All)
- [ ] Sortable columns
- [ ] Pagination (20 per page)
- [ ] "Add Employee" button
- [ ] "Import from BIMA" button
- [ ] Edit action per row
- [ ] Delete action per row (soft delete)

Status: ___________
Notes: ___________

Screen 3.2: Add/Edit Employee Form
Personal Information Section:
- [ ] Social Security Number (9 digits, unique validation)
- [ ] First Name
- [ ] Middle Name (optional)
- [ ] Last Name
- [ ] Date of Birth (age validation: 16-80)
- [ ] Gender dropdown

Employment Information Section:
- [ ] Hire Date
- [ ] Pay Period dropdown (Weekly/Biweekly/Monthly)
- [ ] Occupation
- [ ] Is Director checkbox
- [ ] Is Director Only checkbox
- [ ] Annual Salary (required if Is Director Only = true)
- [ ] Is Levy Exempt checkbox

Contact Information Section:
- [ ] Email (format validation, optional)
- [ ] Phone
- [ ] Mobile
- [ ] Street Address
- [ ] City
- [ ] State
- [ ] Country dropdown
- [ ] Postal Code

Validation:
- [ ] SSN uniqueness check per company
- [ ] Age calculation and validation (16-80)
- [ ] Conditional required field (Annual Salary if Director Only)
- [ ] Email format validation
- [ ] Form submission creates/updates c3_employees record

Status: ___________
Notes: ___________

Screen 3.3: Import from BIMA (Modal/Dialog)
- [ ] SSN input
- [ ] First Name input
- [ ] Last Name input
- [ ] Date of Birth input
- [ ] "Search BIMA" button
- [ ] Calls BIMA API (getIpDetailsByQuery)
- [ ] Displays preview of found employee
- [ ] "Confirm Import" button
- [ ] Auto-fills Add Employee form with BIMA data
- [ ] Error handling if employee not found in BIMA

Status: ___________
Notes: ___________

---

MODULE 4: C3 PAYROLL PROCESSING ⭐ MOST CRITICAL
───────────────────────────────────────

Screen 4.1: Period Selection (/employer/payroll)
- [ ] Month dropdown (1-12)
- [ ] Year dropdown (current year ± 2)
- [ ] "Create C3" or "Edit Existing" button
- [ ] Checks if C3 exists for period
- [ ] Creates c3_contribution_headers record if new
- [ ] Loads existing C3 for editing if exists

Status: ___________
Notes: ___________

Screen 4.2: Wages Grid (/employer/payroll/edit/{id}) ⭐⭐⭐
Data Grid with Columns:

READONLY Columns:
- [ ] Employee Name (First + Last)
- [ ] SSN
- [ ] Age (calculated from date_of_birth)

EDITABLE Columns (User Input):
- [ ] Week 1 Wage (number input)
- [ ] Week 2 Wage
- [ ] Week 3 Wage
- [ ] Week 4 Wage
- [ ] Week 5 Wage
- [ ] Worked Week 1 (checkbox)
- [ ] Worked Week 2 (checkbox)
- [ ] Worked Week 3 (checkbox)
- [ ] Worked Week 4 (checkbox)
- [ ] Worked Week 5 (checkbox)
- [ ] Holiday Pay (number input)
- [ ] Bonus (number input)

CALCULATED Columns (Readonly, auto-update):
- [ ] Total Wages
- [ ] SS Employee
- [ ] SS Employer
- [ ] EI Employee
- [ ] EI Employer
- [ ] Levy Employee
- [ ] Levy Employer
- [ ] PE Employee
- [ ] PE Employer
- [ ] Total Employee Deduction
- [ ] Total Employer Contribution
- [ ] Grand Total

Special Features:
- [ ] Director-only employees: Auto-calculate wages from annual_salary
- [ ] Director-only employees: Wage fields are readonly
- [ ] Auto-save on field blur
- [ ] Calls calculate-c3-contributions Edge Function
- [ ] Updates calculated fields in real-time

Status: ___________
Notes: ___________

Screen 4.3: Calculation Engine (Backend - Edge Function)
⚠️ THIS IS CRITICAL - Must be implemented EXACTLY as in 
_reference/VERIFIED_C3_CALCULATIONS.md

Verify Edge Function Exists:
- [ ] Edge Function: calculate-c3-contributions
- [ ] Accepts correct input parameters
- [ ] Returns correct output structure

Verify Calculation Logic (9-step pipeline):
- [ ] Step 1: Fetch employee data (age, director status, levy exempt)
- [ ] Step 2: Calculate age correctly
- [ ] Step 3: Auto-calculate director wages if is_director_only = true
- [ ] Step 4: Distribute holiday pay to non-working weeks only
- [ ] Step 5: Calculate total wages (sum of all 5 weeks)
- [ ] Step 6: Fetch system rates from c3_system_rates (NO hardcoding)
- [ ] Step 7: Fetch levy tiers from c3_levy_tiers (NO hardcoding)
- [ ] Step 8: Get YTD wages for December bonus exemption check
- [ ] Step 9: Calculate each contribution component:

SS Employee:
- [ ] Formula: totalWages × rates.soc_ee_rate
- [ ] Cap applied: Math.min(calculated, rates.soc_ee_pay_limit)
- [ ] Age exemption: Returns 0 if age < 16 or age > 62
- [ ] Rounded to 2 decimal places

SS Employer:
- [ ] Formula: totalWages × rates.soc_er_rate
- [ ] NO cap applied
- [ ] Age exemption does NOT apply to employer
- [ ] Rounded to 2 decimal places

EI Employee:
- [ ] Formula: totalWages × rates.eib_rate
- [ ] Cap applied: Math.min(calculated, rates.eib_pay_limit)
- [ ] Rounded to 2 decimal places

EI Employer:
- [ ] Formula: totalWages × rates.eib_rate
- [ ] Cap applied: Math.min(calculated, rates.eib_pay_limit)
- [ ] Rounded to 2 decimal places

Levy Employee (PROGRESSIVE TIERS):
- [ ] Fetches tiers from c3_levy_tiers
- [ ] Finds applicable tier based on wage range
- [ ] December Bonus Rule implemented:
      • If month == 12 AND bonus > 0 AND ytdWages < 18720
      • Then wageBase = totalWages - bonus (exclude bonus)
      • Else wageBase = totalWages (include bonus)
- [ ] Applies levy_rate from matched tier
- [ ] Returns 0 if is_levy_exempt = true
- [ ] Rounded to 2 decimal places

Levy Employer:
- [ ] Formula: (totalWages + bonus) × rates.employer_levy_rate
- [ ] Always includes bonus (no exemption)
- [ ] NO cap applied
- [ ] Rounded to 2 decimal places

PE Employee (Severance Pay):
- [ ] Formula: totalWages × rates.severance_rate
- [ ] Cap applied: Math.min(calculated, rates.soc_ee_pay_limit)
- [ ] Rounded to 2 decimal places

PE Employer (Severance Pay):
- [ ] Formula: totalWages × rates.severance_rate
- [ ] NO cap applied
- [ ] Rounded to 2 decimal places

Auto-Save to Database:
- [ ] Saves to c3_contribution_details
- [ ] Uses UPSERT (INSERT ... ON CONFLICT DO UPDATE)
- [ ] Stores all wage inputs and calculated values

Status: ___________
Notes: ___________

Screen 4.4: Summary & Actions
Summary Totals:
- [ ] Employee Count
- [ ] Total Wages
- [ ] Total SS (Employee + Employer)
- [ ] Total EI (Employee + Employer)
- [ ] Total Levy (Employee + Employer)
- [ ] Total PE (Employee + Employer)
- [ ] Total Employee Deduction
- [ ] Total Employer Contribution
- [ ] Grand Total

Action Buttons:
- [ ] "Save Draft" button (keeps is_finalized = false)
- [ ] "Finalize C3" button (sets is_finalized = true)
- [ ] Validation before finalize:
      • All active employees have wage data
      • No negative values
      • If holiday_pay > 0, at least one non-worked week
- [ ] "Submit to BIMA" button (if ENABLE_BIMA_INTEGRATION = true)
- [ ] BIMA submission sets is_submitted = true
- [ ] BIMA response saved

Status: ___________
Notes: ___________

---

MODULE 5: PAYMENT PROCESSING
───────────────────────────────────────

Screen 5.1: Payment Page (/employer/payments or /employer/payroll/{id}/pay)
C3 Summary Display:
- [ ] C3 Period (Month/Year)
- [ ] Total Amount Due
- [ ] Current Payment Status

Payment Method 1 - Online (CyberSource):
- [ ] "Pay Now" button
- [ ] CyberSource payment gateway integration
- [ ] On success: Creates c3_payments record
- [ ] Payment status = 'AUTHORIZED'
- [ ] Sends payment confirmation email
- [ ] Posts payment to BIMA (if enabled)

Payment Method 2 - Offline:
- [ ] Payment Date picker
- [ ] Payment Method dropdown (Check, Cash, Bank Transfer)
- [ ] Receipt Number input
- [ ] Notes textarea
- [ ] "Record Payment" button
- [ ] Creates c3_payments record with status 'Offline Payment'

Status: ___________
Notes: ___________

---

MODULE 6: REPORTS
───────────────────────────────────────

Screen 6.1: Reports Page (/employer/reports)

Report 1 - C3 Summary Report:
- [ ] From Month/Year filter
- [ ] To Month/Year filter
- [ ] Data table showing all C3s in date range
- [ ] Columns: Period, Employee Count, Total Wages, Total Contributions, Payment Status
- [ ] "Export PDF" button (using jsPDF)
- [ ] PDF generation works

Report 2 - Employee Contribution Report:
- [ ] Period filter (Month/Year)
- [ ] Multi-select employee filter
- [ ] Data table showing per-employee breakdown
- [ ] Columns: Name, SSN, Wages, SS, EI, Levy, PE, Total
- [ ] "Export Excel" button (using xlsx library)
- [ ] Excel generation works

Report 3 - Payment History:
- [ ] From Date filter
- [ ] To Date filter
- [ ] Data table showing all payments
- [ ] Columns: Payment Date, C3 Period, Amount, Method, Transaction ID, Status
- [ ] "Export PDF" button
- [ ] PDF generation works

Status: ___________
Notes: ___________

---

MODULE 7: SETTINGS
───────────────────────────────────────

Screen 7.1: Settings Page (/employer/settings)

Tab 1 - Company Profile:
- [ ] Trade Name input
- [ ] Company Name input (readonly, from BIMA)
- [ ] Email input
- [ ] Phone input
- [ ] Address fields (Street, City, State, Country, Postal)
- [ ] Company Logo upload (max 2MB, PNG/JPG)
- [ ] Logo preview
- [ ] "Save Changes" button
- [ ] Updates c3_companies record

Tab 2 - User Management:
- [ ] List of users for company
- [ ] Columns: Email, Username, Role, Status, Actions
- [ ] "Add User" button
- [ ] Add User modal/form
- [ ] Edit Permissions action
- [ ] Deactivate User action

Tab 3 - Notification Preferences:
- [ ] Email notifications for C3 due dates (checkbox)
- [ ] Payment confirmation emails (checkbox)
- [ ] Monthly reminders (checkbox)
- [ ] "Save Preferences" button

Status: ___________
Notes: ___________

---

CROSS-CUTTING FEATURES
───────────────────────────────────────

Security & Access Control:
- [ ] Row Level Security (RLS) policies implemented
- [ ] Users can only see data from their own company
- [ ] Protected routes (require authentication)
- [ ] Unauthorized access redirects to login

UI/UX:
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states during API calls
- [ ] Error messages displayed properly
- [ ] Success toasts/notifications
- [ ] Form validation (client-side for UX)
- [ ] Consistent color scheme (Primary: #0b64a0)
- [ ] Shadcn/UI components used throughout

Data-Driven:
- [ ] NO hardcoded rates (fetched from c3_system_rates)
- [ ] NO hardcoded levy tiers (fetched from c3_levy_tiers)
- [ ] NO hardcoded menus (fetched from c3_user_granular_permissions)
- [ ] NO hardcoded security questions (fetched from c3_security_questions)

Backend-First Architecture:
- [ ] ALL business logic in Supabase Edge Functions
- [ ] Frontend only displays data and collects input
- [ ] NO calculations in frontend
- [ ] NO validation enforcement in frontend
- [ ] ALL API calls go through Edge Functions

Status: ___________
Notes: ___________

═══════════════════════════════════════════════════════════════════════
PART 2: IMPLEMENTATION OF MISSING FEATURES
═══════════════════════════════════════════════════════════════════════

Based on your verification above:

1. List all items marked as ❌ MISSING or ⚠️ PARTIAL
2. For each missing/partial item, please implement it now
3. After implementing, run the verification again

Please start implementing any missing features now.

═══════════════════════════════════════════════════════════════════════
PART 3: CALCULATION TEST CASES (If Module is Complete)
═══════════════════════════════════════════════════════════════════════

⚠️ ONLY proceed with testing if:
1. ALL screens above are ✅ COMPLETE
2. ALL screens visually match `PRDs/Employer_C3_wizard_screens.pdf`
3. Backend logic matches the verified legacy formulas

If the module is complete and matches the PDF, please run these 5 MANDATORY test cases 
for the C3 calculation engine. Each test must produce EXACT results.

REFERENCE: _reference/VERIFIED_C3_CALCULATIONS.md

---

TEST CASE 1: Standard Employee
───────────────────────────────────────

INPUT:
- Employee: John Doe, Age: 35, SSN: 123456789
- Month: January (1), Year: 2026
- Week 1 Wage: $800
- Week 2 Wage: $800
- Week 3 Wage: $800
- Week 4 Wage: $800
- Week 5 Wage: $0
- All weeks worked: true
- Holiday Pay: $0
- Bonus: $0
- Is Levy Exempt: false

EXPECTED OUTPUT:
- Total Wages: $3,200.00
- SS Employee: $160.00 (3200 × 0.05, no cap hit)
- SS Employer: $160.00 (3200 × 0.05, no cap)
- EI Employee: $32.00 (3200 × 0.01, no cap hit)
- EI Employer: $32.00 (3200 × 0.01, no cap)
- Levy Employee: $160.00 (3200 × 0.05, assuming tier 5% for $3000+)
- Levy Employer: $96.00 (3200 × 0.03)
- PE Employee: $160.00 (3200 × 0.05, no cap hit)
- PE Employer: $160.00 (3200 × 0.05, no cap)
- Total Employee Deduction: $512.00
- Total Employer Contribution: $548.00
- Grand Total: $1,060.00

ACTUAL OUTPUT:
(Lovable: Please run this test and provide actual values)

RESULT: PASS / FAIL
If FAIL, explain the discrepancy:

---

TEST CASE 2: High Earner (Caps Applied)
───────────────────────────────────────

INPUT:
- Employee: Jane Smith, Age: 45, SSN: 987654321
- Month: January (1), Year: 2026
- Week 1 Wage: $5,000
- Week 2 Wage: $5,000
- Week 3 Wage: $5,000
- Week 4 Wage: $5,000
- Week 5 Wage: $0
- All weeks worked: true
- Holiday Pay: $0
- Bonus: $0
- Is Levy Exempt: false

EXPECTED OUTPUT:
- Total Wages: $20,000.00
- SS Employee: $750.00 (20000 × 0.05 = 1000, but CAPPED at $750)
- SS Employer: $1,000.00 (20000 × 0.05, NO cap)
- EI Employee: $150.00 (20000 × 0.01 = 200, but CAPPED at $150)
- EI Employer: $150.00 (20000 × 0.01 = 200, but CAPPED at $150)
- Levy Employee: $1,000.00 (20000 × 0.05, assuming tier 5%)
- Levy Employer: $600.00 (20000 × 0.03)
- PE Employee: $750.00 (20000 × 0.05 = 1000, but CAPPED at $750)
- PE Employer: $1,000.00 (20000 × 0.05, NO cap)
- Total Employee Deduction: $2,650.00
- Total Employer Contribution: $2,750.00
- Grand Total: $5,400.00

ACTUAL OUTPUT:
(Lovable: Please run this test and provide actual values)

RESULT: PASS / FAIL
If FAIL, explain the discrepancy:

---

TEST CASE 3: December Bonus (YTD Below $18,720)
───────────────────────────────────────────

INPUT:
- Employee: Bob Johnson, Age: 30, SSN: 555666777
- Month: December (12), Year: 2026
- Week 1 Wage: $625
- Week 2 Wage: $625
- Week 3 Wage: $625
- Week 4 Wage: $625
- Week 5 Wage: $0
- All weeks worked: true
- Holiday Pay: $0
- Bonus: $500
- Is Levy Exempt: false
- YTD Wages (Jan-Nov): $15,000 (< $18,720 threshold)

EXPECTED OUTPUT:
- Total Wages: $2,500.00 (weekly wages only)
- SS Employee: $125.00 ((2500 + 500) × 0.05, bonus included for SS)
- SS Employer: $150.00 ((2500 + 500) × 0.05, bonus included)
- EI Employee: $30.00 ((2500 + 500) × 0.01)
- EI Employer: $30.00
- Levy Employee: $80.00 ⚠️ CRITICAL: ($2,500 - $500) × 0.04 = $80
                         Bonus EXCLUDED because YTD < $18,720
                         Assuming $2,000 wage base falls in 4% tier
- Levy Employer: $90.00 ((2500 + 500) × 0.03, bonus INCLUDED)
- PE Employee: $150.00 ((2500 + 500) × 0.05)
- PE Employer: $150.00
- Total Employee Deduction: $385.00
- Total Employer Contribution: $420.00
- Grand Total: $805.00

ACTUAL OUTPUT:
(Lovable: Please run this test and provide actual values)

RESULT: PASS / FAIL
If FAIL, explain the discrepancy:

---

TEST CASE 4: December Bonus (YTD Above $18,720)
───────────────────────────────────────────

INPUT:
- Employee: Alice Williams, Age: 28, SSN: 111222333
- Month: December (12), Year: 2026
- Week 1 Wage: $625
- Week 2 Wage: $625
- Week 3 Wage: $625
- Week 4 Wage: $625
- Week 5 Wage: $0
- All weeks worked: true
- Holiday Pay: $0
- Bonus: $500
- Is Levy Exempt: false
- YTD Wages (Jan-Nov): $20,000 (>= $18,720 threshold)

EXPECTED OUTPUT:
- Total Wages: $2,500.00
- SS Employee: $150.00 ((2500 + 500) × 0.05)
- SS Employer: $150.00
- EI Employee: $30.00 ((2500 + 500) × 0.01)
- EI Employer: $30.00
- Levy Employee: $150.00 ⚠️ CRITICAL: ($2,500 + $500) × 0.05 = $150
                         Bonus INCLUDED because YTD >= $18,720
                         Assuming $3,000 total falls in 5% tier
- Levy Employer: $90.00 ((2500 + 500) × 0.03)
- PE Employee: $150.00 ((2500 + 500) × 0.05)
- PE Employer: $150.00
- Total Employee Deduction: $480.00
- Total Employer Contribution: $420.00
- Grand Total: $900.00

ACTUAL OUTPUT:
(Lovable: Please run this test and provide actual values)

RESULT: PASS / FAIL
If FAIL, explain the discrepancy:

---

TEST CASE 5: Age Exemption (Too Old for SS)
───────────────────────────────────────────

INPUT:
- Employee: Senior Citizen, Age: 70, SSN: 888999000
- Month: March (3), Year: 2026
- Week 1 Wage: $1,250
- Week 2 Wage: $1,250
- Week 3 Wage: $1,250
- Week 4 Wage: $1,250
- Week 5 Wage: $0
- All weeks worked: true
- Holiday Pay: $0
- Bonus: $0
- Is Levy Exempt: false

EXPECTED OUTPUT:
- Total Wages: $5,000.00
- SS Employee: $0.00 ⚠️ CRITICAL: Age 70 > 62, EXEMPT from SS employee
- SS Employer: $250.00 (5000 × 0.05, employer still pays)
- EI Employee: $50.00 (5000 × 0.01, no age exemption for EI)
- EI Employer: $50.00
- Levy Employee: $250.00 (5000 × 0.05, assuming 5% tier)
- Levy Employer: $150.00 (5000 × 0.03)
- PE Employee: $250.00 (5000 × 0.05, no age exemption for PE)
- PE Employer: $250.00
- Total Employee Deduction: $550.00 (no SS employee)
- Total Employer Contribution: $700.00
- Grand Total: $1,250.00

ACTUAL OUTPUT:
(Lovable: Please run this test and provide actual values)

RESULT: PASS / FAIL
If FAIL, explain the discrepancy:

═══════════════════════════════════════════════════════════════════════
PART 4: FUNCTIONAL TESTING CHECKLIST
═══════════════════════════════════════════════════════════════════════

If calculation tests pass, perform these functional tests:

END-TO-END WORKFLOW TEST:
───────────────────────────────────────

Test 1: Complete Employer Journey
- [ ] Register new employer account
- [ ] Verify email with OTP
- [ ] Login successfully
- [ ] Dashboard displays (with 0 employees, 0 C3s initially)
- [ ] Add 3 employees manually
- [ ] Import 1 employee from BIMA (if enabled)
- [ ] Create C3 form for current month
- [ ] Enter wages for all 4 employees
- [ ] Verify calculations auto-update
- [ ] Verify summary totals are correct
- [ ] Finalize C3
- [ ] Process payment (online or offline)
- [ ] Generate C3 Summary Report and export PDF
- [ ] Generate Employee Contribution Report and export Excel
- [ ] Logout

Result: PASS / FAIL
Notes:

Test 2: Edge Cases
- [ ] Try to create duplicate employee (same SSN) - Should show error
- [ ] Try to finalize C3 with missing wage data - Should show validation error
- [ ] Try to access another company's data - Should be blocked by RLS
- [ ] Try to edit finalized C3 - Should be readonly or blocked
- [ ] Create employee age 15 (too young) - Should show validation error
- [ ] Create employee age 81 (too old) - Should show validation error
- [ ] Enter negative wage - Should show validation error

Result: PASS / FAIL
Notes:

Test 3: Responsive Design
- [ ] Test on mobile (375px width) - All features accessible
- [ ] Test on tablet (768px width) - Layout adapts properly
- [ ] Test on desktop (1920px width) - Optimal layout

Result: PASS / FAIL
Notes:

Test 4: Performance
- [ ] C3 grid with 50 employees loads in < 3 seconds
- [ ] Calculation response time < 1 second per employee
- [ ] Dashboard widgets load in < 2 seconds
- [ ] Report generation completes in < 5 seconds

Result: PASS / FAIL
Notes:

═══════════════════════════════════════════════════════════════════════
FINAL ASSESSMENT
═══════════════════════════════════════════════════════════════════════

Based on all verification and testing above:

Overall Completion Status: ___% (0-100%)

Ready for Production: YES / NO

If NO, list blocking issues:
1. 
2. 
3. 

If YES, confirm:
- [x] All screens implemented
- [x] All 5 calculation test cases PASS
- [x] End-to-end workflow works
- [x] Edge cases handled properly
- [x] Responsive on all devices
- [x] Performance acceptable
- [x] No console errors
- [x] RLS policies protecting data
- [x] Backend-first architecture followed
- [x] Data-driven (no hardcoded values)

═══════════════════════════════════════════════════════════════════════

Please provide a comprehensive response addressing each section above.
```

---

## 📋 HOW TO USE THIS PROMPT

### **Step 1**: After Lovable finishes implementing
Give Lovable this prompt to verify completeness

### **Step 2**: Lovable fills out the verification
Lovable marks each item as ✅ ⚠️ or ❌

### **Step 3**: Implement missing features
If anything is missing, Lovable implements it

### **Step 4**: Run calculation tests
Lovable runs all 5 test cases and reports results

### **Step 5**: Run functional tests
Lovable performs end-to-end testing

### **Step 6**: Final assessment
Lovable declares if module is production-ready

---

**This prompt ensures NOTHING is missed and EVERYTHING is tested!** 🎯
