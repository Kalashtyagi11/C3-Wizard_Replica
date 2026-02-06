# 🧪 COMPREHENSIVE TESTING GUIDE - C3 Wizard Recreation

**Purpose**: Test Lovable's recreation against original C3 Wizard to find gaps and validate 100% accuracy

**Your Role**: Quality Assurance - Ensure perfect replica  
**Success Criteria**: Zero functional gaps, 100% calculation accuracy

---

## 📋 TESTING OVERVIEW

### **What You're Testing**:
1. ✅ **Functionality** - Does everything work like the original?
2. ✅ **Calculations** - Are all formulas 100% accurate?
3. ✅ **UI/UX** - Does it look modern but feel familiar?
4. ✅ **Data** - Is data stored correctly?
5. ✅ **Security** - Are permissions enforced?

### **Testing Approach**:
- **Compare** - Side-by-side with original C3 Wizard
- **Calculate** - Verify every calculation manually
- **Test** - All user workflows
- **Validate** - All edge cases

---

## 🔥 CRITICAL TEST AREAS (MUST TEST)

### **1. Calculations** 🔥🔥🔥 **MOST CRITICAL**

**Why**: Regulatory requirement - calculations MUST be 100% accurate

**Test Scenarios**:

#### **Scenario 1: Normal Employee**
```
Employee: John Doe, Age 30, SSN 123-45-6789
Month: January 2026
Wages: Week 1: $500, Week 2: $500, Week 3: $500, Week 4: $500, Week 5: $0
Total Wages: $2000
Holiday Pay: $0
Bonus: $0

Expected Calculations:
✓ SS Employee: $2000 × 5% = $100
✓ SS Employer: $2000 × 5% = $100
✓ EI Employee: $2000 × 1% = $20
✓ EI Employer: $2000 × 1% = $20
✓ Employee Levy: Calculate based on tier (e.g., $30 if in $500-999 tier)
✓ Employer Levy: $2000 × 3% = $60
✓ PE Employee: $2000 × 5% = $100
✓ PE Employer: $2000 × 5% = $100
```

**How to Test**:
1. Add employee John Doe
2. Generate C3 for January
3. Enter wages as above
4. Check each calculation field
5. Compare with expected values
6. **✅ PASS** if all match, **❌ FAIL** if any differ

---

#### **Scenario 2: SS Cap Test**
```
Employee: Jane Smith, Age 25
Month: February 2026
Wages: $20,000 (high earner)

Expected:
✓ SS Employee: CAPPED at $750 (not $20,000 × 5% = $1000)
✓ SS Employer: $20,000 × 5% = $1000 (NO cap for employer)
✓ EI: Check against EI caps
✓ Levy: Progressive based on total wages
```

**Critical Check**: Employee SS MUST be capped at $750!

---

#### **Scenario 3: December Bonus Exemption** 🔥
```
Employee: Bob Johnson, Age 28
Month: December 2026
YTD Wages (Jan-Nov): $25,000
December Wages: $2000
December Bonus: $1000

Expected:
✓ Regular wages $2000: Subject to employee levy
✓ Bonus $1000: EXEMPT from employee levy (YTD < $28k)
✓ Employer levy: Includes BOTH wages + bonus ($3000 × 3%)
```

**Critical Check**: Employee levy on bonus MUST be $0!

---

#### **Scenario 4: Age Exemption**
```
Employee: Mary Williams, Age 63
Month: March 2026
Wages: $2000

Expected:
✓ SS Employee: $0 (age exemption - over 62)
✓ SS Employer: $0 (age exemption)
✓ EI, Levy, PE: Normal calculations
```

**Critical Check**: SS MUST be $0 for age 63!

---

#### **Scenario 5: Holiday Pay Distribution**
```
Employee: Tom Davis, Age 35
Month: April 2026
Wages: Week 1: $0, Week 2: $500, Week 3: $0, Week 4: $500, Week 5: $0
Holiday Pay: $200
Non-working weeks: 1, 3, 5

Expected:
✓ Week 1: $200/3 = $66.67 added
✓ Week 2: $500 (no change)
✓ Week 3: $200/3 = $66.67 added
✓ Week 4: $500 (no change)
✓ Week 5: $200/3 = $66.67 added
✓ Total wages for calculation: $500 + $500 + $200 = $1200
```

**Critical Check**: Holiday pay distributed ONLY to non-working weeks!

---

### **2. User Roles & Permissions** 🔥

**Test Cases**:

#### **Admin Tests**:
```
Login as: Admin
Test:
✓ Can see ALL companies
✓ Can manage users
✓ Can configure rates
✓ Can reconcile payments
✓ Can view audit logs
✓ Can access admin dashboard
```

#### **Employer Tests**:
```
Login as: Employer (Company A)
Test:
✓ Can ONLY see Company A data
✓ CANNOT see Company B data
✓ Can add employees
✓ Can generate C3
✓ Can process payments
✓ CANNOT configure rates
✓ CANNOT manage other users
```

#### **Self-Employed Tests**:
```
Login as: Self-Employed User
Test:
✓ Can ONLY see own data
✓ CANNOT see any company data
✓ CANNOT add employees
✓ Can manage own profile
✓ Can submit contributions
✓ Can process payments
```

**Critical**: Cross-company data leakage = CRITICAL BUG 🚨

---

### **3. C3 Form Workflow** 🔥

**Complete User Journey**:

#### **Step 1: Create C3**
```
Action: Employer clicks "Generate C3"
Test:
✓ Month/Year selection works
✓ Employee list loads
✓ Can select/deselect employees
✓ Can click "Generate"
```

#### **Step 2: Enter Wages**
```
Action: Enter wages for each employee
Test:
✓ 5 week fields appear
✓ Can enter amounts
✓ Validations work (no negative values)
✓ Holiday pay field works
✓ Bonus field works
✓ Calculations update in real-time
```

#### **Step 3: Review & Save Draft**
```
Action: Click "Save as Draft"
Test:
✓ C3 saved with status "Draft"
✓ Can edit later
✓ Data persists correctly
```

#### **Step 4: Submit**
```
Action: Click "Submit"
Test:
✓ Confirmation dialog appears
✓ After confirmation, status changes to "Submitted"
✓ C3 becomes read-only (cannot edit)
✓ Payment button appears
```

#### **Step 5: Payment**
```
Action: Click "Pay Now"
Test:
✓ Payment options appear (Online/Offline)
✓ Online: CyberSource/PayPal redirects work
✓ Offline: Can select method and enter reference
✓ After payment, receipt generated
✓ C3 status changes to "Paid"
```

#### **Step 6: BIMA Integration (Optional)**
```
Action: Auto-post to BIMA after payment
Test:
✓ C3 data posted to BIMA
✓ Response logged
✓ Status updated
```

---

## 📊 TESTING MATRIX

### **Feature Testing Checklist**:

| Feature | Test Type | Priority | Status |
|---------|-----------|----------|--------|
| User Registration | Functional | High | ⬜ |
| User Login | Functional | High | ⬜ |
| Password Reset | Functional | Medium | ⬜ |
| Add Employee | Functional | High | ⬜ |
| Edit Employee | Functional | High | ⬜ |
| Delete Employee (Soft) | Functional | High | ⬜ |
| Generate C3 | Functional | CRITICAL | ⬜ |
| Enter Wages | Functional | CRITICAL | ⬜ |
| SS Calculation | Calculation | CRITICAL | ⬜ |
| EI Calculation | Calculation | CRITICAL | ⬜ |
| Levy Calculation | Calculation | CRITICAL | ⬜ |
| PE Calculation | Calculation | CRITICAL | ⬜ |
| SS Cap | Calculation | CRITICAL | ⬜ |
| Dec Bonus Exemption | Calculation | CRITICAL | ⬜ |
| Age Exemption | Calculation | CRITICAL | ⬜ |
| Holiday Pay Dist | Calculation | CRITICAL | ⬜ |
| Submit C3 | Functional | High | ⬜ |
| Online Payment | Integration | High | ⬜ |
| Offline Payment | Functional | High | ⬜ |
| Payment Receipt | Functional | High | ⬜ |
| BIMA Import | Integration | Medium | ⬜ |
| BIMA Post | Integration | Medium | ⬜ |
| Admin Rate Config | Functional | Medium | ⬜ |
| Reports | Functional | Medium | ⬜ |
| RLS Employer | Security | CRITICAL | ⬜ |
| RLS Self-Employed | Security | CRITICAL | ⬜ |
| Soft Delete | Security | High | ⬜ |

---

## 🔍 GAP ANALYSIS TEMPLATE

**Use this to document gaps between original and Lovable recreation**:

### **Gap Format**:
```
Gap #: [Number]
Category: [Functional/Calculation/UI/Security/Performance]
Severity: [Critical/High/Medium/Low]
Original Behavior: [What original C3 Wizard does]
Lovable Behavior: [What Lovable's version does]
Expected: [What should happen]
Steps to Reproduce:
1. ...
2. ...
3. ...
Screenshot: [If applicable]
```

### **Example Gap**:
```
Gap #: 001
Category: Calculation
Severity: CRITICAL
Original Behavior: SS Employee capped at $750 for high earners
Lovable Behavior: No cap applied, calculates $1000 for $20k wages
Expected: SS Employee should be $750 (capped)
Steps to Reproduce:
1. Add employee with $20,000 monthly wage
2. Generate C3
3. Check SS Employee calculation
4. Shows $1000 instead of $750
```

---

## 📝 TEST EXECUTION PLAN

### **Day 1: Setup & Basic Tests** (2 hours)
- [ ] Set up test environment
- [ ] Create test users (Admin, Employer, Self-Employed)
- [ ] Test registration & login
- [ ] Test basic navigation

### **Day 2: Employee Management** (2 hours)
- [ ] Test add employee
- [ ] Test edit employee
- [ ] Test delete employee
- [ ] Test employee validation

### **Day 3: C3 Generation** (3 hours) 🔥
- [ ] Test C3 creation
- [ ] Test wage entry
- [ ] Test all calculation scenarios (Scenarios 1-5 above)
- [ ] Test save draft
- [ ] Test submit

### **Day 4: Payments** (2 hours)
- [ ] Test online payment (CyberSource)
- [ ] Test online payment (PayPal)
- [ ] Test offline payment
- [ ] Test receipt generation

### **Day 5: Security & Edge Cases** (2 hours)
- [ ] Test RLS (cross-company access)
- [ ] Test role permissions
- [ ] Test edge cases
- [ ] Regression testing

---

## ✅ ACCEPTANCE CRITERIA

**Lovable's recreation is READY when**:

1. ✅ All 5 calculation scenarios pass
2. ✅ RLS prevents cross-company access
3. ✅ All user workflows work end-to-end
4. ✅ UI is modern and responsive
5. ✅ No CRITICAL or HIGH severity gaps
6. ✅ Payments work correctly
7. ✅ Data persists correctly
8. ✅ Validations work as expected

---

## 🚨 CRITICAL BUGS (Stop Deployment)

**If you find these, do NOT deploy**:

1. ❌ Calculations are wrong
2. ❌ Cross-company data leakage
3. ❌ Users can edit submitted C3
4. ❌ Payments don't work
5. ❌ Data loss or corruption
6. ❌ Authentication bypass

---

## 📞 TESTING RESOURCES

**Compare Against**:
- Original C3 Wizard (running system)
- `knowledge/05_contribution_calculations.md` (formula reference)
- User manual PDFs (workflow reference)
- `knowledge/16_validation_rules.md` (validation reference)

**Tools**:
- Calculator (for manual calculation verification)
- Excel (for creating test data)
- Screenshots (for gap documentation)

---

**Start testing after Lovable completes Phase 1!** 🚀

**Document all gaps you find!** 📝

**Questions? I'm here to help!** 😊
