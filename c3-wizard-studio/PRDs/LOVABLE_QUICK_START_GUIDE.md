# 🚀 Quick Start Guide: Using This Knowledge Base with Lovable AI

**Purpose**: This guide explains how to use the C3 Wizard knowledge base and PRDs with Lovable AI to build the system efficiently.

---

## 📁 What You Have

Your C3 Wizard project now includes:

### 1. `/knowledge` - Complete Knowledge Base (20 modules)
Modular documentation covering every aspect of the system:
- System overview, architecture, and roles
- Complete database schema
- All calculation formulas with examples
- Business rules and workflows
- UI/UX design system
- API contracts and security

### 2. `/PRDs` - Product Requirement Documents
- **00_MAIN_PRD.md**: Master PRD with complete specifications
- **logo.png**: Your company logo for branding

### 3. `system.json` - Lovable Configuration
Complete system configuration including:
- Architecture definition (Supabase → ASP.NET Core migration path)
- User roles and capabilities
- Contribution calculation components
- UI theme (mint green #10b981)
- Payment integration settings
- Feature flags

---

## 🎯 How to Use with Lovable AI

### Step 1: Upload Knowledge Base to Lovable

1. **Log in to Lovable AI** (https://lovable.dev)
2. **Create New Project**: "C3 Wizard"
3. **Upload system.json**:
   - Click "Upload System Config"
   - Select `system.json`
   - This sets the foundation for your project

4. **Upload Knowledge Files**:
   - Go to "Knowledge Base" section
   - Upload ALL files from `/knowledge` folder
   - **Order doesn't matter** - Lovable will index them

5. **Upload PRD**:
   - Upload `PRDs/00_MAIN_PRD.md`
   - This becomes your master reference

---

### Step 2: First Prompt to Lovable

Start with this initial prompt:

```
I need you to build the C3 Wizard Social Security Contribution Management System for St. Kitts & Nevis.

CRITICAL INSTRUCTIONS:
1. Read ALL knowledge base files I've uploaded before starting
2. Follow system.json configuration exactly
3. Use the Main PRD (00_MAIN_PRD.md) as your master reference
4. Implement using React + TypeScript + Supabase + shadcn/ui
5. Use the mint green theme (#10b981) defined in 09_ui_ux_standards.md

NEVER FORGET:
- Three user roles: Admin, Employer, Self-Employed
- Contribution calculations MUST be exact (see 05_contribution_calculations.md)
- Apply maximum caps where specified
- Implement all special rules (bonus exemption, holiday pay, director wages)
- Use Row Level Security for data isolation

Let's start with Phase 1: Database Schema and Authentication.

Create the complete Supabase database schema with:
1. All tables from 04_database_schema.md
2. RLS policies for each role
3. Auth setup with email/password + OTP

Show me the SQL schema first, then I'll approve before proceeding.
```

---

### Step 3: Iterative Development

Work through the system in phases:

#### **Phase 1: Foundation**
```
Prompt: "Create the authentication system with:
- Login page (mint green theme)
- Registration for Employer and Self-Employed
- Password reset flow
- Email OTP verification
Reference: 09_ui_ux_standards.md for design, 03_user_roles_permissions.md for roles"
```

#### **Phase 2: Employer Features**
```
Prompt: "Build the Employer dashboard and employee management:
- Dashboard with company overview
- Employee list (add, edit, delete)
- Import from Excel
Reference: 07_user_workflows.md for flows, 09_ui_ux_standards.md for UI"
```

#### **Phase 3: C3 Form Generation**
```
Prompt: "Implement C3 form generation workflow:
- Multi-step form (Employee Selection → Wage Entry → Review → Submit)
- Auto-calculate contributions using formulas from 05_contribution_calculations.md
- Apply ALL special rules (caps, exemptions, bonus logic, holiday pay)
- Save as draft or submit
CRITICAL: Reference 05_contribution_calculations.md for exact formulas"
```

#### **Phase 4: Payment Processing**
```
Prompt: "Add payment processing:
- CyberSource integration (primary)
- PayPal integration (alternative)
- Offline payment entry
- Receipt generation (PDF)
Reference: 10_payment_processing.md"
```

#### **Phase 5: Admin Features**
```
Prompt: "Build admin panel:
- User management
- Payment reconciliation
- Rate configuration
- System reports
Reference: 03_user_roles_permissions.md for admin capabilities"
```

---

### Step 4: Calculation Validation

**CRITICAL**: After Lovable implements calculations, validate with these test cases:

```
Prompt: "Let's validate the contribution calculations. Test these scenarios:

Test 1: Basic Employee
- Wages: $2,000/month (all 4 weeks worked)
- Age: 30
- No bonus, no holiday pay
Expected results:
- SS Employee: $2,000 × 5% = $100 (below cap)
- SS Employer: $2,000 × 5% = $100
- EI Employee: $2,000 × 1% = $20
- EI Employer: $2,000 × 1% = $20
- Levy Employee: Calculate using progressive tiers
- Levy Employer: $2,000 × 3% = $60
- PE Employee: $2,000 × 5% = $100
- PE Employer: $2,000 × 5% = $100

Test 2: High-Wage Employee (Test Caps)
- Wages: $20,000/month
- Expected: SS Employee capped at max ($750), EI capped, etc.

Test 3: December Bonus with YTD < $28,000
- Month: December
- Wages: $2,000
- Bonus: $500
- YTD: $25,000
- Expected: Bonus EXCLUDED from employee levy, INCLUDED in employer levy

Run all calculations and show me the results."
```

---

## ⚠️ Critical Reminders for Lovable

Include these in your prompts to keep Lovable on track:

### 🔴 NEVER FORGET:
```
CRITICAL RULES (repeat in every major prompt):
1. Use EXACT field names from 04_database_schema.md (c3_users, c3_employees, etc.)
2. Apply maximum caps on SS Employee, EI Employee/Employer, PE Employee
3. Employee levy is PROGRESSIVE (0-5% based on wage tiers)
4. Employer levy is 3% of (wages + bonuses)
5. December bonus exemption: If YTD < $28k, exclude bonus from EMPLOYEE levy only
6. Age exemption for SS: < 16 or > 62 = $0
7. Use mint green (#10b981) theme from 09_ui_ux_standards.md
8. Implement RLS policies (company-scoped for employers, user-scoped for self-employed)
```

---

## 🎨 UI/UX Reminders

When building UI components:

```
Prompt: "Build the [component name] following these design rules:
- Color: Mint green primary (#10b981), hover (#059669)
- Layout: Card-based with subtle shadows, 24px padding
- Typography: Inter font, clear hierarchy
- Buttons: Rounded corners (8px), hover lift effect
- Forms: Inline validation, red error text with icons
- Tables: Sortable, searchable, paginated
- Reference: 09_ui_ux_standards.md for complete design system
```

---

## 🧪 Testing Prompts

After each feature implementation:

```
Prompt: "Let's test the [feature name]:
1. Show me the happy path (normal workflow)
2. Test error cases:
   - Empty fields
   - Invalid data (negative wages, invalid SSN)
   - Permission errors (employer accessing another company's data)
3. Test edge cases:
   - Zero wages
   - 5-week month
   - Multiple employees with special rules
```

---

## 📋 Checklist: Before Calling Feature "Done"

For each feature, ensure:

✅ **Functionality**
- [ ] All user workflows work end-to-end
- [ ] Calculations are exactly correct (validated against test cases)
- [ ] Data saves to database correctly
- [ ] RLS policies prevent unauthorized access

✅ **UI/UX**
- [ ] Matches mint green theme
- [ ] Responsive (works on mobile, tablet, desktop)
- [ ] Loading states shown during async operations
- [ ] Error messages are user-friendly
- [ ] Success toasts after actions

✅ **Security**
- [ ] Auth required for all protected routes
- [ ] RLS policies tested (employers can't see other companies)
- [ ] Sensitive fields encrypted (SSN, payment tokens)

✅ **Quality**
- [ ] No console errors
- [ ] Fast performance (< 2 second page loads)
- [ ] Accessible (keyboard navigation, ARIA labels)

---

## 🔧 Troubleshooting Lovable

### If Lovable "Forgets" Context:

**Symptoms**: Lovable starts using wrong table names, ignoring caps, using wrong colors

**Solution**: Re-anchor with this prompt:
```
STOP. Let's reset context.

Read these knowledge files again:
- 04_database_schema.md (for table names)
- 05_contribution_calculations.md (for formulas and caps)
- 09_ui_ux_standards.md (for design)

Reminder of critical rules:
1. Tables: c3_users, c3_employees, c3_contribution_headers (snake_case, c3_ prefix)
2. Caps: SS Employee max $750, EI Employee/Employer max $150, PE Employee max $750
3. Colors: Primary #10b981, hover #059669
4. Employer levy includes bonuses: (wages + bonuses) × 3%

Now, let's continue with [feature name].
```

### If Calculations Are Wrong:

```
The calculation is incorrect. Let me show you the exact formula from 05_contribution_calculations.md:

[Paste the specific formula from the knowledge base]

Please recalculate and show me:
1. Input values
2. Step-by-step calculation
3. Final result

Expected result for this test case is [X]. Your result was [Y]. Fix this.
```

---

## 🎯 Suggested Development Order

Build in this order for best results:

1. **Week 1**: Database + Auth
   - Schema, RLS policies
   - Login, registration
   - Password reset

2. **Week 2**: Employer - Employees
   - Dashboard layout
   - Employee CRUD
   - Import from Excel

3. **Week 3-4**: C3 Form Generation
   - Multi-step wizard
   - Wage entry
   - **Calculation engine (MOST CRITICAL)**
   - Review & submit

4. **Week 5**: Self-Employed
   - Profile management
   - Self-contribution C3 forms

5. **Week 6**: Payments
   - CyberSource integration
   - PayPal integration
   - Offline payment entry

6. **Week 7**: Admin
   - User management
   - Reconciliation
   - Rate configuration

7. **Week 8**: Polish
   - Email notifications
   - PDF generation
   - Reports
   - UI refinements

---

## 💡 Pro Tips

### 1. Be Specific
❌ Bad: "Build the dashboard"
✅ Good: "Build the Employer dashboard with 4 stat cards (Total Employees, Pending C3s, Total Contributions This Month, Payment Status) and a recent activity table. Use mint green stat cards with gradient background. Reference 09_ui_ux_standards.md for stat card design."

### 2. Reference Knowledge Files
Always tell Lovable which knowledge file to reference:
- "Reference 05_contribution_calculations.md for formulas"
- "Use UI components from 09_ui_ux_standards.md"
- "Follow workflow from 07_user_workflows.md"

### 3. Validate Incrementally
Don't build everything then test. Test each piece:
- Built employee form? → Test add/edit/delete
- Built calculations? → Test with 10 different scenarios
- Built payment? → Test all 3 gateways

### 4. Use Test Data
Create realistic test data:
```
Prompt: "Create seed data:
- 1 admin user (admin@example.com / password123)
- 3 employer companies with 5 employees each
- 2 self-employed users
- Mix of ages (some < 16, some > 62 for SS exemption testing)
- Various wage levels (some exceeding caps)
- Mix of levy-exempt and regular employees
```

---

## 🚨 Emergency Reset

If Lovable goes completely off track:

```
FULL RESET. Disregard previous conversation.

I'm building C3 Wizard - a Social Security Contribution System for St. Kitts & Nevis.

Tech stack:
- Frontend: React + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase (PostgreSQL)
- Theme: Mint green (#10b981)

I have uploaded a complete knowledge base. Please:
1. Read ALL files in /knowledge folder
2. Read PRDs/00_MAIN_PRD.md
3. Read system.json

Confirm you have read and understood:
- 3 user roles (Admin, Employer, Self-Employed)
- 8 contribution components (SS, EI, Levy, PE for Employee + Employer)
- Caps on SS Employee, EI Both, PE Employee
- Special rules (bonus exemption, holiday pay, director wages, age exemption)

Once confirmed, let's start fresh with [specific feature].
```

---

## 📞 Need Help?

If you encounter issues:

1. **Check Knowledge Base**: Answer is usually in one of the 20 knowledge files
2. **Check Main PRD**: `PRDs/00_MAIN_PRD.md` has high-level overview
3. **Check system.json**: Configuration reference
4. **Re-anchor Lovable**: Use "STOP. Let's reset context" prompt above

---

**Remember**: The knowledge base is comprehensive. If Lovable gets something wrong, it's usually because it forgot context. Re-reference the specific knowledge file and it will get back on track!

---

**Good luck building C3 Wizard! You have everything you need for success.** 🚀
