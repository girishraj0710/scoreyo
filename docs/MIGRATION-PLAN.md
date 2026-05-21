# Migration to Dimensional Model - Execution Plan

## Overview

Migrating from flat structure to star schema dimensional model to eliminate topic duplication and improve data quality.

## Current Problems

❌ **1,402 "Current Affairs" questions** spread across 36 exams (mostly duplicates)  
❌ **Arithmetic** duplicated in 24 exams  
❌ **Algebra** duplicated in 22 exams  
❌ **~44,000 questions** with ~40% estimated duplication  
❌ **Hard to maintain** - updating a topic requires changes in multiple places  

## Target Benefits

✅ **~25,000 unique questions** (43% reduction in duplication)  
✅ **Single source of truth** for each topic  
✅ **Update once, applies everywhere**  
✅ **Better question quality** - focus on fewer, better questions  
✅ **Flexible exam configuration** - easily add/remove topics from exams  

## Migration Phases

### Phase 1: Create Schema ✅ (READY TO RUN)

**Script:** `scripts/migrate-to-dimensional-model.ts`

Creates:
- `dim_topics` - Master topics table
- `dim_exams` - Exams dimension
- `dim_subjects` - Subjects dimension
- `bridge_exam_subject_topic` - Mapping table
- `fact_exam_questions` - New questions fact table

**Runtime:** ~30 seconds  
**Risk:** None (creates new tables, doesn't touch existing data)  
**Rollback:** Drop new tables

```bash
npx tsx scripts/migrate-to-dimensional-model.ts
```

### Phase 2: Populate Dimensions ✅ (READY TO RUN)

**Script:** `scripts/populate-dimensions.ts`

Extracts:
- All unique topics from existing questions
- All exams from `src/lib/exams.ts`
- All subjects from exam definitions

Categorizes:
- **Universal topics** (used in 10+ exams): Current Affairs, Algebra, etc.
- **State-specific** (Karnataka GK, UP GK, etc.)
- **Exam-specific** (unique topics)

**Runtime:** ~2-3 minutes  
**Risk:** Low (populates new tables only)  
**Rollback:** Truncate dimension tables

```bash
npx tsx scripts/populate-dimensions.ts
```

### Phase 3: Create Bridge Mappings ✅ (COMPLETE)

**Script:** `scripts/create-bridge-mappings.ts` ✅

Maps:
- Which topics belong to which exam-subject combinations
- Pulls from `src/lib/exams.ts` exam definitions
- Creates entries in `bridge_exam_subject_topic`

**Status:** Complete - Bridge table populated with 2,700+ valid topic mappings  
**Runtime:** ~2-3 minutes  
**Risk:** Low (populates bridge table only)  

### Phase 4: Migrate Questions with Deduplication ✅ (COMPLETE)

**Script:** `scripts/migrate-questions-phase4.ts` ✅

Process:
1. Legacy `exam_questions` table retained (15,590 duplicate questions removed)
2. Dimensional `fact_exam_questions` table can be populated independently
3. Deduplication handled via `scripts/handle-duplicate-questions.ts`

**Status:** Complete - Both tables co-exist, feature flag controls which is used  
**Runtime:** ~5-10 minutes  
**Risk:** Low (both structures available for comparison)  

### Phase 5: Update Application Code ✅ (COMPLETE)

Files updated:
- `src/lib/db.ts` - Added `getExamQuestionsDimensional()` with bridge JOINs ✅
- `src/app/api/quiz/route.ts` - Uses feature flag ✅
- `src/app/api/admin/questions/route.ts` - Dual-mode support ✅
- `src/app/api/admin/analytics/route.ts` - Dimensional queries ✅
- `src/app/api/report-question/route.ts` - Context tracking ✅
- `src/app/api/cron/prewarm-cache/route.ts` - Dimensional support ✅

**Feature Flag:** `USE_DIMENSIONAL_MODEL=true` (enabled in production)

**Status:** Complete - All APIs support both legacy and dimensional modes  
**Testing:** Both modes tested and deployed  
**Risk:** Low (feature flag allows instant rollback)  

### Phase 6: Production Cutover ✅ (COMPLETE - 2026-05-20)

**Timeline:**
1. ✅ **2026-05-18:** Deployed with `USE_DIMENSIONAL_MODEL=false` (legacy mode)
2. ✅ **2026-05-19:** Validated dimensional queries in staging
3. ✅ **2026-05-20:** Enabled `USE_DIMENSIONAL_MODEL=true` in production
4. ✅ **2026-05-20:** Fixed all Cursor-identified issues (admin auth, bridge fan-out, question IDs, report context)
5. ⏳ **Next:** Monitor for 1-2 weeks, then optionally deprecate legacy table

**Current Status:** 100% of users on dimensional model  
**Rollback Plan:** Set `USE_DIMENSIONAL_MODEL=false` (instant, zero downtime)  
**Risk:** Very low (feature flag enables instant rollback)

## Migration Status Summary

### ✅ Completed Phases (All 6)

**Phase 1:** Schema created ✅  
**Phase 2:** Dimensions populated ✅  
**Phase 3:** Bridge mappings created ✅  
**Phase 4:** Questions migrated ✅  
**Phase 5:** Application code updated ✅  
**Phase 6:** Production cutover complete ✅  

### 🎯 Current Production Status

- **Model:** Dimensional (star schema)
- **Feature Flag:** `USE_DIMENSIONAL_MODEL=true`
- **Deployment:** https://prepgenie.co.in
- **Date:** 2026-05-20
- **Stability:** All issues resolved, monitoring in progress

### 📊 Results Achieved

✅ **Topic Deduplication:** 1,687 orphaned topics removed  
✅ **Question Cleanup:** 15,590 duplicates removed  
✅ **Valid Topics:** 2,700+ atomic topics across 74 exams  
✅ **Topic Sharing:** Enabled (e.g., "Thermodynamics" shared by 17 exams)  
✅ **Feature Flag:** Zero-downtime rollback available  
✅ **Code Quality:** All APIs support both modes (legacy + dimensional)  

### 🐛 Issues Fixed (Post-Migration)

1. ✅ Admin authorization on report APIs
2. ✅ Bridge table fan-out duplicates (DISTINCT + subqueries)
3. ✅ Missing question IDs in fetch paths
4. ✅ Feature flag ignored in admin updates
5. ✅ Report context misattribution (stored at submission time)
6. ✅ Missing subject_id in report response payload

## Rollback Plan

If issues arise:

**Before Phase 5 (app code changes):**
- Simple: Drop new tables
- Prod unaffected

**After Phase 5 (app using new structure):**
- Revert code deployment
- Keep both structures for 1 week
- Fall back to old structure

**Emergency:**
- Feature flag to switch between structures
- Zero downtime rollback

## Success Metrics

After complete migration:

✅ Database size reduced by ~40%  
✅ No duplicate "Current Affairs" entries  
✅ Update one topic → reflects in all exams  
✅ Question quality improved (focus on fewer, better questions)  
✅ Quiz generation 2x faster (fewer queries)  
✅ Admin dashboard shows cross-exam analytics  

## Timeline

**Optimistic:** 2 weeks  
**Realistic:** 3-4 weeks  
**Conservative:** 6 weeks  

**Phase 1-2:** 1 day (ready now)  
**Phase 3-4:** 3-5 days (scripting + testing)  
**Phase 5:** 1-2 weeks (app code changes + testing)  
**Phase 6:** 1-2 weeks (gradual rollout)  

## Operational Follow-up

1. Continue monitoring dimensional mode query health and latency.
2. Keep feature flag rollback path (`USE_DIMENSIONAL_MODEL=false`) documented and tested.
3. Maintain migration scripts for backfill/repair operations only (no further structural cutover work pending).
4. Keep docs and scripts in sync as schema/query changes are made.

## Commands Reference

```bash
# Phase 1: Create schema
npx tsx scripts/migrate-to-dimensional-model.ts

# Phase 2: Populate dimensions
npx tsx scripts/populate-dimensions.ts

# Check schema and migration status
npx tsx scripts/check-schema.ts
npx tsx scripts/check-migration-status.ts
```

---

Dimensional migration is complete; this document now serves as runbook/history for maintenance and verification.
