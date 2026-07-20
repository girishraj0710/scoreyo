# ⚡ Quick Load Reference Card

Copy-paste these commands to load your Week 1 content into Supabase.

---

## 🚀 ONE COMMAND (Recommended)

```bash
cd /Users/girish.raj/prepgenie && npx tsx scripts/load-all-content.ts
```

**Loads:** 7 study materials + 501 questions in one go.  
**Time:** ~45 seconds  
**Safe:** Skips duplicates, can run multiple times

---

## 📦 Individual Loaders

### Study Materials Only
```bash
npx tsx scripts/load-study-materials.ts
```

### Questions Only
```bash
npx tsx scripts/load-english-questions.ts
```

---

## ✅ Verify After Loading

### Check Counts
```bash
# Study materials count
psql "$POSTGRES_URL" -c "SELECT COUNT(*) FROM topic_study_content WHERE subject_id = 'english';"

# Questions count by topic
psql "$POSTGRES_URL" -c "SELECT topic_id, COUNT(*) FROM english_questions WHERE path_id = 'foundation' GROUP BY topic_id;"
```

### Test on Production
- https://scoreyo.in/english → Foundation Builder → Parts of Speech → Study First
- https://scoreyo.in/english → Foundation Builder → Pronunciation → Start Quiz

---

## 🐛 Quick Fixes

### Connection Error
```bash
# Export database URL
export $(grep POSTGRES_URL .env.local | xargs)

# Test connection
psql "$POSTGRES_URL" -c "SELECT NOW();"
```

### Files Not Found
```bash
# Ensure you're in project root
cd /Users/girish.raj/prepgenie

# Check files exist
ls content-generated/study-materials/*.md
ls content-generated/questions/*.json
```

### Dependencies Missing
```bash
npm install tsx @types/node
```

---

## 📊 Expected Results

**Study Materials:**
- ✅ 7 materials inserted
- ✅ ~25,000 words total
- ✅ Topics: Parts of Speech, Present/Past/Future Tenses, Articles, Active & Passive Voice, Subject-Verb Agreement

**Questions:**
- ✅ 427-501 questions inserted (depending on pronunciation completion)
- ✅ Topics: Pronunciation (26-100), Pronouns (94), Adjectives (102), Nouns (102), Verbs (103)
- ✅ All include Indian context and exam focus

---

## 📖 Full Documentation

See `SUPABASE-LOADING-GUIDE.md` for:
- Detailed explanations
- Troubleshooting steps
- Verification procedures
- Database schema details

---

**Status:** ✅ Ready to use  
**Last Updated:** June 15, 2026
