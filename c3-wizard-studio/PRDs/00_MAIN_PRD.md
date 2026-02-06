# C3 Wizard - Master PRD

**Version**: 2.0 (Modular Structure)  
**Last Updated**: January 22, 2026  
**Project**: St. Kitts & Nevis Social Security Contribution Management System

---

## 📋 Project Overview

**Purpose**: Recreate C3 Wizard as a modern web application for managing social security contributions in St. Kitts & Nevis.

**Target**: 100% functional replica with improved UI/UX

**Tech Stack**: React 18 + TypeScript + Supabase (PostgreSQL)

**Migration Path**: Supabase → ASP.NET Core + MS-SQL Server (Phase 2)

---

## 🎯 Target Users

1. **Administrator** - Social Security Board staff
2. **Employer** - Business owners, HR managers
3. **Self-Employed** - Freelancers, contractors

---

## 📁 Feature Modules (Detailed PRDs)

### 1. User Management & Authentication
**📄 See**: `PRDs/01_user_management.md`

**Features**:
- User registration (Employer, Self-Employed)
- Email verification with OTP
- Login/logout
- Password reset
- Optional MFA
- Security questions
- Admin user management

---

### 2. Employee Management
**📄 See**: `PRDs/02_employee_management.md`

**Features**:
- Add/Edit/Delete employees
- Import from BIMA API
- Employee list with search/filter
- Pay period configuration
- Employment dates tracking

---

### 3. C3 Form Generation
**📄 See**: `PRDs/03_c3_generation.md`

**Features**:
- Multi-step C3 form wizard
- Wage entry (weekly breakdown)
- Holiday pay management
- Bonus management
- Auto-calculation engine
- Preview before submit
- Save as draft
- Nil return support

---

### 4. Payment Processing
**📄 See**: `PRDs/04_payment_processing.md`

**Features**:
- CyberSource integration (credit/debit cards)
- PayPal integration
- Offline payments (check, cash, bank transfer, journal voucher)
- Payment receipts (PDF generation)
- Payment history

---

### 5. Reporting & Exports
**📄 See**: `PRDs/05_reporting.md`

**Features**:
- C3 submission history
- Payment reports
- Contribution summaries
- Employee contribution reports
- Export to PDF/Excel
- Date range filtering

---

### 6. Admin Features
**📄 See**: `PRDs/06_admin_features.md`

**Features**:
- Rate configuration (SS, EI, Levy, PE rates)
- Levy tier management
- User management (approve/suspend)
- Payment reconciliation
- System audit logs
- Company management

---

### 7. Self-Employed Module
**📄 See**: `PRDs/07_self_employed.md`

**Features**:
- Self-employed registration
- Income entry
- Contribution calculation
- C3 submission
- Payment processing

---

### 8. Email Notifications
**📄 See**: `knowledge/12_email_notifications.md`

**Features**:
- Registration verification (OTP)
- Password reset
- Payment receipts (with PDF)
- Admin notifications
- Account activation
- Integration via Supabase Edge Functions + SendGrid

---

## 🔗 Cross-Cutting Concerns

### Security
**📄 See**: `knowledge/03_user_roles_permissions.md`
- Row Level Security (RLS)
- JWT authentication
- Email OTP for MFA
- Audit logging

### Calculations
**📄 See**: `knowledge/05_contribution_calculations.md`
- Social Security formulas
- Levy calculations (progressive tiers)
- Severance Pay calculations
- Special rules (caps, exemptions, bonuses)

### Database
**📄 See**: `knowledge/04_database_schema.md` + `part2.md`
- Complete schema (45+ tables)
- RLS policies
- Audit columns pattern
- Soft delete pattern

### UI/UX
**📄 See**: `knowledge/09_ui_ux_standards.md`
- Mint green theme (#10b981)
- Component library (shadcn/ui)
- Responsive design
- Accessibility (WCAG 2.1 AA)

### Validation
**📄 See**: `knowledge/16_validation_rules.md`
- Field validation rules
- Error messages
- Form validation patterns

### BIMA Integration
**📄 See**: `knowledge/11_bima_integration.md`
- Employee import API
- C3 submission API
- Payment posting API

---

## 🎯 Success Criteria

1. ✅ All calculations are 100% accurate (verified against test cases)
2. ✅ All three user roles work correctly (Admin, Employer, Self-Employed)
3. ✅ BIMA API integration is functional
4. ✅ Payment processing works (online + offline)
5. ✅ RLS policies prevent unauthorized data access
6. ✅ UI matches mint green theme
7. ✅ Mobile-responsive on all screens
8. ✅ All validation rules enforced

---

## 🚧 Non-Goals (Out of Scope)

**📄 See**: `knowledge/02_system_architecture.md` for complete list

- Time card management (future phase)
- Full payroll processing (future phase)
- Multi-language support (English only)
- Mobile app (web only)

---

## 📊 Development Phases

### Phase 1: Foundation (Week 1)
- Database setup
- Authentication
- User management

### Phase 2: Core Features (Week 2-3)
- Employee management
- C3 generation
- Calculations

### Phase 3: Integration (Week 4)
- BIMA API
- Payment processing

### Phase 4: Polish (Week 5)
- UI refinements
- Reports
- Testing

---

## 📖 How to Use This PRD

1. **Start here** for project overview
2. **Read specific module PRDs** for detailed requirements
3. **Reference knowledge files** for technical implementation details
4. **Check `system.json`** for configuration standards

---

**For complete implementation details, see the modular PRDs in `PRDs/01_*.md` through `PRDs/07_*.md`**

**Last Updated**: January 22, 2026
