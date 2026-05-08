#!/bin/bash

###############################################################################
# PrepGenie - Official PDF Downloader
# Downloads previous year question papers from official government websites
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      PrepGenie - Official PDF Downloader                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Create download directory
DOWNLOAD_DIR="/tmp/prepgenie-official-pdfs"
mkdir -p "$DOWNLOAD_DIR"
cd "$DOWNLOAD_DIR"

echo "📂 Download directory: $DOWNLOAD_DIR"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 DOWNLOAD INSTRUCTIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat << 'EOF'

Since we cannot automate downloads from these sites (they require
browser access, CAPTCHAs, etc.), please follow these manual steps:

┌─────────────────────────────────────────────────────────────────┐
│ 1. JEE MAIN                                                     │
└─────────────────────────────────────────────────────────────────┘
   Website: https://jeemain.nta.nic.in/
   Navigate: Examination → Previous Year Question Papers
   Download: 2019-2024 papers (all shifts)
   Save to: /tmp/prepgenie-official-pdfs/jee-main/

   Expected: ~30-40 PDFs (multiple shifts per year)
   Questions: ~75-90 per paper = 2,250-3,600 total

┌─────────────────────────────────────────────────────────────────┐
│ 2. NEET                                                         │
└─────────────────────────────────────────────────────────────────┘
   Website: https://neet.nta.nic.in/
   Navigate: Previous Year Question Papers
   Download: 2019-2024 papers
   Save to: /tmp/prepgenie-official-pdfs/neet/

   Expected: 6 PDFs (one per year)
   Questions: 180 per paper = 1,080 total

┌─────────────────────────────────────────────────────────────────┐
│ 3. UPSC CSE PRELIMS                                             │
└─────────────────────────────────────────────────────────────────┘
   Website: https://upsc.gov.in/examinations/previous-question-papers
   Navigate: Civil Services Examination → Prelims
   Download: 2019-2024 papers (both GS Paper I & II)
   Save to: /tmp/prepgenie-official-pdfs/upsc/

   Expected: 12 PDFs (2 papers × 6 years)
   Questions: 100 per paper = 1,200 total

┌─────────────────────────────────────────────────────────────────┐
│ 4. SSC CGL                                                      │
└─────────────────────────────────────────────────────────────────┘
   Website: https://ssc.nic.in/
   Navigate: Previous Year Papers → CGL
   Download: Available recent papers
   Save to: /tmp/prepgenie-official-pdfs/ssc-cgl/

   Expected: 10-20 PDFs
   Questions: ~200 per paper = 2,000-4,000 total

┌─────────────────────────────────────────────────────────────────┐
│ 5. GATE CS                                                      │
└─────────────────────────────────────────────────────────────────┘
   Website: https://gate2025.iitr.ac.in/ (rotates to current IIT)
   Navigate: Previous Year Papers
   Alternative: https://www.geeksforgeeks.org/gate-previous-year-papers/
   Download: 2019-2024 papers
   Save to: /tmp/prepgenie-official-pdfs/gate-cs/

   Expected: 6 PDFs
   Questions: 65 per paper = 390 total

┌─────────────────────────────────────────────────────────────────┐
│ 6. CAT MBA                                                      │
└─────────────────────────────────────────────────────────────────┘
   Website: https://iimcat.ac.in/
   Note: CAT doesn't officially release papers
   Alternative: https://www.career360.com/exams/cat-previous-year-question-papers
   Download: Available unofficial reconstructions
   Save to: /tmp/prepgenie-official-pdfs/cat/

   Expected: 5-10 PDFs
   Questions: ~100 per paper = 500-1,000 total

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL EXPECTED QUESTIONS: 7,420 - 11,270 questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

echo ""
echo -e "${YELLOW}📝 AFTER DOWNLOADING:${NC}"
echo ""
echo "1. Verify files are in correct folders:"
echo "   ls -R $DOWNLOAD_DIR"
echo ""
echo "2. Extract questions from PDFs:"
echo "   python scripts/extract-pdf-questions.py <pdf-file> <exam-id> [year]"
echo ""
echo "3. Or batch process all PDFs:"
echo "   bash scripts/batch-extract-pdfs.sh"
echo ""
echo -e "${GREEN}✅ Ready to download! Open the URLs above in your browser.${NC}"
echo ""
