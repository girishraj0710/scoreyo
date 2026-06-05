# Study Materials Feature - Quick Start Guide

## Files Created (14 total)

### Database & Storage
1. **scripts/create-study-materials-table.sql** - PostgreSQL schema
2. **src/lib/supabase.ts** - Supabase Storage integration

### Database Functions
3. **src/lib/db.ts** - Added 9 new functions (see below)

### API Routes (6)
4. **src/app/api/contributor/study-materials/route.ts** - Upload
5. **src/app/api/admin/study-materials/route.ts** - List pending
6. **src/app/api/admin/study-materials/[id]/approve/route.ts** - Approve
7. **src/app/api/admin/study-materials/[id]/reject/route.ts** - Reject
8. **src/app/api/study-materials/route.ts** - List approved
9. **src/app/api/study-materials/[id]/download/route.ts** - Download

### UI Components
10. **src/components/study-material-uploader.tsx** - Reusable uploader
11. **src/app/contributor/materials/page.tsx** - Contributor upload wizard
12. **src/app/admin/review-materials/page.tsx** - Admin review dashboard
13. **src/app/study-materials/page.tsx** - Student materials browser

### Navigation Updates
14. **src/app/contributor/page.tsx** - Added materials card
15. **src/app/more/page.tsx** - Added materials menu link

## Database Functions Added to src/lib/db.ts

```typescript
insertStudyMaterial(data: {...}) -> Promise<string>
getPendingStudyMaterials(limit, offset) -> Promise<Material[]>
getStudyMaterialsByExamSubject(exam_id, subject_id, limit, offset) -> Promise<Material[]>
approveStudyMaterial(id, admin_id) -> Promise<void>
rejectStudyMaterial(id, reason) -> Promise<void>
incrementDownloadCount(id) -> Promise<void>
getStudyMaterial(id) -> Promise<Material>
getContributorStudyMaterials(contributor_id) -> Promise<Material[]>
getPendingStudyMaterialsCount() -> Promise<number>
```

## Setup Steps

### 1. Create Database Table
```bash
cd /Users/girish.raj/prepgenie
psql -U postgres -h db.zomcofptwlumqkeffbht.supabase.co -d postgres \
  < scripts/create-study-materials-table.sql
```

### 2. Create Supabase Storage Bucket
1. Go to Supabase Dashboard
2. Storage → Create Bucket
3. Name: `prepgenie-study-materials`
4. Make Public
5. No file size limit (we validate in code)

### 3. Test the Feature

**As Contributor:**
- Navigate to /contributor (you should see 4 cards now)
- Click "Upload Study Materials"
- Select exam → subject → upload files
- Check /contributor/submissions to see status

**As Admin:**
- Navigate to /admin/review-materials
- Review pending materials
- Approve or reject with reason

**As Student:**
- Navigate to /study-materials
- Browse approved materials
- Download files

## URL Routes

### Contributor
- `/contributor` - Portal with new materials card
- `/contributor/materials` - Upload wizard (new)

### Admin
- `/admin/review-materials` - Review dashboard (new)

### Student/Public
- `/study-materials` - Browse materials (new)
- `/more` - Menu with materials link (updated)

## API Endpoints

### Upload (Contributor)
```
POST /api/contributor/study-materials
Content-Type: multipart/form-data
Body: files[], examId, subjectId, titles[], descriptions[]
```

### List Pending (Admin)
```
GET /api/admin/study-materials?status=pending&limit=50&offset=0
```

### Approve (Admin)
```
POST /api/admin/study-materials/[id]/approve
```

### Reject (Admin)
```
POST /api/admin/study-materials/[id]/reject
Body: { "reason": "..." }
```

### List Approved (Public)
```
GET /api/study-materials?examId=...&subjectId=...&limit=50&offset=0
```

### Download (Public)
```
GET /api/study-materials/[id]/download
```

## Validation Rules

- **File Types:** PDF, DOCX, PPTX only
- **File Size:** Max 50MB per file
- **Batch Size:** Max 200MB total
- **File Count:** Max 10 files per upload
- **Title:** 1-255 characters
- **Description:** 0-500 characters
- **Rejection Reason:** 1-500 characters

## Features Implemented

✅ Multi-file drag-and-drop upload
✅ Real-time file validation
✅ Contributor workflow (exam → subject → upload)
✅ Admin review dashboard
✅ Approve with points reward (5 points)
✅ Reject with reason
✅ Student materials browser
✅ Download tracking (download_count)
✅ Pagination support
✅ Mobile responsive
✅ Error handling
✅ Loading states
✅ Async non-blocking operations

## Security

- File type whitelist (no executables)
- File size limits enforced
- MIME type verification
- Admin auth required for review
- User auth required for upload
- Only approved materials shown to students
- Download counter prevents abuse

## Performance

- Supabase Storage for scalable file storage
- Database indexes on common queries
- Pagination for large result sets
- Async download counter (non-blocking)
- Connection pooling via PostgreSQL

## Next Steps

1. ✅ Run database setup script
2. ✅ Create Supabase storage bucket
3. ✅ Test upload as contributor
4. ✅ Test review as admin
5. ✅ Test download as student
6. Consider: Email notifications, bulk actions, analytics
