# 🔗 How to Connect Supabase to Lovable

## Step-by-Step Guide

### Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"New Project"**
3. Fill in:
   - **Project Name**: `c3-wizard` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to St. Kitts & Nevis (e.g., `US East`)
   - **Pricing Plan**: Start with **Free** tier
4. Click **"Create new project"**
5. Wait 2-3 minutes for Supabase to provision your database

---

### Step 2: Get Supabase Credentials

Once your project is ready:

1. In Supabase dashboard, click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (safe to use in frontend)
     - `service_role` `secret` key (server-side only - keep secret!)

**Copy these values** - you'll need them for Lovable!

---

### Step 3: Connect Supabase to Lovable

#### Option A: If Lovable Has Supabase Integration UI

1. In Lovable, go to **"Project settings"** or **"Connectors"**
2. Look for **"Supabase"** connector
3. Click **"Connect to Supabase"**
4. Enter:
   - **Supabase URL**: Your project URL (from Step 2)
   - **Supabase Anon Key**: Your `anon` `public` key (from Step 2)
5. Click **"Connect"** or **"Save"**

#### Option B: Manual Setup via Environment Variables

If Lovable doesn't have built-in Supabase UI, you'll set it up using environment variables:

1. In Lovable, go to **"Project settings"** → **"Environment Variables"**
2. Add these variables:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
   ```
3. Click **"Save"**

#### Option C: In Code (Lovable will handle this)

Lovable will create a Supabase client file like this:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Just make sure Lovable has access to the environment variables.

---

### Step 4: Test the Connection

Once connected, test it:

1. In Lovable chat, ask:
   ```
   "Please test the Supabase connection by creating a simple test table 
   called 'test_connection' and inserting one row."
   ```

2. If successful, you'll see the table in Supabase:
   - Go to Supabase dashboard
   - Click **"Table Editor"** in left sidebar
   - You should see `test_connection` table

3. Delete the test table after confirming it works

---

### Step 5: Initialize Database Schema

After Supabase is connected, tell Lovable to create the C3 Wizard tables:

```
"Now that Supabase is connected, please create the complete C3 Wizard 
database schema as specified in the first prompt. Create all the c3_ 
prefixed tables with RLS policies."
```

Lovable will create:
- All tables (`c3_users`, `c3_companies`, `c3_employees`, etc.)
- RLS policies
- Indexes
- Triggers (if needed)

---

## 🔐 Security Best Practices

### ✅ DO:
- Use the **`anon` / `public`** key in your frontend (Lovable app)
- Enable **Row Level Security (RLS)** on all tables
- Use **environment variables** for keys (never hardcode)

### ❌ DON'T:
- DON'T use the `service_role` key in frontend (keep it server-side only)
- DON'T commit keys to Git (use `.env.local` which is git-ignored)
- DON'T disable RLS on production tables

---

## 🧪 Verify Everything Works

### Test 1: Authentication
1. Try registering a new user in your Lovable app
2. Check Supabase dashboard → **"Authentication"** → **"Users"**
3. You should see your new user

### Test 2: Database Access
1. Try creating an employee (if you're at that stage)
2. Check Supabase dashboard → **"Table Editor"** → **"c3_employees"**
3. You should see the new row

### Test 3: RLS Policies
1. Login as Employer A
2. Try to view data - should only see own company
3. Login as Employer B
4. Should NOT see Employer A's data

---

## 🛠️ Troubleshooting

### Issue: "Failed to connect to Supabase"
**Fix**: 
- Double-check URL and anon key are correct
- Make sure there are no extra spaces
- URL should start with `https://`

### Issue: "Row Level Security policy violation"
**Fix**:
- RLS is working! This means non-authorized access is blocked
- Check if you're logged in as the correct user
- Verify RLS policies match your role

### Issue: "Database tables not found"
**Fix**:
- Make sure Lovable created the tables (check SQL migrations)
- Go to Supabase **"Table Editor"** and verify tables exist
- If not, ask Lovable to run the database setup again

---

## 📚 Supabase Features You'll Use

### 1. Database (PostgreSQL)
- Store all C3 Wizard data
- Use SQL queries or Supabase client SDK

### 2. Authentication
- Email/password login
- Email verification
- Password reset
- Optional: Email OTP for MFA

### 3. Row Level Security (RLS)
- Control data access by user role
- Employers see only their company data
- Self-employed see only their own data
- Admins see everything

### 4. Edge Functions (Optional)
- Server-side calculations
- Payment gateway integration
- Email sending
- BIMA API calls

### 5. Storage (Optional)
- Upload PDFs (receipts, C3 forms)
- Store employee import files

---

## 🚀 You're Ready!

Once Supabase is connected and tables are created, you can build the entire C3 Wizard system. Lovable will use Supabase for:

✅ User authentication  
✅ Storing all data (users, companies, employees, C3 forms, payments)  
✅ Enforcing permissions via RLS  
✅ Real-time updates (for admin dashboards)

**Need help?** Check Supabase documentation: https://supabase.com/docs

---

**Summary**:
1. Create Supabase project
2. Get URL + anon key
3. Connect to Lovable (via UI, env vars, or Lovable will handle it)
4. Test connection
5. Create database schema
6. Start building!

🎉 **You're all set to build C3 Wizard!**
