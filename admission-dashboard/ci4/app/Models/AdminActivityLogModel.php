<?php

namespace App\Models;

use CodeIgniter\Model;

class AdminActivityLogModel extends Model
{
    protected $table            = 'admin_activity_log';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
  protected $allowedFields    = [
      'admin_id', 'action', 'description', 'entity_type', 'entity_id',
      'ip_address', 'user_agent', 'created_at', 'status', 'reviewed_by', 'reviewed_at', 'notes'
  ];
    protected $useTimestamps    = false;

    public function logActivity(int $adminId, string $action, ?string $description = null, ?string $entityType = null, ?int $entityId = null): bool
    {
        $data = [
            'admin_id'     => $adminId,
            'action'       => $action,
            'description'  => $description,
            'entity_type'  => $entityType,
            'entity_id'    => $entityId,
            'ip_address'   => service('request')->getIPAddress(),
            'user_agent'   => service('request')->getUserAgent()->getAgentString(),
            'created_at'   => date('Y-m-d H:i:s'),
        ];

        return $this->insert($data);
    }

    public function getAdminActivity(int $adminId, int $limit = 50): array
    {
        return $this->where('admin_id', $adminId)
                    ->orderBy('created_at', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    public function getRecentActivity(int $limit = 100): array
    {
        return $this->select('admin_activity_log.*, admins.first_name, admins.last_name, admins.email, admins.role')
                    ->join('admins', 'admins.id = admin_activity_log.admin_id')
                    ->orderBy('admin_activity_log.created_at', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    public function getActivityByEntity(string $entityType, int $entityId): array
    {
        return $this->where('entity_type', $entityType)
                    ->where('entity_id', $entityId)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    public function getActivityStats(int $days = 30): array
    {
        $startDate = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        
        $total = $this->where('created_at >=', $startDate)->countAllResults();
        
        $byAdmin = $this->select('admin_id, COUNT(*) as count')
                        ->where('created_at >=', $startDate)
                        ->groupBy('admin_id')
                        ->get()
                        ->getResultArray();
        
        $byAction = $this->select('action, COUNT(*) as count')
                        ->where('created_at >=', $startDate)
                        ->groupBy('action')
                        ->get()
                        ->getResultArray();

        return [
            'total_actions' => $total,
            'by_admin'      => $byAdmin,
            'by_action'    => $byAction,
        ];
    }
}
