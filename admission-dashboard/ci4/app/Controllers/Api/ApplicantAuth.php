<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ApplicantModel;
use App\Models\OtpModel;
use App\Models\ApplicationModel;

class ApplicantAuth extends ResourceController
{
    protected $modelName = 'App\Models\ApplicantModel';
    protected $format    = 'json';

    /**
     * Get available programs
     * GET /api/applicant/programs
     */
    public function programs()
    {
        // Return available programs
        $programs = [
            ['id' => 1, 'name' => 'Medicine', 'school' => 'School of Health Sciences', 'duration' => '6 Years'],
            ['id' => 2, 'name' => 'Nursing', 'school' => 'School of Health Sciences', 'duration' => '4 Years'],
            ['id' => 3, 'name' => 'Pharmacy', 'school' => 'School of Health Sciences', 'duration' => '5 Years'],
            ['id' => 4, 'name' => 'Medical Lab Science', 'school' => 'School of Health Sciences', 'duration' => '4 Years'],
            ['id' => 5, 'name' => 'Civil Engineering', 'school' => 'School of Engineering & Technology', 'duration' => '5 Years'],
            ['id' => 6, 'name' => 'Computer Science', 'school' => 'School of Engineering & Technology', 'duration' => '4 Years'],
            ['id' => 7, 'name' => 'Electrical Engineering', 'school' => 'School of Engineering & Technology', 'duration' => '5 Years'],
            ['id' => 8, 'name' => 'AI & Robotics', 'school' => 'School of Engineering & Technology', 'duration' => '4 Years'],
            ['id' => 9, 'name' => 'Agricultural Science', 'school' => 'School of Agriculture', 'duration' => '4 Years'],
            ['id' => 10, 'name' => 'Animal Husbandry', 'school' => 'School of Agriculture', 'duration' => '4 Years'],
            ['id' => 11, 'name' => 'Crop Science', 'school' => 'School of Agriculture', 'duration' => '4 Years'],
            ['id' => 12, 'name' => 'Agri-Business', 'school' => 'School of Agriculture', 'duration' => '4 Years'],
            ['id' => 13, 'name' => 'Business Administration', 'school' => 'School of Management Sciences', 'duration' => '4 Years'],
            ['id' => 14, 'name' => 'Accounting', 'school' => 'School of Management Sciences', 'duration' => '4 Years'],
            ['id' => 15, 'name' => 'Marketing', 'school' => 'School of Management Sciences', 'duration' => '4 Years'],
            ['id' => 16, 'name' => 'Human Resources', 'school' => 'School of Management Sciences', 'duration' => '4 Years'],
            ['id' => 17, 'name' => 'Nutrition & Dietetics', 'school' => 'School of Home Economics', 'duration' => '4 Years'],
            ['id' => 18, 'name' => 'Family Studies', 'school' => 'School of Home Economics', 'duration' => '4 Years'],
            ['id' => 19, 'name' => 'Textiles & Fashion', 'school' => 'School of Home Economics', 'duration' => '4 Years'],
            ['id' => 20, 'name' => 'Hospitality Management', 'school' => 'School of Home Economics', 'duration' => '4 Years'],
        ];

        return $this->respond([
            'success' => true,
            'data' => $programs
        ]);
    }

    /**
     * Register new applicant
     * POST /api/applicant/register
     */
    public function register()
    {
        $data = $this->request->getJSON();

        // Validation
        $validation = \Config\Services::validation();
        $validation->setRules([
            'email' => 'required|valid_email',
            'phone' => 'required|min_length[10]',
            'first_name' => 'required|min_length[2]',
            'last_name' => 'required|min_length[2]',
        ]);

        if (!$validation->run((array) $data)) {
            return $this->respond([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validation->getErrors()
            ], 400);
        }

        $applicantModel = new ApplicantModel();
        $otpModel = new OtpModel();
        $applicationModel = new ApplicationModel();

        // Check if email already exists
        $existingApplicant = $applicantModel->findByEmail($data->email);
        
        if ($existingApplicant) {
            return $this->respond([
                'success' => false,
                'message' => 'Email already registered'
            ], 400);
        }

        // Create applicant record (unverified)
        $applicantData = [
            'email' => $data->email,
            'phone' => $data->phone,
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'password_hash' => password_hash($data->password ?? 'temp', PASSWORD_DEFAULT),
            'is_verified' => 0,
        ];

        $applicantId = $applicantModel->insert($applicantData);

        // Create application record with form data
        $applicationData = [
            'applicant_id' => $applicantId,
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'date_of_birth' => $data->dateOfBirth ?? null,
            'gender' => $data->gender ?? null,
            'email' => $data->email,
            'phone' => $data->phone,
            'address' => $data->address ?? null,
            'city' => $data->city ?? null,
            'state' => $data->state ?? null,
            'nationality' => $data->nationality ?? null,
            'primary_school' => $data->primarySchool ?? null,
            'primary_year' => $data->primaryYear ?? null,
            'secondary_school' => $data->secondarySchool ?? null,
            'secondary_year' => $data->secondaryYear ?? null,
            'tertiary_institution' => $data->tertiaryInstitution ?? null,
            'tertiary_course' => $data->tertiaryCourse ?? null,
            'selected_program' => $data->selectedProgram ?? null,
            'campus' => $data->campus ?? null,
            'intake' => $data->intake ?? null,
            'status' => 'pending',
        ];

        $applicationModel->insert($applicationData);

        // Generate and send OTP
        $otp = $otpModel->createOtp($data->email, 'verification');
        $this->sendOtpEmail($data->email, $otp, $data->first_name);

        return $this->respond([
            'success' => true,
            'message' => 'Registration successful. Please verify your email.',
            'data' => [
                'applicant_id' => $applicantId,
                'email' => $data->email,
                'requires_verification' => true
            ]
        ], 201);
    }

    /**
     * Send OTP to email
     * POST /api/applicant/send-otp
     */
    public function sendOtp()
    {
        $data = $this->request->getJSON();

        if (!isset($data->email)) {
            return $this->respond([
                'success' => false,
                'message' => 'Email is required'
            ], 400);
        }

        $applicantModel = new ApplicantModel();
        $otpModel = new OtpModel();

        $applicant = $applicantModel->findByEmail($data->email);

        if (!$applicant) {
            return $this->respond([
                'success' => false,
                'message' => 'Email not found'
            ], 404);
        }

        // Check for rate limiting (1 minute)
        if ($otpModel->hasRecentOtp($data->email)) {
            return $this->respond([
                'success' => false,
                'message' => 'Please wait before requesting another OTP'
            ], 429);
        }

        $otp = $otpModel->createOtp($data->email, 'verification');
        $this->sendOtpEmail($data->email, $otp, $applicant['first_name']);

        return $this->respond([
            'success' => true,
            'message' => 'OTP sent to your email'
        ]);
    }

    /**
     * Verify OTP
     * POST /api/applicant/verify-otp
     */
    public function verifyOtp()
    {
        $data = $this->request->getJSON();

        if (!isset($data->email) || !isset($data->otp)) {
            return $this->respond([
                'success' => false,
                'message' => 'Email and OTP are required'
            ], 400);
        }

        $otpModel = new OtpModel();
        $applicantModel = new ApplicantModel();

        if ($otpModel->verifyOtp($data->email, $data->otp, 'verification')) {
            // Mark applicant as verified
            $applicant = $applicantModel->findByEmail($data->email);
            if ($applicant) {
                $applicantModel->markAsVerified($applicant['id']);
            }

            return $this->respond([
                'success' => true,
                'message' => 'Email verified successfully',
                'data' => [
                    'verified' => true
                ]
            ]);
        }

        return $this->respond([
            'success' => false,
            'message' => 'Invalid or expired OTP'
        ], 400);
    }

    /**
     * Login
     * POST /api/applicant/login
     */
    public function login()
    {
        $data = $this->request->getJSON();

        if (!isset($data->email) || !isset($data->password)) {
            return $this->respond([
                'success' => false,
                'message' => 'Email and password are required'
            ], 400);
        }

        $applicantModel = new ApplicantModel();
        $applicant = $applicantModel->verifyCredentials($data->email, $data->password);

        if (!$applicant) {
            return $this->respond([
                'success' => false,
                'message' => 'Invalid email or password'
            ], 401);
        }

        if (!$applicant['is_verified']) {
            return $this->respond([
                'success' => false,
                'message' => 'Please verify your email first',
                'requires_verification' => true,
                'email' => $data->email
            ], 403);
        }

        // Generate simple token (in production, use JWT)
        $token = bin2hex(random_bytes(32));

        return $this->respond([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'id' => $applicant['id'],
                'email' => $applicant['email'],
                'first_name' => $applicant['first_name'],
                'last_name' => $applicant['last_name'],
                'token' => $token
            ]
        ]);
    }

    /**
     * Set password after OTP verification
     * POST /api/applicant/set-password
     */
    public function setPassword()
    {
        $data = $this->request->getJSON();

        if (!isset($data->email) || !isset($data->password)) {
            return $this->respond([
                'success' => false,
                'message' => 'Email and password are required'
            ], 400);
        }

        $applicantModel = new ApplicantModel();
        $applicant = $applicantModel->findByEmail($data->email);

        if (!$applicant) {
            return $this->respond([
                'success' => false,
                'message' => 'Applicant not found'
            ], 404);
        }

        $applicantModel->updatePassword($applicant['id'], $data->password);

        return $this->respond([
            'success' => true,
            'message' => 'Password set successfully'
        ]);
    }

    /**
     * Get applicant profile
     * GET /api/applicant/profile
     */
    public function profile()
    {
        $token = $this->request->getHeaderLine('Authorization');
        
        if (!$token) {
            return $this->respond([
                'success' => false,
                'message' => 'Authorization required'
            ], 401);
        }

        // In production, validate JWT token
        // For now, we'll use email from query
        $email = $this->request->getGet('email');
        
        if (!$email) {
            return $this->respond([
                'success' => false,
                'message' => 'Email is required'
            ], 400);
        }

        $applicantModel = new ApplicantModel();
        $applicant = $applicantModel->findByEmail($email);

        if (!$applicant) {
            return $this->respond([
                'success' => false,
                'message' => 'Applicant not found'
            ], 404);
        }

        // Get application status
        $applicationModel = new ApplicationModel();
        $application = $applicationModel->findByApplicantId($applicant['id']);

        unset($applicant['password_hash']);

        return $this->respond([
            'success' => true,
            'data' => [
                'applicant' => $applicant,
                'application' => $application
            ]
        ]);
    }

    /**
     * Send OTP email
     */
    private function sendOtpEmail(string $email, string $otp, string $name)
    {
        $emailService = \Config\Services::email();

        $emailService->setFrom(
            config('Email')->fromEmail,
            config('Email')->fromName
        );
        
        $emailService->setTo($email);
        $emailService->setSubject('Your OTP Code - Excellence Academy');
        
        $message = "
        Dear {$name},

        Your One-Time Password (OTP) for Excellence Academy Admissions is: {$otp}

        This OTP will expire in 10 minutes.

        If you did not request this, please ignore this email.

        Best regards,
        Excellence Academy Admissions
        ";
        
        $emailService->setMessage($message);
        $emailService->send();
    }
}
