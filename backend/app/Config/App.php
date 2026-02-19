<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class App extends BaseConfig
{
    public string $baseURL = 'http://localhost:8080/backend/public/';
    
    public string $indexPage = 'index.php';
    
    public string $uriProtocol = 'REQUEST_URI';
    
    public string $defaultLocale = 'en';
    
    public bool $negotiateLocale = false;
    
    public array $supportedLocales = ['en'];
    
    public string $appTimezone = 'UTC';
    
    public string $charset = 'UTF-8';
    
    public bool $forceGlobalSecureRequests = false;
    
    public string $cookiePrefix = '';
    public string $cookieDomain = '';
    public string $cookiePath = '/';
    public bool $cookieSecure = false;
    public bool $cookieHTTPOnly = false;
    public string $cookieSameSite = 'Lax';
    
    public array $proxyIPs = [];
    
    public string $CSRFTokenName = 'csrf_token_name';
    public string $CSRFCookieName = 'csrf_cookie_name';
    public int $CSRFExpire = 7200;
    public bool $CSRFRegenerate = true;
    public array $CSRFExcludeURIs = ['api/*'];
    public array $CSRFDomains = [];
    public array $CSRFPaths = [];
    
    public string $tokenName = 'jwt_token';
    public int $tokenExpiry = 3600;
    public int $refreshTokenExpiry = 86400;
}
