<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $admins = [
            [
                'admin_id'       => 'ADM000001',
                'first_name'     => 'John',
                'last_name'      => 'Smith',
                'email'          => 'john.smith@admission.edu',
                'password_hash'   => '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i',
                'role'           => 'super_admin',
                'department'     => 'Administration',
                'phone'          => '+1234567890',
                'is_active'      => 1,
                'created_at'     => Time::now(),
                'updated_at'     => Time::now(),
            ],
            [
                'admin_id'       => 'ADM000002',
                'first_name'     => 'Sarah',
                'last_name'      => 'Johnson',
                'email'          => 'sarah.johnson@admission.edu',
                'password_hash'   => '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i',
                'role'           => 'admission_officer',
                'department'     => 'Admissions',
                'phone'          => '+1234567891',
                'is_active'      => 1,
                'created_at'     => Time::now(),
                'updated_at'     => Time::now(),
            ],
            [
                'admin_id'       => 'ADM000003',
                'first_name'     => 'Michael',
                'last_name'      => 'Williams',
                'email'          => 'michael.williams@admission.edu',
                'password_hash'   => '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i',
                'role'           => 'reviewer',
                'department'     => 'Admissions',
                'phone'          => '+1234567892',
                'is_active'      => 1,
                'created_at'     => Time::now(),
                'updated_at'     => Time::now(),
            ],
            [
                'admin_id'       => 'ADM000004',
                'first_name'     => 'Emily',
                'last_name'      => 'Brown',
                'email'          => 'emily.brown@admission.edu',
                'password_hash'   => '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i',
                'role'           => 'coordinator',
                'department'     => 'Programs',
                'phone'          => '+1234567893',
                'is_active'      => 1,
                'created_at'     => Time::now(),
                'updated_at'     => Time::now(),
            ],
        ];

        $this->db->table('admins')->insertBatch($admins);
        
        echo "4 Admin users seeded successfully!\n";
        echo "Default password for all: admin123\n";
    }
}
