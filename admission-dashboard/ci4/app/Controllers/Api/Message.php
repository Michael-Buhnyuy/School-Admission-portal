<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\MessageModel;
use App\Models\AdminActivityLogModel;
use App\Models\ApplicantModel;
use App\Models\AdminModel;

class Message extends ResourceController
{
    protected $format = 'json';
    private $messageModel;
    private $activityLogModel;

    public function __construct()
    {
        $this->messageModel = new MessageModel();
        $this->activityLogModel = new AdminActivityLogModel();
    }

    /**
     * POST /api/messages - Send new message (from landing or applicant)
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        // Basic validation
        if (empty($data['content']) || empty($data['recipient_type']) || !isset($data['recipient_id'])) {
            return $this->fail('Content, recipient_type, and recipient_id required', 400);
        }

        $senderType = $data['sender_type'] ?? 'applicant';
        $senderId = $data['sender_id'] ?? 0;
        $recipientType = $data['recipient_type'];
        $recipientId = (int)$data['recipient_id'];

        // Verify sender exists if provided
        if ($senderId) {
            $model = $senderType === 'admin' ? new AdminModel() : new ApplicantModel();
            $sender = $model->find($senderId);
            if (!$sender) {
                return $this->fail('Invalid sender', 400);
            }
        }

        $messageData = [
            'thread_id' => $data['thread_id'] ?? '',
            'sender_type' => $senderType,
            'sender_id' => $senderId ?: 0,
            'recipient_type' => $recipientType,
            'recipient_id' => $recipientId,
            'subject' => $data['subject'] ?? 'No Subject',
            'content' => trim($data['content']),
            'attachment_path' => $data['attachment_path'] ?? null
        ];

        $messageId = $this->messageModel->createMessage($messageData);

        if ($messageId) {
            // Log if from admin
            if ($senderType === 'admin' && $senderId) {
                $this->activityLogModel->logActivity($senderId, 'message_sent', 
                    "Message sent to {$recipientType}:{$recipientId}", 'message', $messageId);
            }

            return $this->respondCreated([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $messageData + ['id' => $messageId]
            ]);
        }

        return $this->fail('Failed to send message', 500);
    }

    /**
     * GET /api/messages/admin/inbox - Admin inbox
     */
    public function adminInbox()
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $limit = $this->request->getGet('limit') ?? 50;
        $messages = $this->messageModel->getAdminInbox((int)$limit);

        return $this->respond([
            'success' => true,
            'data' => $messages,
            'count' => count($messages),
            'unread_count' => $this->messageModel->where('recipient_type', 'admin')->where('is_read', 0)->countAllResults()
        ]);
    }

    /**
     * GET /api/messages/thread/{threadId} - Get conversation thread
     */
    public function getThread($threadId = '')
    {
        if (!$threadId) {
            return $this->fail('Thread ID required', 400);
        }

        $messages = $this->messageModel->getByThread($threadId);

        // Mark as read for recipient
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if ($adminId && count($messages) > 0) {
            $messageIds = array_column($messages, 'id');
            $this->messageModel->markAsRead($messageIds);
        }

        return $this->respond([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * GET /api/messages/conversation - Get applicant-admin conversation
     */
    public function getConversation()
    {
        $applicantId = $this->request->getGet('applicant_id');
        $adminId = $this->request->getHeaderLine('X-Admin-ID');

        if (!$applicantId) {
            return $this->fail('applicant_id required', 400);
        }

        if (!$adminId) {
            return $this->fail('Admin authentication required', 401);
        }

        $messages = $this->messageModel->getConversation((int)$applicantId, (int)$adminId);

        return $this->respond([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * PUT /api/messages/{id}/read - Mark as read
     */
    public function markRead($id = 0)
    {
        $adminId = $this->request->getHeaderLine('X-Admin-ID');
        if (!$adminId || !$id) {
            return $this->fail('Invalid request', 400);
        }

        if ($this->messageModel->update($id, ['is_read' => 1])) {
            return $this->respond([
                'success' => true,
                'message' => 'Marked as read'
            ]);
        }

        return $this->fail('Message not found', 404);
    }

    /**
     * GET /api/messages/stats
     */
    public function stats()
    {
        $stats = $this->messageModel->getStats();

        return $this->respond([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * GET /api/messages/threads - Get thread overview for inbox
     */
    public function threads()
    {
        $recipientType = $this->request->getGet('recipient_type') ?? 'admin';
        $recipientId = $this->request->getGet('recipient_id');
        
        if (!$recipientId) {
            return $this->fail('recipient_id required', 400);
        }

        $limit = $this->request->getGet('limit') ?? 20;
        $threads = $this->messageModel->getThreadsOverview($recipientType, (int)$recipientId, (int)$limit);

        return $this->respond([
            'success' => true,
            'data' => $threads
        ]);
    }
}

