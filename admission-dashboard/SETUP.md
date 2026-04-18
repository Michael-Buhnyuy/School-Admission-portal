# Admission Dashboard - Complete Setup Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Complete Application Flow](#complete-application-flow)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

This is a full-stack admission management system with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS (Port: 5173)
- **Backend**: CodeIgniter 4 PHP REST API (Port: 8080)
- **Database**: MySQL

### Features Implemented

#### Admin Dashboard Sections
1. **Dashboard** - Overview stats, recent activity, charts
2. **Applications** - List all applications, view details, approve/reject
3. **Documents** - View all applicant documents, verify/flag/reject, upload new docs
4. **Messages** - View inbox, conversation threads, send messages to applicants
5. **Reports** - Analytics, charts, officer performance, submit changes for review
6. **Reviews** - Admin supervisor panel to review changes made by other admins

#### Applicant Features
- Multi-step application form
- OTP email verification
- Document upload
- View application status
- Contact admin via messaging

---

## Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **PHP** (v8.0 or higher)
- **MySQL** (v8.0 or higher)
- **Composer** (PHP dependency manager)
- **Apache** or **Nginx** web server (or use PHP's built-in server)

### Optional
- **XAMPP** or **WAMP** (includes PHP, MySQL, Apache)
- **VS Code** or any IDE

---

## Database Setup

### Step 1: Create Database

1. Open **phpMyAdmin** or MySQL command line
2. Create a new database named `admission_db`
3. Import the provided SQL file:

```bash
# Using command line
mysql -u root -p admission_db < ci4/database_setup.sql
```

Or via phpMyAdmin:
1. Click "Import" tab
2. Choose file: `ci4/database_setup.sql`
3. Click "Go"

### Step 2: Verify Tables

After import, you should have these tables:
- `applicants`
- `applications`
- `otp_verification`
- `admins`
- `admin_activity_log`
- `documents`
- `messages`

---

## Backend Configuration (CodeIgniter 4)

### Step 1: Navigate to Backend Directory

```bash
cd ci4
```

### Step 2: Install Dependencies

```bash
composer install
```

### Step 3: Configure Environment

Edit the `.env` file in the `ci4` folder:

```ini
# Database Configuration
database.default.hostname = localhost
database.default.database = admission_db
database.default.username = root
database.default.password = your_password
database.default.DBDriver = MySQLi
database.default.port = 3306

# Base URL (if needed)
app.baseURL = 'http://localhost:8080/'
```

**Important**: Uncomment the database lines by removing the `#` at the start.

### Step 4: Configure Email (Optional for OTP)

Edit `ci4/app/Config/Email.php`:

```php
public $SMTPHost = 'smtp.gmail.com';
public $SMTPUser = 'your-email@gmail.com';
public $SMTPPass = 'your-app-password';
public $SMTPPort = 587;
public $SMTPCrypto = 'tls';
```

Or use Mailtrap for testing: https://mailtrap.io

### Step 5: Enable CORS (If needed)

Edit `ci4/app/Config/Filters.php` and add CORS filter:

```php
public $aliases = [
    'csrf'     => \CodeIgniter\Filters\CSRF::class,
    'toolbar'  => \CodeIgniter\Debug\Toolbar::class,
    'cors'     => \CodeIgniter\Filters\Cors::class,  // Add this
];
```

### Step 6: Run Migrations

```bash
# Navigate to ci4 folder
cd ci4

# Run all migrations
php spark migrate

# Or run specific migration
php spark migrate AddReviewFieldsToActivityLog
```

### Step 7: Seed Sample Data (Optional)

The SQL file already includes sample data. To add more via seeder:

```bash
php spark db:seed AdminSeeder
```

### Step 8: Start Backend Server

```bash
php spark serve --port=8080
```

The API will be available at: `http://localhost:8080/api`

**API Endpoints:**
- `POST /api/admin/login` - Admin login
- `GET /api/admin/applicants` - Get all applicants
- `POST /api/documents` - Upload document
- `GET /api/documents` - Get documents
- `POST /api/messages` - Send message
- `GET /api/messages/threads` - Get message threads
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/dashboard` - Get dashboard data

---

## Frontend Setup (React)

### Step 1: Navigate to Frontend Directory

```bash
cd ../  # Root directory of the project
```

### Step 2: Install Dependencies

```bash
npm install
```

Required packages already in `package.json`:
- react, react-dom
- react-router-dom
- recharts (for charts)
- lucide-react (for icons)
- tailwindcss

### Step 3: Configure API URL

The API base URL is set in `src/context/AuthContext.tsx`:

```typescript
const API_BASE = "http://localhost:8080/api";
```

If your backend runs on a different port, update this value.

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## Running the Application

### Option 1: Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd ci4
php spark serve --port=8080
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open: http://localhost:5173

### Option 2: Production Build

**Build Frontend:**
```bash
npm run build
```

**Serve static files with Apache/Nginx** or use PHP's built-in server:

```bash
cd ci4
php spark serve --port=8080
```

Then visit: http://localhost:8080

---

## Complete Application Flow

### 1. Admin Login
- URL: `/login`
- Demo credentials:
  - **John Smith** (Super Admin): `john.smith@admission.edu` / `admin123`
  - **Sarah Johnson** (Admission Officer): `sarah.johnson@admission.edu` / `admin123`

### 2. Dashboard
- View application statistics
- Recent activity log
- Quick links to all sections

### 3. Applications List
- `/applications`
- Filter by status
- Search by name/email
- Click to view details
- Approve/Reject from detail view

### 4. Application Detail
- View personal information
- View education background
- View program selection
- Tab: Documents
  - Upload new documents
  - View existing documents
  - Verify/Flag/Reject documents
  - Preview documents
- Tab: Messages
  - Send message to applicant
- Action buttons: Approve/Reject with notes

### 5. Documents (`/documents`)
- View all documents across all applicants
- Filter by status/type
- Preview images & PDFs
- Quick actions: Verify, Flag, Reject
- Download originals

### 6. Messages (`/messages`)
- View conversation threads
- See unread count
- Read full conversations
- Reply to applicants
- Threaded discussions

### 7. Reports (`/reports`)
- Analytics charts:
  - Applications by program
  - Status distribution (pie chart)
  - Monthly trends (line chart)
- Officer performance table
- Submit changes for review (logs review request)

### 8. Reviews (`/reviews`)
- Supervisor view
- See all admin submissions needing approval
- Review and approve/reject with notes
- Audit trail of decisions

### 9. Applicant Journey (Public)
- Landing page: `/`
- Apply: `/apply` (multi-step form)
- OTP verification: `/verify-otp`
- Login: `/applicant/login`
- Track application status

---

## API Documentation

### Authentication
Admin API requires Bearer token in header:
```
Authorization: Bearer {token}
X-Admin-ID: {admin_id}
```

### Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/applicant/{id}` | Get documents by applicant |
| GET | `/api/documents/application/{id}` | Get documents by application |
| GET | `/api/documents/stats` | Get document statistics |
| POST | `/api/documents` | Upload document (multipart) |
| PUT | `/api/documents/{id}/status` | Update document status |
| DELETE | `/api/documents/{id}` | Delete document |

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/admin/inbox` | Admin inbox |
| GET | `/api/messages/threads` | Thread overview |
| GET | `/api/messages/thread/{id}` | Get conversation |
| GET | `/api/messages/conversation` | Applicant conversation |
| POST | `/api/messages` | Send message |
| PUT | `/api/messages/{id}/read` | Mark as read |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/applicants` | All applicants |
| GET | `/api/admin/applicant/{id}` | Single applicant |
| PUT | `/api/admin/applicant/{id}/status` | Update status |
| GET | `/api/admin/stats` | Application stats |
| GET | `/api/admin/dashboard` | Full dashboard data |
| POST | `/api/admin/review/submit` | Submit for review |
| GET | `/api/admin/reviews/pending` | Pending reviews |
| PUT | `/api/admin/review/{id}` | Review decision |

---

## Database Schema Reference

### applicants
```
id (PK)
first_name, last_name
email, phone
password_hash
is_verified, is_active
created_at, updated_at
```

### applications
```
id (PK)
applicant_id (FK)
application_number (unique)
Personal info, education, program details
status (pending/under_review/approved/rejected)
admin_notes, reviewed_by, reviewed_at
created_at, updated_at
```

### documents
```
id (PK)
application_id, applicant_id (FK)
filename, original_name, file_path
type (passport_photo/transcript/certificate/identification/other)
mime_type, size_bytes
status (pending/verified/flagged/rejected)
reviewed_by, notes
uploaded_at
```

### messages
```
id (PK)
thread_id (groups conversations)
sender_type, recipient_type (applicant/admin)
sender_id, recipient_id
subject, content
attachment_path
is_read, status (sent/delivered/read/failed)
created_at
```

### admin_activity_log
```
id (PK)
admin_id (FK)
action, description
entity_type, entity_id
status (pending/approved/rejected) for reviews
reviewed_by, reviewed_at, notes
ip_address, user_agent
created_at
```

### admins
```
id (PK)
admin_id (unique code)
first_name, last_name, email
password_hash
role (super_admin/admission_officer/reviewer/coordinator)
department, phone
is_active, last_login
created_at, updated_at
```

---

## Troubleshooting

### Backend not connecting
- Ensure PHP server is running on port 8080
- Check `.env` database credentials
- Verify migrations ran: `php spark migrate`

### Frontend shows "Network Error"
- Confirm API_BASE in `AuthContext.tsx` is correct
- Check browser console for CORS errors
- Ensure backend URL is accessible

### Documents not uploading
- Check `writable/uploads/documents/` folder exists (created automatically)
- Verify file permissions (755 for folders, 644 for files)
- Check PHP upload_max_filesize and post_max_size in php.ini

### Email OTP not working
- Configure SMTP in `ci4/app/Config/Email.php`
- Use Mailtrap for testing
- Check spam folder

### Database connection error
1. Verify MySQL is running
2. Check username/password in `.env`
3. Ensure database `admission_db` exists
4. Grant privileges: `GRANT ALL ON admission_db.* TO 'root'@'localhost';`

### Port already in use
- Backend: Change port in `php spark serve --port=8081`
- Frontend: Set VITE_PORT in `.env` or use `npm run dev -- --port 5174`

---

## Testing the System

### Test Admin Login
```
Email: john.smith@admission.edu
Password: admin123
```

### Test Applicant Data (already in DB)
1. Alice Brown - APP0001 - Computer Science
2. Michael Chen - APP0002 - Engineering  
3. Emma Wilson - APP0003 - Business Administration

### Test Document Upload
1. Go to Applications → Select one → Documents tab
2. Choose file (PDF, JPG, PNG)
3. Select type
4. Click Upload

### Test Message Reply
1. Go to Messages
2. Click a thread
3. Type message
4. Click Send Reply

### Test Report Submission
1. Go to Reports
2. Scroll to "Submit Changes for Review"
3. Enter description of work done
4. Click "Submit for Review"

### Test Review Approval
1. Go to Reviews (must be logged in as reviewer/supervisor)
2. Click on pending review
3. Add note (optional)
4. Click Approve or Reject

---

## Development Tips

### Adding New Document Types
1. Update ENUM in `ci4/app/Database/Migrations/...CreateDocumentsTable.php`
2. Update form select in `DocumentUploader.tsx`
3. Run migration: `php spark migrate`

### Adding New Application Fields
1. Update `ApplicationForm.tsx`
2. Update `admin/application` validation in CodeIgniter
3. Update database migration

### Customizing Reports
Edit `src/pages/Reports.tsx` to add new charts or metrics.

### Changing Admin Roles
Edit `ci4/app/Models/AdminModel.php` role permissions.

---

## Security Notes

- All API endpoints validate admin authentication
- File uploads are validated for type and size
- SQL injection prevention via CodeIgniter's query builder
- XSS protection via input filtering
- Admin tokens are stored in localStorage (consider HTTPS in production)

---

## Next Steps for Production

1. **Environment Configuration**
   - Set `CI_ENVIRONMENT = production` in `.env`
   - Disable debug toolbar
   - Enable caching

2. **Security Hardening**
   - Use HTTPS
   - Implement rate limiting
   - Add CSRF protection
   - Sanitize file uploads more strictly

3. **Performance**
   - Implement pagination at API level
   - Add indexes to database
   - Enable query caching
   - Compress assets

4. **Monitoring**
   - Set up error logging
   - Monitor admin activity
   - Backup database daily

5. **Email**
   - Configure proper SMTP
   - Set up email templates
   - Test OTP flow

---

## Support

For issues, check:
1. Browser console (F12)
2. PHP error logs in `ci4/writable/logs/`
3. React dev tools

Contact: [Your contact info here]

---

**System Status**: ✅ All core features implemented and connected to backend API.

**Last Updated**: 2026-04-17
