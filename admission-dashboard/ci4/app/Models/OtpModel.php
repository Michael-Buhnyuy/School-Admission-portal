<?php

namespace App\Models;

use CodeIgniter\Model;

class OtpModel extends Model
{
    protected $table            = 'otp_verification';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'email',
        'otp_code',
        'otp_type',
        'expires_at',
        'is_used',
        'created_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';

    /**
     * Generate a 6-digit OTP
     */
    public function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create new OTP for email
     */
    public function createOtp(string $email, string $type = 'verification'): string
    {
        // Delete any existing unused OTPs for this email
        $this->where('email', $email)
            ->where('is_used', 0)
            ->delete();

        // Generate new OTP
        $otpCode = $this->generateOtp();
        
        $data = [
            'email' => $email,
            'otp_code' => $otpCode,
            'otp_type' => $type,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+10 minutes')),
            'is_used' => 0,
        ];

        $this->insert($data);

        return $otpCode;
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(string $email, string $otpCode, string $type = 'verification'): bool
    {
        $otp = $this->where('email', $email)
            ->where('otp_code', $otpCode)
            ->where('otp_type', $type)
            ->where('is_used', 0)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->first();

        if ($otp) {
            // Mark OTP as used
            $this->update($otp['id'], ['is_used' => 1]);
            return true;
        }

        return false;
    }

    /**
     * Check if OTP is valid (for resend limit checking)
     */
    public function hasRecentOtp(string $email): bool
    {
        $recentOtp = $this->where('email', $email)
            ->where('created_at >=', date('Y-m-d H:i:s', strtotime('-1 minute')))
            ->first();

        return $recentOtp !== null;
    }
}
