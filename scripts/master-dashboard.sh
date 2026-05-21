#!/bin/bash
# Master Dashboard - All Pipelines

clear
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "🚀 PREPGENIE MASTER DASHBOARD - UNLIMITED QUESTIONS PROJECT"
echo "═══════════════════════════════════════════════════════════════════════════════"
date
echo ""

# Database status
echo "📊 CURRENT DATABASE:"
echo "─────────────────────────────────────────────────────────────────────────────"
TOTAL=$(npx tsx -e "import{createClient}from'@libsql/client';import{readFileSync}from'fs';const e=readFileSync('.env.local','utf-8');e.split('\n').forEach(l=>{const m=l.match(/^([^=]+)=(.*)$/);if(m)process.env[m[1].trim()]=m[2].trim().replace(/^[\"']|[\"']$/g,'')});const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});(async()=>{const r=await db.execute('SELECT COUNT(*) as c FROM exam_questions');console.log(r.rows[0].c);process.exit(0)})();" 2>/dev/null)
echo "  Total Questions: $TOTAL"
echo "  Target by Week End: 90,000+"
echo "  Remaining: $((90000 - TOTAL))"
echo ""

# Pipeline statuses
echo "🔄 ACTIVE PIPELINES:"
echo "─────────────────────────────────────────────────────────────────────────────"

# Pipeline 1: FREE AI Seeder
if ps aux | grep -q "[o]ptimized-seeder"; then
  BATCH=$(grep "📦 BATCH" optimized-seed-free.log 2>/dev/null | tail -1 | grep -oE "[0-9]+/[0-9]+")
  AI_COUNT=$(grep "💾 Inserted" optimized-seed-free.log 2>/dev/null | grep -oE "[0-9]+ questions" | awk '{sum+=$1} END {print sum}')
  echo "✅ 1. FREE AI SEEDER (DeepSeek)"
  echo "     Progress: Batch $BATCH"
  echo "     Inserted: ${AI_COUNT:-0} questions"
  echo "     Target: 7,880 Q | Cost: \$0"
else
  echo "❌ 1. FREE AI SEEDER - Stopped"
fi

# Pipeline 2: Aggressive Scraper
if ps aux | grep -q "[a]ggressive-scraper"; then
  SCRAPE_COUNT=$(grep "✅ Total inserted" aggressive-scraper.log 2>/dev/null | tail -5 | grep -oE "[0-9]+ questions" | awk '{sum+=$1} END {print sum}')
  LAST_TOPIC=$(grep "📚" aggressive-scraper.log 2>/dev/null | tail -1 | cut -d'→' -f2 | cut -d'(' -f1)
  echo "✅ 2. AGGRESSIVE SCRAPER"
  echo "     Current: $LAST_TOPIC"
  echo "     Inserted: ${SCRAPE_COUNT:-0} questions"
  echo "     Target: 10K-50K Q | Cost: \$0"
else
  echo "❌ 2. AGGRESSIVE SCRAPER - Stopped"
fi

# Pipeline 3: PDF Extractor
if ps aux | grep -q "[p]df-extractor"; then
  PDF_COUNT=$(grep "Questions generated" pdf-extractor.log 2>/dev/null | tail -1 | grep -oE "[0-9]+")
  echo "✅ 3. PDF EXTRACTOR"
  echo "     Status: Processing NCERT + PYQs"
  echo "     Inserted: ${PDF_COUNT:-0} questions"
  echo "     Target: 20K+ Q | Cost: \$0"
else
  PDF_STATUS=$(grep "DEMONSTRATION COMPLETE" pdf-extractor.log 2>/dev/null)
  if [ -n "$PDF_STATUS" ]; then
    echo "⚠️  3. PDF EXTRACTOR - Needs npm install pdf-parse"
  else
    echo "❌ 3. PDF EXTRACTOR - Stopped"
  fi
fi

# Pipeline 4: Content Converter
if ps aux | grep -q "[c]ontent-converter"; then
  CONV_COUNT=$(grep "💾 Inserted" content-converter.log 2>/dev/null | grep -oE "[0-9]+ questions" | awk '{sum+=$1} END {print sum}')
  CONV_TOPIC=$(grep "📚" content-converter.log 2>/dev/null | tail -1 | cut -d'→' -f2 | cut -d'(' -f1)
  echo "✅ 4. CONTENT CONVERTER (Wikipedia)"
  echo "     Current: $CONV_TOPIC"
  echo "     Inserted: ${CONV_COUNT:-0} questions"
  echo "     Target: 15K+ Q | Cost: \$0"
else
  echo "❌ 4. CONTENT CONVERTER - Stopped"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"

# Progress calculation
TOTAL_TARGET=90000
CURRENT=${TOTAL:-25332}
PROGRESS=$((CURRENT * 100 / TOTAL_TARGET))

echo "📈 OVERALL PROGRESS:"
echo "─────────────────────────────────────────────────────────────────────────────"
echo "  Current: $CURRENT / $TOTAL_TARGET questions ($PROGRESS%)"
echo "  Pipeline Total Target: 50K-90K new questions"
echo "  Total Cost: \$1.50 spent, \$8.50 remaining (pipelines are FREE!)"
echo ""

# Active processes count
ACTIVE=$(ps aux | grep -E "(optimized-seeder|aggressive-scraper|pdf-extractor|content-converter)" | grep -v grep | wc -l | xargs)
echo "  Active Processes: $ACTIVE/4"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "🎯 GOAL: Unlimited questions for every topic - students never look elsewhere"
echo ""
echo "Commands:"
echo "  Refresh: bash scripts/master-dashboard.sh"
echo "  Logs: tail -f <pipeline>.log"
echo "═══════════════════════════════════════════════════════════════════════════════"
