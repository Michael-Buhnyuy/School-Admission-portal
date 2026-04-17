<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ApplicationModel;
use App\Models\ApplicantModel;
use App\Models\AdminModel;
use App\Models\AdminActivityLogModel;

class Admin extends ResourceController
{
    protected $modelName = 'App\Models\ApplicationModel';
    protected $format    = 'json';
    
    private $adminModel;
    private $activityLogModel;
    
    public function __construct()
    {
        $this->adminModel = new AdminModel();
        $this->activityLogModel = new AdminActivityLogModel();
    }

    /**
     * Admin login
     * POST /api/admin/login
     */
    public function login()
    {
        $data = $this->request->getJSON();

        if (!isset($data->email) || !isset($data->password)) {
            return $this->respond([
                'success' => false,
                'message' => 'Email and password are required'
            ], 400);
        }

        // Verify admin credentials from database
        $admin = $this->adminModel->verifyLogin($data->email, $data->password);

        if (!$admin) {
            return $this->respond([
                'success' => false,
                'message' => 'Invalid admin credentials'
            ], 401);
        }

        // Generate token
        $token = bin2hex(random_bytes(32));
        
        // Log the login activity
        $this->activityLogModel->logActivity(
            $admin['id'],
            'admin_login',
            'Admin logged in successfully',
            'admin',
            $admin['id']
        );

        // Get role label
        $roleLabel = $this->adminModel->getRoleLabel($admin['role']);

        return $this->respond([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'id' => $admin['id'],
                'admin_id' => $admin['admin_id'],
                'email' => $admin['email'],
                'first_name' => $admin['first_name'],
                'last_name' => $admin['last_name'],
                'role' => $admin['role'],
                'role_label' => $roleLabel,
                'department' => $admin['department'],
                'token' => $token
            ]
        ]);
    }

    /**
     * Get all admins (for super admin)
     * GET /api/admin/admins
     */
    public function getAdmins()
    {
        $admins = $this->adminModel->getAllAdmins();
        
        // Add role labels
        foreach ($admins as &$admin) {
            $admin['role_label'] = $this->adminModel->getRoleLabel($admin['role']);
        }

        return $this->respond([
            'success' => true,
            'data' => $admins,
            'total' => count($admins)
        ]);
    }

    /**
     * Get all applicants
     * GET /api/admin/applicants
     */
    public function applicants()
    {
        $applicationModel = new ApplicationModel();
        $applicants = $applicationModel->getAllWithApplicant();

        return $this->respond([
            'success' => true,
            'data' => $applicants,
            'total' => count($applicants)
        ]);
    }

    /**
     * Get single applicant details
     * GET /api/admin/applicant/{id}
     */
    public function applicant($id = null)
    {
        if ($id === null) {
            return $this->respond([
                'success' => false,
                'message' => 'Applicant ID is required'
            ], 400);
        }

        $applicationModel = new ApplicationModel();
        $application = $applicationModel->find($id);

        if (!$application) {
            return $this->respond([
                'success' => false,
                'message' => 'Applicant not found'
            ], 404);
        }

        // Get applicant details
        $applicantModel = new ApplicantModel();
        $applicant = $applicantModel->find($application['applicant_id']);

        if ($applicant) {
            unset($applicant['password_hash']);
        }

        // Get activity log for this application
        $activityLog = $this->activityLogModel->getActivityByEntity('application', $id);

        return $this->respond([
            'success' => true,
            'data' => [
                'application' => $application,
                'applicant' => $applicant,
                'activity_log' => $activityLog
            ]
        ]);
    }

    /**
     * Update applicant status
     * PUT /api/admin/applicant/{id}/status
     */
    public function updateStatus($id = null)
    {
        if ($id === null) {
            return $this->respond([
                'success' => false,
                'message' => 'Applicant ID is required'
            ], 400);
        }

        $data = $this->request->getJSON();

        if (!isset($data->status)) {
            return $this->respond([
                'success' => false,
                'message' => 'Status is required'
            ], 400);
        }

        $validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
        
        if (!in_array($data->status, $validStatuses)) {
            return $this->respond([
                'success' => false,
                'message' => 'Invalid status'
            ], 400);
        }

        $applicationModel = new ApplicationModel();
        $application = $applicationModel->find($id);

        if (!$application) {
            return $this->respond([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        $oldStatus = $application['status'];
        $notes = $data->admin_notes ?? null;
        $adminId = $data->admin_id ?? null;
        
        $applicationModel->updateStatus($id, $data->status, $notes, $adminId);

        // Log the activity
        if ($adminId) {
            $this->activityLogModel->logActivity(
                $adminId,
                'status_change',
                "Changed application status from '{$oldStatus}' to '{$data->status}'" . ($notes ? ": {$notes}" : ""),
                'application',
                $id
            );
        }

        return $this->respond([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => [
                'id' => $id,
                'old_status' => $oldStatus,
                'new_status' => $data->status
            ]
        ]);
    }

    /**
     * Get dashboard statistics
     * GET /api/admin/stats
     */
    public function stats()
    {
        $applicationModel = new ApplicationModel();
        $stats = $applicationModel->getStats();
        
        // Get activity stats
        $activityStats = $this->activityLogModel->getActivityStats(7);

        return $this->respond([
            'success' => true,
            'data' => [
                'applications' => $stats,
                'activity' => $activityStats
            ]
        ]);
    }

    /**
     * Get recent activity log
     * GET /api/admin/activity
     */
    public function activity()
    {
        $limit = $this->request->getGet('limit') ?? 50;
        $activity = $this->activityLogModel->getRecentActivity($limit);

        return $this->respond([
            'success' => true,
            'data' => $activity,
            'total' => count($activity)
        ]);
    }

    /**
     * Search applicants
     * GET /api/admin/search
     */
    public function search()
    {
        $query = $this->request->getGet('q');
        
        if (!$query) {
            return $this->respond([
                'success' => false,
                'message' => 'Search query is required'
            ], 400);
        }

        $applicationModel = new ApplicationModel();
        
        $results = $applicationModel
            ->like('first_name', $query)
            ->orLike('last_name', $query)
            ->orLike('email', $query)
            ->orLike('phone', $query)
            ->orLike('application_number', $query)
            ->findAll();

        return $this->respond([
            'success' => true,
            'data' => $results,
            'total' => count($results)
        ]);
    }

    /**
     * Submit admin changes for review
     * POST /api/admin/review/submit
     */
    public function submitReview()
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $data = $this->request->getJSON(true);

        $changes = [
            'entity_type' => $data['entity_type'] ?? 'unknown',
            'entity_id' => $data['entity_id'] ?? 0,
            'description' => $data['description'] ?? 'Changes submitted for review',
            'action' => 'review_submitted'
        ];

        // Log for review
        $logId = $this->activityLogModel->logActivity(
            (int)$adminId,
            $changes['action'],
            $changes['description'],
            $changes['entity_type'],
            (int)$changes['entity_id']
        );

        return $this->respondCreated([
            'success' => true,
            'message' => 'Changes submitted for review',
            'data' => [
                'log_id' => $logId,
                'changes' => $changes
            ]
        ]);
    }

    /**
     * Get dashboard overview with all stats
     * GET /api/admin/dashboard
     */
    public function dashboard()
    {
        $applicationModel = new ApplicationModel();
        $documentModel = new \App\Models\DocumentModel();
        $messageModel = new \App\Models\MessageModel();

        $appStats = $applicationModel->getStats();
        $docStats = $documentModel->getStats();
        $msgStats = $messageModel->getStats();

        $recentActivity = $this->activityLogModel->getRecentActivity(10);

        return $this->respond([
            'success' => true,
            'data' => [
                'applications' => $appStats,
                'documents' => $docStats,
                'messages' => $msgStats,
                'recent_activity' => $recentActivity
            ]
        ]);
    }

    /**
     * Get pending reviews for admin
     * GET /api/admin/reviews/pending
     */
    public function pendingReviews()
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $reviews = $this->activityLogModel->where('action', 'review_submitted')
                    ->orderBy('created_at', 'DESC')
                    ->findAll();

        foreach ($reviews as &$review) {
            $admin = $this->adminModel->find($review['admin_id']);
            $review['admin_name'] = $admin ? $admin['first_name'] . ' ' . $admin['last_name'] : 'Unknown';
        }

        return $this->respond([
            'success' => true,
            'data' => $reviews,
            'count' => count($reviews)
        ]);
    }

    /**
     * Review submitted changes (approve/reject with note)
     * PUT /api/admin/review/{id}
     */
    public function review($id = null)
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        if ($id === null) {
            return $this->respond(['success' => false, 'message' => 'Review ID required'], 400);
        }

        $data = $this->request->getJSON(true);
        $decision = $data['decision'] ?? '';
        $note = $data['note'] ?? '';

        if (!in_array($decision, ['approved', 'rejected'])) {
            return $this->respond(['success' => false, 'message' => 'Decision must be approved or rejected'], 400);
        }

        $review = $this->activityLogModel->find($id);
        if (!$review) {
            return $this->respond(['success' => false, 'message' => 'Review not found'], 404);
        }

        $updateData = [
            'status' => $decision,
            'reviewed_by' => $adminId,
            'reviewed_at' => date('Y-m-d H:i:s'),
        ];
        if ($note) {
            $updateData['notes'] = $note;
        }

        $this->activityLogModel->update($id, $updateData);

        // Log the review decision
        $this->activityLogModel->logActivity(
            (int)$adminId,
            'review_' . $decision,
            "Review #{$id} was {$decision}" . ($note ? ": {$note}" : ""),
            'review',
            (int)$id
        );

        return $this->respond([
            'success' => true,
            'message' => "Review {$decision} successfully"
        ]);
    }

}

