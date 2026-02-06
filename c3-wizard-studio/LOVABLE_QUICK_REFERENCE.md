# 🎯 LOVABLE QUICK REFERENCE CARD

**Print this and keep it beside you while working with Lovable**

---

## 📋 IMPLEMENTATION SEQUENCE (MUST FOLLOW IN ORDER)

```
┌─────────────────────────────────────────────────┐
│ PHASE 1: SETUP & KNOWLEDGE (Day 1 Morning)     │
├─────────────────────────────────────────────────┤
│ Step 1: Upload knowledge files                  │
│ Step 2: Correct calculation ($18,720)           │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 2: AUTHENTICATION (Day 1 Afternoon)      │
├─────────────────────────────────────────────────┤
│ Step 3: Build auth system                       │
│ Step 4: Test login/register                     │
│ ⚠️ DON'T PROCEED UNTIL AUTH WORKS!             │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 3: EMPLOYER REGISTRATION (Day 2 AM)      │
├─────────────────────────────────────────────────┤
│ Step 5: Employer registration + BIMA           │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 4: DASHBOARD (Day 2 PM)                  │
├─────────────────────────────────────────────────┤
│ Step 6: Dashboard + dynamic menu                │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 5: EMPLOYEE MANAGEMENT (Day 3)           │
├─────────────────────────────────────────────────┤
│ Step 7: Employee CRUD + BIMA import             │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 6: C3 PAYROLL (Day 4-5) ⭐ CRITICAL!     │
├─────────────────────────────────────────────────┤
│ Step 8: C3 form + calculation engine            │
│ ⚠️ TEST ALL 5 CALCULATION TEST CASES!          │
│ ⚠️ DON'T PROCEED UNTIL 100% MATCH!             │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 7: PAYMENTS (Day 6)                      │
├─────────────────────────────────────────────────┤
│ Step 9: Payment processing                      │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 8: REPORTS (Day 7)                       │
├─────────────────────────────────────────────────┤
│ Step 10: Reports + exports                      │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 9: SETTINGS (Day 8)                      │
├─────────────────────────────────────────────────┤
│ Step 11: Settings module                        │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ PHASE 10: TESTING (Day 9-10)                   │
├─────────────────────────────────────────────────┤
│ Step 12: End-to-end testing                     │
└─────────────────────────────────────────────────┘
```

---

## 🚨 CRITICAL REMINDERS

### ⚠️ MUST-KNOWS:

1. **$18,720 NOT $28,000** - December bonus threshold
2. **Use VERIFIED_C3_CALCULATIONS.md** - Primary source for all calculations
3. **Test calculations BEFORE moving on** - All 5 test cases must pass
4. **Fetch rates from database** - NEVER hardcode rates
5. **Calculations in Edge Functions** - NOT in frontend

---

## 📚 DOCUMENT PRIORITY

When Lovable asks for clarification, reference these in order:

1. **`_reference/VERIFIED_C3_CALCULATIONS.md`** ⭐ For calculations
2. **`_reference/LEGACY_AUTH_FLOW.md`** 🔐 For authentication
3. **`knowledge/11_bima_integration.md`** 🌐 For BIMA API
4. **`knowledge/04_database_schema.md`** 🗄️ For database structure
5. **`knowledge/23_optimised_schema_mapping.md`** 🔄 For table mappings

---

## 🧮 CALCULATION TEST CASES (MUST PASS ALL)

```javascript
TEST 1: Standard Employee
Input:  Wages=$3,200, Age=35, Bonus=$0
Output: Grand Total=$992.00

TEST 2: High Earner (Caps)
Input:  Wages=$20,000, Age=45
Output: SS Employee=$750 (capped), EI Employee=$150 (capped)

TEST 3: December Bonus (Below Threshold)
Input:  Month=12, Wages=$2,500, Bonus=$500, YTD=$15,000
Output: Levy Employee=$80 (bonus excluded)

TEST 4: December Bonus (Above Threshold)
Input:  Month=12, Wages=$2,500, Bonus=$500, YTD=$20,000
Output: Levy Employee=$150 (bonus included)

TEST 5: Age Exemption
Input:  Wages=$5,000, Age=70
Output: SS Employee=$0 (too old)
```

**If ANY test fails, STOP and fix before proceeding!**

---

## 🗄️ CRITICAL DATABASE TABLES

```
AUTHENTICATION:
├── auth.users (Supabase built-in)
├── c3_users (links to auth)
├── c3_user_profiles (user data)
└── c3_roles (role definitions)

EMPLOYER:
├── c3_companies (company master)
└── c3_user_granular_permissions (menu access)

EMPLOYEES:
└── c3_employees (employee master)

C3 CONTRIBUTIONS:
├── c3_contribution_headers (C3 form header)
├── c3_contribution_details (per-employee wages)
├── c3_system_rates (calculation rates) ⭐
└── c3_levy_tiers (progressive levy rates) ⭐

PAYMENTS:
└── c3_payments (payment records)

DECEMBER BONUS:
└── DECEMBER_BONUS_EXEMPTED_CONTRIBUTION (bonus rules)
```

---

## 🎨 UI GUIDELINES

**Color Scheme:**
- Primary: `#0b64a0` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Error: `#ef4444` (red)

**Components:**
- Use Shadcn/UI components
- Professional, modern design
- Responsive (mobile-first)
- Accessible (WCAG 2.1 AA)

**Forms:**
- Clear labels
- Inline validation
- Error messages below fields
- Success toasts

**Data Grids:**
- Sortable columns
- Search/filter
- Pagination (20 per page)
- Row actions (Edit/Delete)

---

## 🔧 COMMON LOVABLE PROMPTS

### When Lovable Makes a Mistake:
```
⚠️ This is incorrect. According to _reference/VERIFIED_C3_CALCULATIONS.md,
the formula should be: [paste correct formula]

Please update the Edge Function to match this exact logic.
```

### When You Need to See Code:
```
Please show me the complete code for the [function name] 
in the [filename] file so I can review it.
```

### When Calculation is Wrong:
```
The calculation result doesn't match the expected output.

Expected: [show expected values]
Actual: [show what Lovable produced]

Please debug the calculate-c3-contributions Edge Function and 
compare it line-by-line with VERIFIED_C3_CALCULATIONS.md.
```

### When UI Needs Improvement:
```
The UI works but needs polish. Please:
1. Add loading states during API calls
2. Show success/error toasts
3. Improve spacing and alignment
4. Make it responsive for mobile
```

---

## ✅ DAILY CHECKLIST

**At the end of each day:**

- [ ] All new features tested manually
- [ ] No console errors in browser
- [ ] All forms validate correctly
- [ ] Loading states implemented
- [ ] Error messages user-friendly
- [ ] Mobile responsive
- [ ] Code committed to Git
- [ ] Tomorrow's plan ready

---

## 🆘 TROUBLESHOOTING

**Lovable is confused:**
→ Reference specific knowledge document
→ Be very specific about what's wrong
→ Show example input/output

**Calculation is wrong:**
→ Test with the 5 test cases
→ Compare Edge Function code with VERIFIED_C3_CALCULATIONS.md
→ Check database rates and levy tiers

**BIMA integration fails:**
→ Check environment variables
→ Verify ENABLE_BIMA_INTEGRATION flag
→ Test with mock data first

**Database query error:**
→ Check table name (case-sensitive in Supabase)
→ Verify RLS policies
→ Check column names match schema

---

## 📞 EMERGENCY CONTACTS

**If completely stuck:**
1. Re-read the LOVABLE_STEP_BY_STEP_GUIDE.md
2. Check the specific step you're on
3. Reference the knowledge document for that module
4. Ask Lovable to explain its logic
5. Break the problem into smaller pieces

---

**REMEMBER:**
🎯 Follow the steps in order
🧮 Test calculations thoroughly
📚 Reference the right documents
✅ Complete each phase before moving on
🚨 Don't skip authentication or calculation testing!

---

**Good luck! 🚀**

**You've got this!** Follow the guide, trust the process, and you'll have a working C3 Wizard Employer Module.

---

**Created**: February 5, 2026  
**For**: C3 Wizard Recreation Project  
**Reference**: LOVABLE_STEP_BY_STEP_GUIDE.md
