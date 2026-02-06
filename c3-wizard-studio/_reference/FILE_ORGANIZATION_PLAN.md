# 📁 FILE ORGANIZATION PLAN

**New Structure**: 3 folders only

---

## 🗂️ FINAL FOLDER STRUCTURE

```
c3-wizard-studio/
├── knowledge/              # Critical knowledge - referenced in every conversation
│   ├── 00_index.md        # Master index
│   ├── 01_purpose_scope.md
│   ├── 02_system_architecture.md
│   ├── 03_user_roles_permissions.md
│   ├── 04_database_schema.md
│   ├── 04_database_schema_part2.md
│   ├── 05_contribution_calculations.md 🔥
│   ├── 09_ui_ux_standards.md
│   ├── 10_payment_processing.md
│   ├── 11_bima_integration.md
│   ├── 12_email_notifications.md
│   ├── 13_complete_table_list.md
│   ├── 14_security_authentication.md
│   ├── 16_validation_rules.md
│   └── 20_database_optimization_guide.md
│
├── PRDs/                   # Requirements & User Manuals
│   ├── 00_MAIN_PRD.md
│   ├── 01_user_management.md
│   ├── 03_c3_generation.md
│   ├── 04_payment_processing.md
│   ├── C3 Wizard Admin Portal User Manual (1) 1.pdf
│   ├── C3 Wizard Employer Portal User Manual (1) 1.pdf
│   └── C3 Wizard Self-Employee User Manual (1) 1.pdf
│
├── docs/                   # Migration & Setup Documentation
│   ├── START_HERE.md                      # Main entry point
│   ├── LOVABLE_FIRST_PROMPT.md           # What to paste in Lovable
│   ├── DATABASE_MIGRATION_MAPPING.md      # Field mappings
│   ├── DATA_MIGRATION_GUIDE.md           # Migration timeline
│   ├── DATABASE_OPTIMIZATION_STRATEGY.md  # Why optimize
│   ├── SUPABASE_SETUP_GUIDE.md           # Supabase connection
│   ├── TEST_LOVABLE_SETUP.md             # Test prompt
│   └── system.json                        # Lovable config
│
└── [project files]         # React app files (don't touch)
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

---

## 📋 FILES TO MOVE

### **Move to `docs/` folder**:
```
FROM ROOT                          → TO docs/
────────────────────────────────────────────
DATABASE_FIRST_STRATEGY.md        → DATABASE_OPTIMIZATION_STRATEGY.md
DATABASE_MIGRATION_MAPPING.md     → DATABASE_MIGRATION_MAPPING.md
DATA_MIGRATION_GUIDE.md            → DATA_MIGRATION_GUIDE.md
START_HERE_DATABASE_FIRST.md       → START_HERE.md
MIGRATION_AND_CHANGE_CONTROL.md    → (merge into START_HERE.md)
README.md                          → (update and keep)
system.json                        → system.json (copy to docs)

FROM _reference/                   → TO docs/
────────────────────────────────────────────
FIRST_PROMPT_FOR_LOVABLE.md       → LOVABLE_FIRST_PROMPT.md
LOVABLE_KNOWLEDGE_CONTEXT.md       → (paste into Lovable Instructions)
SUPABASE_SETUP_GUIDE.md            → SUPABASE_SETUP_GUIDE.md
TEST_PROMPT_VERIFY_SETUP.md        → TEST_LOVABLE_SETUP.md
```

### **Keep in `knowledge/` folder**:
```
✓ All knowledge files (00-20)
✓ 00_index.md (master navigation)
```

### **Keep in `PRDs/` folder**:
```
✓ All PRD markdown files
✓ All PDF user manuals
```

### **Delete `_reference/` folder** (after moving files)

---

## 🎯 CLEAN STRUCTURE BENEFITS

1. **knowledge/**: What Lovable needs to know (paste LOVABLE_KNOWLEDGE_CONTEXT once)
2. **PRDs/**: What to build (requirements + user manuals for exact screens)
3. **docs/**: How to build it (migration, setup, first prompt)

**Simple, Clear, No Confusion!** ✅

---

## 📝 UPDATED REFERENCES

All references will point to new locations:

```
OLD: _reference/FIRST_PROMPT_FOR_LOVABLE.md
NEW: docs/LOVABLE_FIRST_PROMPT.md

OLD: DATABASE_FIRST_STRATEGY.md
NEW: docs/DATABASE_OPTIMIZATION_STRATEGY.md

OLD: knowledge/00_index.md references to _reference/
NEW: knowledge/00_index.md references to docs/
```

---

**Executing reorganization now...**
