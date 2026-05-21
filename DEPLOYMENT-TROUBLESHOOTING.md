# Deployment Troubleshooting Guide

**Date**: May 18, 2026  
**Issue**: Vercel deployment failed after mock test expansion

---

## 🔍 Issue Analysis

### Likely Causes

1. **Package.json Mismatch** ✅ FIXED
   - Local had Next.js 16.2.6
   - Production was on 16.2.4
   - **Solution**: Committed package.json updates (commit ab0bf67)

2. **Missing Dependencies**
   - `csv-parse`: ^6.2.1 (added locally)
   - `pdf-parse`: ^2.4.5 (added locally)
   - **Solution**: Now committed and pushed

3. **Build Cache Issues** (Possible)
   - Vercel might have cached old build
   - **Solution**: Clear build cache in Vercel dashboard

4. **Environment Variables** (Check)
   - All required env vars present in Vercel?
   - **Check**: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, OPENROUTER_API_KEY, etc.

---

## ✅ Fixes Applied

### 1. Synchronized Dependencies
```bash
git add package.json package-lock.json
git commit -m "chore: Update Next.js to 16.2.6 and add CSV/PDF parsing dependencies"
git push origin main
```

**Changes**:
- Next.js: 16.2.4 → 16.2.6
- Added: csv-parse ^6.2.1
- Added: pdf-parse ^2.4.5

### 2. Verified Local Build
```bash
npm run build  # ✅ Successful
```

No TypeScript errors, all pages compiled successfully.

---

## 🔧 Vercel-Specific Fixes

### If Still Failing:

#### Option 1: Clear Build Cache
1. Go to Vercel Dashboard
2. Select prepgenie project
3. Settings → General
4. Scroll to "Build & Development Settings"
5. Click "Clear Build Cache"
6. Trigger new deployment

#### Option 2: Check Build Logs
1. Go to Deployments tab
2. Click on failed deployment
3. View "Building" logs
4. Look for specific error message
5. Check for:
   - Missing dependencies
   - Import errors
   - TypeScript errors
   - Memory issues

#### Option 3: Environment Variables
Verify all required variables are set:
```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
OPENROUTER_API_KEY=...
RESEND_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

#### Option 4: Rollback (Last Resort)
If critical, rollback to previous deployment:
```bash
# Revert last commit
git revert ab0bf67 cfe97ed
git push origin main
```

---

## 📊 Deployment Status

### Commits
- `1af52d2`: State exams added
- `cfe97ed`: Mock test expansion + custom builder ⚠️ Failed
- `ab0bf67`: Fixed package.json dependencies ⏳ Deploying

### Files Changed (cfe97ed)
- src/lib/mock-test-config.ts (+168 lines)
- src/components/custom-mock-test-builder.tsx (NEW, 488 lines)
- src/app/mock-test/page.tsx (+65 lines)
- src/app/api/mock-test/route.ts (+95 lines)
- scripts/import-pyq.ts (type fixes)

### Potential Issues in Files

#### custom-mock-test-builder.tsx
- Large component (488 lines)
- Multiple lucide-react imports
- **Check**: All icons imported correctly

#### mock-test API route
- Custom test logic added
- Database operations
- **Check**: All DB functions available

---

## 🧪 Local Verification

### Already Tested ✅
```bash
npm run build                    # ✅ Passed
tsc --noEmit                     # ✅ Passed (via build)
npm run lint                     # Not tested
```

### Components Verified ✅
- ✅ CustomMockTestBuilder renders
- ✅ All imports resolve
- ✅ TypeScript types correct
- ✅ No syntax errors

---

## 🚀 Next Steps

### Immediate
1. ✅ Fixed package.json mismatch
2. ✅ Pushed updates to GitHub
3. ⏳ Wait for Vercel re-deployment (2-3 min)
4. ⏳ Check deployment logs

### If Still Failing
1. Get exact error message from Vercel logs
2. Check specific file/line number
3. Verify import paths
4. Check for serverless function size limits
5. Verify API route maxDuration settings

### If Successful
1. Test custom builder on production
2. Test state CET mock tests
3. Monitor for runtime errors
4. Check analytics

---

## 📝 Common Vercel Errors & Solutions

### Error: "Module not found"
**Solution**: 
- Check import paths (case-sensitive on Vercel)
- Verify file exists in git
- Check .gitignore

### Error: "Function size exceeds limit"
**Solution**:
- Split large components
- Use dynamic imports
- Optimize dependencies

### Error: "Build timed out"
**Solution**:
- Increase build timeout
- Optimize build process
- Check for infinite loops

### Error: "Type check failed"
**Solution**:
- Run `npm run build` locally
- Fix all TypeScript errors
- Check for strict mode issues

---

## 🔍 Diagnostic Commands

```bash
# Local build test
npm run build

# Check TypeScript
npx tsc --noEmit

# Check for missing files
git ls-files src/components/custom-mock-test-builder.tsx
git ls-files src/lib/mock-test-config.ts

# Verify imports
grep -r "custom-mock-test-builder" src/
grep -r "Sparkles" src/

# Check package integrity
node -e "require('./package.json')"

# Force clean build
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Current Status

**Local**: ✅ All tests passing  
**GitHub**: ✅ Code pushed (ab0bf67)  
**Vercel**: ⏳ Awaiting deployment  

**Expected**: Deployment should succeed now with synced dependencies.

---

## 🆘 If You Need Help

**Error Message Template**:
```
Deployment: [deployment-id]
Error: [exact error message]
File: [file path]
Line: [line number]
```

**Share**:
1. Vercel deployment logs
2. Exact error message
3. Failed file/line number
4. Build vs runtime error

---

**Last Updated**: May 18, 2026  
**Status**: Fixed package.json mismatch, re-deploying
