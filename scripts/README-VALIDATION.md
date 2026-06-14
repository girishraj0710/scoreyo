# Post-Migration Validation Scripts

This directory contains automated validation tools for the dimensional model migration.

---

## 📁 Files

- **run-validation.sh** - Main validation runner (USE THIS)
- **post-migration-validation.py** - Python validation script
- **validate-migration.py** - Pre-migration validation (deprecated - use SQL queries instead)
- **validate-migration.js** - Pre-migration validation (deprecated)

---

## 🚀 Quick Start

After running the migration SQL, validate with:

```bash
cd /Users/girish.raj/prepgenie
./scripts/run-validation.sh
```

This will:
1. Create a Python virtual environment (first run only)
2. Install psycopg2-binary (first run only)
3. Run all 13 validation tests
4. Generate detailed report

---

## 📊 What Gets Validated

### Data Integrity (Critical)
- ✅ No duplicate bridge entries
- ✅ All foreign keys valid (no orphans)
- ✅ No data loss during migration
- ✅ Mapping table integrity

### Functional Correctness (Critical)
- ✅ Shared subjects created (52 expected)
- ✅ All mappings created (295 expected)
- ✅ JEE and NEET share physics
- ✅ Shared subjects linked to topics

### Quality Checks (Warnings)
- ⚠️ Question pool sizes adequate
- ⚠️ Shared subjects used by multiple exams
- ⚠️ Backward compatibility preserved

---

## 📖 Expected Output

### ✅ Success (All Tests Pass)

```
🔧 Setting up validation environment...
   Creating virtual environment...
   Installing psycopg2-binary...

🚀 Running post-migration validation...

================================================================================
POST-MIGRATION VALIDATION REPORT
Generated: 2026-06-14 15:30:00
================================================================================

Running validation tests...

[1/13] Shared Subjects Created... ✅ PASS
[2/13] Migration Mapping Table... ✅ PASS
[3/13] No Duplicate Bridge Entries... ✅ PASS
[4/13] Foreign Key: Bridge → Exams... ✅ PASS
[5/13] Foreign Key: Bridge → Subjects... ✅ PASS
[6/13] Foreign Key: Bridge → Topics... ✅ PASS
[7/13] JEE + NEET Share Physics... ✅ PASS
[8/13] Shared Subjects Multi-Exam Usage... ✅ PASS
[9/13] Backward Compatibility... ✅ PASS
[10/13] Physics Question Pool Size... ✅ PASS
[11/13] Mapping Table Integrity... ✅ PASS
[12/13] No Data Loss... ✅ PASS
[13/13] Shared Subjects Have Topics... ✅ PASS

================================================================================
DETAILED TEST RESULTS
================================================================================

✅ PASS Shared Subjects Created
   Created 52 shared subjects
   📋 Verifies all 52 shared subjects were inserted

✅ PASS Migration Mapping Table
   Created 295 mappings
   📋 Verifies subject_migration_map was created with all mappings

...

================================================================================
VALIDATION SUMMARY
================================================================================
✅ Passed: 13/13
⚠️  Warnings: 0/13
❌ Failed: 0/13

🎉 PERFECT! Migration completed successfully with no issues.
✅ Safe to proceed with production testing.
```

### ⚠️ Warnings (Some Issues)

```
================================================================================
VALIDATION SUMMARY
================================================================================
✅ Passed: 11/13
⚠️  Warnings: 2/13
❌ Failed: 0/13

✅ Migration completed successfully.
⚠️  2 warning(s) - review above for details.
✅ Generally safe to proceed, but monitor closely.
```

### ❌ Failure (Critical Issues)

```
================================================================================
VALIDATION SUMMARY
================================================================================
✅ Passed: 10/13
⚠️  Warnings: 1/13
❌ Failed: 2/13

❌ MIGRATION VALIDATION FAILED!
❌ 2 critical error(s) detected.
🚫 DO NOT proceed to production.
📋 Run rollback from VALIDATE-THEN-MIGRATE.md
```

---

## 🔧 Troubleshooting

### Error: "command not found: ./scripts/run-validation.sh"

**Solution:**
```bash
chmod +x scripts/run-validation.sh
./scripts/run-validation.sh
```

### Error: "could not translate host name"

**Cause:** Network connectivity issue or wrong database URL

**Solution:**
1. Check `.env.local` has correct `POSTGRES_URL`
2. Test connection: `ping db.zomcofptwlumqkeffbht.supabase.co`
3. Run manual SQL validation instead (see `POST-MIGRATION-VALIDATION.sql`)

### Error: "No module named 'psycopg2'"

**Cause:** Virtual environment setup failed

**Solution:**
```bash
# Delete virtual environment and try again
rm -rf .venv
./scripts/run-validation.sh

# Or install manually
pip install --user psycopg2-binary
python3 scripts/post-migration-validation.py
```

### Warning: "Only X shared subjects have topics"

**Cause:** Some shared subjects aren't linked to any topics yet

**Impact:** Low - those subjects may not be used yet

**Action:** Monitor. If number is < 10, investigate which subjects are unused.

---

## 🎯 Manual Validation (Alternative)

If the automated script fails, you can run manual SQL validation:

```sql
-- In Supabase SQL Editor
-- Copy tests from ../POST-MIGRATION-VALIDATION.sql
-- Run each test and review results
```

Benefits:
- No dependencies required
- Visual review of each test
- Easy to share results

Drawbacks:
- Manual process (15 tests)
- No automated pass/fail
- More time consuming

---

## 📞 Support

If validation fails:

1. **Save the output:**
   ```bash
   ./scripts/run-validation.sh > validation-report.txt 2>&1
   ```

2. **Check specific test that failed** - Look for `❌ FAIL` in output

3. **Common fixes:**
   - **Duplicate entries** → Run rollback, check if migration already ran
   - **Orphaned references** → Database corruption, must rollback
   - **JEE/NEET don't share physics** → Migration didn't execute, check SQL output

4. **Rollback if needed:**
   ```sql
   -- See VALIDATE-THEN-MIGRATE.md for rollback SQL
   ```

---

## 🔄 Re-running Validation

You can run validation multiple times safely:

```bash
# Run again after fixing issues
./scripts/run-validation.sh

# Check specific test only (manual SQL)
psql "$POSTGRES_URL" -c "SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%'"
```

---

## ✅ Next Steps After Validation

If all tests pass:

1. ✅ Test quiz generation in production
2. ✅ Test study content
3. ✅ Monitor for 24-48 hours
4. ✅ Check Vercel logs for errors
5. ✅ After 1 week: Run cleanup SQL (optional)

---

## 📚 Related Files

- `../POST-MIGRATION-VALIDATION.sql` - Manual SQL validation queries
- `../VALIDATE-THEN-MIGRATE.md` - Complete migration guide
- `../MIGRATION-QUICK-REFERENCE.md` - Quick reference
- `../migration-dimensional-model.sql` - The migration script itself

---

**Last Updated:** June 14, 2026
