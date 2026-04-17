# Testing Guide for Admission Dashboard

## Pre-Testing Setup

### 1. Start Backend Server
```bash
cd ci4
php spark serve --port=8080
```
Expected: `CodeIgniter Development Server started on http://localhost:8080`

### 2. Start Frontend
```bash
npm run dev
```
Expected: `Local: http://localhost:5173`

### 3. Verify Database Connection
- Visit: http://localhost:8080/api/admin/stats
- Should return JSON with application stats
- If error, check `.env` database credentials

---

## Test Cases Checklist

### A. Admin Authentication

#### TC001: Admin Login - Super Admin
1. Go to http://localhost:5173/login
2. Enter: `john.smith@admission.edu`
3. Password: `admin123`
4. Click Login
**Expected**: Redirect to dashboard, see "Super Admin" role

#### TC002: Admin Login - Admission Officer
1. Logout
2. Enter: `sarah.johnson@admission.edu`
3. Password: `admin123`
4. Click Login
**Expected**: Redirect to dashboard, see "Admission Officer" role

#### TC003: Invalid Login
1. Enter wrong credentials
2. Click Login
**Expected**: Error message "Invalid admin credentials"

---

### B. Dashboard

#### TC004: Dashboard Loads
1. Login as any admin
2. Navigate to Dashboard
**Expected**:
- Stats cards show numbers (Total, Pending, Approved, Rejected)
- Activity log shows recent actions
- Charts render properly

#### TC005: Dashboard Data Accuracy
1. Note the "Pending Applications" count
2. Go to Applications page
3. Count manually or verify consistency
**Expected**: Numbers should match

---

### C. Applications Management

#### TC006: View Applications List
1. Go to Applications page
**Expected**:
- List of all applicants with their details
- Status badges visible
- Search bar functional
- Pagination works

#### TC007: View Application Detail
1. Click on any application row
**Expected**: Detail page opens with tabs (Details, Documents, Messages)

#### TC008: Application Detail - Personal Info
1. On detail page, check "Personal Information" section
**Expected**: Name, email, phone, address displayed correctly

#### TC009: Application Detail - Education
1. Check "Education Background" section
**Expected**: Primary and secondary school info shown

#### TC010: Application Detail - Program
1. Check "Program Details" section
**Expected**: Program name, campus, intake displayed

---

### D. Document Management

#### TC011: Upload Document
1. Open any application
2. Go to Documents tab
3. Select document type (e.g., "Transcript")
4. Choose a PDF or image file
5. Click "Upload Document"
**Expected**: Upload succeeds, document appears in list with "Pending" status

#### TC012: Upload Valid File Types
Try uploading: `.pdf`, `.jpg`, `.png`, `.doc`, `.docx`
**Expected**: All accepted

#### TC013: Upload Invalid File Type
Try uploading: `.exe`, `.php`
**Expected**: Should be rejected by browser/file input

#### TC014: Document Preview (Image)
1. Upload an image file
2. Click eye icon on document row
**Expected**: Modal opens showing image preview

#### TC015: Document Preview (PDF)
1. Upload PDF file
2. Click eye icon
**Expected**: PDF displays in iframe

#### TC016: Document Download
1. Click download icon
**Expected**: File downloads or opens in new tab

#### TC017: Verify Document
1. On pending document, click Check Circle icon
**Expected**: Status changes to "Verified", green badge appears

#### TC018: Flag Document
1. On pending document, click Alert Triangle icon
**Expected**: Status changes to "Flagged", red badge appears

#### TC019: Reject Document
1. On flagged document, click X Circle icon
**Expected**: Status changes to "Rejected"

---

### E. Messaging System

#### TC020: View Message Inbox
1. Go to Messages page
**Expected**:
- List of conversation threads on left
- Unread count shown
- Sender name and subject displayed

#### TC021: Open Conversation
1. Click on any thread
**Expected**: Full conversation loads on right side

#### TC022: Message Display
1. Check message bubbles
**Expected**:
- Applicant messages on left (gray)
- Admin messages on right (blue)
- Timestamps visible

#### TC023: Send Reply
1. In conversation view, type a message
2. Click "Send Reply"
**Expected**: Message appears in conversation immediately

#### TC024: Empty State
1. With no thread selected, check right panel
**Expected**: "Select a conversation to view" message shown

#### TC025: Search Messages
1. Type in search box
**Expected**: Threads filtered by subject/content

#### TC026: Filter Unread
1. Click "Unread" tab
**Expected**: Only unread threads shown

---

### F. Application Status Management

#### TC027: Approve Application
1. Open pending application
2. Click "Approve" button
3. (Optional) Add note
4. Confirm
**Expected**:
- Status changes to "Approved" (green badge)
- Note saved if provided

#### TC028: Reject Application
1. Open pending application
2. Click "Reject" button
3. Add rejection reason
4. Confirm
**Expected**:
- Status changes to "Rejected" (red badge)
- Note displayed in Admin Notes section

#### TC029: Status Change on Already Reviewed
1. Open approved/rejected application
**Expected**: Approve/Reject buttons not visible

---

### G. Reports & Analytics

#### TC030: Reports Page Loads
1. Navigate to Reports
**Expected**: All charts visible with data

#### TC031: Stats Cards Accuracy
1. Compare Reports total with Applications page count
**Expected**: Should match

#### TC032: Applications by Program Chart
1. Check bar chart
**Expected**: Bars showing counts per program

#### TC033: Status Distribution Pie Chart
1. Check pie chart
**Expected**: Segments for Pending, Approved, Rejected, etc.

#### TC034: Monthly Trends
1. Check line chart
**Expected**: Lines showing application trends over months

#### TC035: Officer Performance Table
1. Scroll to Officer Performance section
**Expected**: Table showing officer names with approval rates

#### TC036: Submit Changes for Review
1. Scroll to "Submit Changes for Review" section
2. Enter description: "Approved 5 applications today"
3. Click "Submit for Review"
**Expected**: Success alert, field cleared

---

### H. Reviews Panel (Supervisor)

#### TC037: Access Reviews Page
1. Login as super admin (john.smith@admission.edu)
2. Go to Reviews in sidebar
**Expected**: Page shows pending reviews

#### TC038: View Pending Reviews
1. Check stats cards
**Expected**: Count of pending, approved, rejected reviews

#### TC039: Review Item Detail
1. Click eye icon on a review
**Expected**: Modal opens with full description and approve/reject buttons

#### TC040: Approve Review
1. Open a pending review
2. Click "Approve"
3. Add optional note
4. Confirm
**Expected**: Review status changes to Approved, disappears from pending list

#### TC041: Reject Review
1. Open a pending review
2. Click "Reject"
3. Add feedback note
4. Confirm
**Expected**: Review marked as Rejected

#### TC042: Filter Reviews
1. Click "Approved" tab
**Expected**: Shows only approved reviews
2. Click "All" tab
**Expected**: Shows all reviews with status badges

---

### I. End-to-End Flow

#### TC043: Complete Application Lifecycle
1. **Admin logs in**
2. **Views dashboard** → sees stats
3. **Opens Applications** → selects pending app
4. **Views Documents tab** → uploads transcript
5. **Verifies document** → clicks verify
6. **Moves to Messages** → sends message to applicant
7. **Approves application** → clicks approve with note
8. **Submits report** → goes to Reports, submits changes
9. **Supervisor reviews** → logs in as super admin, reviews submission
10. **Checks activity log** → sees all actions logged

**Expected**: All steps complete without errors, data persists

---

### J. Error Handling

#### TC044: Backend Offline
1. Stop PHP server
2. Refresh frontend page
**Expected**: Fallback to mock data shows demo mode message

#### TC045: Invalid File Upload
1. Try uploading .exe file
**Expected**: Upload fails with error message

#### TC046: Network Error on Status Update
1. Disconnect network
2. Try to approve application
3. Reconnect
**Expected**: Error message "Network error"

---

## API Testing with Curl

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.smith@admission.edu","password":"admin123"}'
```

### Get Applications
```bash
curl http://localhost:8080/api/admin/applicants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Documents
```bash
curl http://localhost:8080/api/documents/application/1 \
  -H "X-Admin-ID: 1"
```

### Send Message
```bash
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -H "X-Admin-ID: 1" \
  -d '{"sender_type":"admin","sender_id":1,"recipient_type":"applicant","recipient_id":1,"subject":"Test","content":"Hello"}'
```

---

## Performance Checks

### Page Load Times
- Dashboard: < 2 seconds
- Applications list: < 2 seconds
- Documents: < 2 seconds
- Messages: < 1 second

### Large Dataset Handling
- With 100+ applications, pagination works
- Search remains responsive

### Memory Usage
- Frontend: < 100MB
- Backend: < 50MB

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Mobile Responsiveness

Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Known Issues & Limitations

1. Email OTP not functional without SMTP configuration
2. File uploads stored in `writable/uploads/` - backup needed
3. No password reset for admins (planned feature)
4. Reviewer role not fully implemented (can use super admin)

---

## Test Sign-Off

| Test Area | Status | Tester | Date |
|-----------|--------|--------|------|
| Admin Auth | ⬜ | | |
| Dashboard | ⬜ | | |
| Applications | ⬜ | | |
| Documents | ⬜ | | |
| Messages | ⬜ | | |
| Reports | ⬜ | | |
| Reviews | ⬜ | | |
| E2E Flow | ⬜ | | |

---

## Quick Smoke Test (5 minutes)

1. Start backend & frontend
2. Login as john.smith@admission.edu / admin123
3. Check Dashboard loads with numbers
4. Open Applications → click one
5. Go to Documents tab → upload a file
6. Verify document appears
7. Go to Messages → open thread → send reply
8. Approve application
9. Go to Reports → submit a change
10. Go to Reviews → approve/review item
11. Logout

**Result**: All steps should work without errors.

---

**Next**: Run full test suite, then deploy to production environment.
