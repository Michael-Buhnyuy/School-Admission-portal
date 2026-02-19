<?php

namespace App\Libraries;

class JWTHandler
{
    protected $secretKey;
    protected $algorithm;
    protected $expiry;
    
    public function __construct()
    {
        $this->secretKey = getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production';
        $this->algorithm = 'HS256';
        $this->expiry = 3600; // 1 hour in seconds
    }
    
    /**
     * Generate a JWT token
     */
    public function generateToken(array $payload): string
    {
        // Add standard claims
        $payload['iat'] = time();
        $payload['exp'] = time() + $this->expiry;
        $payload['iss'] = 'admission-portal';
        
        // Create token header
        $header = [
            'typ' => 'JWT',
            'alg' => $this->algorithm
        ];
        
        // Encode header and payload
        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));
        
        // Create signature
        $signature = $this->createSignature($headerEncoded, $payloadEncoded);
        $signatureEncoded = $this->base64UrlEncode($signature);
        
        // Return complete token
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    /**
     * Verify and decode a JWT token
     */
    public function verifyToken(string $token): array
    {
        // Split token into parts
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new \Exception('Invalid token format');
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verify signature
        $signature = $this->createSignature($headerEncoded, $payloadEncoded);
        
        if ($this->base64UrlEncode($signature) !== $signatureEncoded) {
            throw new \Exception('Invalid signature');
        }
        
        // Decode payload
        $payload = json_decode($this->base64UrlDecode($payloadEncoded), true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new \Exception('Token expired');
        }
        
        return $payload;
    }
    
    /**
     * Create signature for token
     */
    protected function createSignature(string $headerEncoded, string $payloadEncoded): string
    {
        $data = $headerEncoded . '.' . $payloadEncoded;
        
        return hash_hmac('sha256', $data, $this->secretKey, true);
    }
    
    /**
     * Base64 URL encode
     */
    protected function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    protected function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
