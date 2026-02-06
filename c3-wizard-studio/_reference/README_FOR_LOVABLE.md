# 🎯 C3 Wizard - Complete Knowledge Base for Lovable AI

**Project**: St. Kitts & Nevis Social Security Contribution Management System  
**Version**: 1.0 - Production Ready  
**Documentation Status**: 95% COMPLETE  
**Ready to Build**: ✅ YES

---

## 📖 FOR LOVABLE AI: HOW TO USE THIS KNOWLEDGE BASE

### **You Are Building**:
A complete web application for employers and self-employed individuals in St. Kitts & Nevis to manage social security contributions.

### **Key Requirement**:
**100% accurate calculations** - This is a regulatory compliance system. Calculation accuracy is CRITICAL.

---

## 🗂️ DOCUMENTATION STRUCTURE

### **📄 Start Here**
1. **`system.json`** → Your configuration file (read this FIRST)
2. **`LOVABLE_KNOWLEDGE_CONTEXT.md`** → Quick reference rules (already in your Instructions field)
3. **`FIRST_PROMPT_FOR_LOVABLE.md`** → Initial implementation tasks

### **📚 Knowledge Files** (knowledge/)
**These contain ALL technical implementation details:**

| Priority | File | What It Contains |
|----------|------|------------------|
| 🔥🔥🔥 | `05_contribution_calculations.md` | **ALL calculation formulas - READ THIS FIRST** |
| ⭐⭐⭐ | `04_database_schema.md` + `part2.md` | Complete database structure (45+ tables) |
| ⭐⭐⭐ | `03_user_roles_permissions.md` | RLS policies, role definitions |
| ⭐⭐ | `16_validation_rules.md` | All field validations & error messages |
| ⭐⭐ | `11_bima_integration.md` | BIMA API complete specs |
| ⭐⭐ | `09_ui_ux_standards.md` | Mint green theme, component library |
| ⭐ | `01_purpose_scope.md` | Project overview |
| ⭐ | `02_system_architecture.md` | Tech stack, folder structure |
| 📋 | `00_index.md` | Table of contents |
| 📋 | `13_complete_table_list.md` | Table name mapping reference |

### **📋 PRD Files** (PRDs/)
**Feature specifications organized by module:**

| File | Module | Priority |
|------|--------|----------|
| `00_MAIN_PRD.md` | Master index | ⭐⭐⭐ Read first |
| `01_user_management.md` | Auth & registration | ⭐⭐⭐ Phase 1 |
| `03_c3_generation.md` | C3 form (core feature) | ⭐⭐⭐ Phase 2 |
| `04_payment_processing.md` | Payments (online + offline) | ⭐⭐ Phase 3 |
| `LOVABLE_QUICK_START_GUIDE.md` | Implementation guide | ⭐⭐ Reference |

---

## 🎯 IMPLEMENTATION PHASES

### **Phase 1: Foundation** (Build First)
**Files to read**:
- `knowledge/04_database_schema*.md` → Create all tables
- `knowledge/03_user_roles_permissions.md` → Set up RLS
- `PRDs/01_user_management.md` → Build auth

**What to build**:
1. Database schema (all `c3_*` tables)
2. Row Level Security policies
3. User registration & login
4. Email verification (OTP)

### **Phase 2: Core Features** (Build Second)
**Files to read**:
- `knowledge/05_contribution_calculations.md` → **READ CAREFULLY** 🔥
- `PRDs/03_c3_generation.md` → C3 form specs
- `knowledge/16_validation_rules.md` → Field validations

**What to build**:
1. Employee management (CRUD)
2. C3 form generation wizard
3. **Calculation engine** (CRITICAL - test thoroughly!)
4. Holiday pay & bonus management

### **Phase 3: Integration** (Build Third)
**Files to read**:
- `knowledge/11_bima_integration.md` → BIMA API
- `PRDs/04_payment_processing.md` → Payments

**What to build**:
1. BIMA employee import
2. BIMA C3 submission
3. Payment processing (CyberSource, PayPal, offline)
4. Receipt generation

### **Phase 4: Polish** (Build Last)
**Files to read**:
- `knowledge/09_ui_ux_standards.md` → UI theme

**What to build**:
1. Reports & exports
2. Admin features
3. UI refinements
4. Email notifications

---

## 🔴 CRITICAL RULES (NEVER FORGET)

### **1. Calculations**
```
⚠️ DO NOT code calculation formulas yourself
⚠️ ALWAYS read from knowledge/05_contribution_calculations.md
⚠️ Test with provided test cases before deploying

Critical rules:
- SS employee has $750/month cap
- December bonus: EXEMPT from employee levy if YTD < $28k
- Holiday pay: Distribute to non-working weeks only
- Age < 16 or ≥ 62: No SS contributions
- Employer levy INCLUDES bonuses
```

### **2. Database**
```
✅ snake_case naming (c3_users, NOT c3Users)
✅ c3_ prefix for ALL tables
✅ Add audit columns to EVERY table:
  created_at, created_by, updated_at, updated_by, is_deleted
✅ Soft delete ONLY (UPDATE is_deleted = TRUE, never DELETE)
```

### **3. Security**
```
✅ Row Level Security on ALL tables
✅ Employers see ONLY their company data
✅ Self-Employed see ONLY their data
✅ Admins see ALL data
```

### **4. Rates are NOT Hardcoded**
```
⚠️ Rates shown in system.json are EXAMPLE VALUES only
⚠️ Actual rates are fetched from c3_system_rates table
⚠️ Admins can update rates via Admin panel
```

---

## 🧪 VALIDATION TEST CASES

**Before deploying, verify these scenarios**:

| Test | Input | Expected Output |
|------|-------|----------------|
| **Cap Test** | Wages $20k/month | SS Employee = **$750** (capped, not $1,000) |
| **Dec Bonus** | Month=Dec, YTD=$25k, Bonus=$1k | Employee levy on bonus = **$0** (exempt) |
| **Age Exempt** | Age 63, Wages $2k | SS Employee = **$0**, SS Employer = **$0** |
| **Holiday Dist** | Holiday $200, Weeks 2&4 not worked | Add **$100** to Week 2, **$100** to Week 4 |

**Detailed test cases**: See `knowledge/05_contribution_calculations.md`

---

## 🎨 UI/UX STANDARDS

**Primary Color**: Mint Green `#10b981`

**Component Library**: shadcn/ui (do NOT build custom components)

**Design Principles**:
- Clean, modern, professional
- Card-based layouts
- Generous spacing (24px padding)
- Mobile-first responsive
- WCAG 2.1 AA accessible

**See**: `knowledge/09_ui_ux_standards.md` for complete design system

---

## 📁 QUICK FILE REFERENCE

**Need calculation formulas?**
→ `knowledge/05_contribution_calculations.md`

**Need database table structure?**
→ `knowledge/04_database_schema.md` + `part2.md`

**Need validation rules?**
→ `knowledge/16_validation_rules.md`

**Need BIMA API specs?**
→ `knowledge/11_bima_integration.md`

**Need UI components?**
→ `knowledge/09_ui_ux_standards.md`

**Need RLS policies?**
→ `knowledge/03_user_roles_permissions.md`

---

## ⚠️ COMMON PITFALLS TO AVOID

1. ❌ Hardcoding contribution rates (fetch from `c3_system_rates` table)
2. ❌ Hard deleting records (always soft delete with `is_deleted = TRUE`)
3. ❌ Using camelCase in database (always `snake_case`)
4. ❌ Skipping RLS policies (security requirement)
5. ❌ Guessing calculation formulas (read from knowledge file)
6. ❌ Inventing error messages (use exact wording from `16_validation_rules.md`)
7. ❌ Cross-company data access (enforce RLS)
8. ❌ Forgetting December bonus exemption (critical compliance rule)

---

## 🚀 GETTING STARTED

### **Step 1**: Read These First
1. `system.json` (configuration)
2. `knowledge/02_system_architecture.md` (project structure)
3. `PRDs/00_MAIN_PRD.md` (feature overview)

### **Step 2**: Build Phase 1 (Foundation)
1. Create database tables from `knowledge/04_database_schema*.md`
2. Set up RLS policies from `knowledge/03_user_roles_permissions.md`
3. Build auth from `PRDs/01_user_management.md`

### **Step 3**: Build Phase 2 (Core Features)
1. **READ** `knowledge/05_contribution_calculations.md` carefully 🔥
2. Build C3 generation from `PRDs/03_c3_generation.md`
3. **TEST** calculations thoroughly

### **Step 4**: Build Remaining Phases
Follow phase order above

---

## ✅ SUCCESS CRITERIA

Your implementation is successful when:

1. ✅ All calculations are 100% accurate (verified with test cases)
2. ✅ RLS policies prevent unauthorized data access
3. ✅ All three user roles work correctly
4. ✅ BIMA API integration is functional
5. ✅ Payment processing works (online + offline)
6. ✅ UI matches mint green theme
7. ✅ Mobile-responsive on all screens

---

## 📞 WHEN IN DOUBT

**Always check the knowledge files first!**

If something is unclear:
1. Search for the topic in `knowledge/00_index.md`
2. Read the relevant knowledge file
3. If still unclear, ask for clarification

**NEVER guess or assume** - this is a regulatory compliance system.

---

## 🎊 YOU'RE READY TO BUILD!

**You have**:
- ✅ 95% complete documentation
- ✅ 100% calculation formulas documented
- ✅ Complete database schema (45+ tables)
- ✅ Full BIMA API specs
- ✅ Comprehensive validation rules
- ✅ Complete UI/UX design system

**Quality**: Production-ready, regulatory-compliant

**Start with**: Phase 1 (Database + Auth)

**Most Critical File**: `knowledge/05_contribution_calculations.md` 🔥

---

**Good luck! Build this system with precision and care.** 💪

**Last Updated**: January 22, 2026  
**Total Documentation**: 32+ files, ~8,000 lines  
**Status**: Production-Ready ✅
