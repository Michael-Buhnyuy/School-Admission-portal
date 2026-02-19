# Complete Setup Guide for CodeIgniter Backend

This guide will help you set up a proper CodeIgniter 4 backend for your admission portal.

---

## Prerequisites

Make sure you have:

- **XAMPP** installed (with Apache and MySQL)
- **Node.js** installed (for React frontend)
- **Composer** installed (for PHP dependencies) - Download from https://getcomposer.org/

---

## Step 1: Install Composer (If Not Already Installed)

1. Go to https://getcomposer.org/
2. Download and run Composer-Setup.exe
3. Follow the installation wizard
4. After installation, open a new command prompt and type:

```
   composer --version

```

You should see the version number

---

## Step 2: Create CodeIgniter Project (Already Done!)

The composer command has already created the CodeIgniter project in the `backend/appstarter` folder!

You can see these folders in your backend directory:

- `backend/appstarter/` - The CodeIgniter project (use this!)
- `backend/api/` - Simple PHP API (not needed anymore)

---

## Step 3: Configure Database

1. Open the file: `backend/appstarter/.env`
2. Add these lines at the bottom:

```
# Database Configuration
database.default.hostname = localhost
database.default.database = admission_portal
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.DBPrefix =
```

---

## Step 4: Set Up MySQL Database

1. Open XAMPP Control Panel
2. Click **Start** next to **MySQL** (wait for green "Running")
3. Open browser and go to **http://localhost/phpmyadmin**
4. Click **Databases** tab
5. Under "Create database", type: `admission_portal`
6. Select **utf8mb4_general_ci** as collation
7. Click **Create**
8. Click on the new `admission_portal` database
9. Click **Import** tab
10. Click **Choose File**
11. Select: `c:\Users\TB COMPUTERS\Desktop\admission-portal\backend\database.sql`
12. Click **Go** at the bottom

---

## Step 5: Create Auth Controller in CodeIgniter

Create a new file at `backend/appstarter/app/Controllers/Api/AuthController.php`:

```
php
<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use App\Models\AdminModel;

class AuthController extends ResourceController
{
    use ResponseTrait;

    public function login()
    {
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        if (!$email || !$password) {
            return $this->respond(['error' => 'Email and password are required'], 400);
        }

        // Check users table first
        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        // If not found in users, check admins table
        if (!$user) {
            $adminModel = new AdminModel();
            $user = $adminModel->where('email', $email)->first();
        }

        if (!$user) {
            return $this->respond(['error' => 'Invalid credentials'], 401);
        }

        if (!password_verify($password, $user['password'])) {
            return $this->respond(['error' => 'Invalid credentials'], 401);
        }

        // Prepare response
        if (isset($user['role']) && ($user['role'] === 'admin' || $user['role'] === 'super_admin')) {
            $response = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => 'admin',
                'avatar' => $user['avatar'] ?? null
            ];
        } else {
            $response = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['full_name'],
                'role' => 'applicant',
                'avatar' => $user['avatar'] ?? null,
                'applicationStatus' => $user['application_status'] ?? 'not_started',
                'applicationId' => $user['application_id'] ?? null
            ];
        }

        return $this->respond($response);
    }

    public function signup()
    {
        $data = $this->request->getVar();

        // Validate required fields
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['fullName'])) {
            return $this->respond(['error' => 'Email, password, and fullName are required'], 400);
        }

        $userModel = new UserModel();

        // Check if email already exists
        if ($userModel->where('email', $data['email'])->first()) {
            return $this->respond(['error' => 'Email already registered'], 400);
        }

        // Hash password
        $insertData = [
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
            'full_name' => $data['fullName'],
            'phone' => $data['phone'] ?? '',
            'date_of_birth' => $data['dob'] ?? null,
            'role' => 'applicant',
            'application_status' => 'not_started'
        ];

        // Insert user
        $userId = $userModel->insert($insertData);

        if ($userId) {
            return $this->respond([
                'id' => $userId,
                'email' => $data['email'],
                'name' => $data['fullName'],
                'role' => 'applicant'
            ], 201);
        }

        return $this->respond(['error' => 'Failed to create account'], 500);
    }

    public function logout()
    {
        return $this->respond(['message' => 'Logged out successfully']);
    }
}
```

---

## Step 6: Configure Routes

Edit `backend/appstarter/app/Config/Routes.php` and add these lines at the bottom:

```
php
$routes->group('api', function ($routes) {
    $routes->post('auth/login', 'Api\AuthController::login');
    $routes->post('auth/signup', 'Api\AuthController::signup');
    $routes->post('auth/logout', 'Api\AuthController::logout');
});
```

---

## Step 7: Update Frontend API URL

Edit `src/services/api.js` and change:

```
javascript
const API_BASE_URL = 'http://localhost:8080/backend/api';
```

to:

```
javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## Step 8: Run the Backend

1. Open Command Prompt
2. Navigate to:

```
   cd c:\Users\TB COMPUTERS\Desktop\admission-portal\backend\appstarter\public

```

3. Run:

```
   php -S localhost:8080

```

4. You should see: `PHP Development Server started at http://localhost:8080`

---

## Step 9: Run the Frontend

1. Open another Command Prompt
2. Navigate to:

```
   cd c:\Users\TB COMPUTERS\Desktop\admission-portal

```

3. Run:

```
   npm run dev

```

4. Open browser to http://localhost:5173

---

## Testing the Application

### Test Applicant Registration

1. Go to http://localhost:5173/signup
2. Fill in the form and click "Create Account"

### Test Applicant Login

1. Go to http://localhost:5173/login
2. Enter email and password

### Test Admin Login

1. Go to http://localhost:5173/admin-login
2. Email: admin@school.com
3. Password: admin123

---

## Quick Summary

1. ✅ Composer created `backend/appstarter/`
2. Configure database in `.env`
3. Create AuthController in `app/Controllers/Api/`
4. Add routes in `app/Config/Routes.php`
5. Run backend from `backend/appstarter/public`
6. Run frontend with `npm run dev`
