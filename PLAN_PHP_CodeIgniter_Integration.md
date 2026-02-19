# PHP CodeIgniter & MySQL Backend Integration Plan

## Overview

This plan outlines how to replace the current mock authentication system with a real PHP CodeIgniter backend using MySQL database.

## Current State Analysis

### Frontend (React - Already Built)

- **AuthContext.jsx**: Mock login/signup with setTimeout
- **LoginPage.jsx**: Applicant login form
- **SignupPage.jsx**: Applicant registration form
- **AdminLoginPage.jsx**: Admin login form
- **Storage**: localStorage for user session

### Backend (To Be Created)

- **Technology**: PHP with CodeIgniter 4 framework
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

---

## Architecture Overview

```
┌─────────────────┐      HTTP Requests       ┌─────────────────┐
│   React App     │ ◄──────────────────────► │  CodeIgniter    │
│   (Frontend)    │   JSON with JWT Token    │  API (Backend)  │
│                 │                           │                 │
│ - LoginPage     │                           │ - /auth/login   │
│ - SignupPage    │                           │ - /auth/signup  │
│ - AdminLogin    │                           │ - /auth/user    │
│ - AuthContext   │                           │ - /auth/logout  │
└─────────────────┘                           └────────┬────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │    MySQL DB     │
                                               │                 │
                                               │ - users table   │
                                               │ - admins table  │
                                               └─────────────────┘
```

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Setup (PHP CodeIgniter + MySQL)

#### 1.1 Set Up CodeIgniter Project

- Install CodeIgniter 4 via Composer
- Configure base URL and environment
- Set up database connection

#### 1.2 Create MySQL Database

```
sql
-- Database: admission_portal

-- Users table (for applicants)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    role ENUM('applicant') DEFAULT 'applicant',
    avatar VARCHAR(255),
    application_status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',
    application_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admins table (for administrators)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 1.3 Create REST API Endpoints

| Endpoint           | Method | Description              |
| ------------------ | ------ | ------------------------ |
| `/api/auth/login`  | POST   | Authenticate user/admin  |
| `/api/auth/signup` | POST   | Register new applicant   |
| `/api/auth/user`   | GET    | Get current user profile |
| `/api/auth/logout` | POST   | Logout user and admin    |

#### 1.4 Backend Code Structure

```
backend/
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php      # Login, signup, logout
│   │   └── UserController.php      # User profile operations
│   ├── Models/
│   │   ├── UserModel.php           # Applicant operations
│   │   └── AdminModel.php          # Admin operations
│   └── Filters/
│       └── AuthFilter.php           # JWT authentication filter
├── public/
│   └── index.php
└── .env                            # Environment configuration
```

---

### Phase 2: Frontend Updates (React)

#### 2.1 Create API Service

- Create `src/services/api.js` for API calls
- Implement axios instance with JWT token handling
- Create methods: login, signup, getUser, logout

#### 2.2 Update AuthContext

- Replace mock login/signup with API calls
- Store JWT token in localStorage
- Update user state from API response
- Add token refresh logic

#### 2.3 Update LoginPage.jsx

- Already uses useAuth hook - minimal changes needed
- AuthContext handles API communication

#### 2.4 Update SignupPage.jsx

- Already uses useAuth hook - minimal changes needed
- Send full form data to API

#### 2.5 Update AdminLoginPage.jsx

- Already uses useAuth hook - minimal changes needed

---

## What We Both Need To Do

### Developer (Me) - Will Create:

1. **Backend CodeIgniter Setup**
   - Complete CodeIgniter project structure
   - All Controllers, Models, and configurations
   - Database migrations/schema

2. **Frontend Updates**
   - API service file
   - Updated AuthContext with real API calls
   - All other necessary frontend changes

3. **Documentation**
   - API documentation
   - Setup instructions

### User (You) - Need To:

1. **Set Up Local Development Environment**
   - Install PHP (7.4 or 8.x)
   - Install MySQL or use XAMPP/WAMP/MAMP
   - Install Composer
   - Install CodeIgniter

2. **Create MySQL Database**
   - Run the SQL commands I'll provide
   - Set up database credentials

3. **Configure Backend**
   - Update .env file with database credentials
   - Run the CodeIgniter development server

4. **Test the Integration**
   - Test applicant registration
   - Test applicant login
   - Test admin login

---

## Implementation Order

1. **Step 1**: Set up MySQL database (you)
2. **Step 2**: Create CodeIgniter backend (me)
3. **Step 3**: Update React frontend (me)
4. **Step 4**: Connect and test (both)

---

## Security Features

- Password hashing using bcrypt (password_hash/password_verify)
- JWT tokens for session management
- CORS configuration for frontend-backend communication
- Input validation on both frontend and backend
- SQL injection prevention using CodeIgniter's query builder

---

## Follow-up Questions

Before I proceed with implementation, please confirm:

1. Do you have PHP and MySQL installed on your computer?   yes
2. Do you prefer using XAMPP/WAMP/MAMP or standalone installations? XAMP
3. Should I create the backend in a separate folder or within the current project? In a saparate folder within the project folder
4. Do you want me to set up any additional features (like password reset, email verification)? Yes

---

## Ready to Proceed?

Please confirm this plan and let me know:

- Your preferred development environment (XAMPP, WAMP, MAMP, or standalone)
- Any additional features you'd like to include
- Whether you want the backend in a separate folder or inside this project
