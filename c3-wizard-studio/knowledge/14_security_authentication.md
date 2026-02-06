# 14. Security & Authentication

**Document Version**: 1.0
**Last Updated**: January 22, 2026
**Purpose**: Security architecture, authentication flows, and data protection strategies.

---

## 14.1 Authentication Strategy

The system uses **Supabase Auth** for identity management, wrapping standard JWT-based authentication.

### Login Flow
1.  **Credentials**: Email + Password.
2.  **Verification**: Supabase validates credentials.
3.  **MFA (Optional/Enforced)**: If enabled, send OTP via Email.
    *   Legacy: `AuthController.cs` -> `sendMailOtpLogin`
    *   New: Supabase Native MFA or Custom Edge Function.
4.  **Session**: JWT Access Token + Refresh Token issued.

### User Types & Claims
*   **Admin**: `role: 'admin'` in `raw_user_meta_data` or `public.users` table.
*   **Employer**: `role: 'employer'`, linked to `company_id`.
*   **Self-Employed**: `role: 'self_employed'`, linked to `ssn`.

---

## 14.2 Authorization & RLS

**Row Level Security (RLS)** is the primary enforcement mechanism for data isolation.

### Policies
1.  **Employers**:
    *   `SELECT`: Can view own Company data and Employees where `company_id` matches user's `company_id`.
    *   `INSERT/UPDATE`: Can modify own Company/Employee data.
    *   `DELETE`: Restricted (Soft Delete only).
2.  **Self-Employed**:
    *   `SELECT`: Can view own Contributions where `ssn` matches user's `ssn`.
3.  **Admins**:
    *   `ALL`: Full access to all tables (bypass RLS or specific Admin policy).

### Example Policy (PostgreSQL)
```sql
CREATE POLICY "Employers can view own employees"
ON c3_employees
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM c3_company_users WHERE company_id = c3_employees.company_id
));
```

---

## 14.3 BIMA API Security

*   **Service Account**: The system uses a dedicated Service Account (Basic Auth) to communicate with BIMA API.
*   **Credential Storage**: Credentials (`BIMA_USERNAME`, `BIMA_PASSWORD`) are stored in **Supabase Vault** or **Edge Function Secrets**.
*   **Isolation**: Users never interact with BIMA directly; the backend proxies all requests.

---

## 14.4 Data Protection

*   **Encryption at Rest**: PostgreSQL TDE (Transparent Data Encryption).
*   **Encryption in Transit**: TLS 1.2+ for all API traffic.
*   **Sensitive Data**:
    *   **Passwords**: Bcrypt/Argon2 (managed by Supabase).
    *   **SSNs**: Stored as plain text (per requirement) but access strictly controlled via RLS. *Recommendation: Encrypt if possible.*

---

## 14.5 Audit Logging

All critical actions are logged to `c3_audit_logs`.
*   **Events**: Login, Failed Login, C3 Submission, Payment, User Creation.
*   **Data**: User ID, Timestamp, IP Address, Action Type, Old Value, New Value.

---

**Document Status**: Active
