# PRD 01: User Management & Authentication

**Module**: User Management & Authentication  
**Version**: 1.0  
**Last Updated**: January 22, 2026

---

## 📋 Overview

User Management handles registration, authentication, and account management for all three user roles.

**Referenced By**:
- Master PRD: `PRDs/00_MAIN_PRD.md`
- Security: `knowledge/03_user_roles_permissions.md`
- Database: `knowledge/04_database_schema.md` (c3_users table)

---

## 🎯 User Roles

**See**: `knowledge/03_user_roles_permissions.md` for complete role definitions

1. **Administrator** (created by system/other admins)
2. **Employer** (self-registration → admin approval)
3. **Self-Employed** (self-registration → admin approval)

---

## 🔐 Features

### 1. User Registration (Employer & Self-Employed)

**Registration Form Fields**:

**Personal Information**:
- First Name (required)
- Last Name (required)
- Email (required, unique, becomes login ID)
- Phone Number (optional format: XXX-XXX-XXXX)
- Mobile Number (optional format: XXX-XXX-XXXX)

**Account Type** (radio buttons):
- ⭕ Employer (requires company information)
- ⭕ Self-Employed (requires SSN)

**For Employers - Company Information**:
- Company Name (required)
- Trade Name (optional)
- Registration Number (required, unique)
- Business Type (dropdown: Corporation, LLC, Partnership, Sole Proprietor, Other)
- Address (required)
- City, State/Region, Postal Code, Country (default: KN)
- Phone, Fax, Email, Website

**For Self-Employed**:
- SSN (required, format: XXX-XX-XXXX)
- Birth Date (required)
- Occupation (required)
- Business Name (optional)

**Password**:
- Password (required, see validation rules below)
- Confirm Password (must match)

**Security Questions** (optional but recommended):
- Question 1 (dropdown)
- Answer 1
- Question 2 (dropdown, must be different from Q1)
- Answer 2

**Terms & Conditions**:
- ☐ I agree to Terms & Conditions (required)

**Validation Rules**: See `knowledge/16_validation_rules.md`

---

### 2. Email Verification (OTP)

**Flow**:
```
User submits registration
  ↓
Account created with is_email_verified = FALSE
  ↓
System generates 6-digit OTP (expires in 10 minutes)
  ↓
Email sent to user with OTP
  ↓
User enters OTP on verification screen
  ↓
If correct: is_email_verified = TRUE
If incorrect (3 attempts max): "Invalid OTP. X attempts remaining."
If expired: "OTP expired. Request new code."
```

**OTP Email Template** (placeholder for external service):
```
Subject: Verify Your C3 Wizard Account

Hello [First Name],

Your verification code is: [123456]

This code expires in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
C3 Wizard Team
St. Kitts & Nevis Social Security Board
```

---

### 3. Login

**Login Form**:
- Email / Login ID (required)
- Password (required)
- ☐ Remember Me (optional, 30-day cookie)

**Validation**:
- Check if email exists
- Verify password hash (bcrypt via Supabase Auth)
- Check if email is verified (if not, redirect to OTP screen)
- Check if account is active (not suspended)

**Error Messages**:
- "Invalid email or password"
- "Email not verified. Check your inbox for verification code."
- "Account suspended. Contact administrator."
- "Too many failed attempts. Account locked for 30 minutes."

**After Successful Login**:
- Generate JWT token (24hr expiry)
- Log login attempt (c3_login_logs table)
- Redirect to Dashboard based on role:
  - Admin → Admin Dashboard
  - Employer → Employer Dashboard
  - Self-Employed → Self-Employed Dashboard

---

### 4. Optional MFA (Multi-Factor Authentication)

**Enable MFA** (in user profile):
- Uses TOTP (Time-based One-Time Password)
- Generate QR code for authenticator app (Google Authenticator, Authy, etc.)
- User scans QR code
- User enters 6-digit code to confirm setup
- Store MFA secret (encrypted) in c3_users.mfa_secret

**Login with MFA**:
```
User enters email + password
  ↓
If MFA enabled:
  ↓
  Show "Enter authenticator code" screen
  ↓
  User enters 6-digit code
  ↓
  Verify code (30-second window)
  ↓
  Grant access
```

---

### 5. Password Reset

**Flow**:
```
User clicks "Forgot Password?"
  ↓
Enter email
  ↓
System generates reset token (expires in 1 hour)
  ↓
Email sent with reset link
  ↓
User clicks link → Reset password screen
  ↓
User enters new password (must meet requirements)
  ↓
Password updated, token invalidated
  ↓
Redirect to login
```

**Password Reset Email Template** (placeholder):
```
Subject: Reset Your C3 Wizard Password

Hello [First Name],

Click the link below to reset your password:
[Reset Link - expires in 1 hour]

If you didn't request this, please ignore this email.

Best regards,
C3 Wizard Team
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

**Validation**: See `knowledge/16_validation_rules.md`

---

### 6. User Profile Management

**Edit Profile**:
- Update personal information
- Change email (requires re-verification)
- Update phone numbers
- Update company info (for employers)
- Cannot change: SSN, Registration Number, User Role

**Change Password**:
- Current password (required)
- New password (must meet requirements)
- Confirm new password

**Security Settings**:
- Enable/Disable MFA
- Update security questions
- View login history (last 10 logins)

---

### 7. Admin: User Management

**User List** (Admin only):
- Table with columns:
  - User Name
  - Email
  - Role
  - Company (for employers)
  - Status (Active / Suspended / Pending Approval)
  - Email Verified
  - Last Login
  - Actions (View, Edit, Suspend, Activate, Delete)

**Filters**:
- Role (All / Admin / Employer / Self-Employed)
- Status (All / Active / Pending / Suspended)
- Search by name or email

**Admin Actions**:
- **Approve Pending User**: Set is_active = TRUE
- **Suspend User**: Set is_active = FALSE (cannot login)
- **Activate User**: Set is_active = TRUE
- **Delete User**: Soft delete (is_deleted = TRUE)
- **Reset Password**: Generate temporary password, email to user

---

## 🗄️ Database Tables

**Primary Table**: `c3_users`

**See**: `knowledge/04_database_schema.md` for complete structure

**Key Fields**:
- `id`, `login_id` (email), `password_hash`
- `role` ('admin', 'employer', 'self_employed')
- `is_active`, `is_email_verified`
- `email_verification_token`, `password_reset_token`
- `mfa_enabled`, `mfa_secret`
- `company_id` (for employers, NULL for others)

**Related Tables**:
- `c3_companies` (for employer users)
- `c3_self_employed_profiles` (for self-employed users)
- `c3_login_logs` (audit trail)
- `c3_user_otps` (OTP codes)

---

## 🔐 Security

**Authentication**: Supabase Auth (JWT tokens)

**Password Hashing**: bcrypt (handled by Supabase)

**Row Level Security**:
```sql
-- Users can view their own profile
CREATE POLICY "Users view own profile" ON c3_users
  FOR SELECT USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins view all users" ON c3_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM c3_users WHERE id = auth.uid() AND role = 'admin')
  );
```

**See**: `knowledge/03_user_roles_permissions.md` for complete RLS policies

---

## ✅ Validation Rules

**See**: `knowledge/16_validation_rules.md` for complete list

**Key Validations**:
- Email format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- SSN format: `/^\d{3}-\d{2}-\d{4}$/`
- Password: Min 8 chars, 1 upper, 1 lower, 1 number, 1 special
- Phone: `XXX-XXX-XXXX`

---

## 🎨 UI/UX

**See**: `knowledge/09_ui_ux_standards.md`

**Key Screens**:
1. Registration form (multi-step wizard)
2. Email verification (OTP entry)
3. Login page
4. Password reset flow
5. User profile
6. Admin user management table

**Components**:
- shadcn/ui Form components
- Toast notifications for success/error
- Inline validation errors
- Mint green primary buttons

---

## 🧪 Acceptance Criteria

1. ✅ User can self-register as Employer or Self-Employed
2. ✅ Email verification OTP works correctly
3. ✅ Login with email + password works
4. ✅ Optional MFA can be enabled and works
5. ✅ Password reset flow works end-to-end
6. ✅ Admins can approve pending users
7. ✅ All validation rules are enforced
8. ✅ RLS prevents unauthorized data access

---

**For implementation details, see referenced knowledge files.**

**Last Updated**: January 22, 2026
