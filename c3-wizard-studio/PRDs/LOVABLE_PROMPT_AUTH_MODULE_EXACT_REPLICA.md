# Lovable Prompt — Authentication Module ONLY (Exact Legacy Replica)

Use this prompt exactly. Build **only Authentication module** with strict legacy behavior parity.

---

## ROLE AND HARD BOUNDARY

You are implementing **only**:
- Registration (Employer + Self-Employed)
- Login
- Activation / verification code
- Email OTP/MFA (mail + authenticator)
- Forgot password (security questions + reset)
- Resend activation code
- Login log create + logout linkage

Do **not** implement payroll/C3/business modules in this prompt.

---

## SOURCE OF TRUTH PRIORITY (MANDATORY)

1. Legacy backend behavior (`c3Api`) is absolute truth for auth logic.
2. Legacy frontend screens/flows (`C3WizardReactApp`) are truth for UX transitions/messages.
3. Optimized schema in target repo must be used at runtime:
   - `secusers` -> `optimised_c3wizard.c3_users`
   - `secusersprofile` -> `optimised_c3wizard.c3_user_profiles`
   - `securityquestionanswer` -> `optimised_c3wizard.c3_security_questions`
   - `userotp` -> `optimised_c3wizard.c3_user_otps`
   - `mastercompany` -> `optimised_c3wizard.c3_companies`
   - `selfemployee` -> `optimised_c3wizard.c3_self_employed`
   - `loginlog` -> `optimised_c3wizard.c3_login_logs`
   - `secrole` -> `optimised_c3wizard.c3_roles`
4. Do not trust existing Lovable-generated auth logic if it differs from below.

---

## AUTHENTICATION OVERVIEW (LEGACY PARITY MODEL)

Legacy auth is hybrid and flag-driven:
- Primary credential check is against local `SECUsers` with encrypted password.
- If external SSB/BEMA connectivity is enabled, some registration/activation/reset paths additionally call external APIs.
- Local activation state for non-BEMA mode is `userstts` + `token` on user record.
- Login identifier supports:
  - Username (`LoginId`)
  - 6-digit registration number lookup via user profile mapping (`SECUsersProfiles.REG_NUMBER`)
- Login success can branch to:
  - Direct success (token returned)
  - Mail OTP verification step (`mailVarifyProcess`)
  - Authenticator MFA step (`MFAProcess`)
  - Activation required (“User account is not active ...”)

---

## REGISTRATION FLOW — EMPLOYER (STEP-BY-STEP)

### API Entry
`POST /Auth/RegisterCompanyNew`

### Preconditions / validations (must match sequence)
1. Reject if a `SECUsers` record already exists where `LoginId == registerCompanyVm.LoginId` or `LoginId == registerCompanyVm.UserName`.
2. Validate registration number/email via `ValidateRegistration(regNo, email)`.
3. If validation fails, return conflict with registration already-exists semantics.

### Persistence actions (legacy order to replicate)
When registration succeeds, preserve this creation order:
1. Create company record (legacy `MasterCompany`).
2. Create user record (legacy `SECUsers`) with:
   - role `RoleId = 3` (Employer role in legacy)
   - `IsSelfEmployee = false`
   - `IsActive = true`
   - `Status = true`
   - encrypted password (legacy reversible encryption routine used in source)
3. Create security question record (legacy `SecurityQuestionAnswer`).
4. Create user-profile mapping record (legacy `SECUsersProfile`).
5. Seed user permission rows (legacy inserts into `UserPermission`).

### Activation + email behavior
After successful register:
1. If `response.auth_token == "local"` and `IsBEMARegistrationEnabled == "0"`:
   - set `userstts = null`
   - generate activation code: random GUID substring length 8 (`Guid.NewGuid().ToString("N").Substring(0,8)`)
   - store in user `token`
   - send activation email template `verifictionTemplate.cshtml`
2. Send welcome email to user using `WelcomeCustomer.cshtml`.
3. Send admin/SSB notification email using `Welcome.cshtml`.
4. If `IsTestMail == 1`, all outgoing mails route to `TestMail`; otherwise real destination.

### UI transition (legacy frontend)
- Registration page (`/register`) submits.
- On success frontend usually routes to `/login` (unless old branch `res.data === 'Existing User'`, then `/Verification`).
- Keep backend messages intact; frontend toast shows response message.

---

## REGISTRATION FLOW — SELF-EMPLOYED (STEP-BY-STEP)

### API Entry
`POST /Auth/RegisterCompanyNew` with `employmentType = "SelfEmployed"`

### Preconditions
1. Validate SSN/email via `GET /Auth/TextChangeSsnSelfRegister?ssN=&email=`
2. Required checks mirrored from legacy:
   - SSN required
   - SSN length must be 6
   - reject if already in company table or self-employee table
   - if BEMA reachable, verify email exactly matches SSB response

### Persistence actions (legacy order)
1. Create self-employed master record (legacy `SelfEmployee`).
2. Create user record (legacy `SECUsers`) with:
   - role `RoleId = 5` (Self-employed role in legacy)
   - `SelfEmpID = SelfEmployee.EmployeeID`
   - `EmpId = "0"`
   - `IsSelfEmployee = true`
   - `IsActive = true`
   - `Status = true`
3. Create security question record.
4. Create user-profile mapping record with self-employed marker.
5. Success message is same activation-pending text as employer.

### Activation + email behavior
- Same activation code generation path as employer when local registration mode applies (`auth_token == local` + BEMA disabled).

### UI transition
- Same registration page submits; on success generally returns to login.

---

## LOGIN FLOW (STEP-BY-STEP)

### API Entry
`POST /Auth/Login { userName, userPass }`

### Credential handling
1. Reject if username/password empty.
2. Encrypt trimmed password before compare.
3. If username length is 6, attempt REG_NUMBER-based lookup via `SECUsersProfiles` first; then fallback to direct LoginId.
4. If user not found -> `401 "Invalid LoginId or Password"`.
5. If `IsActive == false` -> `401 "User is inactive, please contact to social security"`.

### Post-auth local checks
1. Fetch role/company/self context.
2. If user requires local activation (`IsBEMARegistrationEnabled == 0` and `userstts == null`):
   - If account inserted on previous date, regenerate new 8-char token and resend activation email.
   - Return `400` with message: `User account is not active ... verification code sent ...`.

### MFA branching
If config `IsMfaProcess == 1`:
1. If `IsMfaType == "mail"`:
   - create OTP record (10-minute expiry) in `UserOtp`
   - remove previous unused OTPs for user
   - send `OtpVerificationLogin.cshtml`
   - return payload: `{ type: "mailVarifyProcess", userid }`
2. Else (authenticator):
   - generate Base32 secret
   - store as OTP type MFA
   - return QR `otpauth://...`
   - return payload: `{ type: "MFAProcess", userid }`

If MFA disabled:
- return normal login success with JWT token payload + profile metadata.

### UI transitions (legacy frontend)
From `/login`:
- If response data type `mailVarifyProcess` -> navigate `/VerifyProcess`
- If response data type `MFAProcess` -> navigate `/VerifyQRCODE`
- Else navigate by role category:
  - Company -> `/apps/dashboard`
  - SelfEmployee -> `/apps/dashboards`
  - SSB -> `/admin-dashboard`
- If backend message includes "User account is not active" -> navigate `/Verification`.

---

## OTP RULES (EXACT)

### Activation code (registration activation)
- Format: 8-char from GUID `N` format substring.
- Stored on user (`token`) with user activation status field (`userstts`).
- Verified by endpoint: `GET /Auth/varificatiion_code?code=&UserName=`.

### Login Mail OTP
- Stored in `UserOtp` (`OtpType = MAIL`, `IsUsed=false`, expiry = now + 10 minutes).
- Old unused OTPs for user are deleted before insert.
- Validated by `POST /Auth/VerifyMFAOtp?userId=&type=mailVarifyProcess&otp=`.
- On success mark OTP `IsUsed=true`.
- Expired OTP is removed and treated invalid.

### Authenticator MFA OTP
- Base32 secret stored as `OtpType = MFA`.
- Verify TOTP with tolerance window `(1,1)`.

### Resend behavior
`GET /Auth/ReSendvarifycode?UserName=&Password=`:
- If BEMA-enabled and connected, calls external reactivate API.
- Otherwise local:
  - reset `userstts = null`
  - regenerate new 8-char token
  - resend activation email (`verifictionTemplate.cshtml`)

---

## EMAIL RULES (EXACT)

### Templates and triggers
1. `verifictionTemplate.cshtml`
   - Trigger: registration activation (local mode), resend activation, inactive login re-send.
   - Subject: `Activate your C3 Remittances Account`
2. `OtpVerificationLogin.cshtml`
   - Trigger: login mail OTP MFA
   - Subject: `C3 Remittances — Login OTP`
3. `WelcomeCustomer.cshtml`
   - Trigger: registration success
   - Recipient: user email (or TestMail in test mode)
4. `Welcome.cshtml`
   - Trigger: registration success
   - Recipient: SSB admin mail (`SSBMail`, or TestMail in test mode)

### Restrictions
- No hardcoded SMTP credentials.
- Sender email/password/server/port must come from environment config.
- Respect `IsTestMail` switch exactly.

---

## FORGOT PASSWORD FLOW (SECURITY QUESTIONS + RESET)

### Step 1: Fetch security questions
`GET /Auth/QuestionAnswerForget?regNo=&userName=`
- Lookup by exact registration number + username.
- If no record: `NotFound` with invalid reg/user message.

### Step 2: Validate answers and get UserId
`POST /Auth/ForgetPasswordbtnNext`
- Verifies regNo/userName/questions/answers using stored-proc based check.
- If match, returns `Status=true`, `Data=UserId`.
- If mismatch: `400 "Entered values not matched..."`.

### Step 3: Set new password
`POST /Auth/ForgotPassword`
- Uses returned UserId + username + regNo + new password.
- Reject if new encrypted password equals current.
- Update local password and external (when BEMA enabled).
- Return success message `Password Updated Successfully!`.

### UI behavior (legacy)
- Screen 1 `/forgotpassword`: enter regNo + username, then answer both questions.
- On success navigates to `/forgotPasswordDetails` with UserId.
- Screen 2 submits new + confirm password.
- On success redirect `/login`.

---

## ACTIVATION VERIFICATION FLOW

### Endpoint
`GET /Auth/varificatiion_code?code=&UserName=`

### Behavior
1. Loads user and role context.
2. If BEMA enabled/connected -> calls repo verification; may return:
   - Already Activated
   - Successfully activated
3. If BEMA disabled and user has `userstts == null`:
   - compare code with user token
   - on match set `userstts = "A"`
   - return success + login payload
   - on mismatch return invalid code

### UI behavior
- `/Verification` screen used for registration activation path.
- Successful verification returns user to login.
- “Resend code” action calls `ReSendvarifycode`.

---

## DATABASE EXECUTION MAPPING (LEGACY -> OPTIMISED)

Implement all runtime writes against optimized schema only. Preserve behavior, not legacy names.

### Required write maps
- `SECUsers` create/update -> `c3_users`
  - include activation flags/token fields equivalent to `userstts`, `token`, status, active, self-employed marker, role
- `SECUsersProfile` -> `c3_user_profiles`
- `SecurityQuestionAnswer` -> `c3_security_questions`
- `UserOtp` -> `c3_user_otps`
- `MasterCompany` -> `c3_companies`
- `SelfEmployee` -> `c3_self_employed`
- `LoginLog` -> `c3_login_logs`

### Required parity note
For each endpoint above, produce and keep in docs:
- request payload
- read tables
- write tables
- field-level mapping
- transaction boundary

---

## STRICT INSTRUCTIONS TO LOVABLE (NON-NEGOTIABLE)

- ❌ Do not assume missing behavior.
- ❌ Do not move auth decisions to frontend.
- ❌ Do not hardcode OTP length, expiry, role IDs, status flags, or template names.
- ❌ Do not remove legacy branches (BEMA on/off, test mail mode, inactive activation flow).
- ✅ Keep all auth branching server-side.
- ✅ Return response shapes expected by legacy UI flows:
  - `{type: "mailVarifyProcess", userid}`
  - `{type: "MFAProcess", userid}`
- ✅ Enforce exact error/success semantics for blocked login, inactive user, invalid code, expired OTP.
- ✅ Use optimized schema only with explicit mapping.

---

## TEST GATES (MUST PASS BEFORE HANDOVER)

### Registration + activation
1. Employer register -> activation email generated -> wrong code fails -> correct code activates.
2. Self-employed register -> same activation behavior.
3. Resend generates new code and invalidates old code.

### Login variants
4. Username login success.
5. 6-digit reg number login success via profile lookup.
6. Inactive user blocked with exact message.
7. Not-activated user blocked and resend path works.
8. MFA mail path issues OTP, enforces 10-minute expiry, marks used on success.
9. MFA authenticator path validates TOTP.

### Forgot password
10. Q/A mismatch blocks step 2.
11. Q/A correct returns user ID.
12. Password reset rejects same password, accepts new password, login works with new password.

### Audit/session
13. Successful login writes login log and returns log id.
14. Logout updates same log record.

No handover until all above pass with evidence.
