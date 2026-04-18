<?php

namespace App\Models;

use CodeIgniter\Model;

class ApplicantModel extends Model
{
    protected $table            = 'applicants';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'email',
        'password_hash',
        'phone',
        'first_name',
        'last_name',
        'is_verified',
        'is_active',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'email'    => 'required|valid_email|is_unique[applicants.email]',
        'phone'    => 'required|min_length[10]',
        'first_name' => 'required|min_length[2]',
        'last_name' => 'required|min_length[2]',
    ];

    protected $validationMessages = [
        'email' => [
            'required' => 'Email is required',
            'valid_email' => 'Please enter a valid email address',
            'is_unique' => 'This email is already registered',
        ],
    ];

    /**
     * Find applicant by email
     */
    public function findByEmail(string $email)
    {
        return $this->where('email', $email)->first();
    }

    /**
     * Verify applicant credentials
     */
    public function verifyCredentials(string $email, string $password)
    {
        $applicant = $this->where('email', $email)->first();
        
        if ($applicant && password_verify($password, $applicant['password_hash'])) {
            return $applicant;
        }
        
        return null;
    }

    /**
     * Create new applicant
     */
    public function createApplicant(array $data)
    {
        $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
        unset($data['password']);
        
        return $this->insert($data);
    }

    /**
     * Update password
     */
    public function updatePassword(int $id, string $password)
    {
        $data = [
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ];
        
        return $this->update($id, $data);
    }

    /**
     * Mark applicant as verified
     */
    public function markAsVerified(int $id)
    {
        return $this->update($id, ['is_verified' => 1]);
    }
}
