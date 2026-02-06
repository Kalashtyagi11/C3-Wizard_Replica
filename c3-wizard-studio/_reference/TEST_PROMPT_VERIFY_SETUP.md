# 🧪 TEST PROMPT - Verify Lovable Setup

**USE THIS BEFORE STARTING THE ACTUAL PROJECT**

**Purpose**: Verify that Lovable can read your knowledge base and connect to Supabase before building anything.

---

## 📋 COPY THIS PROMPT TO LOVABLE

```
Hi Lovable! Before we start building the C3 Wizard project, I need to verify that:
1. You can read my knowledge base
2. My Supabase connection is working

Please help me test this setup.

## TEST 1: Knowledge Base Reading

Please answer these questions to prove you've read the knowledge base:

1. What are the THREE user roles in this system?
2. What is the PRIMARY COLOR theme? (provide the hex code)
3. What is the MAXIMUM CAP for SS employee contribution per month?
4. What is the special rule for December bonus regarding employee levy?
5. What database naming convention should be used for all tables?
6. According to the manager's directive, what TWO critical tasks must you do?

## TEST 2: Supabase Connection

Please:
1. Verify the Supabase connection is configured
2. List the environment variables you can see (URL and keys)
3. Attempt to ping the Supabase database
4. Report the connection status

## TEST 3: File Access

Please confirm you can access these files:
- system.json
- knowledge/05_contribution_calculations.md
- knowledge/20_database_optimization_guide.md
- PRDs/00_MAIN_PRD.md

For each file, tell me: ✅ Can access OR ❌ Cannot access

---

**IMPORTANT**: Do NOT start building anything yet. Just answer these test questions so I can verify the setup is correct.

After you answer, I'll either:
- Fix any issues, OR
- Give you the actual first prompt to start building

Ready? Please answer all the test questions above.
```

---

## ✅ EXPECTED RESPONSES

**If Lovable answers correctly**:

1. **User Roles**: Admin, Employer, Self-Employed
2. **Primary Color**: #10b981 (Mint Green)
3. **SS Employee Cap**: $750 per month
4. **December Bonus Rule**: EXEMPT from employee levy if YTD wages < $28,000
5. **Database Naming**: snake_case with c3_ prefix (e.g., c3_users, c3_employees)
6. **Manager's Directives**: 
   - Database optimization (optimize structure, keep functionality)
   - User manual screen replication (exact screens with modern UI)

**Supabase Connection**:
- Should see: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Connection status: Connected ✅

**File Access**:
- All files should be ✅ accessible

---

## ⚠️ IF LOVABLE CAN'T ANSWER

**Possible Issues**:

1. **Knowledge base not uploaded to Git** → Solution: Commit and push
2. **Supabase not connected** → Solution: Follow SUPABASE_SETUP_GUIDE.md
3. **Lovable can't see files** → Solution: Check Git repository connection

---

## 🎯 AFTER TEST PASSES

Once Lovable answers all questions correctly:

1. ✅ Knowledge base is working
2. ✅ Supabase is connected
3. ✅ Ready to start building

**Then use**: `_reference/FIRST_PROMPT_FOR_LOVABLE.md` to actually start the project.

---

**This test takes 2 minutes and prevents hours of debugging later!** 🎯
