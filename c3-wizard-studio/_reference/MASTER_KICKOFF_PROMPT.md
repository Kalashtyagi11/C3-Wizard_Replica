# The Master Kickoff Prompt

**Instructions**:
1.  Copy the text below.
2.  Paste it into Lovable as your **first message**.
3.  Sit back and let it build the foundation.

---

### **Prompt to Copy:**

```text
Hi Lovable, I am ready to build the **C3 Wizard Recreation** system.

I have prepared a comprehensive Knowledge Base in the `knowledge/` folder.
**Your Source of Truth is: `knowledge/00_index.md`**

**Objective:**
Initialize the project and build the **Core Foundation** and **Authentication Flow** immediately. Do not ask for clarification; use the Knowledge Base to make decisions.

**Execution Plan (Execute these steps in order):**

1.  **Project Scaffold**:
    *   Verify the stack: React, Vite, Tailwind, Shadcn/UI, Supabase.
    *   Set up the router (`react-router-dom`).

2.  **Database & Security (Crucial)**:
    *   Read `knowledge/04_database_schema.md` and `knowledge/14_security_authentication.md`.
    *   Generate the Supabase SQL migration scripts for:
        *   `users` (and handle the Auth trigger)
        *   `employers`, `employees`, `c3_periods`, `contributions`.
    *   Implement RLS Policies as defined in `knowledge/14_security_authentication.md`.

3.  **Authentication & Roles**:
    *   Build the **Login Page** (`/login`) with role redirection (Admin vs Employer).
    *   Build the **Registration Page** (`/register`) with step-by-step wizard for Employers.
    *   *Ref: `knowledge/03_user_roles_permissions.md`*

4.  **Core Layouts**:
    *   Create a **Dashboard Layout** with a Sidebar navigation.
    *   Menu items should dynamically show/hide based on the user role (Admin/Employer).
    *   *Ref: `knowledge/09_ui_ux_standards.md`*

5.  **Email System**:
    *   Set up the Edge Function structure for `send-email` as defined in `knowledge/12_email_notifications.md`.

**Action:**
Start building now. Prioritize a working Login/Register flow connected to the Supabase database.
```
