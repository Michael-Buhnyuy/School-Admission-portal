# Admission Portal - Specification Document

## 1. Project Overview

**Project Name:** School Admission Portal
**Project Type:** React Web Application
**Core Functionality:** A comprehensive admission management system that allows prospective students to apply online, track their application status, and enables administrators to manage all applications efficiently.
**Target Users:**

- Prospective students (Applicants)
- School administrators

---

## 2. UI/UX Specification

### Color Palette

- **Primary:** #1e3a8a (Deep Blue)
- **Primary Light:** #3b82f6 (Blue)
- **Primary Dark:** #1e1b4b (Dark Blue)
- **Secondary:** #f59e0b (Amber/Gold)
- **Accent:** #10b981 (Emerald Green)
- **Success:** #22c55e (Green)
- **Warning:** #f59e0b (Amber)
- **Error:** #ef4444 (Red)
- **Background:** #f8fafc (Light Gray)
- **Card Background:** #ffffff (White)
- **Text Primary:** #1e293b (Dark Slate)
- **Text Secondary:** #64748b (Slate)
- **Border:** #e2e8f0 (Light Border)

### Typography

- **Primary Font:** 'Playfair Display', serif (for headings)
- **Secondary Font:** 'Poppins', sans-serif (for body text)
- **Heading 1:** 48px, Bold
- **Heading 2:** 36px, Bold
- **Heading 3:** 24px, SemiBold
- **Heading 4:** 20px, SemiBold
- **Body:** 16px, Regular
- **Small:** 14px, Regular
- **Caption:** 12px, Regular

### Spacing System

- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px
- **3xl:** 64px

### Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

---

## 3. Page Structure

### 3.1 Landing Page (Public)

**Header/Navigation:**

- Logo (School crest)
- Nav Links: Home, About Us, Programs, Contact Us
- Auth Buttons: Login, Apply Now
- Mobile hamburger menu

**Hero Section:**

- Full-width background with school image overlay
- Main heading: "Shape Your Future at Excellence Academy"
- Subheading: "Join a community of achievers and leaders"
- CTA Buttons: "Apply Now" (Primary), "Learn More" (Secondary)
- Animated stats counter (Students, Programs, Success Rate, Faculty)

**About Us Section:**

- Two-column layout (Image + Text)
- School history and mission
- Key highlights with icons
- Statistics (Founded year, Students, Faculty, Alumni)

**Programs Section:**

- Section title with decorative line
- Grid of program cards (3 columns desktop, 2 tablet, 1 mobile)
- Each card: Image, Program name, Duration, Description, Learn More button
- Programs: Science, Arts, Commerce, Engineering, Medicine, Law

**Contact Section:**

- Split layout: Contact form + Contact info
- Form fields: Name, Email, Phone, Message
- Contact info: Address, Phone, Email, Social links
- Embedded map placeholder

**Footer:**

- 4-column layout
- Column 1: Logo + Brief description + Social links
- Column 2: Quick Links
- Column 3: Programs
- Column 4: Contact Info
- Bottom bar: Copyright + Privacy Policy + Terms

### 3.2 Login Page

**Layout:**

- Split screen: Left side image/branding, Right side form
- Clean, modern design with glassmorphism effect

**Form Elements:**

- Email input with icon
- Password input with show/hide toggle
- "Remember me" checkbox
- "Forgot Password" link
- Login button (full width)
- Divider with "OR"
- Google Sign-in button
- Sign up link

### 3.3 Signup Page

**Layout:** Same as login page

**Form Elements:**

- Full name input
- Email input
- Password input with strength indicator
- Confirm password input
- Date of birth
- Phone number
- Terms & conditions checkbox
- Signup button
- Google Sign-in button
- Login link

### 3.4 Applicant Dashboard

**Sidebar Navigation:**

- User avatar + name
- Nav items with icons:
  - Dashboard (Home)
  - Application Form
  - Payment
  - My Profile
  - Change Password
  - Notifications
  - Logout

**Dashboard Home:**

- Welcome message with applicant name
- Application status card (Pending/Under Review/Accepted/Rejected)
- Progress tracker (Steps completed)
- Quick stats cards
- Recent notifications

**Application Form (Multi-step):**

- Step 1: Personal Details
  - Full name, Date of birth, Gender
  - Email, Phone, Address
  - Nationality, State, LGA
  - Passport photo upload
- Step 2: Educational Details
  - Primary school (Name, Year, Certificate)
  - Secondary school (Name, Year, Certificate, Grades)
  - Tertiary institution (if applicable)
  - Upload relevant documents
- Step 3: Program Selection
  - Choose program (dropdown)
  - Choose campus
  - Choose intake
- Step 4: Review & Submit
  - Summary of all entered data
  - Edit buttons for each section
  - Submit button

**Payment Page:**

- Payment summary
- Amount display
- Payment method selection (Card, Bank Transfer, USSD)
- Secure payment form
- Payment confirmation

**Profile Page:**

- View all personal information
- Profile photo
- Edit button
- Account status

**Change Password:**

- Current password
- New password
- Confirm new password
- Update button

### 3.5 Admin Dashboard

**Sidebar Navigation:**

- Admin avatar + name + role
- Nav items with icons:
  - Dashboard
  - Applications
  - Programs
  - Notices
  - Enquiries
  - Subscribers
  - Settings
  - Logout

**Dashboard Home:**

- Stats cards row:
  - Total Applications
  - Pending Applications
  - Selected Applications
  - Rejected Applications
- Secondary stats:
  - Total Programs
  - Total Notices
  - Total Enquiries
  - Total Subscribers
- Recent applications table (5 recent)
- Quick actions

**Applications Page:**

- Filter tabs: All, Pending, Selected, Rejected
- Search bar (search by name, email, application number)
- Applications table:
  - SN, Application No, Program, Name, Email, Date, Status
  - Action buttons: View, Accept, Reject
- Pagination

**Application Details Modal:**

- Full applicant information
- Personal details tab
- Educational details tab
- Documents tab
- Status change buttons
- Notes textarea

**Programs Page:**

- Add new program button
- Programs grid/list view
- Each program: Name, Description, Duration, Capacity, Status
- Edit/Delete actions

**Notices Page:**

- Create notice button
- Notices list
- Each notice: Title, Content, Date, Priority
- Edit/Delete actions

**Enquiries Page:**

- Enquiries list
- Mark as resolved
- Reply button

**Subscribers Page:**

- Email list
- Export functionality

---

## 4. Functionality Specification

### Authentication:

- Email/password login
- Google OAuth sign up
- Session management
- Protected routes
- Password change functionality

### Application Form:

- Multi-step form with validation
- File upload for photos and documents
- Progress persistence
- Draft saving
- Final submission

### Payment:

- Payment method selection
- Amount display
- Payment simulation
- Confirmation receipt

### Admin Features:

- Application management (view, accept, reject)
- Search and filter
- Program management
- Notice management
- Enquiry management
- Subscriber management

---

## 5. Technical Stack

- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **State Management:** React Context API
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **HTTP Client:** Fetch API (mock)
- **Animations:** CSS Animations + Framer Motion

---

## 6. File Structure

```
admission-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── pages/
│   │   ├── landing/
│   │   ├── auth/
│   │   ├── applicant/
│   │   └── admin/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── data/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 7. Acceptance Criteria

### Landing Page:

- [ ] Header displays correctly with navigation
- [ ] Hero section shows with animated stats
- [ ] About section displays school information
- [ ] Programs section shows all 6 programs in cards
- [ ] Contact form is functional (mock)
- [ ] Footer displays all columns
- [ ] Responsive on all breakpoints

### Auth Pages:

- [ ] Login form validates input
- [ ] Signup form validates input
- [ ] Google sign-in button present
- [ ] Navigation between pages works
- [ ] Form styling is consistent

### Applicant Dashboard:

- [ ] Sidebar navigation works
- [ ] Dashboard shows application status
- [ ] Application form has all 4 steps
- [ ] Form validation works
- [ ] Payment page shows amount and methods
- [ ] Profile page displays information
- [ ] Password change works

### Admin Dashboard:

- [ ] All stat cards display data
- [ ] Applications table shows all applicants
- [ ] Filter tabs work correctly
- [ ] Search functionality works
- [ ] Status update (accept/reject) works
- [ ] Application details modal opens
- [ ] Programs management works
- [ ] Notices management works

### General:

- [ ] All routes work correctly
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Consistent styling throughout
