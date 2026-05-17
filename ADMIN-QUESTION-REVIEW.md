# Admin Question Review Interface

## Overview
A comprehensive admin dashboard to review and fix user-reported questions.

## Features

### ✅ View Reported Questions
- Filter by status: Pending, Reviewing, Fixed, Dismissed
- Pagination support (10 reports per page)
- See full question details with options and explanation
- View reporter information and feedback

### ✅ Edit Questions
- Edit question text
- Modify all 4 options
- Change correct answer
- Update explanation
- Adjust difficulty level
- Add admin notes for internal tracking

### ✅ Manage Reports
- Mark as Fixed (after editing)
- Dismiss without changes
- Add admin notes
- Automatic timestamp tracking

## Access

**URL:** `/admin/questions`

**Admin Users:**
- girish.raj0710@gmail.com
- grgowda07.1992@gmail.com

To add more admins, edit: `src/app/api/admin/questions/route.ts`

## APIs

### GET /api/admin/questions
Fetch reported questions with pagination

**Query Parameters:**
- `status` - pending | reviewing | fixed | dismissed (default: pending)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "reports": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### PUT /api/admin/questions
Update a question (admin only)

**Body:**
```json
{
  "questionId": 123,
  "question": "Updated question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 2,
  "explanation": "Updated explanation",
  "difficulty": "medium"
}
```

### PATCH /api/admin/questions
Update report status

**Body:**
```json
{
  "reportId": "report_123",
  "status": "fixed",
  "adminNotes": "Fixed the typo"
}
```

## Database Schema

### question_reports table
```sql
CREATE TABLE question_reports (
  id TEXT PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);
```

## Testing

1. **Create sample reports:**
```bash
npx tsx scripts/create-sample-reports.ts
```

2. **Start dev server:**
```bash
npm run dev
```

3. **Visit admin dashboard:**
```
http://localhost:3000/admin/questions
```

4. **Test workflow:**
   - Click "Edit Question" on a report
   - Modify question/options/explanation
   - Add admin notes
   - Save changes
   - Report automatically marked as "Fixed"

## Security

- Admin check via email whitelist
- Cookie-based authentication required
- 403 Forbidden for non-admin users
- All updates logged with admin notes

## Future Enhancements

- [ ] Proper role-based access control (admin role in DB)
- [ ] Bulk actions (approve/dismiss multiple reports)
- [ ] Question history/audit log
- [ ] Email notifications to reporters when fixed
- [ ] Advanced search/filter options
- [ ] Export reports to CSV
- [ ] Statistics dashboard (reports per category, response time, etc.)
- [ ] Question versioning (track all changes)
