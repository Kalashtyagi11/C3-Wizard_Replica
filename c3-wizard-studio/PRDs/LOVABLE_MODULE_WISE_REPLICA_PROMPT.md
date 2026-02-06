# Lovable Prompt: Module-Wise, Production Replica of Legacy C3 Wizard

Use this prompt **as-is** in Lovable to build an exact replica of the legacy C3 Wizard application.

---

## 0) ROLE, OBJECTIVE, AND OUTPUT FORMAT

You are building a **production-grade, exact-behavior replica** of the C3 Wizard system.

### Objective
Recreate the legacy system end-to-end (Admin, Employer, Self-Employed) so that:
1. Screen flow and layout match legacy manuals/PDFs.
2. Business logic and calculations match legacy .NET API behavior.
3. Permissions/visibility match legacy role behavior.
4. All persistence uses the **optimized schema only** (never legacy DB directly).

### Mandatory Output from Lovable
For every module, produce:
- Database-first implementation plan
- API/Edge-function contracts
- UI screens and route map
- Validation rules
- Permission matrix
- Test cases (unit + integration + UAT)
- Gap/ambiguity log (if anything is unclear)

---

## 1) SOURCE OF TRUTH HIERARCHY (DO NOT VIOLATE)

1. **Legacy backend logic** (`c3Api`) = source of truth for behavior, rules, calculations, status transitions.
2. **Legacy frontend flow/UI** (`C3WizardReactApp`) + **PDF manuals in `c3-wizard-studio/PRDs`** = source of truth for screens and user flow.
3. **Optimized schema + mapping docs** (`c3-wizard-studio/knowledge/23_optimised_schema_mapping.md`, `24_legacy_to_optimised_field_mapping.md`) = source of truth for storage model.
4. Knowledge docs help implementation, but if there is conflict, preserve legacy behavior and screen contract.

---

## 2) NON-NEGOTIABLE ENGINEERING RULES

- ❌ No hardcoded side menus, permissions, rate values, or contribution constants.
- ❌ No frontend-side business logic/calculation engines for final values.
- ❌ No direct usage of legacy DB schema/tables in runtime implementation.
- ❌ No guessed workflows.
- ✅ Fetch rate/config/reference values from database/API.
- ✅ Keep calculations and workflow transitions server-side.
- ✅ Enforce RBAC and data scope from DB-backed role mappings.
- ✅ Use optimized schema only, with explicit legacy→optimized field mapping.
- ✅ Preserve auditability: creator/updater/timestamps/status transitions.

---

## 3) LEGACY SYSTEM MAP TO REPLICATE

### Legacy Backend Areas (behavior source)
- Auth + registration + OTP + password reset + MFA: `AuthController`
- Employer C3, employee, holiday, bonus, submit/export/import: `C3Controller`
- Director/non-working director flow: `NonDirectorController`, `NonWorkingDirectorController`
- Admin user management, role management, audit/history/contact/about: `AdministrationController`
- Self-employed contribution and profile/settings: `SelfEmpContributionController`, `SelfEmployeeController`, `SelfUserManagementController`
- Rate/config settings: `SettingsController`, `BonusSettingsController`
- Dashboard/menu-role mapping: `DashBoardController`
- Payments + reconciliation + cybersource/offline: `PaymentController`

### Legacy Frontend Areas (UI/flow source)
- Full route map and role-gated navigation: `src/routes/Router.js`
- Role-based sidebar/menu model: `src/layouts/sidebars/sidebardata/SidebarData.js`
- Auth, admin, employer, self-employed screens under `src/views/apps/**` and `src/views/auth/**`

### Screen Contract (visual)
- `PRDs/admin_c3_wizard_screen.pdf`
- `PRDs/Employer_C3_wizard_screens.pdf`
- `PRDs/C3 Wizard Admin Portal User Manual (1) 1.pdf`
- `PRDs/C3 Wizard Employer Portal User Manual (1) 1.pdf`
- `PRDs/C3 Wizard Self-Employee User Manual (1) 1.pdf`

---

## 4) MODULE-WISE IMPLEMENTATION PROMPTS

## Module A — Authentication, Registration, OTP, Password, Session

Recreate legacy flows exactly:
- New registration (Employer + Self-Employed)
- Duplicate checks (username/email/reg no/SSN constraints)
- Email verification/token workflows
- Login + optional OTP/MFA verification flow
- Forgot password, question/answer validation, reset
- Login history + logout update

Implementation directives:
1. Extract all validation states and error messages from legacy controllers + frontend forms.
2. Keep all auth decisions server-side; frontend only orchestrates flow and displays messages.
3. Persist user status flags (active/inactive/verified/otp-required) in optimized auth model.
4. Add end-to-end tests for: register → verify → login → reset password → re-login.

Acceptance:
- No auth action bypasses verification rules.
- Rate-limiting/attempt tracking applied where legacy expects it.
- OTP + email templates are environment-driven (no hardcoded sender secrets).

---

## Module B — Role-Based Access Control and Dynamic Navigation

Roles:
- Admin (SSB)
- Employer (Company)
- Self-Employed (Standard)

Recreate:
- Role-specific dashboard and menu trees
- Permission filtering by module/action
- Company-scoped vs self-scoped vs global visibility

Implementation directives:
1. Build DB-driven permissions (roles, modules, actions, mapping tables).
2. API returns allowed menu/actions; UI renders from API response.
3. Enforce same checks at backend authorization layer (UI checks are not enough).

Acceptance:
- Users cannot access unauthorized routes even via direct URL.
- Menu and action visibility exactly follows role + mapping.

---

## Module C — Employer: Employee Master, Holiday/Other Pay, Bonus

Recreate screens and behavior for employer C3 preparation:
- Employee CRUD + listing + paging/search/filter
- Holiday/other pay entry and updates
- Bonus management and edits
- Import employee flows from external source where legacy supports it

Implementation directives:
1. Recreate form-level validations from legacy (required fields, patterns, edge states).
2. Preserve status-based edit restrictions (e.g., finalized/submitted periods).
3. Ensure list and search behavior match legacy sorting/filter semantics.

Acceptance:
- CRUD and list behavior match legacy responses and frontend expectations.
- Import and delete actions preserve audit trail.

---

## Module D — Employer: C3 Generation, Save/Continue, Finalize, Submit, Export/Import

Recreate full C3 workflow:
- Load employee wages and prior data
- Save & continue drafts
- Add/update listing rows
- Finalize/submit (single and bulk paths)
- Delete local/SSB-linked records as per legacy guards
- Download PDF/export data/import last C3

Implementation directives:
1. State machine must mirror legacy statuses and transitions.
2. All contribution totals computed server-side only.
3. Year/month period locking and duplicate period checks must match legacy.
4. Export payload formats must be compatible with legacy templates/outputs.

Acceptance:
- Draft/final/submit lifecycle exactly replicated.
- Reopen/edit restrictions behave same as legacy.

---

## Module E — Non-Working Director Flow

Recreate NW Director module end-to-end:
- Director profile/master details
- Payroll preview/edit/finalize
- Save & continue, submit bulk
- Search/report/download/import last C3

Implementation directives:
1. Preserve NW-specific contribution handling and report generation behavior.
2. Keep NW flows separated from standard employee contribution paths where legacy does.

Acceptance:
- Director contribution/report flows match legacy API behavior and screen flow.

---

## Module F — Self-Employed Module

Recreate full self-employed journey:
- Self profile management and settings
- Contribution creation/edit/delete/listing
- Report preview/download
- Import/download submitted C3
- User management, audit trail, login history

Implementation directives:
1. Keep self-employed data scope strictly user-bound.
2. Prevent cross-company/self data leakage by DB policy + API checks.
3. Reuse same contribution engine with correct self-employed configuration paths.

Acceptance:
- Self-employed can only read/write own records.
- End-to-end submission and reporting works for self-employed persona.

---

## Module G — Admin Management (Users, Roles, Company Views, Audit)

Recreate admin capabilities:
- My users, company users, self-employed users
- Add/edit/inactivate users
- Reset password + reset email
- Role create/update/delete + module permission mapping
- Logged-in history, user audit trail, exception logs
- About us / contact us management

Implementation directives:
1. Keep administrative actions fully auditable.
2. Require server-side permission checks on every admin mutation endpoint.
3. Match pagination, date filters, and exports from legacy behavior.

Acceptance:
- Admin sees global data; non-admin cannot query global endpoints.
- Role changes take effect immediately in authorization + menus.

---

## Module H — Settings and Rate Configuration

Recreate settings modules:
- C3 settings
- Bonus settings
- Self-employed settings
- Levy settings / deductions tax table details
- Carry-forward year settings

Implementation directives:
1. Store settings in optimized schema tables mapped from legacy entities.
2. Use effective-date/year-aware retrieval logic.
3. Protect locked/closed periods from invalid modifications.

Acceptance:
- Contribution engine always reads current applicable rates from DB.
- No rate or tax table values are hardcoded in UI/API code.

---

## Module I — Dashboards, Reports, and Payment/Reconciliation

Recreate:
- Employer and admin dashboards (counts, statuses, unsent notes)
- Transaction history
- Online payment capture flow (cybersource/paypal equivalents if in target stack)
- Offline payment capture and upload
- Reconciliation views, notes, status updates
- Payment success/cancel callbacks and receipt/report outputs

Implementation directives:
1. Payment status transitions must be idempotent and auditable.
2. Reconciliation uploads/updates must validate file format and record match keys.
3. Expose reports with same date filtering and role-based scope.

Acceptance:
- Payment + reconciliation end-to-end tested using sandbox configs.
- Report totals match contribution and transaction ledgers.

---

## Module J — External Integrations (BIMA, Email)

Recreate integration behavior from legacy and knowledge references:
- Employer/self verification and import workflows
- C3 submission to external system where applicable
- Email notifications (verification, reset, receipts, alerts)

Implementation directives:
1. Build integration adapters with retry + error logging.
2. Keep credentials/config in environment variables/secrets manager only.
3. Log request/response metadata for traceability (mask sensitive fields).

Acceptance:
- Failed integration calls are visible in admin exception/reporting views.
- Reprocessing path exists for recoverable failures.

---

## 5) DATABASE & MAPPING EXECUTION REQUIREMENTS

Implement using optimized schema as target runtime model.

Mandatory method:
1. Create a mapping catalog per module:
   - legacy table/field
   - optimized table/field
   - transformation rule
   - nullable/default behavior
2. No feature is considered done until mapping is documented and tested.
3. Write migration-safe repository/services that never reference legacy table names in runtime code.
4. Add compatibility test cases proving output parity with legacy behavior for same sample inputs.

---

## 6) SCREEN-BY-SCREEN DELIVERY CHECKLIST

For every screen from Admin/Employer/Self PDFs:
1. Route + breadcrumb + title match.
2. Field labels/order/default values match.
3. Validation messages and blocking behavior match.
4. Button enable/disable states match workflow stage.
5. Grid columns, sorting, paging, and filters match.
6. Download/export actions match format and naming behavior.
7. Role visibility rules verified.

No screen can be marked complete without before/after comparison evidence.

---

## 7) TESTING & HANDOVER GATES (MUST PASS)

### Critical E2E packs
1. Employer: Register → verify → login → employee setup → C3 draft → finalize → submit → payment → receipt.
2. Self-employed: Register → verify → contribution submit → payment → report download.
3. Admin: Login → role update → user lifecycle actions → settings update → reconciliation → audit verification.

### Mandatory technical tests
- Unit tests for all calculation functions.
- Integration tests for auth, OTP, email, payment callbacks.
- RBAC tests for route and API authorization.
- Data-scope tests for employer/self isolation.
- Regression tests for period locks and duplicate prevention.

### UAT acceptance
- All PDFs screens matched.
- Legacy behavioral parity demonstrated for representative scenarios.
- No hardcoded rates/permissions/menus detected by static checks.

---

## 8) WHAT LOVABLE MUST NOT ASSUME

- Do not assume field meanings from naming alone.
- Do not infer formulas from UI totals; derive from backend rules.
- Do not merge role behavior unless explicitly confirmed by legacy behavior.
- Do not replace multi-step workflows with simplified single-step flows.
- Do not skip "rare" paths (import last C3, delete submitted linkage paths, reconciliation notes, audit reports).

---

## 9) EXECUTION ORDER (RECOMMENDED)

1. Auth + RBAC + menu service
2. Settings/rate engine + shared calculation service
3. Employer employee/holiday/bonus
4. Employer C3 generation/submission/export/import
5. Self-employed module
6. Non-working director module
7. Admin management + reports/audit
8. Payments + reconciliation + integration hardening
9. Full parity/UAT test pass and production hardening

---

## 10) FINAL DEFINITION OF DONE

Replica is complete only when:
1. All module flows execute exactly like legacy.
2. All screens match PDFs/manual behavior and layout.
3. All logic/calculations/permissions are backend + DB driven.
4. Optimized schema is exclusively used in runtime.
5. E2E test packs pass with documented evidence.
