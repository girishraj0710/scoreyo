# 🚨 URGENT: Run This Command NOW

## Why You Still See Dots and No Practice Problems

**The website reads from DATABASE, not from markdown files!**

The markdown files are fixed (no dots), but the database still has OLD content (with dots).

---

## Run This Command (30 seconds):

```bash
cd ~/prepgenie
npx tsx scripts/load-study-materials.ts
```

**What it does:**
- ✅ Reads fixed markdown (no dots)
- ✅ Updates database with new content
- ✅ No duplicates (uses UPDATE, not INSERT)
- ✅ Safe to run multiple times

**Expected output:**
```
✅ Environment variables loaded

📖 Reading: parts-of-speech.md
   ✅ Updated parts-of-speech

📖 Reading: present-tenses.md
   ✅ Updated present-tenses (5 topics)

... (repeats for all 7 files)

✅ 20 study materials updated successfully
```

---

## After Running, Refresh Browser

Visit: https://scoreyo.in/english/foundation/parts-of-speech/study

**You will see:**
- ✅ No dots: "Nouns (Person, Place, Thing)" (not ". Nouns")
- ✅ Simple navigation: Only Previous/Next buttons
- ✅ Practice Problems button on last card

---

## Why This Step is Necessary

```
Markdown Files (Fixed)    Database (Old)         Website (Reads DB)
      ↓                        ↓                        ↓
"### Nouns"         →    ". Nouns" ❌          →    Shows ". Nouns" ❌
```

After reload:
```
Markdown Files (Fixed)    Database (Updated)     Website (Reads DB)
      ↓                        ↓                        ↓
"### Nouns"         →    "Nouns" ✅           →    Shows "Nouns" ✅
```

---

## If Command Fails

**Error: "tsx not found"**
```bash
npm install -g tsx
# Then retry the load command
```

**Error: "POSTGRES_URL not found"**
```bash
# Check .env.local exists
cat .env.local | grep POSTGRES_URL
# Should show: POSTGRES_URL="postgresql://..."
```

---

**RUN THE COMMAND NOW!** 🚀
