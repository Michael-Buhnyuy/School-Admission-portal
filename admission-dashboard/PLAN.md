# Admission Portal - Complete Implementation Guide

This document explains in detail how the entire admission portal system works, with examples and explanations for each component.

---

## Table of Contents
1. [System Overview](#system-overview)
2. [How the User Flow Works](#how-the-user-flow-works)
3. [Database Tables Explained](#database-tables-explained)
4. [Backend (CodeIgniter) Explained](#backend-codeigniter-explained)
5. [Frontend Explained](#frontend-explained)
6. [How to Connect Everything](#how-to-connect-everything)
7. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)

---

## 1. System Overview

### What is This System?

This is a complete **Admission Portal** for a school/university that allows:
- **Applicants** to apply online, verify with OTP, make payments, and check their status
- **Admins** to manage applications, verify documents, approve/reject applicants, and manage programs

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMISSION PORTAL                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌────────────────┐   │
│   │   LANDING    │    │ APPLICATION  │    │     ADMIN      │   │
│   │    PAGE      │───▶│    FORM      │───▶│   DASHBOARD    │   │
│   │              │    │              │    │  (React App)   │   │
│   └──────────────┘    └──────────────┘    └────────────────┘   │
│          │                  │                     │             │
│          │                  │                     │             │
│          ▼                  ▼                     ▼             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CODEIGNITER BACKEND (PHP)                   │   │
│   │                                                         │   │
│   │   • Handles all data processing                         │   │
│   │   • Sends emails (OTP, admission letters)               │   │
│   │   • Manages database operations                         │   │
│   │   • Provides API for both frontend apps                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              MYSQL DATABASE (Server)                     │   │
│   │   Stores: Applicants, Admins, Programs, Documents, etc. │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. How the User Flow Works

### A. Applicant Flow (Detailed Example)

Let's follow a student named **John Doe** through the entire process:

#### Step 1: Landing Page
John visits the school website and sees a landing page with:
- School information
- Programs offered
- "Apply Now" button

**Code Example (Landing Page Link):**
```
html
<a href="/apply">Apply Now</a>
```

#### Step 2: Start Application (Enter Email & Phone)
John clicks "Apply Now" and enters:
- Email: john.doe@email.com
- Phone: +237612345678

**What Happens:**
1. React sends this data to CodeIgniter backend
2. Backend generates a 6-digit OTP (e.g., "123456")
3. Backend sends OTP to John's email
4. Backend stores OTP in database with 10-minute expiration

**API Call Example:**
```
javascript
// Frontend (React)
fetch('https://school.com/api/web/application/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.doe@email.com',
    phone: '+237612345678'
  })
})
```

#### Step 3: OTP Verification
John checks his email and enters OTP "123456" on the verification page.

**Backend Logic Example (PHP CodeIgniter):**
```
php
// In Application.php controller
public function verify_otp() {
    $email = $this->input->post('email');
    $otp = $this->input->post('otp');
    
    // Check if OTP is valid and not expired
    $result = $this->otp_model->verify_otp($email, $otp);
    
    if ($result['success']) {
        // Mark email as verified in database
        $this->applicant_model->update_otp_status($email, true);
        return json_encode(['status' => 'success', 'message' => 'OTP verified']);
    } else {
        return json_encode(['status' => 'error', 'message' => 'Invalid OTP']);
    }
}
```

#### Step 4: Complete Application Form
Now John can fill in all his details:
- Full Name: John Doe
- Date of Birth: 2005-05-15
- Gender: Male
- Address: Douala, Cameroon
- Program: Computer Science
- Level: HND
- Previous School: ABC High School
- GPA: 3.5
- Upload documents (certificate, transcript, ID)

**Frontend Form Example (React):**
```jsx
function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    programId: '',
    levelId: '',
    previousSchool: '',
    gpa: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send to backend
    applicantApi.post('/application/complete', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="First Name"
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
      />
      {/* More form fields... */}
      <button type="submit">Submit Application</button>
    </form>
  );
}
```

#### Step 5: Payment
John selects payment method:
- **MTN Mobile Money**
- **Orange Money**
- **Bank Transfer**

**Payment Options Example:**
```
jsx
function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState('');
  
  return (
    <div>
      <h3>Select Payment Method</h3>
      <label>
        <input 
          type="radio" 
          name="payment" 
          value="mtn"
          onChange={(e) => setPaymentMethod('mtn')}
        />
        MTN Mobile Money
      </label>
      <label>
        <input 
          type="radio" 
          name="payment" 
          value="orange"
          onChange={(e) => setPaymentMethod('orange')}
        />
        Orange Money
      </label>
      <label>
        <input 
          type="radio" 
          name="payment" 
          value="bank_transfer"
          onChange={(e) => setPaymentMethod('bank_transfer')}
        />
        Bank Transfer
      </label>
      
      {paymentMethod === 'bank_transfer' && (
        <div>
          <h4>Bank Details:</h4>
          <p>Bank: EcoBank</p>
          <p>Account: 1234567890</p>
          <p>Reference: APP-{Date.now()}</p>
        </div>
      )}
    </div>
  );
}
```

#### Step 6: Application Submitted
John's application is saved with status "pending" in the database.

**Database Record Example:**
```
sql
-- In 'applicants' table
id: 1
application_number: 'APP-2024-0001'
first_name: 'John'
last_name: 'Doe'
email: 'john.doe@email.com'
phone: '+237612345678'
status: 'pending'
is_otp_verified: 1
is_payment_verified: 0
created_at: '2024-01-15 10:30:00'
```

#### Step 7: Admin Reviews Application
Admin logs in, sees John's application, reviews documents, and makes decision.

**Admin Decision Example:**
```
John's Application Status: APPROVED
Reason: All documents verified, meets requirements
Decision by: Admin Mary
Date: 2024-01-16
```

#### Step 8: Acceptance Email Sent
Backend sends email to John with:
- Admission letter (PDF attachment)
- Login credentials (username: john.doe@email.com, password: generated123)

**Email Example:**
```
Subject: Congratulations! You've Been Admitted

Dear John Doe,

We are pleased to inform you that you have been admitted to 
our Computer Science program (HND).

Your Login Credentials:
Username: john.doe@email.com
Password: Abc123xyz

Click here to login: https://school.com/applicant-login

Welcome to our school!

Best regards,
Admissions Office
```

---

### B. Admin Flow (Detailed Example)

Let's follow **Admin Mary** who manages admissions:

#### Step 1: Admin Login
Admin Mary visits `/login` and enters:
- Username: mary
- Password: admin123

**What Happens:**
1. React sends credentials to backend
2. Backend verifies against `admins` table
3. Backend returns auth token
4. React stores token and redirects to dashboard

**Login API Call:**
```
javascript
// Frontend
const login = async (username, password) => {
  const response = await fetch('https://school.com/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('admin_token', data.token);
    return true;
  }
  return false;
};
```

#### Step 2: View Dashboard
Admin Mary sees:
- Total Applications: 150
- Pending: 45
- Approved: 80
- Rejected: 25

#### Step 3: Review Applications
Mary clicks on "Applications" to see list. She can:
- Filter by status (pending, approved, rejected)
- Search by name or application number
- View applicant details

#### Step 4: Verify Documents
Mary clicks on an applicant to see uploaded documents:
- Check certificate (verify it's real)
- Check transcript
- Check ID

**Document Status Options:**
- ✅ Verified (document is valid)
- ⚠️ Flagged (suspicious document)
- ❌ Missing (not uploaded)
- ⏳ Pending (not yet reviewed)

#### Step 5: Make Decision
After review, Mary can:
- **Approve** the application
- **Reject** the application
- Add reason for decision

**Decision API Example:**
```
javascript
// Frontend - Making a decision
const makeDecision = async (applicantId, decision, reason) => {
  const token = localStorage.getItem('admin_token');
  
  await fetch(`https://school.com/api/applicants/${applicantId}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      decision: 'approved', // or 'rejected'
      reason: 'All documents verified, meets GPA requirements'
    })
  });
};
```

#### Step 6: Manage Programs
Mary can add new programs under each level:
- **HND**: Computer Science, Business, Accounting
- **BCS**: Software Engineering, Data Science
- **Direct BSc**: Mathematics, Physics
- **Masters**: MBA, MSc Computer Science

**Add Program Example:**
```
javascript
const addProgram = async (programData) => {
  await fetch('https://school.com/api/programs', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Computer Science',
      code: 'CS-HND',
      level_id: 1, // HND
      required_papers: 1,
      capacity: 100
    })
  });
};
```

---

## 3. Database Tables Explained

### What is a Database?

A database is like a digital filing cabinet that stores information. MySQL is a popular database system.

### Each Table Explained

#### Table 1: `admins` (Who can access the dashboard)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | INT | Unique ID | 1 |
| username | VARCHAR | Login name | "mary" |
| password | VARCHAR | Hashed password | "$2y$10$..." |
| first_name | VARCHAR | First name | "Mary" |
| last_name | VARCHAR | Last name | "Johnson" |
| email | VARCHAR | Email address | "mary@school.edu" |
| role | ENUM | Role type | "admin", "officer" |
| is_active | TINYINT | Account active? | 1 = yes |

**SQL Example:**
```
sql
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role ENUM('super_admin', 'admin', 'officer') DEFAULT 'officer',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What each role can do:**
- **Super Admin**: Everything (create other admins, change settings)
- **Admin**: Manage applications, programs, make decisions
- **Officer**: View applications, verify documents, send messages

---

#### Table 2: `admission_levels` (The different study levels)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | INT | Unique ID | 1 |
| name | VARCHAR | Level name | "Higher National Diploma" |
| code | VARCHAR | Short code | "HND" |
| description | TEXT | Details | "2-year program" |
| is_active | TINYINT | Active? | 1 |

**SQL Example:**
```
sql
CREATE TABLE admission_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1
);

-- Sample data:
INSERT INTO admission_levels (name, code, description) VALUES 
('Higher National Diploma', 'HND', 'HND Programs'),
('Bachelor of Computer Science', 'BCS', 'Direct BCS'),
('Bachelor of Science Direct', 'DIRECT_BSC', 'Direct Entry BSc'),
('Masters', 'MASTERS', 'Masters Programs');
```

---

#### Table 3: `programs` (Specific courses under each level)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | INT | Unique ID | 1 |
| level_id | INT | Links to level | 1 (HND) |
| name | VARCHAR | Program name | "Computer Science" |
| code | VARCHAR | Short code | "CS-HND" |
| description | TEXT | Details | "Study of computing..." |
| required_papers | INT | Papers needed | 1 |
| capacity | INT | Max students | 100 |

**SQL Example:**
```
sql
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    required_papers INT DEFAULT 1,
    capacity INT DEFAULT 100,
    is_active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (level_id) REFERENCES admission_levels(id)
);

-- Sample data:
INSERT INTO programs (level_id, name, code, description, capacity) VALUES 
(1, 'Computer Science', 'CS-HND', 'Computer Science HND', 100),
(1, 'Business Management', 'BM-HND', 'Business Management HND', 80),
(2, 'Software Engineering', 'SE-BCS', 'Software Engineering BSc', 60);
```

---

#### Table 4: `applicants` (All applicant information)

This is the MAIN table storing applicant data.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | INT | Unique ID | 1 |
| application_number | VARCHAR | Unique app ID | "APP-2024-0001" |
| first_name | VARCHAR | First name | "John" |
| last_name | VARCHAR | Last name | "Doe" |
| email | VARCHAR | Email | "john@email.com" |
| phone | VARCHAR | Phone | "+237612345678" |
| date_of_birth | DATE | DOB | "2005-05-15" |
| gender | ENUM | Gender | "male" |
| address | TEXT | Address | "Douala, Cameroon" |
| program_id | INT | Program applied | 1 |
| level_id | INT | Level applied | 1 |
| previous_school | VARCHAR | Last school | "ABC High School" |
| gpa | DECIMAL | Grade | 3.5 |
| status | ENUM | Application status | "pending" |
| otp_code | VARCHAR | OTP for verification | "123456" |
| otp_expires_at | DATETIME | OTP expiry | "2024-01-15 11:00:00" |
| is_otp_verified | TINYINT | Email verified? | 1 |
| is_payment_verified | TINYINT | Payment done? | 0 |
| payment_method | ENUM | Payment type | "mtn" |
| admission_letter_sent | TINYINT | Letter sent? | 0 |

**Application Status Options:**
- `pending` - Not yet reviewed
- `reviewed` - Being reviewed
- `verified` - Documents verified
- `approved` - Accepted
- `rejected` - Not accepted

**SQL Example:**

- [ ] Create Program management
- [ ] Create Level management
- [ ] Create Admission settings

### Phase 5: Email/Notifications

- [ ] Configure email in CodeIgniter
- [ ] Send OTP emails
- [ ] Send admission letters
- [ ] Send login credentials

---

## Server Setup Guide

### Option 1: Remote Server (Recommended for Production)

1. **Get Server** - Purchase/Rent a VPS or use cloud (AWS, DigitalOcean, Linode)

2. **Install LAMP Stack** (On Ubuntu)

```
bash
   sudo apt update
   sudo apt install apache2 mysql-server php php-mysql libapache2-mod-php

```

3. **Configure MySQL**

```
bash
   sudo mysql
   CREATE DATABASE admission_portal;
   CREATE USER 'admission_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON admission_portal.* TO 'admission_user'@'localhost';
   FLUSH PRIVILEGES;

```

4. **Deploy Backend**

```
bash
   sudo cp -r admission-backend /var/www/html/
   sudo chown -R www-data:www-data /var/www/html/admission-backend

```

### Option 2: Local Development

1. **XAMPP/WAMP** - Install XAMPP or WAMP, start Apache and MySQL, put CodeIgniter in htdocs folder

2. **Using PHP's Built-in Server**

```
bash
   cd admission-backend
   php spark serve --host 0.0.0.0 --port 8000

```

---

## Admin Roles

| Role            | Permissions                                               |
| --------------- | --------------------------------------------------------- |
| **Super Admin** | Full access, can create other admins, manage all settings |
| **Admin**       | Manage applications, programs, levels, make decisions     |
| **Officer**     | View applications, verify documents, send messages        |

---

## Payment Integration Notes

For MTN, Orange, and Bank Transfer:

1. **MTN/Orange Mobile Money** - Requires MTN MoMo API integration OR USSD for manual verification, Store payment reference in database

2. **Bank Transfer** - Provide bank account details, Admins verify manually, Update payment status in system

---

## Next Steps

1. **Confirm this plan** - Let me know if anything needs modification
2. **Provide the Landing Page** - Send your landing page code
3. **Provide the Application Form** - Send your application form code
4. **Set up the server** - Get your server details for database
5. **Start implementation** - We'll build step by step

---

## Questions to Confirm

Before proceeding, please confirm:

1. ✓ Do you have access to a MySQL server (local or remote)?
2. ✓ Do you have PHP hosting available for CodeIgniter?
3. ✓ What are the server details (IP, username, etc.)?
4. ✓ Do you want to use SMTP for emails or a service like SendGrid/Mailgun?
5. ✓ Which payment methods do you want to integrate fully?
6. ✓ Do you have the landing page and application form ready to share?
