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
            return $this->respond(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        // Prepare response
        if (isset($user['role']) && ($user['role'] === 'admin' || $user['role'] === 'super_admin')) {
            $userData = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => 'admin',
                'avatar' => $user['avatar'] ?? null
            ];
        } else {
            $userData = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['full_name'],
                'role' => 'applicant',
                'avatar' => $user['avatar'] ?? null,
                'applicationStatus' => $user['application_status'] ?? 'not_started',
                'applicationId' => $user['application_id'] ?? null
            ];
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'user' => $userData,
                'token' => base64_encode(json_encode([
                    'user_id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $userData['role'],
                    'exp' => time() + 3600
                ]))
            ]
        ]);
    }

    public function signup()
    {
        $json = $this->request->getJSON();
        $data = $json ? (array) $json : $this->request->getVar();

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
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $userId,
                        'email' => $data['email'],
                        'name' => $data['fullName'],
                        'role' => 'applicant',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                        'applicationStatus' => 'not_started',
                        'applicationId' => null
                    ],
                    'token' => base64_encode(json_encode([
                        'user_id' => $userId,
                        'email' => $data['email'],
                        'role' => 'applicant',
                        'exp' => time() + 3600
                    ]))
                ]
            ], 201);
        }

        return $this->respond(['error' => 'Failed to create account'], 500);
    }

    public function logout()
    {
        return $this->respond(['message' => 'Logged out successfully']);
    }
}
