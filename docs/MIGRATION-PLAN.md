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

### Phase 3: Create Bridge Mappings (TODO)

**Script:** `scripts/create-bridge-mappings.ts` (needs creation)

Maps:
- Which topics belong to which exam-subject combinations
- Pulls from existing `exam_questions` table
- Creates entries in `bridge_exam_subject_topic`

**Estimated Runtime:** ~5 minutes  
**Risk:** Low (still not touching prod data)  

### Phase 4: Migrate Questions with Deduplication (TODO)

**Script:** `scripts/migrate-questions-dedupe.ts` (needs creation)

Process:
1. For each universal topic (e.g., "Current Affairs"):
   - Find all questions across all exams
   - Detect duplicates (fuzzy matching on question text)
   - Keep best version of each question
   - Link to all applicable exams via bridge table

2. For state-specific topics:
   - Group by state
   - Deduplicate within state exams
   - Keep exam-specific when needed

3. For exam-specific topics:
   - Migrate as-is, no deduplication

**Estimated Runtime:** ~30-60 minutes (due to duplicate detection)  
**Risk:** Medium (complex logic, need thorough testing)  

### Phase 5: Update Application Code (TODO)

Files to update:
- `src/lib/db.ts` - Database queries
- `src/lib/quiz-generator.ts` - Quiz generation logic
- `src/app/api/quiz/route.ts` - Quiz API
- `src/app/admin/page.tsx` - Admin dashboard queries

**Dual-read strategy:**
- Query both old and new structures
- Compare results for validation
- Log discrepancies

**Estimated Runtime:** ~2-3 days development + testing  
**Risk:** Medium (requires careful testing)  

### Phase 6: Gradual Cutover (TODO)

1. **Week 1:** Deploy with dual-read (validate)
2. **Week 2:** Switch 10% of users to new structure
3. **Week 3:** Switch 50% of users
4. **Week 4:** Switch 100% of users
5. **Week 5:** Drop old `exam_questions` table

**Risk:** Low (gradual rollout allows quick rollback)

## Immediate Next Steps

### Step 1: Review & Approve Design

Review:
- `docs/DIMENSIONAL-MODEL-DESIGN.md` - Full design document
- `docs/MIGRATION-PLAN.md` - This execution plan

**Decision needed:** Approve to proceed?

### Step 2: Run Phase 1 (Safe - Creates New Tables)

```bash
npx tsx scripts/migrate-to-dimensional-model.ts
```

**Impact:** None on prod, creates new empty tables

### Step 3: Run Phase 2 (Safe - Populates Dimensions)

```bash
npx tsx scripts/populate-dimensions.ts
```

**Impact:** None on prod, fills dimension tables with metadata

### Step 4: Validate Dimensions

Query to check:
```bash
npx tsx -e "
import { createClient } from '@libsql/client';
// Check dim_topics
// Check dim_exams
// Check dim_subjects
"
```

### Step 5: Build Phase 3 & 4 Scripts

After validation, we'll build:
- Bridge mapping script
- Question migration with deduplication logic

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

## Questions to Resolve

1. **Should we run Phase 1-2 now?** (Safe, no prod impact)
2. **Deduplication strategy:** Keep highest quality or merge explanations?
3. **State-specific topics:** Which states to prioritize?
4. **Testing strategy:** Staging environment available?

## Commands Reference

```bash
# Phase 1: Create schema
npx tsx scripts/migrate-to-dimensional-model.ts

# Phase 2: Populate dimensions
npx tsx scripts/populate-dimensions.ts

# Check results
npx tsx scripts/analyze-dimensional-model.ts

# Rollback if needed
npx tsx scripts/rollback-dimensional-model.ts
```

---

**Ready to proceed with Phase 1 & 2?** They're safe operations that don't affect production data.
