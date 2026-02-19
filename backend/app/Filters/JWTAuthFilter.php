<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\JWTHandler;

class JWTAuthFilter implements FilterInterface
{
    protected $jwt;
    
    public function __construct()
    {
        $this->jwt = new JWTHandler();
    }
    
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (!$authHeader) {
            return $this->unauthorizedResponse('No token provided');
        }
        
        // Check if it starts with 'Bearer '
        if (strpos($authHeader, 'Bearer ') !== 0) {
            return $this->unauthorizedResponse('Invalid token format');
        }
        
        $token = substr($authHeader, 7);
        
        try {
            $decoded = $this->jwt->verifyToken($token);
            
            // Store user data in request for later use
            $request->userData = $decoded;
            
        } catch (\Exception $e) {
            return $this->unauthorizedResponse($e->getMessage());
        }
    }
    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do here
    }
    
    protected function unauthorizedResponse(string $message)
    {
        $response = service('response');
        $response->setStatusCode(401);
        $response->setJSON([
            'success' => false,
            'message' => $message
        ]);
        
        return $response;
    }
}
