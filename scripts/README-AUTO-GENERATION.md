# 🤖 Automated Question Generation System

## Overview

This system **automatically generates high-quality exam questions** using AI with multi-model consensus and quality validation. **No human intervention required.**

---

## 🎯 Key Features

### 1. **Multi-Model Consensus**
- Uses 3 different AI models simultaneously
- Cross-validates answers and explanations
- Only accepts questions with high consensus

### 2. **Quality Scoring (0-100)**
- Validates question length, clarity
- Checks explanation quality
- Ensures option diversity
- Filters out low-quality questions

### 3. **Automatic Import**
- Generated questions auto-import to question bank
- Ready to use in mock tests immediately
- No manual intervention needed

### 4. **Continuous Generation**
- Runs on schedule (hourly/daily)
- Tracks progress toward target (10,000 questions)
- Monitors quality metrics
- Logs all activity

---

## 🚀 Quick Start

### One-Time Generation

```bash
# Generate 50 questions across all priority exams
node scripts/auto-generate-questions.js

# Generate for specific exam
node scripts/auto-generate-questions.js --exam jee-main --count 100

# Higher quality threshold
node scripts/auto-generate-questions.js --threshold 90

# Preview without saving
node scripts/auto-generate-questions.js --dry-run
```

### Continuous Auto-Generation

```bash
# Start scheduler (runs every hour)
node scripts/question-bank-scheduler.js

# Custom interval (every 30 minutes)
node scripts/question-bank-scheduler.js --interval 30

# Generate more per run
node scripts/question-bank-scheduler.js --count 50

# Custom target
node scripts/question-bank-scheduler.js --target 5000
```

---

## 📊 How It Works

### Multi-Model Consensus Flow

```
1. Question Request
   ↓
2. Parallel Generation (3 models)
   - Gemini 2.0 Flash
   - Llama 3.1 8B
   - Phi-3 Mini
   ↓
3. Quality Scoring
   - Question length ✓
   - Explanation depth ✓
   - Option diversity ✓
   - Answer validity ✓
   - Model consensus ✓
   ↓
4. Threshold Filter (80/100)
   ↓
5. Auto-Import to Question Bank
   ↓
6. Ready for Mock Tests!
```

### Quality Scoring Algorithm

```javascript
Base Score: 100

Deductions:
- Short question (<30 chars): -20 points
- Weak explanation (<30 chars): -25 points
- Short options (<5 chars avg): -20 points
- Duplicate options: -30 points
- Invalid correct_answer: -50 points

Bonuses:
- High model consensus: +10 points

Final: Max(0, Min(100, score))
```

---

## 🎓 Priority Exams & Topics

### Automatically Covers:

**Engineering:**
- JEE Main: Physics, Chemistry, Mathematics (20 Q per topic)

**Medical:**
- NEET UG: Physics, Chemistry, Biology (20 Q per topic)

**Civil Services:**
- UPSC CSE: History, Polity (15 Q per topic)

**SSC:**
- SSC CGL: Quantitative Aptitude, Reasoning (15 Q per topic)

**Total Priority Topics:** 30+
**Target per Topic:** 15-20 questions
**Total Target:** 10,000 questions

---

## 📁 Output Structure

### Generated Files

```
.agents/artifacts/auto-generated/
  ├── auto-generated-2024-01-15T10-30-00.csv
  ├── auto-generated-2024-01-15T10-30-00.json
  ├── auto-generated-2024-01-15T11-30-00.csv
  └── ...

.agents/artifacts/imported-questions/
  ├── jee_main_jee_physics_Mechanics.ts
  ├── neet_ug_neet_biology_Genetics.ts
  └── ...

.agents/artifacts/
  ├── question-bank-stats.json (progress tracking)
  └── question-generation.log (activity log)
```

### Stats File Format

```json
{
  "total_generated": 450,
  "total_imported": 450,
  "runs": 23,
  "last_run": "2024-01-15T11:30:00.000Z",
  "by_exam": {
    "jee-main": 150,
    "neet-ug": 200,
    "upsc-cse": 100
  },
  "by_difficulty": {
    "easy": 180,
    "medium": 180,
    "hard": 90
  },
  "avg_quality": 87.3
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Required
export OPENROUTER_API_KEY="your-key-here"

# Optional (defaults shown)
export QUALITY_THRESHOLD=80
export QUESTIONS_PER_RUN=20
export INTERVAL_MINUTES=60
```

### Command-Line Options

#### auto-generate-questions.js

```bash
--exam <exam-id>        # Target specific exam
--count <number>        # Questions to generate (default: 50)
--threshold <0-100>     # Quality threshold (default: 80)
--dry-run               # Preview without saving
```

#### question-bank-scheduler.js

```bash
--interval <minutes>    # Run frequency (default: 60)
--count <number>        # Per run (default: 20)
--target <number>       # Total target (default: 10000)
```

---

## 📈 Progress Tracking

### View Current Progress

```bash
# Check stats file
cat .agents/artifacts/question-bank-stats.json

# View generation log
tail -f .agents/artifacts/question-generation.log
```

### Progress Dashboard (While Running)

```
╔═══════════════════════════════════════════════════════════════╗
║         PrepGenie - Question Bank Auto-Builder Status         ║
╚═══════════════════════════════════════════════════════════════╝

Progress:
  Total Generated:  450 / 10,000
  Total Imported:   450
  Runs Completed:   23
  Last Run:         1/15/2024, 11:30:00 AM

Progress: 5%
██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

Configuration:
  Interval:         60 minutes
  Per Run:          20 questions
  Quality:          80/100
```

---

## 🎯 Production Deployment

### Option 1: Background Process (Simple)

```bash
# Start in background
nohup node scripts/question-bank-scheduler.js > /dev/null 2>&1 &

# Check if running
ps aux | grep question-bank-scheduler

# Stop
kill <pid>
```

### Option 2: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start scheduler
pm2 start scripts/question-bank-scheduler.js --name "question-builder"

# Monitor
pm2 status
pm2 logs question-builder

# Auto-restart on reboot
pm2 startup
pm2 save

# Stop
pm2 stop question-builder
pm2 delete question-builder
```

### Option 3: Systemd Service (Linux)

Create `/etc/systemd/system/prepgenie-question-builder.service`:

```ini
[Unit]
Description=PrepGenie Question Bank Builder
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/prepgenie
Environment="OPENROUTER_API_KEY=your-key"
ExecStart=/usr/bin/node scripts/question-bank-scheduler.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable prepgenie-question-builder
sudo systemctl start prepgenie-question-builder
sudo systemctl status prepgenie-question-builder
```

### Option 4: Docker Container

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
ENV OPENROUTER_API_KEY=your-key
CMD ["node", "scripts/question-bank-scheduler.js"]
```

```bash
docker build -t prepgenie-builder .
docker run -d --name question-builder prepgenie-builder
```

### Option 5: Cron Job (Periodic, Not Continuous)

```bash
# Edit crontab
crontab -e

# Add line (runs every hour)
0 * * * * cd /path/to/prepgenie && node scripts/auto-generate-questions.js --count 20
```

---

## 💡 Best Practices

### 1. **Start Small**

```bash
# First run: Test with small batch
node scripts/auto-generate-questions.js --count 10 --dry-run

# Verify quality
# Then run for real
node scripts/auto-generate-questions.js --count 10
```

### 2. **Monitor Quality**

```bash
# Check average quality score
grep "Average Quality" .agents/artifacts/question-generation.log | tail -5

# Should be consistently above 80/100
```

### 3. **Adjust Threshold**

```bash
# If quality is low, increase threshold
node scripts/auto-generate-questions.js --threshold 85

# If too many rejections, lower threshold
node scripts/auto-generate-questions.js --threshold 75
```

### 4. **Balance API Costs**

```bash
# OpenRouter free tier: ~100 requests/day
# Each question = 3 model calls = 3 requests
# Max ~33 questions/day on free tier

# Adjust interval for free tier:
node scripts/question-bank-scheduler.js --interval 120 --count 10
# Runs every 2 hours, generates ~10 questions
```

### 5. **Review Generated Questions**

```bash
# Periodically review samples
head -20 .agents/artifacts/auto-generated/auto-generated-*.csv

# Check for:
# - Factual accuracy
# - Explanation quality
# - Option plausibility
```

---

## 🔧 Troubleshooting

### Issue: All models failing

**Cause:** API key invalid or rate limit hit

**Solution:**
```bash
# Check API key
echo $OPENROUTER_API_KEY

# Test manually
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Issue: Low quality scores

**Cause:** Models generating poor questions

**Solution:**
```bash
# Increase quality threshold to filter more
node scripts/auto-generate-questions.js --threshold 90

# Or manually review and edit generated CSV files
```

### Issue: Import failing

**Cause:** Generated questions don't match format

**Solution:**
```bash
# Check generated CSV format
head .agents/artifacts/auto-generated/latest.csv

# Manually import with validation
node scripts/import-questions.js <file>
```

### Issue: Scheduler not stopping at target

**Cause:** Stats file not updating

**Solution:**
```bash
# Check stats file
cat .agents/artifacts/question-bank-stats.json

# Manually update if needed
# Or delete and restart
```

---

## 📊 Expected Timeline

### Conservative Estimate (Free Tier)

- **Rate:** 10 questions/2 hours
- **Per Day:** 120 questions
- **Per Week:** 840 questions
- **10,000 target:** ~12 weeks (3 months)

### Aggressive (Paid API)

- **Rate:** 50 questions/hour
- **Per Day:** 1,200 questions
- **10,000 target:** ~8 days

---

## 🎓 Quality Assurance

### Automated Checks

✅ Question length validation  
✅ Option diversity check  
✅ Explanation depth verification  
✅ Answer validity confirmation  
✅ Multi-model consensus  
✅ Quality scoring (0-100)  

### Manual Review (Recommended)

- Spot-check 10 questions per day
- Flag factually incorrect questions
- Report patterns of low quality
- Adjust threshold as needed

---

## 🚀 Scaling Up

### Phase 1: Bootstrap (Now)
- Target: 1,000 questions
- Timeline: 1-2 weeks
- Focus: JEE, NEET, UPSC

### Phase 2: Core Coverage (Month 1)
- Target: 5,000 questions
- Timeline: 1 month
- Focus: All priority exams

### Phase 3: Comprehensive (Month 3)
- Target: 10,000 questions
- Timeline: 3 months
- Focus: All exams, all topics

### Phase 4: Premium (Ongoing)
- Target: 20,000+ questions
- Maintain quality above 85/100
- Add new exam patterns
- Update with latest syllabus

---

## 📞 Support

### Logs Location
```
.agents/artifacts/question-generation.log
```

### Stats Location
```
.agents/artifacts/question-bank-stats.json
```

### Generated Questions
```
.agents/artifacts/auto-generated/
.agents/artifacts/imported-questions/
```

---

**🎉 With this system, you can build a 10,000-question bank automatically!**

No spreadsheets, no manual work, no human intervention required! 🤖✨
