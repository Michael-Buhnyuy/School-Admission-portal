<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddReviewFieldsToActivityLog extends Migration
{
    public function up()
    {
        $this->db->disableForeignKeyChecks();

        $fields = [
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'approved', 'rejected'],
                'default'    => 'pending',
                'null'       => true,
                'after'      => 'action',
            ],
            'reviewed_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'status',
            ],
            'reviewed_at' => [
                'type'       => 'DATETIME',
                'null'       => true,
                'after'      => 'reviewed_by',
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
                'after'      => 'reviewed_at',
            ],
        ];

        $this->forge->addColumn('admin_activity_log', $fields);

        // Add foreign key constraint
        $this->forge->addForeignKey('reviewed_by', 'admins', 'id', 'SET NULL', 'CASCADE');
        $this->forge->processForeignKeys('admin_activity_log');

        $this->db->enableForeignKeyChecks();
    }

    public function down()
    {
        $this->db->disableForeignKeyChecks();

        $this->forge->dropColumn('admin_activity_log', ['status', 'reviewed_by', 'reviewed_at', 'notes']);

        $this->db->enableForeignKeyChecks();
    }
}
