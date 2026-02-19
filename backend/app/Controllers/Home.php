<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Welcome to Excellence Academy API',
            'version' => '1.0.0',
            'endpoints' => [
                'POST /api/auth/login' => 'Login user or admin',
                'POST /api/auth/signup' => 'Register new applicant',
                'POST /api/auth/forgot-password' => 'Request password reset',
                'POST /api/auth/reset-password' => 'Reset password with token',
                'GET /api/auth/user' => 'Get current user profile (protected)',
                'POST /api/auth/logout' => 'Logout user (protected)',
                'PUT /api/auth/update-profile' => 'Update user profile (protected)',
                'POST /api/auth/change-password' => 'Change password (protected)'
            ]
        ]);
    }
}
