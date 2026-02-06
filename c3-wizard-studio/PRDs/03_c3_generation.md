# PRD 03: C3 Form Generation

**Module**: C3 Form Generation (Core Feature)  
**Version**: 1.0  
**Last Updated**: January 22, 2026

---

## 📋 Overview

The C3 Form Generation module is the **core feature** of C3 Wizard. It allows employers to create monthly contribution forms for submission to the Social Security Board.

**Referenced By**:
- Master PRD: `PRDs/00_MAIN_PRD.md`
- Calculations: `knowledge/05_contribution_calculations.md`
- Validation: `knowledge/16_validation_rules.md`

---

## 🎯 User Stories

### As an Employer
1. I want to select a month/year to generate C3 for
2. I want to select which employees to include
3. I want to enter weekly wages for each employee
4. I want to add holiday pay and bonuses
5. I want to see auto-calculated contributions
6. I want to preview the complete C3 before submitting
7. I want to save as draft and return later
8. I want to submit to BIMA and process payment

### As a Self-Employed User
1. I want to enter my monthly income
2. I want to see my contribution amount
3. I want to submit my C3
4. I want to process payment

---

## 🖥️ Screen Flow

```
Dashboard
  ↓
Generate C3 (Select Period)
  ↓
Select Employees (Multi-select with checkboxes)
  ↓
Enter Wages & Contributions
  ├─ Weekly wages (Week 1-5)
  ├─ Holiday pay (separate modal)
  ├─ Bonus (separate modal)
  └─ Auto-calculate contributions
  ↓
Preview C3
  ├─ Review all details
  ├─ Validate calculations
  └─ Edit if needed (go back)
  ↓
Save / Submit
  ├─ Save as Draft → Dashboard
  └─ Submit → Payment Processing
```

---

## 📐 Detailed Requirements

### 1. Period Selection

**Fields**:
- Month (dropdown: Jan-Dec)
- Year (dropdown: Current year ± 10 years)
- Pay Period (multi-select checkboxes):
  - ☐ W - Weekly
  - ☐ E2W - Every Two Weeks
  - ☐ M - Monthly
  - ☐ 2M - Twice Monthly

**Validation**:
- Month & Year are required
- At least one Pay Period must be selected
- Cannot create duplicate C3 for same period (unless previous is draft)

**Error Messages**:
- "Please select Month and Year."
- "Please select at least one Pay Period."
- "C3 for this period already exists. Do you want to edit it?"

---

### 2. Employee Selection

**Display**:
- Table with columns:
  - ☐ Checkbox (Select)
  - SSN (masked: XXX-XX-6789)
  - Employee Name
  - Department
  - Pay Period

**Features**:
- Search by SSN or Name
- Filter by Department
- Filter by Pay Period
- "Select All" checkbox
- Show only active employees by default

**Nil Return Option**:
- Toggle switch: "Nil Return (No Employees)"
- If enabled, skip employee selection
- Used when no employees worked in period

**Validation**:
- Must select at least 1 employee (unless Nil Return)

---

### 3. Wage Entry Table

**Layout**: Editable data table

**Columns** (for Weekly pay period example):
- Employee (read-only)
- ☐ Week 1 (checkbox + amount input)
- ☐ Week 2 (checkbox + amount input)
- ☐ Week 3 (checkbox + amount input)
- ☐ Week 4 (checkbox + amount input)
- ☐ Week 5 (checkbox + amount input, if month has 5 weeks)
- Holiday Pay (button → open modal)
- Bonus (button → open modal)
- Actions (Edit, Delete)

**Wage Input**:
- Format: Decimal (2 places), e.g., 800.00
- Auto-check week checkbox if amount > 0
- Allow manual check/uncheck (for unpaid weeks)

**Holiday Pay Modal**:
- Amount (required)
- Distribution (auto or manual):
  - Auto: Distribute evenly across non-working weeks
  - Manual: Select specific weeks
- From Date / To Date (optional)

**Bonus Modal**:
- Amount (required)
- Payment Date (required)
- Type: Performance / Holiday / Year-end / Other

---

### 4. Auto-Calculation Display

**Per Employee Row** (calculated columns):
- Total Wages (sum of weeks + holiday)
- SS Employee (auto-calculated)
- SS Employer (auto-calculated)
- Levy Employee (auto-calculated, progressive)
- Levy Employer (auto-calculated)
- PE Employee (auto-calculated)
- PE Employer (auto-calculated)
- **Employee Total** (bold)
- **Employer Total** (bold)
- **Grand Total** (bold)

**Formulas**: See `knowledge/05_contribution_calculations.md`

**Footer Totals**:
- Total Employees: [count]
- Total Wages: $[sum]
- Total SS Contributions: $[sum EE + ER]
- Total Levy: $[sum EE + ER]
- Total PE: $[sum EE + ER]
- **GRAND TOTAL**: $[all contributions]

---

### 5. Preview Screen

**Display**:
- Company information (read-only)
- Period (Month/Year)
- Complete employee list with all contributions
- Summary totals
- Warnings/Notices (if any):
  - "December bonus exemption applied for [X] employees"
  - "Age exemption applied for [X] employees"

**Actions**:
- ← Back (return to wage entry)
- Save as Draft
- Submit

---

### 6. Save vs Submit

**Save as Draft**:
- Stores in database with `status = 'draft'`
- Can be edited later
- Does NOT validate completeness
- Does NOT post to BIMA

**Submit**:
- Validates all fields
- Posts to BIMA API (if enabled)
- Updates `status = 'submitted'`
- Redirects to Payment Processing

---

## 🧮 Calculation Rules Reference

**⚠️ CRITICAL**: All calculation formulas are in `knowledge/05_contribution_calculations.md`

**Key Rules to Enforce**:
1. SS employee cap: $750/month
2. December bonus: Exempt from employee levy if YTD < $28k
3. Holiday pay: Distribute to non-working weeks
4. Age exemption: No SS if age < 16 or ≥ 62
5. Employer levy includes bonuses

**Test Cases**: See `knowledge/05_contribution_calculations.md` lines 300-350

---

## ✅ Validation Rules Reference

**See**: `knowledge/16_validation_rules.md` for complete list

**Field Validations**:
- Wages: Decimal, ≥ 0, max 2 decimals
- SSN: Format XXX-XX-XXXX
- Dates: Valid format (dd/MM/yyyy)
- Amounts: Non-negative

**Error Messages**: Use exact wording from validation rules doc

---

## 🔌 BIMA Integration

**When Submit Button Clicked**:

1. **Validate all data** (client-side)
2. **Call Supabase Edge Function**: `submit-c3-to-bima`
3. **Edge Function**:
   - Formats payload per BIMA API spec
   - Calls BIMA API: `POST /C3/c3BulkSubmit/...`
   - Handles response
4. **On Success**:
   - Update local database: `is_submitted = TRUE`
   - Store BIMA receipt number
   - Show success toast
   - Redirect to Payment

**See**: `knowledge/11_bima_integration.md` for complete API specs

---

## 🎨 UI/UX Reference

**See**: `knowledge/09_ui_ux_standards.md`

**Key Components**:
- Multi-step wizard (Progress indicators)
- Data table (shadcn/ui Table)
- Modals for Holiday Pay & Bonus
- Toast notifications (success/error)
- Mint green primary buttons

---

## 💾 Database Tables

**Referenced Tables**:
- `c3_contribution_headers` (header record)
- `c3_contribution_details` (per-employee records)
- `c3_employees` (employee data)
- `c3_system_rates` (rate configuration)
- `c3_levy_tiers` (progressive levy tiers)

**See**: `knowledge/04_database_schema.md` for complete structures

---

## 🧪 Acceptance Criteria

**Must Pass All**:

1. ✅ User can select period and employees
2. ✅ User can enter wages for all weeks
3. ✅ User can add holiday pay and bonuses
4. ✅ Calculations are 100% accurate (verify with test cases)
5. ✅ User can save as draft
6. ✅ User can submit to BIMA successfully
7. ✅ Validation prevents invalid data
8. ✅ UI is responsive on mobile
9. ✅ Nil return option works correctly
10. ✅ December bonus exemption is applied correctly

---

## 🚫 Edge Cases

1. **5-week months**: Show Week 5 column only if month has 5 Mondays
2. **Employee terminated mid-month**: Allow partial weeks
3. **December bonus + low YTD**: Apply exemption automatically
4. **Age 62 employee**: Show warning, zero SS contributions
5. **Duplicate C3**: Warn user, offer to edit existing

---

**For implementation details, see referenced knowledge files above.**

**Last Updated**: January 22, 2026
