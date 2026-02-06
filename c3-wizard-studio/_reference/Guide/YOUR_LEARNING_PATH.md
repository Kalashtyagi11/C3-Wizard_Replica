# 📚 YOUR LEARNING PATH - Become C3 Wizard Expert

**Goal**: Understand EVERY aspect of C3 Wizard to test Lovable's recreation and answer any questions confidently

**Time Investment**: 4-6 hours (spread over 2-3 days)  
**Result**: Complete system mastery

---

## 🎯 LEARNING PATH

### **Phase 1: System Overview** (30 minutes)

**Read These (In Order)**:
1. ✅ `README.md` (Project overview - 10 min)
2. ✅ `knowledge/01_purpose_scope.md` (What is C3 Wizard - 15 min)
3. ✅ `knowledge/00_index.md` (Knowledge structure - 5 min)

**You'll Learn**:
- What C3 Wizard does
- Who uses it (Admin, Employer, Self-Employed)
- Why it exists (St. Kitts & Nevis Social Security)

**Test Yourself**:
- Can you explain what C3 Wizard is to someone in 2 minutes?
- Can you name the 3 user roles and their purposes?

---

### **Phase 2: User Roles & Workflows** (45 minutes)

**Read These**:
1. ✅ `knowledge/03_user_roles_permissions.md` (30 min)
2. ✅ `PRDs/01_user_management.md` (15 min)

**You'll Learn**:
- What Admin can do
- What Employer can do
- What Self-Employed can do
- How authentication works
- What each role can/cannot access

**Test Yourself**:
- Can Employer see another company's data? (No)
- Can Self-Employed add employees? (No)
- Who can configure contribution rates? (Admin only)

---

### **Phase 3: Core Feature - C3 Generation** 🔥 (1 hour)

**Read These**:
1. ✅ `PRDs/03_c3_generation.md` (30 min) - **CRITICAL**
2. ✅ Review user manual PDFs in `PRDs/` folder (30 min)

**You'll Learn**:
- How C3 form is generated (step-by-step)
- What fields are on the form
- How to select employees
- How to enter wages (weekly breakdown)
- What holiday pay is
- What bonus is
- How to save vs submit

**Test Yourself**:
- What's the difference between "Save as Draft" and "Submit"?
- When entering wages, what are the 5 weeks for?
- What happens after clicking Submit?

---

### **Phase 4: Calculations** 🔥🔥🔥 (1.5 hours - MOST CRITICAL)

**Read These**:
1. ✅ `knowledge/05_contribution_calculations.md` (1 hour) - **MOST IMPORTANT**
2. ✅ `VERIFICATION_RATES_FROM_DB.md` (15 min)

**You'll Learn**:
- How SS is calculated (5% employee, 5% employer)
- What the SS cap is (e.g., $750/month for employee)
- How EI is calculated (1% each)
- How Levy is calculated (progressive tiers)
- **December bonus exemption** (CRITICAL!)
- **Age exemption** (16-62 for SS)
- **Holiday pay distribution**

**Test Yourself** (Use these scenarios):

**Scenario 1**: Employee earns $2000/month, age 30
- What's SS employee contribution?
- What's SS employer contribution?
- What's employee levy?

**Scenario 2**: Employee earns $20,000/month, age 30
- What's SS employee contribution? (Should be capped at $750)

**Scenario 3**: December, employee earned $25k YTD, gets $1000 bonus
- Is bonus subject to employee levy? (NO - exempt!)

**Scenario 4**: Employee age 63, earns $2000
- What's SS contribution? ($0 - age exemption)

---

### **Phase 5: Database Structure** (1 hour)

**Read These**:
1. ✅ `knowledge/04_database_schema.md` (30 min)
2. ✅ `knowledge/04_database_schema_part2.md` (30 min)

**You'll Learn**:
- All database tables
- What data is stored where
- How tables relate to each other
- RLS policies (security)

**Test Yourself**:
- Where are employee details stored? (c3_employees)
- Where are contribution calculations stored? (c3_contribution_details)
- Where are payment rates stored? (c3_system_rates)

---

### **Phase 6: Payment Processing** (45 minutes)

**Read These**:
1. ✅ `PRDs/04_payment_processing.md` (30 min)
2. ✅ `knowledge/10_payment_processing.md` (15 min)

**You'll Learn**:
- How online payment works (CyberSource, PayPal)
- How offline payment works
- What happens after payment
- How payment receipts are generated

**Test Yourself**:
- What payment methods are supported?
- Can employer edit C3 after submitting? (No, must pay first)
- What gets emailed after payment?

---

### **Phase 7: BIMA Integration** (30 minutes)

**Read These**:
1. ✅ `knowledge/11_bima_integration.md` (30 min)

**You'll Learn**:
- What BIMA is (St. Kitts Social Security Board system)
- How C3 Wizard integrates with BIMA
- What data is sent to BIMA
- What data is received from BIMA

**Test Yourself**:
- Can you import employees from BIMA? (Yes)
- What happens when you submit C3? (Posted to BIMA optionally)

---

### **Phase 8: UI/UX & Validation** (30 minutes)

**Read These**:
1. ✅ `knowledge/09_ui_ux_standards.md` (15 min)
2. ✅ `knowledge/16_validation_rules.md` (15 min)

**You'll Learn**:
- What the system should look like (mint green theme)
- What error messages should say
- What field validations exist
- How forms should behave

**Test Yourself**:
- What's the primary color? (#10b981 mint green)
- What SSN format is required? (XXX-XX-XXXX)
- What's minimum password length? (8 characters)

---

### **Phase 9: Database Optimization** (30 minutes)

**Read These**:
1. ✅ `knowledge/20_database_optimization_guide.md` (30 min)

**You'll Learn**:
- What was wrong with original database
- How Lovable should optimize it
- What to check in optimized database

**Test Yourself**:
- Should table names be camelCase or snake_case? (snake_case)
- Should tables have c3_ prefix? (Yes)

---

## 📋 TOTAL TIME INVESTMENT

| Phase | Time | Priority |
|-------|------|----------|
| 1. System Overview | 30 min | High |
| 2. User Roles | 45 min | High |
| 3. C3 Generation | 1 hour | CRITICAL |
| 4. Calculations | 1.5 hours | CRITICAL |
| 5. Database | 1 hour | Medium |
| 6. Payments | 45 min | High |
| 7. BIMA | 30 min | Medium |
| 8. UI/Validation | 30 min | Medium |
| 9. Optimization | 30 min | Low |
| **TOTAL** | **~6 hours** | |

---

## 🎯 RECOMMENDED SCHEDULE

### **Day 1** (2 hours):
- Morning: Phase 1 + 2 (System + Roles) - 1.25 hours
- Evening: Phase 3 (C3 Generation) - 1 hour

### **Day 2** (2.5 hours):
- Morning: Phase 4 (Calculations) - 1.5 hours 🔥
- Evening: Phase 5 + 6 (Database + Payments) - 1.75 hours

### **Day 3** (1.5 hours):
- Morning: Phase 7 + 8 + 9 (BIMA + UI + Optimization) - 1.5 hours

**Total**: 3 days, ~6 hours spread out

---

## ✅ MASTERY CHECKLIST

**After completing the learning path, you should be able to answer**:

### **Business Questions**:
- [ ] What is C3 Wizard used for?
- [ ] Who are the users?
- [ ] What problem does it solve?
- [ ] What is St. Kitts & Nevis Social Security?

### **Functional Questions**:
- [ ] How does an employer add an employee?
- [ ] How does an employer generate a C3 form?
- [ ] What's the difference between Draft and Submit?
- [ ] How are payments processed?
- [ ] What is BIMA and how does it integrate?

### **Technical Questions**:
- [ ] How is SS calculated?
- [ ] What is the SS cap?
- [ ] How is Levy calculated? (Progressive!)
- [ ] What is December bonus exemption?
- [ ] What is age exemption for SS?
- [ ] How is holiday pay distributed?

### **Database Questions**:
- [ ] What tables exist?
- [ ] Where are employees stored?
- [ ] Where are C3 forms stored?
- [ ] Where are rates stored?
- [ ] What is RLS?

### **Testing Questions**:
- [ ] What should I test first?
- [ ] What are critical test scenarios?
- [ ] What are edge cases?
- [ ] How do I verify calculations are correct?

---

## 📝 QUICK REFERENCE CHEAT SHEET

**After reading, create your own cheat sheet with**:

1. **User Roles**:
   - Admin: Can do X, Y, Z
   - Employer: Can do A, B, C
   - Self-Employed: Can do P, Q, R

2. **Calculations**:
   - SS: Employee 5% (cap $750), Employer 5% (no cap)
   - EI: Both 1% (both capped)
   - Levy: Employee progressive, Employer 3%
   - PE: Both 5%

3. **Special Rules**:
   - December bonus exempt if YTD < $28k
   - Age 16-62 for SS
   - Holiday pay distributed to non-working weeks

4. **Key Tables**:
   - c3_users → Users
   - c3_employees → Employees
   - c3_contribution_headers → C3 forms
   - c3_contribution_details → Calculations
   - c3_payments → Payments

---

## 🚀 AFTER LEARNING

**You'll be ready to**:
1. ✅ Test Lovable's recreation thoroughly
2. ✅ Find gaps between original and new system
3. ✅ Answer any questions about C3 Wizard
4. ✅ Validate calculations are 100% correct
5. ✅ Present the system to stakeholders confidently

---

**Start with Phase 1 today, Kalash!** 🎯

**Questions? I'm here to help!** 😊
