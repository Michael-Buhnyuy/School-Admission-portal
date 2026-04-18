<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentModel extends Model
{
    protected $table = 'documents';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'application_id', 'applicant_id', 'filename', 'original_name', 'file_path',
        'type', 'mime_type', 'size_bytes', 'status', 'reviewed_by', 'notes'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'uploaded_at';
    protected $updatedField = null;
    protected $deletedField = null;

    protected $validationRules = [
        'applicant_id' => 'required|is_natural_no_zero',
        'filename' => 'required|alpha_dash',
        'original_name' => 'required|alpha_numeric_space',
        'file_path' => 'required',
        'type' => 'required|in_list[passport_photo,transcript,certificate,identification,other]',
        'mime_type' => 'permit_empty|valid_mime_types[image/jpeg,image/png,application/pdf]',
        'size_bytes' => 'permit_empty|is_natural',
        'status' => 'permit_empty|in_list[pending,verified,flagged,rejected]',
    ];

    protected $validationMessages = [
        'applicant_id' => [
            'required' => 'Applicant ID is required.',
            'is_natural_no_zero' => 'Valid applicant ID required.'
        ],
        'filename' => [
            'required' => 'Filename is required.'
        ],
        'type' => [
            'in_list' => 'Invalid document type.'
        ]
    ];

    protected $skipValidation = false;

    /**
     * Get documents by applicant ID
     */
    public function getByApplicantId(int $applicantId, int $limit = 50): array
    {
        return $this->where('applicant_id', $applicantId)
                   ->orderBy('uploaded_at', 'DESC')
                   ->limit($limit)
                   ->findAll();
    }

    /**
     * Get documents by application ID
     */
    public function getByApplicationId(int $applicationId): array
    {
        return $this->where('application_id', $applicationId)
                   ->orderBy('uploaded_at', 'DESC')
                   ->findAll();
    }

    /**
     * Update document status and log review
     */
    public function updateStatus(int $documentId, string $status, ?int $adminId = null, string $notes = ''): bool
    {
        $data = ['status' => $status];
        if ($adminId) {
            $data['reviewed_by'] = $adminId;
        }
        if ($notes) {
            $data['notes'] = $notes;
        }

        return $this->update($documentId, $data);
    }

    /**
     * Get documents needing review (pending/flagged)
     */
    public function getPendingReview(int $limit = 100): array
    {
        return $this->whereIn('status', ['pending', 'flagged'])
                   ->orderBy('uploaded_at', 'ASC')
                   ->limit($limit)
                   ->findAll();
    }

    /**
     * Get document stats
     */
    public function getStats(): array
    {
        return [
            'total' => $this->countAll(),
            'pending' => $this->where('status', 'pending')->countAllResults(),
            'verified' => $this->where('status', 'verified')->countAllResults(),
            'flagged' => $this->where('status', 'flagged')->countAllResults(),
            'rejected' => $this->where('status', 'rejected')->countAllResults(),
        ];
    }
}

