# 🤖 SIMPLE SCENARIO PROMPT FOR LOVABLE

**Purpose**: Explain situation, ask Lovable's opinion (don't suggest solutions)  
**Let Lovable think for itself!**

---

## 💬 COPY THIS TO LOVABLE

```
Hi Lovable! I want to discuss my project scenario before we start building. I'd like to hear YOUR thoughts on how to approach this.

## 📋 MY SITUATION

I have an existing C3 Wizard application:
- **Backend**: ASP.NET Core + MS SQL Server (production, live data)
- **Frontend**: React
- **Users**: ~1000+ companies, thousands of employees, years of historical data

**Current Database Problems**:
- Inconsistent naming: SECUsers, MasterCompany, PROCESS_C3Header (mixed casing)
- No table prefixes
- Some tables missing foreign keys
- Some indexes missing
- Poorly organized structure

## 🎯 WHAT I NEED TO DO

Recreate this entire system with:
1. **New Backend**: Supabase (PostgreSQL) instead of MS SQL Server
2. **New Frontend**: React with modern UI (keep all functionality)
3. **Migrate ALL production data**: From old MS SQL database to new Supabase
4. **100% functional replica**: Every feature must work exactly the same

## 📚 WHAT I HAVE FOR YOU

1. **knowledge/** folder
   - Complete documentation of how the system works
   - All business rules, calculations, validations
   - Current database schema

2. **PRDs/** folder  
   - All requirements
   - 3 PDF user manuals showing exact screens (Admin, Employer, Self-Employed)

3. **Old MS SQL database script**
   - Full schema with ~50 tables
   - Lots of production data to migrate

## 🤔 MY QUESTIONS FOR YOU

I'm unsure about the best approach. What's YOUR recommendation?

1. **What would you build first?**
   - Database schema? Or UI screens? Or something else?
   
2. **How should I handle the database?**
   - Should I replicate the old poorly-organized schema exactly?
   - Or create an optimized schema and handle differences during migration?
   - Something else?

3. **Migration strategy?**
   - Build everything first, then migrate data?
   - Create database first, migrate data, then build UI?
   - Other approach?

4. **Optimization vs Migration**
   - If you optimize the database (better naming, structure), how does that affect data migration?
   - Is it possible to improve database AND still migrate data successfully?
   - What would you do?

5. **Your workflow recommendation?**
   - What's the smart order to build things?
   - Where do you think I might run into problems?
   - What should I watch out for?

## 💭 I'D LIKE YOUR HONEST OPINION

Don't worry about what I "want to hear" - just tell me:
- What approach makes most sense to YOU?
- What would YOU do if this was your project?
- What risks do you see?
- What's the smartest strategy?

I'm open to your suggestions!

---

**What's your recommended approach for this scenario?**
```

---

## 🎯 WHAT THIS PROMPT DOES

### **What it INCLUDES** ✅:
- ✅ Explains the scenario (old MS SQL, new Supabase)
- ✅ Shows the problem (poorly organized database)
- ✅ States the challenge (migrate production data)
- ✅ Asks Lovable's opinion

### **What it EXCLUDES** ❌:
- ❌ No mention of "database-first approach"
- ❌ No migration mapping document
- ❌ No specific optimization strategy
- ❌ No telling Lovable what to do

### **Why This is Better**:
- 🧠 **Tests Lovable's thinking**: Can it figure out database-first on its own?
- 💡 **Gets creative ideas**: Maybe Lovable has better approach than yours!
- 🤝 **Collaborative**: Feels like asking a colleague, not ordering
- ✅ **Validates your strategy**: If Lovable suggests same approach, you know it's smart!

---

## 📊 WHAT TO WATCH FOR IN LOVABLE'S RESPONSE

### **GOOD Signs** ✅:

Lovable might say:
```
"I recommend database-first approach:
1. Create optimized Supabase schema first
2. Write migration scripts to transform old data → new structure
3. Test migration with sample data
4. Once data migrated successfully, build UI on good database

This way you have solid foundation before building screens."
```

**OR**:
```
"Let's optimize the database for Supabase best practices.
For migration, you'll need transformation scripts since 
old and new schemas will be different. I can help design
a migration-friendly structure."
```

### **CONCERNING Signs** ⚠️:

Lovable might say:
```
"Just replicate the exact old schema in Supabase,
then migration is easy. We can optimize later."
```
→ **Problem**: Never optimizes, keeps bad structure

**OR**:
```
"Build everything first, we'll figure out
migration later."
```
→ **Problem**: Might build incompatible structure

### **CONFUSING Signs** 🤔:

Lovable might say:
```
"I don't understand the migration challenge"
```
→ **Need**: Explain more about data migration

---

## ✅ AFTER LOVABLE RESPONDS

### **If Lovable's Approach is Good**:
```
YOU: "That makes sense! So you're suggesting [repeat approach]. 
Before we start, I actually have a detailed migration mapping 
document. Should I share that with you first?"

LOVABLE: "Yes please!"

YOU: [Share DATABASE_MIGRATION_MAPPING.md]
```

### **If Lovable's Approach Needs Adjustment**:
```
YOU: "Interesting! I was thinking [your approach]. 
What do you think about that vs your suggestion?"

[Discuss until aligned]
```

### **If Lovable Suggests Something Better**:
```
YOU: "Oh! I hadn't thought of that approach. 
Tell me more about how that would work..."

[Learn from Lovable!]
```

---

## 🎊 BENEFITS OF THIS APPROACH

1. ✅ **Lovable ownership**: Feels involved in planning, not just executing
2. ✅ **Better ideas**: Lovable might suggest something you didn't think of
3. ✅ **Validates your plan**: If Lovable suggests same approach, it's confirmed smart
4. ✅ **Catches issues**: Lovable might see problems you didn't
5. ✅ **Collaborative**: Sets tone for working together, not command/execute

---

**This is perfect, Kalash!** Let Lovable think for itself! 🧠

**Paste this and see what Lovable comes up with!** 😊
