# 🎓 Admission Dashboard System

A full-featured admission management system for educational institutions. This application provides a complete workflow from application submission to admissions decision, with separate interfaces for applicants and administrators.

![Dashboard Preview](https://img.shields.io/badge/status-active-success) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🚀 Features

### For Administrators

- **Dashboard** - Real-time statistics, activity logs, and visual analytics
- **Applications** - View, filter, and manage all applications with detailed views
- **Documents** - Upload, verify, flag, and reject applicant documents with preview support
- **Messages** - Thread-based messaging system to communicate with applicants
- **Reports** - Comprehensive analytics with charts (applications by program, status distribution, trends)
- **Reviews** - Supervisor approval workflow for admin actions (quality control)
- **Multi-role Support** - Super Admin, Admission Officer, Reviewer, Coordinator

### For Applicants

- Multi-step application form with validation
- Email OTP verification
- Document upload capability
- View application status tracking
- Direct messaging with admissions office

---

## 🏗️ Architecture

**Frontend Stack:**
- React 18 + TypeScript
- Vite (fast build tool)
- Tailwind CSS + custom styles
- React Router v6
- Recharts (data visualization)
- Lucide Icons

**Backend Stack:**
- CodeIgniter 4 (PHP)
- RESTful JSON API
- MySQL database
- Session-based authentication with token support

**Database Tables:**
- `applicants` - User accounts
- `applications` - Application forms
- `documents` - Uploaded files
- `messages` - Communication threads
- `admins` - Admin accounts
- `admin_activity_log` - Audit trail

---

## 📸 Screenshots

| Dashboard | Applications | Documents |
|-----------|--------------|-----------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Applications](docs/screenshots/applications.png) | ![Documents](docs/screenshots/documents.png) |

| Messages | Reports | Reviews |
|----------|---------|---------|
| ![Messages](docs/screenshots/messages.png) | ![Reports](docs/screenshots/reports.png) | ![Reviews](docs/screenshots/reviews.png) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 16
- PHP ≥ 8.0
- MySQL ≥ 8.0
- Composer

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd admission-dashboard
```

### 2. Database Setup
```bash
# Import the database schema
mysql -u root -p admission_db < ci4/database_setup.sql

# Or use phpMyAdmin to import ci4/database_setup.sql
```

### 3. Backend Configuration

```bash
# Navigate to backend
cd ci4

# Install dependencies
composer install

# Configure .env
cp env .env
# Edit .env with your database credentials:
# database.default.database = admission_db
# database.default.username = root
# database.default.password = your_password

# Run migrations (optional - SQL already includes all tables)
php spark migrate

# Start backend server
php spark serve --port=8080
```

Backend runs at: **http://localhost:8080/api**

### 4. Frontend Setup

```bash
# From root directory
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Demo Credentials

### Admin Accounts
| Name | Email | Password | Role |
|------|-------|----------|------|
| John Smith | john.smith@admission.edu | admin123 | Super Admin |
| Sarah Johnson | sarah.johnson@admission.edu | admin123 | Admission Officer |
| Michael Williams | michael.williams@admission.edu | admin123 | Reviewer |
| Emily Brown | emily.brown@admission.edu | admin123 | Coordinator |

### Sample Applicant Data
- **Alice Brown** - APP0001 - Computer Science
- **Michael Chen** - APP0002 - Engineering
- **Emma Wilson** - APP0003 - Business Administration

---

## 📊 Features in Detail

### 1. Dashboard
Real-time overview of admission metrics:
- Total applications count
- Pending/Approved/Rejected breakdown
- Recent activity feed
- Application trends chart

### 2. Applications Management
- List view with search & filter
- Detailed applicant profile
- Personal information display
- Educational background
- Program selection details
- Quick status actions (Approve/Reject)

### 3. Document Verification
- Centralized document viewer
- Upload directly to applicant's file
- Status management: Pending → Verified/Flagged
- Image & PDF preview in modal
- Download original files
- Bulk actions support

### 4. Messaging
- Threaded conversations
- Real-time message sending
- Unread count indicators
- Applicant history view
- Message search

### 5. Reports & Analytics
- Applications by program (bar chart)
- Status distribution (pie chart)
- Monthly trends (line chart)
- Officer performance metrics
- Export data (PDF/Excel ready)

### 6. Review Workflow
- Admin actions logged for review
- Supervisor approval interface
- Approval/rejection with notes
- Audit trail maintained
- Quality control system

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/admin/login
```

### Applications
```
GET    /api/admin/applicants
GET    /api/admin/applicant/{id}
PUT    /api/admin/applicant/{id}/status
GET    /api/admin/stats
GET    /api/admin/dashboard
```

### Documents
```
GET    /api/documents/applicant/{id}
GET    /api/documents/application/{id}
POST   /api/documents
PUT    /api/documents/{id}/status
DELETE /api/documents/{id}
GET    /api/documents/stats
```

### Messages
```
GET    /api/messages/admin/inbox
GET    /api/messages/thread/{id}
GET    /api/messages/threads
POST   /api/messages
PUT    /api/messages/{id}/read
```

### Reviews
```
POST   /api/admin/review/submit
GET    /api/admin/reviews/pending
PUT    /api/admin/review/{id}
```

---

## 🛠️ Development

### Project Structure
```
admission-dashboard/
├── ci4/                  # CodeIgniter 4 backend
│   ├── app/
│   │   ├── Controllers/Api/
│   │   ├── Models/
│   │   └── Config/
│   ├── app/Database/Migrations/
│   ├── public/           # Web root
│   └── writable/uploads/ # File storage
├── src/                  # React frontend
│   ├── components/
│   │   └── Layout/
│   ├── context/          # Auth & Data contexts
│   ├── pages/
│   ├── types/
│   └── App.tsx
├── database_setup.sql
├── SETUP.md             # Detailed setup guide
├── TESTING.md           # Testing procedures
└── README.md           # This file
```

### Adding New Features

**Backend:**
1. Create migration: `php spark make:migration AddNewTable`
2. Create model: `app/Models/NewModel.php`
3. Create controller: `app/Controllers/Api/NewController.php`
4. Add routes in `ci4/app/Config/Routes.php`

**Frontend:**
1. Create page: `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add navigation item in `Sidebar.tsx`
4. Fetch data via useAuth() or useData()

---

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive test cases.

**Quick Smoke Test:**
```bash
# 1. Start servers (backend on 8080, frontend on 5173)
# 2. Login: john.smith@admission.edu / admin123
# 3. Verify dashboard loads
# 4. Open application, upload document
# 5. Send a message
# 6. Approve application
# 7. Go to Reviews, approve submission
```

---

## ⚠️ Common Issues

### Backend connection refused
- Ensure PHP server is running on port 8080
- Check `.env` database credentials
- Verify MySQL is running

### Frontend shows "Network Error"
- Confirm API_BASE in `src/context/AuthContext.tsx` = `http://localhost:8080/api`
- Check CORS configuration in `ci4/app/Config/Cors.php`
- Ensure no firewall blocking port 8080

### Documents not uploading
- Create `writable/uploads/documents/` folder with 755 permissions
- Check PHP upload_max_filesize (increase if needed)
- Verify file size < 10MB (adjustable in backend)

### Email OTP not working
- Configure SMTP in `ci4/app/Config/Email.php`
- Use Mailtrap for testing: https://mailtrap.io
- Check spam folder

---

## 📦 Deployment

### Production Checklist
- [ ] Set `CI_ENVIRONMENT = production` in `.env`
- [ ] Disable debug toolbar
- [ ] Configure real email SMTP
- [ ] Set up HTTPS (SSL certificate)
- [ ] Change default admin passwords
- [ ] Enable query caching
- [ ] Set up database backups
- [ ] Configure proper file permissions
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging

### Build for Production
```bash
# Frontend
npm run build

# Backend
cd ci4
php spark cache:clear
# Configure Apache/Nginx to serve public/ folder
```

---

## 📚 Documentation

- **Setup Guide** → [SETUP.md](SETUP.md)
- **Testing Guide** → [TESTING.md](TESTING.md)
- **API Reference** → [SETUP.md#api-documentation](SETUP.md#api-documentation)
- **Database Schema** → [SETUP.md#database-schema-reference](SETUP.md#database-schema-reference)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📧 Email: support@admission.edu
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/admission-dashboard/issues)
- 📖 Docs: [SETUP.md](SETUP.md)

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2026-04-17  

Made with ❤️ for educational institutions.
