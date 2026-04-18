<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\DocumentModel;
use App\Models\ApplicationModel;
use App\Models\AdminActivityLogModel;

class Document extends ResourceController
{
    protected $format = 'json';
    private $documentModel;
    private $activityLogModel;

    public function __construct()
    {
        $this->documentModel = new DocumentModel();
        $this->activityLogModel = new AdminActivityLogModel();
    }

    /**
     * GET /api/documents/applicant/{applicantId} - Get applicant's documents
     */
    public function getByApplicant($applicantId = 0)
    {
        if (!$applicantId || $applicantId == 0) {
            return $this->fail('Applicant ID required', 400);
        }

        $documents = $this->documentModel->getByApplicantId((int)$applicantId);

        return $this->respond([
            'success' => true,
            'data' => $documents,
            'count' => count($documents)
        ]);
    }

    /**
     * GET /api/documents/application/{applicationId} - Get application documents
     */
    public function getByApplication($applicationId = 0)
    {
        if (!$applicationId || $applicationId == 0) {
            return $this->fail('Application ID required', 400);
        }

        $documents = $this->documentModel->getByApplicationId((int)$applicationId);

        return $this->respond([
            'success' => true,
            'data' => $documents,
            'count' => count($documents)
        ]);
    }

    /**
     * GET /api/documents/review - Documents needing review
     */
    public function getPendingReview()
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID') ?: 0;
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $documents = $this->documentModel->getPendingReview();

        return $this->respond([
            'success' => true,
            'data' => $documents,
            'count' => count($documents)
        ]);
    }

    /**
     * POST /api/documents - Upload document
     */
    public function upload()
    {
        $file = $this->request->getFile('document');
        if (!$file || !$file->isValid()) {
            return $this->fail('No valid file uploaded', 400);
        }

        $applicantId = $this->request->getPost('applicant_id');
        $applicationId = $this->request->getPost('application_id');
        $type = $this->request->getPost('type') ?? 'other';

        if (!$applicantId) {
            return $this->fail('applicant_id required', 400);
        }

        // Configure upload path
        $uploadPath = WRITEPATH . 'uploads/documents/';
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $filename = 'doc_' . date('YmdHis') . '_' . uniqid() . '.' . $file->getClientExtension();
        $filePath = 'uploads/documents/' . $filename;

        if (!$file->move($uploadPath, $filename)) {
            return $this->fail('Upload failed: ' . $file->getErrorString(), 500);
        }

        $documentData = [
            'applicant_id' => (int)$applicantId,
            'application_id' => $applicationId ? (int)$applicationId : null,
            'filename' => $filename,
            'original_name' => $file->getClientName(),
            'file_path' => $filePath,
            'type' => $type,
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize()
        ];

        $documentId = $this->documentModel->insert($documentData);

        if ($documentId) {
            return $this->respondCreated([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => $documentData + ['id' => $documentId]
            ]);
        }

        return $this->fail('Failed to save document record', 500);
    }

    /**
     * PUT /api/documents/{id}/status - Update document status
     */
    public function updateStatus($id = 0)
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $data = $this->request->getJSON(true);
        $status = $data['status'] ?? '';
        $notes = $data['notes'] ?? '';

        if (!$status || !in_array($status, ['pending', 'verified', 'flagged', 'rejected'])) {
            return $this->fail('Valid status required', 400);
        }

        if (!$this->documentModel->updateStatus((int)$id, $status, (int)$adminId, $notes)) {
            return $this->fail('Document not found or update failed', 404);
        }

        // Log activity
        $this->activityLogModel->logActivity((int)$adminId, 'document_status_updated', 
            "Document {$id} status changed to {$status}", 'document', (int)$id);

        return $this->respond([
            'success' => true,
            'message' => 'Document status updated'
        ]);
    }

    /**
     * GET /api/documents/stats
     */
    public function stats()
    {
        $stats = $this->documentModel->getStats();

        return $this->respond([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * DELETE /api/documents/{id} - Soft delete or mark as deleted
     */
    public function delete($id = 0)
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $document = $this->documentModel->find($id);
        if (!$document) {
            return $this->fail('Document not found', 404);
        }

        // Delete physical file
        $filePath = WRITEPATH . ltrim($document['file_path'], '/');
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $this->documentModel->delete($id);

        $this->activityLogModel->logActivity((int)$adminId, 'document_deleted', 
            "Document {$id} deleted", 'document', (int)$id);

        return $this->respond([
            'success' => true,
            'message' => 'Document deleted'
        ]);
    }
}

