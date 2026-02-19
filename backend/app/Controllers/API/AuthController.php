<?php

namespace App\Controllers\API;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Models\AdminModel;
use App\Libraries\JWTHandler;
use CodeIgniter\HTTP\Response;

class AuthController extends BaseController
{
    protected UserModel $userModel;
    protected AdminModel $adminModel;
    protected JWTHandler $jwt;
    
    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->adminModel = new AdminModel();
        $this->jwt = new JWTHandler();
    }
    
    /**
     * POST /api/auth/login
     * Login user or admin
     */
    public function login()
    {
        $json = $this->request->getJSON();
        
        $email = $json->email ?? '';
        $password = $json->password ?? '';
        
        if (empty($email) || empty($password)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Email and password are required'
            ])->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        
        // Check if admin
        $admin = $this->adminModel->where('email', $email)->first();
        
        if ($admin && password_verify($password, $admin['password'])) {
            $token = $this->jwt->generateToken([
                'id' => $admin['id'],
                'email' => $admin['email'],
                'role' => $admin['role']
            ]);
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $admin['id'],
                        'email' => $admin['email'],
                        'name' => $admin['name'],
                        'role' => $admin['role'],
                        'avatar' => $admin['avatar'] ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
                    ],
                    'token' => $token
                ]
            ]);
        }
        
        // Check if user (applicant)
        $user = $this->userModel->where('email', $email)->first();
        
        if ($user && password_verify($password, $user['password'])) {
            $token = $this->jwt->generateToken([
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
            ]);
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['full_name'],
                        'role' => $user['role'],
                        'phone' => $user['phone'],
                        'dob' => $user['date_of_birth'],
                        'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                        'applicationStatus' => $user['application_status'],
                        'applicationId' => $user['application_id']
                    ],
                    'token' => $token
                ]
            ]);
        }
        
        return $this->response->setJSON([
            'success' => false,
            'message' => 'Invalid email or password'
        ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
    }
    
    /**
     * POST /api/auth/signup
     * Register new applicant
     */
    public function signup()
    {
        $json = $this->request->getJSON();
        
        $fullName = $json->fullName ?? '';
        $email = $json->email ?? '';
        $phone = $json->phone ?? '';
        $dob = $json->dob ?? '';
        $password = $json->password ?? '';
        
        if (empty($fullName) || empty($email) || empty($password)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Full name, email and password are required'
            ])->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        
        // Check if email already exists
        if ($this->userModel->where('email', $email)->first()) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Email already registered'
            ])->setStatusCode(Response::HTTP_CONFLICT);
        }
        
        // Check if email is registered as admin
        if ($this->adminModel->where('email', $email)->first()) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Email already registered as admin'
            ])->setStatusCode(Response::HTTP_CONFLICT);
        }
        
        // Create new user
        $userData = [
            'email' => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'full_name' => $fullName,
            'phone' => $phone,
            'date_of_birth' => $dob,
            'role' => 'applicant',
            'application_status' => 'not_started',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        ];
        
        $userId = $this->userModel->insert($userData);
        
        if (!$userId) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Failed to create account'
            ])->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        // Generate token
        $token = $this->jwt->generateToken([
            'id' => $userId,
            'email' => $email,
            'role' => 'applicant'
        ]);
        
        return $this->response->setJSON([
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
    }
    
    /**
     * GET /api/auth/user
     * Get current user profile (protected)
     */
    public function user()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No token provided'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
        
        $token = substr($authHeader, 7);
        
        try {
            $decoded = $this->jwt->verifyToken($token);
            
            if ($decoded['role'] === 'admin' || $decoded['role'] === 'super_admin') {
                $user = $this->adminModel->find($decoded['id']);
                
                if (!$user) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'User not found'
                    ])->setStatusCode(Response::HTTP_NOT_FOUND);
                }
                
                return $this->response->setJSON([
                    'success' => true,
                    'data' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['name'],
                        'role' => $user['role'],
                        'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
                    ]
                ]);
            } else {
                $user = $this->userModel->find($decoded['id']);
                
                if (!$user) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'User not found'
                    ])->setStatusCode(Response::HTTP_NOT_FOUND);
                }
                
                return $this->response->setJSON([
                    'success' => true,
                    'data' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['full_name'],
                        'role' => $user['role'],
                        'phone' => $user['phone'],
                        'dob' => $user['date_of_birth'],
                        'avatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                        'applicationStatus' => $user['application_status'],
                        'applicationId' => $user['application_id']
                    ]
                ]);
            }
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Invalid token'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
    }
    
    /**
     * POST /api/auth/logout
     * Logout user (protected)
     */
    public function logout()
    {
        // For JWT, we just return success. 
        // Client should remove token from storage.
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }
    
    /**
     * POST /api/auth/forgot-password
     * Request password reset
     */
    public function forgotPassword()
    {
        $json = $this->request->getJSON();
        $email = $json->email ?? '';
        
        if (empty($email)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Email is required'
            ])->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        
        // Check if email exists in users or admins
        $user = $this->userModel->where('email', $email)->first();
        $admin = $this->adminModel->where('email', $email)->first();
        
        if (!$user && !$admin) {
            // Don't reveal if email exists or not
            return $this->response->setJSON([
                'success' => true,
                'message' => 'If the email exists, a reset link has been sent'
            ]);
        }
        
        // Generate reset token (in production, send email with reset link)
        $resetToken = bin2hex(random_bytes(32));
        
        // Store reset token (in production, store in database with expiry)
        // For now, we'll just return success
        
        return $this->response->setJSON([
            'success' => true,
            'message' => 'If the email exists, a reset link has been sent',
            'debug_token' => $resetToken // Remove in production
        ]);
    }
    
    /**
     * POST /api/auth/reset-password
     * Reset password with token
     */
    public function resetPassword()
    {
        $json = $this->request->getJSON();
        
        $email = $json->email ?? '';
        $token = $json->token ?? '';
        $newPassword = $json->newPassword ?? '';
        
        if (empty($email) || empty($token) || empty($newPassword)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Email, token and new password are required'
            ])->setStatusCode(Response::HTTP_BAD_REQUEST);
        }
        
        // Check if user
        $user = $this->userModel->where('email', $email)->first();
        
        if ($user) {
            $this->userModel->update($user['id'], [
                'password' => password_hash($newPassword, PASSWORD_BCRYPT)
            ]);
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Password reset successfully'
            ]);
        }
        
        // Check if admin
        $admin = $this->adminModel->where('email', $email)->first();
        
        if ($admin) {
            $this->adminModel->update($admin['id'], [
                'password' => password_hash($newPassword, PASSWORD_BCRYPT)
            ]);
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Password reset successfully'
            ]);
        }
        
        return $this->response->setJSON([
            'success' => false,
            'message' => 'Invalid token or email'
        ])->setStatusCode(Response::HTTP_BAD_REQUEST);
    }
    
    /**
     * PUT /api/auth/update-profile
     * Update user profile (protected)
     */
    public function updateProfile()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No token provided'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
        
        $token = substr($authHeader, 7);
        
        try {
            $decoded = $this->jwt->verifyToken($token);
            $json = $this->request->getJSON();
            
            $updateData = [];
            
            if (isset($json->fullName)) {
                $updateData['full_name'] = $json->fullName;
            }
            if (isset($json->phone)) {
                $updateData['phone'] = $json->phone;
            }
            if (isset($json->dob)) {
                $updateData['date_of_birth'] = $json->dob;
            }
            
            if ($decoded['role'] === 'admin' || $decoded['role'] === 'super_admin') {
                if (isset($json->name)) {
                    $updateData['name'] = $json->name;
                }
                $this->adminModel->update($decoded['id'], $updateData);
            } else {
                $this->userModel->update($decoded['id'], $updateData);
            }
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Invalid token'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
    }
    
    /**
     * POST /api/auth/change-password
     * Change password (protected)
     */
    public function changePassword()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No token provided'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
        
        $token = substr($authHeader, 7);
        
        try {
            $decoded = $this->jwt->verifyToken($token);
            $json = $this->request->getJSON();
            
            $currentPassword = $json->currentPassword ?? '';
            $newPassword = $json->newPassword ?? '';
            
            if (empty($currentPassword) || empty($newPassword)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Current password and new password are required'
                ])->setStatusCode(Response::HTTP_BAD_REQUEST);
            }
            
            if ($decoded['role'] === 'admin' || $decoded['role'] === 'super_admin') {
                $admin = $this->adminModel->find($decoded['id']);
                
                if (!password_verify($currentPassword, $admin['password'])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Current password is incorrect'
                    ])->setStatusCode(Response::HTTP_BAD_REQUEST);
                }
                
                $this->adminModel->update($decoded['id'], [
                    'password' => password_hash($newPassword, PASSWORD_BCRYPT)
                ]);
            } else {
                $user = $this->userModel->find($decoded['id']);
                
                if (!password_verify($currentPassword, $user['password'])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Current password is incorrect'
                    ])->setStatusCode(Response::HTTP_BAD_REQUEST);
                }
                
                $this->userModel->update($decoded['id'], [
                    'password' => password_hash($newPassword, PASSWORD_BCRYPT)
                ]);
            }
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Invalid token'
            ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
        }
    }
}
