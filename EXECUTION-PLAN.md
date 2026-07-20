# 🚀 Scoreyo - Transparent Hybrid Question Bank

**Goal:** 500+ questions per exam, properly labeled, high quality  
**Approach:** Path C - Hybrid (AI + Public Domain)  
**Timeline:** 3-4 days  

---

## 📊 Target Numbers

| Exam | AI Questions | Public Domain | Total |
|------|--------------|---------------|-------|
| JEE Main | 450 | 50+ (NCERT) | 500+ |
| NEET UG | 450 | 50+ (NCERT) | 500+ |
| UPSC CSE | 500 | TBD | 500+ |
| SSC CGL | 500 | TBD | 500+ |
| Banking (IBPS/SBI) | 500 each | TBD | 1000+ |
| CAT | 500 | TBD | 500+ |
| Others (12 exams) | 500 each | TBD | 6000+ |

**Total Target:** 9,000+ questions (properly labeled)

---

## ✅ Phase 1: Database & Schema Updates (30 min)

### Update Question Model:
```typescript
interface Question {
  // ... existing fields
  sourceType: 'ai-generated' | 'official' | 'ncert' | 'community';
  sourceCitation: string; // "AI Generated 2026", "NCERT Class 12", "UPSC 2015"
  verified: boolean;
  qualityScore?: number; // 0-100
  reviewStatus?: 'pending' | 'approved' | 'rejected';
}
```

### Update Database:
- Add source tracking
- Add verification status
- Add quality scoring
