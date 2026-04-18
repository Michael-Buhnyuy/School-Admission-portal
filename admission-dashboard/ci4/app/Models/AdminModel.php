<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\I18n\Time;

class AdminModel extends Model
{
    protected $table            = 'admins';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = [
        'admin_id', 'first_name', 'last_name', 'email', 'password_hash',
        'role', 'department', 'phone', 'is_active', 'last_login', 'created_at', 'updated_at'
    ];
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    protected $validationRules = [
        'first_name' => 'required|min_length[2]|max_length[50]',
        'last_name'  => 'required|min_length[2]|max_length[50]',
        'email'      => 'required|valid_email|is_unique[admins.email,id,{id}]',
        'password_hash' => 'required|min_length[6]',
        'role'       => 'required|in_list[super_admin,admission_officer,reviewer,coordinator]',
    ];

    public function verifyLogin(string $email, string $password): ?array
    {
        $admin = $this->where('email', $email)
                      ->where('is_active', 1)
                      ->first();

        if (!$admin) {
            return null;
        }

        if (!password_verify($password, $admin['password_hash'])) {
            return null;
        }

        // Update last login
        $this->update($admin['id'], ['last_login' => Time::now()]);

        unset($admin['password_hash']);
        return $admin;
    }

    public function getAdminById(int $id): ?array
    {
        return $this->where('id', $id)
                    ->where('is_active', 1)
                    ->first();
    }

    public function getAdminByEmail(string $email): ?array
    {
        return $this->where('email', $email)
                    ->where('is_active', 1)
                    ->first();
    }

    public function getAllAdmins(): array
    {
        return $this->select('id, admin_id, first_name, last_name, email, role, department, phone, last_login, created_at')
                    ->where('is_active', 1)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    public function createAdmin(array $data): int
    {
        // Generate unique admin_id
        $data['admin_id'] = 'ADM' . strtoupper(uniqid());
        
        return $this->insert($data);
    }

    public function updateAdmin(int $id, array $data): bool
    {
        return $this->update($id, $data);
    }

    public function deactivateAdmin(int $id): bool
    {
        return $this->update($id, ['is_active' => 0]);
    }

    public function getRoleLabel(string $role): string
    {
        $roles = [
            'super_admin' => 'Super Administrator',
            'admission_officer' => 'Admission Officer',
            'reviewer' => 'Application Reviewer',
            'coordinator' => 'Program Coordinator',
        ];
        
        return $roles[$role] ?? $role;
    }
}
