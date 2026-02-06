# C3 Wizard - Instructions for Lovable AI

**PASTE THIS INTO LOVABLE'S "Instructions & guidelines" FIELD**

---

## 📚 KNOWLEDGE BASE REFERENCE

**Read this FIRST**: `knowledge/00_index.md`

This index contains:
- ✅ Complete file list with descriptions
- ✅ Quick reference table
- ✅ Critical rules summary
- ✅ Implementation checklist

---

## 🚨 CHANGE CONTROL - ASK PERMISSION FIRST

### **⚠️ NEVER Make These Changes Without User Permission**:

1. ❌ **Split tables** (e.g., split c3_employees into multiple tables)
2. ❌ **Merge tables** (combine multiple tables)
3. ❌ **Remove fields** (even if seem unused)
4. ❌ **Change data types** (VARCHAR → INTEGER, etc.)
5. ❌ **Change table relationships** (add/remove foreign keys)
6. ❌ **Modify calculation logic** (even to "improve")
7. ❌ **Remove features** (even if seem redundant)
8. ❌ **Change auth flow**
9. ❌ **Modify payment processing**
10. ❌ **Any structural change affecting existing data**

### **WHY**:
This system has **LIVE PRODUCTION DATA** that will be migrated from MS SQL Server.

**Breaking changes = Migration failure = Business disruption** 🚨

**What seems like "improvement" might break critical workflows.**

### **PROTOCOL**:
```
BEFORE making major change:
1. Stop and think: "Does this affect database structure?"
2. Explain what you want to change and why
3. List what might break
4. ASK: "Should I proceed with this change?"
5. WAIT for user confirmation
6. Only then implement
```

### **Example**:
```
"I want to split c3_employees into:
- c3_employees_basic (SSN, name)
- c3_employees_work (hire_date, wages)

This improves performance BUT affects:
- Data migration scripts
- 15+ existing queries
- Application code

PERMISSION REQUIRED: Should I proceed?"
```

### **What You CAN Do Without Permission**:
✅ Add NEW optional fields (with DEFAULT values)  
✅ Add indexes  
✅ Add validation  
✅ Improve UI (same functionality)  
✅ Optimize queries (same structure)  
✅ Fix bugs  

---

## 🔄 DATA MIGRATION CONTEXT

**CRITICAL**: Existing C3 Wizard has years of production data in MS SQL Server.

**Migration Plan**: See `DATA_MIGRATION_GUIDE.md`

**Your Responsibility**:
- ✅ Build schema that's **migration-friendly**
- ✅ Use field names compatible with old system
- ✅ Maintain data relationships
- ✅ Don't break migration assumptions

**If you're unsure**: ASK before changing structure!

---

## 🔴 NEVER FORGET (In Every Conversation)

### 1. Fetch Rates from Database
```typescript
❌ const SS_RATE = 0.05;  // NEVER hardcode
✅ const rates = await supabase.from('c3_system_rates').select('*');
```

### 2. Optimize Database Structure
- ✅ Improve naming (snake_case, c3_ prefix)
- ✅ Add proper indexes, foreign keys
- ✅ Keep 100% functionality

**Details**: `knowledge/20_database_optimization_guide.md`

### 3. Replicate Screens from PDFs
- ✅ 3 user manuals in `PRDs/` folder
- ✅ Match exact field order
- ✅ Apply mint green theme

### 4. Soft Delete ONLY
```sql
❌ DELETE FROM table;
✅ UPDATE table SET is_deleted = TRUE;
```

### 5. Apply RLS Everywhere
- Employers → Own company only
- Self-Employed → Own data only
- Admins → All data

---

## 🔥 MOST CRITICAL FILES

1. `knowledge/05_contribution_calculations.md` - ALL formulas
2. `knowledge/04_database_schema.md` - Database structure
3. `knowledge/20_database_optimization_guide.md` - Optimization guide
4. `knowledge/00_index.md` - Complete file list

---

**Everything else is in the knowledge files. Read `knowledge/00_index.md` for complete navigation.**

**Last Updated**: January 22, 2026
