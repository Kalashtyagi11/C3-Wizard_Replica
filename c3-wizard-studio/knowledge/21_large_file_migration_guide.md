# 21. Large File Migration Guide

**Document Version**: 1.0  
**Last Updated**: January 27, 2026  
**Purpose**: Solutions for migrating large data files (>100MB) that exceed GitHub limits

---

## Problem Statement

GitHub has a **100MB file size limit**. The production data export file `SSB.ProductionData.sql` is **264.43 MB**, which cannot be pushed to GitHub.

```
error: GH001: Large files detected.
File mssql_backup/SSB.ProductionData.sql is 264.43 MB;
this exceeds GitHub's file size limit of 100.00 MB
```

---

## 🚀 Solution Options (Ranked by Recommendation)

### Option 1: Git LFS (Large File Storage) ⭐ RECOMMENDED

**Best for**: Keeping large files in version control

**Setup Steps**:

```bash
# 1. Install Git LFS
# macOS
brew install git-lfs

# Windows
# Download from https://git-lfs.github.com/

# Linux
sudo apt install git-lfs

# 2. Initialize Git LFS in your repo
git lfs install

# 3. Track large SQL files
git lfs track "*.sql"
git lfs track "mssql_backup/*.sql"

# 4. Commit the .gitattributes file
git add .gitattributes
git commit -m "Configure Git LFS for large SQL files"

# 5. Add and push your large file
git add mssql_backup/SSB.ProductionData.sql
git commit -m "Add production data export"
git push origin main
```

**Pros**:
- Files stay in version control
- Normal git workflow
- Easy for team collaboration

**Cons**:
- GitHub LFS has bandwidth/storage limits (free tier: 1GB storage, 1GB/month bandwidth)
- May need paid plan for large datasets

---

### Option 2: Split Large Files into Chunks ⭐ RECOMMENDED

**Best for**: Avoiding LFS entirely

**Split using SQL approach**:

```bash
# Split the file into 50MB chunks
split -b 50M mssql_backup/SSB.ProductionData.sql mssql_backup/data_chunk_

# This creates:
# data_chunk_aa (50MB)
# data_chunk_ab (50MB)
# data_chunk_ac (50MB)
# data_chunk_ad (50MB)
# data_chunk_ae (50MB)
# data_chunk_af (~14MB)

# Reassemble later:
cat mssql_backup/data_chunk_* > mssql_backup/SSB.ProductionData.sql
```

**Split by table approach** (More organized):

```sql
-- Export each table separately
-- Each file stays under 100MB

-- Companies (~970 rows) - small
bcp "SELECT * FROM MasterCompany" queryout companies.sql -c -T

-- Employees (~9,145 rows) - medium
bcp "SELECT * FROM MasterEmployee" queryout employees.sql -c -T

-- Contributions (~59,591 rows) - large, may need splitting
bcp "SELECT * FROM Process_Contributions WHERE CONT_ID <= 30000" queryout contributions_part1.sql -c -T
bcp "SELECT * FROM Process_Contributions WHERE CONT_ID > 30000" queryout contributions_part2.sql -c -T
```

---

### Option 3: External Storage + Download Script

**Best for**: Very large datasets

```bash
# Upload to cloud storage
# Azure Blob Storage, AWS S3, Google Cloud Storage

# Create download script
cat > download_data.sh << 'EOF'
#!/bin/bash
echo "Downloading production data..."
curl -o mssql_backup/SSB.ProductionData.sql \
  "https://your-storage.blob.core.windows.net/backups/SSB.ProductionData.sql"
echo "Download complete!"
EOF
chmod +x download_data.sh
```

**Add to .gitignore**:
```
mssql_backup/SSB.ProductionData.sql
```

---

### Option 4: Direct Database-to-Database Migration ⭐ BEST FOR PRODUCTION

**Best for**: Actual production migration

**Using Edge Function with Cloudflare Tunnel**:

1. **Set up Cloudflare Tunnel** on MS SQL server
2. **Create migration edge function** that:
   - Connects to MS SQL via tunnel
   - Reads data in batches (1000 rows at a time)
   - Transforms and inserts into Supabase
   - Logs progress

**Batch Migration Example**:

```typescript
// supabase/functions/migrate-data/index.ts
const BATCH_SIZE = 1000;

async function migrateTable(
  mssqlPool: any, 
  supabase: any, 
  sourceTable: string, 
  targetTable: string,
  transformFn: (row: any) => any
) {
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    // Read batch from MS SQL
    const result = await mssqlPool.request()
      .query(`SELECT * FROM ${sourceTable} 
              ORDER BY ID 
              OFFSET ${offset} ROWS 
              FETCH NEXT ${BATCH_SIZE} ROWS ONLY`);
    
    if (result.recordset.length === 0) {
      hasMore = false;
      continue;
    }

    // Transform and insert
    const transformed = result.recordset.map(transformFn);
    
    const { error } = await supabase
      .from(targetTable)
      .insert(transformed);
    
    if (error) throw error;
    
    offset += BATCH_SIZE;
    console.log(`Migrated ${offset} rows from ${sourceTable}`);
  }
}
```

---

## 📊 Recommended Migration Strategy

### Phase 1: Schema Migration (DONE ✅)
- Create all Supabase tables with correct structure
- Set up RLS policies and indexes

### Phase 2: Reference Data First (Small tables)
1. `c3_countries` (2 rows)
2. `c3_cities` (1 row)
3. `c3_states` (0 rows)
4. `c3_system_rates` (3 rows)
5. `c3_levy_tiers` (65 rows)
6. `c3_wage_categories` (112 rows)
7. `c3_deduction_codes` (3 rows)
8. `c3_obligation_codes` (5 rows)
9. `c3_december_bonus_exemptions` (6 rows)

### Phase 3: Core Entities
1. `c3_companies` (970 rows)
2. `c3_employees` (9,145 rows)
3. `c3_self_employed_profiles` (21 rows)

### Phase 4: Transaction Data (Largest)
1. `c3_contribution_headers` (3,337 rows)
2. `c3_contribution_details` (59,591 rows) - **SPLIT INTO BATCHES**
3. `c3_employee_deductions` (22,485 rows)
4. `c3_employee_incomes` (10,856 rows)
5. `c3_employee_obligations` (37,475 rows)

### Phase 5: Audit Data (Optional)
1. `c3_audit_logs` (23,337 rows)
2. `c3_login_logs` (4,218 rows)
3. `c3_error_logs` (8,416 rows)

---

## 🔧 Quick Fix for Your Immediate Error

**Remove the large file and add to .gitignore**:

```bash
# Remove from git tracking (keeps local file)
git rm --cached mssql_backup/SSB.ProductionData.sql

# Add to .gitignore
echo "mssql_backup/SSB.ProductionData.sql" >> .gitignore

# Commit and push
git add .gitignore
git commit -m "Remove large data file from tracking"
git push origin main
```

**Then choose Option 1 (Git LFS) or Option 2 (Split files)** for long-term solution.

---

## Summary

| Option | Complexity | Best For |
|--------|------------|----------|
| Git LFS | Low | Files you want in version control |
| Split Files | Low | Avoiding LFS, manual management |
| External Storage | Medium | Very large datasets, CI/CD integration |
| Direct Migration | High | Production migration (most reliable) |

**Recommendation**: Use **Git LFS** for development, **Direct Migration** for production deployment.

---

**Last Updated**: January 27, 2026
