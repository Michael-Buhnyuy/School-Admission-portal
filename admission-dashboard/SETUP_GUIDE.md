# Admission Dashboard - Complete Setup Guide

## Overview

This is a full-stack admission dashboard with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: CodeIgniter 4 (PHP)
- **Database**: MySQL

## Quick Start

### Step 1: Database Setup

1. Open phpMyAdmin or MySQL Workbench
2. Create a new database named `admission_db`
3. Import the database schema:
   - Go to `ci4/database_setup.sql`
   - Copy the SQL content
   - Run it in phpMyAdmin

### Step 2: Configure Database Credentials

Edit `ci4/app/Config/Database.php`:

```
php
'hostname'     => 'localhost',
'username'     => 'root',        // Your MySQL username
'password'     => '',             // Your MySQL password
'database'     => 'admission_db',
```

### Step 3: Configure Email (for OTP)

Edit `ci4/app/Config/Email.php`:

```
php
'SMTPUser' => 'your-email@gmail.com',
'SMTPPass' => 'your-16-character-app-password',
```

- For Gmail: Use Google App Password (not regular password)
- Go to Google Account → Security → 2-Step Verification → App Passwords

### Step 4: Start the Backend (CodeIgniter)

```bash
cd ci4
php spark serve --port 8080
```

### Step 5: Start the Frontend

```
bash
cd c:/Users/TB COMPUTERS/admission-dashboard
npm run dev
```

## Access URLs

- **Landing Page**: http://localhost:5173/
- **Apply Now**: http://localhost:5173/apply
- **Applicant Login**: http://localhost:5173/applicant/login
- **Admin Login**: http://localhost:5173/login
- **Admin Dashboard**: http://localhost:5173/app/dashboard

## Admin Credentials

| Role              | Email                          | Password |
| ----------------- | ------------------------------ | -------- |
| Super Admin       | john.smith@admission.edu       | admin123 |
| Admission Officer | sarah.johnson@admission.edu    | admin123 |
| Reviewer          | michael.williams@admission.edu | admin123 |

## Flow

1. **Applicant** visits landing page → clicks "Apply Now"
2. Fills application form → submits
3. **OTP sent to email** for verification
4. After verification, applicant can login to check status
5. **Admin** logs in to view/approve/reject applications

## API Endpoints

- `POST /api/applicant/register` - Register new applicant
- `POST /api/applicant/login` - Applicant login
- `POST /api/applicant/send-otp` - Send OTP
- `POST /api/applicant/verify-otp` - Verify OTP
- `POST /api/application/submit` - Submit application
- `POST /api/admin/login` - Admin login
- `GET /api/admin/applicants` - Get all applicants
- `PUT /api/admin/applicant/:id/status` - Update application status

## Troubleshooting

- If frontend can't connect to backend: Make sure both servers are running
- Database connection errors: Check username/password in Database.php
- Email not sending: Check SMTP settings and App Password
