<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'      => \CodeIgniter\Filters\CSRF::class,
        'toolbar'   => \CodeIgniter\Filters\DebugToolbar::class,
        'admins'    => \App\Filters\AdminFilter::class,
        'auth'      => \App\Filters\JWTAuthFilter::class,
    ];
    
    public array $methods = [
        'POST' => ['csrf'],
    ];
    
    public array $filters = [
        'csrf' => ['before' => ['api/*']],
        'auth' => ['before' => ['api/auth/user', 'api/auth/logout', 'api/auth/update-profile', 'api/auth/change-password']],
    ];
}
