# 🚀 FIRST PROMPT FOR LOVABLE AI

**COPY THIS PROMPT AND PASTE IT AS YOUR FIRST MESSAGE TO LOVABLE**

---

Hi Lovable! I need you to build the **C3 Wizard Social Security Contribution Management System** for St. Kitts & Nevis.

## 🎯 PROJECT OVERVIEW

**What**: Social Security Contribution Management System  
**For**: St. Kitts & Nevis employers and self-employed individuals  
**Tech Stack**: React 18 + TypeScript + Supabase (PostgreSQL) + Tailwind + shadcn/ui  
**Theme**: Mint green (#10b981) - clean, modern, professional design

**🔴 MANAGER'S CRITICAL DIRECTIVES**:
1. ⚠️ **Database Optimization**: Current database is poorly organized. OPTIMIZE structure (naming, normalization, relationships) while keeping 100% functionality.
2. 📚 **User Manual Screen Replication**: Use 3 PDF manuals to replicate exact screens with modern UI.

**User Manuals** (in `_reference/` or attached):
- `C3 Wizard Admin Portal User Manual (1) 1.pdf`
- `C3 Wizard Employer Portal User Manual (1) 1.pdf`
- `C3 Wizard Self-Employee User Manual (1) 1.pdf`

## 📚 KNOWLEDGE BASE

I have provided you with a complete knowledge base. **BEFORE YOU START, please confirm you have read**:

1. **LOVABLE_KNOWLEDGE_CONTEXT.md** - Master instructions (database optimization + PDF references) 🔥
2. **system.json** - Complete system configuration
3. **knowledge/00_index.md** - Knowledge base index
4. **knowledge/01_purpose_scope.md** - System overview
5. **knowledge/02_system_architecture.md** - Technical architecture
6. **knowledge/03_user_roles_permissions.md** - User roles (Admin, Employer, Self-Employed)
7. **knowledge/05_contribution_calculations.md** - 🔥 CRITICAL: All calculation formulas
8. **knowledge/09_ui_ux_standards.md** - Design system (mint green theme)
9. **PRDs/00_MAIN_PRD.md** - Master Product Requirements Document
10. **README.md** - Complete deliverables summary
11. **User Manual PDFs** - Screen-by-screen layouts

## ⚠️ CRITICAL RULES (NEVER FORGET)

1. **Three User Roles**: Admin, Employer, Self-Employed (each with distinct capabilities)
2. **Contribution Calculations MUST BE EXACT**:
   - Employee SS/EI/PE have maximum caps
   - Employer levy = (wages + bonuses) × 3% (bonuses are included!)
   - Employee levy is progressive (0-5% based on wage tiers)
   - December bonus exemption (if YTD < $28k)
   - Age exemption for SS (16-62 only)
   - Director auto-wage calculation
   - Holiday pay distribution
3. **Database Naming**: All tables prefixed with `c3_` (e.g., `c3_users`, `c3_employees`)
4. **Row Level Security**: Enforce data isolation (employers see only their company, self-employed see only their own data)
5. **UI Theme**: Mint green (#10b981) primary color, shadcn/ui components, mint green navbar
6. **Soft Delete**: Use `is_deleted` flag (never hard delete)

## 🚀 LET'S START - PHASE 1: DATABASE SCHEMA & AUTHENTICATION

For our first step, I need you to:

### Task 1: Create Complete Supabase Database Schema

Create the following tables with Row Level Security (RLS) policies:

1. **c3_users** - User accounts (admin, employer, self_employed roles)
2. **c3_companies** - Employer company information
3. **c3_employees** - Employee records
4. **c3_self_employed_profiles** - Self-employed profiles
5. **c3_contribution_headers** - C3 form headers
6. **c3_contribution_details** - Individual employee contributions
7. **c3_payments** - Payment transactions
8. **c3_payment_reconciliation** - Payment reconciliation records
9. **c3_system_rates** - Contribution rates and caps (SS, EI, Levy, PE)
10. **c3_audit_logs** - System audit trail

**Required for each table**:
- Soft delete: `is_deleted` boolean column
- Audit columns: `created_at`, `updated_at`, `created_by`, `updated_by`
- Appropriate RLS policies (reference `knowledge/03_user_roles_permissions.md`)

### Task 2: Authentication Setup

Set up Supabase Auth with:
- Email/password authentication
- Email verification
- Password reset flow
- Optional: Email OTP for MFA

### Task 3: Initial UI Setup

Create the basic app structure:
- Login page (mint green theme, centered card design)
- Registration page (for Employer and Self-Employed)
- Dashboard layout with:
  - Mint green navbar (gradient background)
  - White sidebar with icons
  - Main content area
- Route structure for three user roles

## 🎨 DESIGN REFERENCE

**Primary Color**: #10b981 (Mint Green)  
**Hover Color**: #059669  
**Font**: Inter  
**Components**: Use shadcn/ui  
**Style**: Card-based, clean, modern, professional

Reference the uploaded screenshot (logo.png) for branding inspiration.

## ✅ WHAT I EXPECT TO SEE

After this first task, I should have:

1. ✅ Complete Supabase database schema (SQL file or migration)
2. ✅ RLS policies for each table
3. ✅ Working login page (mint green theme)
4. ✅ Working registration for Employer and Self-Employed
5. ✅ Basic dashboard layout (navbar + sidebar)
6. ✅ Role-based routing (admin, employer, self-employed routes)

## 🧪 HOW TO VALIDATE

Test that:
- Users can register as Employer or Self-Employed
- Users can login
- RLS policies prevent cross-company data access
- Dashboard shows correct navigation based on role

## 📋 AFTER THIS PHASE

Once Phase 1 is complete and working, we'll move to:
- **Phase 2**: Employer features (employee management)
- **Phase 3**: C3 form generation with calculations (CRITICAL)
- **Phase 4**: Payment processing
- **Phase 5**: Admin features and polish

---

**IMPORTANT**: Before you start coding, please confirm:
1. You have read all the knowledge files I mentioned above
2. You understand the three user roles
3. You understand the database naming convention (c3_ prefix)
4. You understand the mint green theme (#10b981)

If you have any questions about the requirements, **ask me before implementing**. Precision is critical for this regulatory-compliance system.

Ready to start? Let's build the foundation! 🚀
