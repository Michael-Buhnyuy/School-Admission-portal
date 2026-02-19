<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Database extends BaseConfig
{
    public string $defaultGroup = 'default';
    
    public array $default = [
        'DSN'          => '',
        'hostname'      => 'localhost',
        'username'      => 'root',
        'password'      => '',
        'database'      => 'admission_portal',
        'DBDriver'      => 'MySQLi',
        'DBPrefix'      => '',
        'pConnect'      => false,
        'DBDebug'       => true,
        'charset'       => 'utf8mb4',
        'DBCollat'      => 'utf8mb4_general_ci',
        'swapPre'       => '',
        'encrypt'       => false,
        'compress'      => false,
        'strictOn'      => false,
        'failover'      => [],
        'saveQueries'   => true,
    ];
    
    public function __construct()
    {
        parent::__construct();
        
        // Load environment variables if .env exists
        if (file_exists(ROOTPATH . '.env')) {
            $this->default['hostname'] = getenv('database.default.hostname') ?: 'localhost';
            $this->default['username'] = getenv('database.default.username') ?: 'root';
            $this->default['password'] = getenv('database.default.password') ?: '';
            $this->default['database'] = getenv('database.default.database') ?: 'admission_portal';
        }
    }
}
