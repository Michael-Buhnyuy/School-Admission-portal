<?php

namespace App\Models;

use CodeIgniter\Model;

class ApplicationModel extends Model
{
    protected $table            = 'applications';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'applicant_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'nationality',
        'primary_school',
        'primary_year',
        'secondary_school',
        'secondary_year',
        'tertiary_institution',
        'tertiary_course',
        'selected_program',
        'campus',
        'intake',
        'status',
        'admin_notes',
        'submitted_at',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    /**
     * Find application by applicant ID
     */
    public function findByApplicantId(int $applicantId)
    {
        return $this->where('applicant_id', $applicantId)->first();
    }

    /**
     * Find application by email
     */
    public function findByEmail(string $email)
    {
        return $this->where('email', $email)->first();
    }

    /**
     * Get all applications with applicant info
     */
    public function getAllWithApplicant()
    {
        return $this->select('applications.*, applicants.email as applicant_email, applicants.phone as applicant_phone')
            ->join('applicants', 'applicants.id = applications.applicant_id')
            ->orderBy('applications.created_at', 'DESC')
            ->findAll();
    }

    /**
     * Create new application
     */
    public function createApplication(array $data)
    {
        $data['submitted_at'] = date('Y-m-d H:i:s');
        return $this->insert($data);
    }

    /**
     * Update application status
     */
    public function updateStatus(int $id, string $status, string $notes = null)
    {
        $data = ['status' => $status];
        
        if ($notes !== null) {
            $data['admin_notes'] = $notes;
        }
        
        return $this->update($id, $data);
    }

    /**
     * Get application statistics
     */
    public function getStats()
    {
        $total = $this->countAll();
        $pending = $this->where('status', 'pending')->countAllResults();
        $approved = $this->where('status', 'approved')->countAllResults();
        $rejected = $this->where('status', 'rejected')->countAllResults();

        return [
            'total' => $total,
            'pending' => $pending,
            'approved' => $approved,
            'rejected' => $rejected,
        ];
    }
}
