# 📁 FILE REORGANIZATION - Execute These Commands

**Goal**: Clean 3-folder structure (knowledge/, PRDs/, docs/)

---

## 🚀 STEP-BY-STEP COMMANDS

### **Step 1: Create docs folder**
```bash
cd "D:\Projects\Neeraj Sir APP\C3-wizard-recreation\c3-wizard-studio"
mkdir docs
```

### **Step 2: Move files from root to docs/**
```bash
# Move migration files
move DATABASE_MIGRATION_MAPPING.md docs\
move DATA_MIGRATION_GUIDE.md docs\
move DATABASE_FIRST_STRATEGY.md docs\DATABASE_OPTIMIZATION_STRATEGY.md
move START_HERE_DATABASE_FIRST.md docs\START_HERE.md
move MIGRATION_AND_CHANGE_CONTROL.md docs\

# Move other root docs
move LOVABLE_MIGRATION_DISCUSSION_PROMPT.md docs\
move FILE_ORGANIZATION_PLAN.md docs\

# Copy system.json to docs (keep original in root for Lovable)
copy system.json docs\system.json
```

### **Step 3: Move files from _reference/ to docs/**
```bash
cd _reference

# Move to docs
move FIRST_PROMPT_FOR_LOVABLE.md ..\docs\LOVABLE_FIRST_PROMPT.md
move SUPABASE_SETUP_GUIDE.md ..\docs\
move TEST_PROMPT_VERIFY_SETUP.md ..\docs\TEST_LOVABLE_SETUP.md

# Keep LOVABLE_KNOWLEDGE_CONTEXT.md for now (will paste in Lovable)
# We'll delete _reference folder after pasting this in Lovable
```

### **Step 4: Update knowledge/00_index.md**
```bash
# Edit knowledge/00_index.md to point to new docs/ locations
# (I'll create updated version next)
```

### **Step 5: Clean up** (after confirming everything works)
```bash
# Delete old files that were moved
cd ..
rmdir /s _reference  # Only after pasting LOVABLE_KNOWLEDGE_CONTEXT in Lovable
```

---

## ✅ FINAL STRUCTURE

```
c3-wizard-studio/
├── knowledge/              ← All system knowledge
│   ├── 00_index.md
│   ├── 01-20 knowledge files
│
├── PRDs/                   ← Requirements + User Manuals
│   ├── PRD markdown files
│   ├── 3 PDF user manuals
│
├── docs/                   ← Setup & Migration Guides
│   ├── START_HERE.md
│   ├── LOVABLE_FIRST_PROMPT.md
│   ├── DATABASE_MIGRATION_MAPPING.md
│   ├── DATA_MIGRATION_GUIDE.md
│   ├── DATABASE_OPTIMIZATION_STRATEGY.md
│   ├── MIGRATION_AND_CHANGE_CONTROL.md
│   ├── SUPABASE_SETUP_GUIDE.md
│   ├── TEST_LOVABLE_SETUP.md
│   ├── LOVABLE_MIGRATION_DISCUSSION_PROMPT.md
│   ├── FILE_ORGANIZATION_PLAN.md
│   └── system.json (copy)
│
├── src/                    ← React app (don't touch)
├── public/
├── README.md              ← Updated overview
├── system.json            ← Lovable config (original)
└── [other project files]
```

---

## 📝 FILES IN EACH FOLDER

### **knowledge/** (15 files)
```
00_index.md                         → Master index
01_purpose_scope.md
02_system_architecture.md
03_user_roles_permissions.md
04_database_schema.md
04_database_schema_part2.md
05_contribution_calculations.md     → MOST CRITICAL
09_ui_ux_standards.md
10_payment_processing.md
11_bima_integration.md
12_email_notifications.md
13_complete_table_list.md
14_security_authentication.md
16_validation_rules.md
20_database_optimization_guide.md
```

### **PRDs/** (7 files)
```
00_MAIN_PRD.md
01_user_management.md
03_c3_generation.md
04_payment_processing.md
C3 Wizard Admin Portal User Manual (1) 1.pdf
C3 Wizard Employer Portal User Manual (1) 1.pdf
C3 Wizard Self-Employee User Manual (1) 1.pdf
```

### **docs/** (9 files)
```
START_HERE.md                              → Entry point
LOVABLE_FIRST_PROMPT.md                    → What to paste
LOVABLE_MIGRATION_DISCUSSION_PROMPT.md     → Pre-build discussion
DATABASE_MIGRATION_MAPPING.md              → Field mappings
DATA_MIGRATION_GUIDE.md                    → Timeline
DATABASE_OPTIMIZATION_STRATEGY.md          → Why database-first
MIGRATION_AND_CHANGE_CONTROL.md            → Protection
SUPABASE_SETUP_GUIDE.md                    → Setup help
TEST_LOVABLE_SETUP.md                      → Test prompt
system.json                                → Lovable config (copy)
```

---

## 🎯 WHAT TO DO NOW

### **Option A: Manual Reorganization** (Recommended - 10 min)
```
1. Create docs/ folder manually
2.  Copy/move files per Step 2-3 above
3. Verify all files in right place
4. Test that nothing broke
```

### **Option B: I'll Create Scripts** (If you want)
```
I can create PowerShell scripts to do this automatically.
Let me know!
```

---

## 📌 IMPORTANT

**Before deleting _reference/ folder**:
1. ✅ Copy content of `_reference/LOVABLE_KNOWLEDGE_CONTEXT.md`
2. ✅ Paste in Lovable "Instructions & guidelines" field
3. ✅ THEN delete _reference/ folder

**This file contains critical rules Lovable needs to remember!**

---

**Ready to reorganize, Kalash?** Let me know if you want the PowerShell scripts or prefer manual! 😊
