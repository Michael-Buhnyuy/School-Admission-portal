<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ApplicationModel;
use App\Models\ApplicantModel;

class Application extends ResourceController
{
    protected $modelName = 'App\Models\ApplicationModel';
    protected $format    = 'json';

    /**
     * Get application status by email
     * GET /api/application/status
     */
    public function status()
    {
        $email = $this->request->getGet('email');

        if (!$email) {
            return $this->respond([
                'success' => false,
                'message' => 'Email is required'
            ], 400);
        }

        $applicationModel = new ApplicationModel();
        $application = $applicationModel->findByEmail($email);

        if (!$application) {
            return $this->respond([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        return $this->respond([
            'success' => true,
            'data' => $application
        ]);
    }

    /**
     * Submit application
     * POST /api/application/submit
     */
    public function submit()
    {
        $data = $this->request->getJSON();

        $applicationModel = new ApplicationModel();

        // Check if application already exists for this email
        $existingApp = $applicationModel->findByEmail($data->email ?? '');

        if ($existingApp) {
            return $this->respond([
                'success' => false,
                'message' => 'Application already submitted for this email'
            ], 400);
        }

        // Validation
        $requiredFields = ['first_name', 'last_name', 'email', 'phone', 'secondary_school', 'selected_program'];
        
        foreach ($requiredFields as $field) {
            if (empty($data->$field)) {
                return $this->respond([
                    'success' => false,
                    'message' => "Field {$field} is required"
                ], 400);
            }
        }

        // Create application
        $applicationData = [
            'applicant_id' => $data->applicant_id ?? 0,
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'date_of_birth' => $data->date_of_birth ?? null,
            'gender' => $data->gender ?? null,
            'email' => $data->email,
            'phone' => $data->phone,
            'address' => $data->address ?? null,
            'city' => $data->city ?? null,
            'state' => $data->state ?? null,
            'nationality' => $data->nationality ?? null,
            'primary_school' => $data->primary_school ?? null,
            'primary_year' => $data->primary_year ?? null,
            'secondary_school' => $data->secondary_school,
            'secondary_year' => $data->secondary_year,
            'tertiary_institution' => $data->tertiary_institution ?? null,
            'tertiary_course' => $data->tertiary_course ?? null,
            'selected_program' => $data->selected_program,
            'campus' => $data->campus ?? null,
            'intake' => $data->intake ?? null,
            'status' => 'pending',
        ];

        $applicationId = $applicationModel->insert($applicationData);

        if ($applicationId) {
            return $this->respond([
                'success' => true,
                'message' => 'Application submitted successfully',
                'data' => [
                    'application_id' => $applicationId,
                    'status' => 'pending'
                ]
            ], 201);
        }

        return $this->respond([
            'success' => false,
            'message' => 'Failed to submit application'
        ], 500);
    }

    /**
     * Update application
     * PUT /api/application/update
     */
    public function update()
    {
        $data = $this->request->getJSON();

        if (!isset($data->id)) {
            return $this->respond([
                'success' => false,
                'message' => 'Application ID is required'
            ], 400);
        }

        $applicationModel = new ApplicationModel();
        $application = $applicationModel->find($data->id);

        if (!$application) {
            return $this->respond([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        // Update fields
        $updateData = [];
        $fillable = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'phone', 'address', 'city', 'state', 'nationality',
            'primary_school', 'primary_year', 'secondary_school', 'secondary_year',
            'tertiary_institution', 'tertiary_course',
            'selected_program', 'campus', 'intake'
        ];

        foreach ($fillable as $field) {
            if (isset($data->$field)) {
                $updateData[$field] = $data->$field;
            }
        }

        $applicationModel->update($data->id, $updateData);

        return $this->respond([
            'success' => true,
            'message' => 'Application updated successfully'
        ]);
    }
}
