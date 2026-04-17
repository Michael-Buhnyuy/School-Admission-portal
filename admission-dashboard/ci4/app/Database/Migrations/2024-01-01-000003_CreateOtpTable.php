<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOtpTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'otp_code' => [
                'type' => 'VARCHAR',
                'constraint' => 6,
            ],
            'otp_type' => [
                'type' => 'ENUM',
                'constraint' => ['verification', 'password_reset'],
                'default' => 'verification',
            ],
            'expires_at' => [
                'type' => 'DATETIME',
            ],
            'is_used' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('otp_verification');
    }

    public function down()
    {
        $this->forge->dropTable('otp_verification');
    }
}
