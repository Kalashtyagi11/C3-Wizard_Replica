# 🛠️ UI REPAIR PROMPT - URGENT FIXES

**Give this prompt to Lovable to fix the broken sidebar and layout immediately.**

---

```markdown
⚠️ **URGENT UI BREAKAGE REPORT**

I reviewed your latest update, and the UI is visibly broken. Please look at the current state and fix the following critical issues immediately. The current result is UNUSABLE.

**1. CRITICAL SIDEBAR MENU FIXES:**
The sidebar is currently unreadable and messy.
- **Problem**: Menu text is white on a very light background. It is invisible! 
- **Fix**: 
  - Set Sidebar Background to **Dark Green** (approx `#064e3b` or `#166534`) to match the legacy SSB theme.
  - Set Text Color to **White** (`#ffffff`).
  - Active Item Background: Should be a lighter shade of green or white with green text.
  - **Structure**: The nested items (Employee, C3 Generation, etc.) look disordered. Use a proper **Accordion/Collapsible** structure for the "C3" menu.
  - **Width**: The sidebar looks too wide or has a strange scrollbar appearing in the middle of the layout. Fix the flexbox layout so the sidebar has a fixed width (e.g., 250px) and the main content takes the rest.

**2. LAYOUT & SCROLLBAR BUG:**
- **Problem**: There is a jarring grey scrollbar appearing *between* the sidebar and the main content. 
- **Fix**: This suggests an overflow issue. Ensure the Sidebar is `h-screen fixed left-0` (or similar) and the Main Content has `ml-[250px]`. Remove the internal scrollbar unless distinctively needed for the menu only (and make it thin/hidden).

**3. ERROR TOAST OBSTRUCTION:**
- **Problem**: An "Error: The app encountered an error" toast is covering the bottom of the screen.
- **Fix**: This indicates a runtime crash on load. 
  - Check the `EmployerSidebar.tsx` or `DashboardLayout.tsx`. 
  - It is likely failing to load the user profile or permissions. 
  - Add a fallback: `if (!user) return <Loading />` instead of crashing.
  - **Action**: Fix the underlying crash so the toast disappears.

**4. VISUAL POLISH (MATCH PDF):**
- The "Select Period" wizard stepper looks okay, but the "Select Period" dropdown section is taking up too much vertical space. Make it more compact.
- The Header "Welcome, Jaleel Grant..." is good, but ensure vertical alignment is centered.

**IMMEDIATE DATA-DRIVEN ACTION (STRICT REQUIREMENT):**
You mentioned "Replaced dynamic menu with reliable static sidebar".
- **❌ REVERT THIS MISTAKE IMMEDIATELY**: 
  - The menu **MUST BE DYNAMIC** and strictly driven by the `c3_user_granular_permissions` table.
  - **CLARIFICATION**: Do NOT use `c3_user_permissions` (that is for modules). Use **`c3_user_granular_permissions`** because that is where the menu item names (e.g., 'REPORTS', 'EMPLOYEE') are stored.
  - **SCENARIO**: If I go to the database right now and delete the 'REPORTS' permission for this user, the "Reports" menu item **MUST DISAPPEAR** from the UI instantly.
  - **If you hardcode the sidebar, you fail the security requirement.**
  - Iterate through the user's permissions fetched from Supabase and ONLY render the items present in that list.
  - Do NOT assume all users see the same menu.

**SUMMARY OF TASKS:**
1. Fix Sidebar Color contrast (Dark Green background / White text).
2. Fix Sidebar Layout (Remove weird middle scrollbar).
3. **Switch back to DYNAMIC Menu Loading** (Fetch permissions → Render items).
4. Debug and fix the "App encountered an error" crash.
5. Ensure C3 submenu is a clean collapsible list.

**Please generate the corrected code for `EmployerSidebar.tsx` and `DashboardLayout.tsx` now.**
```
