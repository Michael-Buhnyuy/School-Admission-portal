<?php
// Simple PHP API for Admission Portal - No framework required

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost';
$db = 'admission_portal';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Get the request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle both /api/ and /backend/api/ prefixes
$uri = str_replace('/backend/api/', '', $uri);
$uri = str_replace('/api/', '', $uri);

// Simple routing
$parts = explode('/', $uri);
$endpoint = $parts[0] ?? '';

// Handle root endpoint
if ($endpoint === '' || $uri === '/') {
    echo json_encode([
        'success' => true,
        'message' => 'Admission Portal API is running',
        'endpoints' => [
            'POST /api/auth/signup' => 'Register new user',
            'POST /api/auth/login' => 'Login user or admin',
            'POST /api/auth/logout' => 'Logout user',
            'GET /api/auth/user' => 'Get current user (requires auth)',
            'POST /api/auth/forgot-password' => 'Request password reset',
            'POST /api/auth/reset-password' => 'Reset password'
        ]
    ]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Helper function to hash passwords
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Helper function to verify passwords
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Helper function to generate JWT token (simple version)
function generateToken($userId, $email, $role) {
    $payload = [
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'exp' => time() + 3600 // 1 hour expiry
    ];
    return base64_encode(json_encode($payload));
}

// Handle requests
switch ($endpoint) {
    case 'auth':
        handleAuth($pdo, $method, $parts, $input);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}

function handleAuth($pdo, $method, $parts, $input) {
    $action = $parts[1] ?? '';
    
    switch ($action) {
        case 'signup':
            if ($method === 'POST') {
                signup($pdo, $input);
            }
            break;
            
        case 'login':
            if ($method === 'POST') {
                login($pdo, $input);
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                logout();
            }
            break;
            
        case 'user':
            if ($method === 'GET') {
                getUser($pdo);
            }
            break;
            
        case 'forgot-password':
            if ($method === 'POST') {
                forgotPassword($pdo, $input);
            }
            break;
            
        case 'reset-password':
            if ($method === 'POST') {
                resetPassword($pdo, $input);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Action not found']);
    }
}

function signup($pdo, $input) {
    // Validate required fields
    $required = ['email', 'password', 'fullName'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => ucfirst($field) . ' is required']);
            return;
        }
    }
    
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }
    
    $password = $input['password'];
    $fullName = $input['fullName'];
    $phone = $input['phone'] ?? '';
    $dob = $input['dob'] ?? null;
    
    try {
        // Check if email already exists in users table
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already registered']);
            return;
        }
        
        // Check if email is registered as admin
        $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already registered as admin']);
            return;
        }
        
        // Insert new user
        $hashedPassword = hashPassword($password);
        $stmt = $pdo->prepare("INSERT INTO users (email, password, full_name, phone, date_of_birth, role, application_status) VALUES (?, ?, ?, ?, ?, 'applicant', 'not_started')");
        $stmt->execute([$email, $hashedPassword, $fullName, $phone, $dob]);
        
        $userId = $pdo->lastInsertId();
        
        // Generate token
        $token = generateToken($userId, $email, 'applicant');
        
        // Return in the format expected by frontend
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'data' => [
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'name' => $fullName,
                    'role' => 'applicant',
                    'phone' => $phone,
                    'dob' => $dob,
                    'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    'applicationStatus' => 'not_started',
                    'applicationId' => null
                ],
                'token' => $token
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create account: ' . $e->getMessage()]);
    }
}

function login($pdo, $input) {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    try {
        // Check users table first
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // If not found in users, check admins table
        $isAdmin = false;
        if (!$user) {
            $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $isAdmin = true;
            }
        }
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            return;
        }
        
        if (!verifyPassword($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            return;
        }
        
        // Generate token
        $token = generateToken($user['id'], $user['email'], $user['role']);
        
        // Prepare response based on role - match frontend expectations
        if ($isAdmin || $user['role'] === 'admin' || $user['role'] === 'super_admin') {
            $userData = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => 'admin',
                'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
            ];
        } else {
            $userData = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['full_name'],
                'role' => 'applicant',
                'phone' => $user['phone'] ?? '',
                'dob' => $user['date_of_birth'] ?? '',
                'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                'applicationStatus' => $user['application_status'] ?? 'not_started',
                'applicationId' => $user['application_id'] ?? null
            ];
        }
        
        // Return in the format expected by frontend
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $userData,
                'token' => $token
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Login failed: ' . $e->getMessage()]);
    }
}

function logout() {
    // For simple API, logout is handled on client side by removing token
    echo json_encode(['message' => 'Logged out successfully']);
}

function getUser($pdo) {
    // Get token from header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        return;
    }
    
    $token = str_replace('Bearer ', '', $authHeader);
    $payload = json_decode(base64_decode($token), true);
    
    if (!$payload || !isset($payload['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
        return;
    }
    
    try {
        $userId = $payload['user_id'];
        $role = $payload['role'];
        
        if ($role === 'admin') {
            $stmt = $pdo->prepare("SELECT id, email, name, role, avatar FROM admins WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $userData = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'role' => $user['role'],
                    'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
                ];
            }
        } else {
            $stmt = $pdo->prepare("SELECT id, email, full_name, phone, date_of_birth, role, avatar, application_status, application_id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $userData = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['full_name'],
                    'role' => $user['role'],
                    'phone' => $user['phone'] ?? '',
                    'dob' => $user['date_of_birth'] ?? '',
                    'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    'applicationStatus' => $user['application_status'] ?? 'not_started',
                    'applicationId' => $user['application_id'] ?? null
                ];
            }
        }
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        // Return in the format expected by frontend
        echo json_encode([
            'success' => true,
            'data' => $userData
        ]);
        
    } 
    catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to get user: ' . $e->getMessage()]);
    }
}

function forgotPassword($pdo, $input) {
    $email = $input['email'] ?? '';
    
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is required']);
        return;
    }
    
    // In a real application, you would send an email with reset link
    // For demo, we'll just return success
    echo json_encode(['message' => 'Password reset instructions sent to your email']);
}

function resetPassword($pdo, $input) {
    $email = $input['email'] ?? '';
    $newPassword = $input['newPassword'] ?? '';
    
    if (empty($email) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and new password are required']);
        return;
    }
    
    try {
        $hashedPassword = hashPassword($newPassword);
        
        // Try users table first
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $email]);
        
        if ($stmt->rowCount() === 0) {
            // Try admins table
            $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE email = ?");
            $stmt->execute([$hashedPassword, $email]);
        }
        
        echo json_encode(['message' => 'Password reset successfully']);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to reset password']);
    }
}
