<?php

namespace App\Models;

use CodeIgniter\Model;

class MessageModel extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'thread_id', 'sender_type', 'sender_id', 'recipient_type', 'recipient_id',
        'subject', 'content', 'attachment_path', 'is_read', 'status'
    ];

    protected $useTimestamps = false;  // Use created_at
    protected $createdField = 'created_at';
    protected $updatedField = null;
    protected $deletedField = null;

    protected $validationRules = [
        'thread_id' => 'required|alpha_dash|max_length[50]',
        'sender_type' => 'required|in_list[applicant,admin]',
        'sender_id' => 'required|is_natural_no_zero',
        'recipient_type' => 'required|in_list[applicant,admin]',
        'recipient_id' => 'required|is_natural_no_zero',
        'content' => 'required|min_length[1]',
        'subject' => 'permit_empty|max_length[255]',
        'status' => 'permit_empty|in_list[sent,delivered,read,failed]',
    ];

    protected $validationMessages = [
        'content' => [
            'required' => 'Message content is required.',
        ],
        'sender_type' => [
            'in_list' => 'Invalid sender type.'
        ]
    ];

    protected $skipValidation = false;

    /**
     * Create new message and start thread if needed
     */
    public function createMessage(array $data): int
    {
        // Auto-generate thread_id if not provided
        if (empty($data['thread_id'])) {
            $data['thread_id'] = 'thread_' . date('YmdHis') . '_' . uniqid();
        }

        return $this->insert($data);
    }

    /**
     * Get messages by thread
     */
    public function getByThread(string $threadId, int $limit = 50): array
    {
        return $this->where('thread_id', $threadId)
                   ->orderBy('created_at', 'ASC')
                   ->limit($limit)
                   ->findAll();
    }

    /**
     * Get unread messages for admin
     */
    public function getAdminInbox(int $limit = 50): array
    {
        return $this->where('recipient_type', 'admin')
                   ->where('is_read', 0)
                   ->orderBy('created_at', 'DESC')
                   ->limit($limit)
                   ->findAll();
    }

    /**
     * Get messages for specific applicant-admin conversation
     */
    public function getConversation(int $applicantId, ?int $adminId = null): array
    {
        $builder = $this->groupStart()
                       ->where('sender_type', 'applicant')
                       ->where('sender_id', $applicantId)
                       ->orWhere('recipient_type', 'applicant')
                       ->where('recipient_id', $applicantId)
                       ->groupEnd();

        if ($adminId) {
            $builder = $builder->groupStart()
                              ->where('sender_type', 'admin')
                              ->where('sender_id', $adminId)
                              ->orWhere('recipient_type', 'admin')
                              ->where('recipient_id', $adminId)
                              ->groupEnd();
        }

        return $builder->orderBy('created_at', 'ASC')
                      ->findAll();
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(array $messageIds): bool
    {
        return $this->update($messageIds, ['is_read' => 1]);
    }

    /**
     * Get recent messages for dashboard
     */
    public function getRecent(int $limit = 10): array
    {
        return $this->orderBy('created_at', 'DESC')
                   ->limit($limit)
                   ->findAll();
    }

    /**
     * Get message stats
     */
    public function getStats(): array
    {
        return [
            'total' => $this->countAll(),
            'unread' => $this->where('recipient_type', 'admin')->where('is_read', 0)->countAllResults(),
            'today' => $this->where('DATE(created_at)', date('Y-m-d'))->countAllResults(),
        ];
    }

    /**
     * Get threads overview for inbox
     */
    public function getThreadsOverview(string $recipientType, int $recipientId, int $limit = 20): array
    {
        return $this->select('thread_id, subject, content, created_at, sender_type, sender_id, is_read')
                   ->where('recipient_type', $recipientType)
                   ->where('recipient_id', $recipientId)
                   ->groupBy('thread_id')
                   ->orderBy('created_at', 'DESC')
                   ->limit($limit)
                   ->findAll();
    }
}

