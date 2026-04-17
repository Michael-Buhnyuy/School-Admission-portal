import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const mockAdmin = {
  id: 1,
  admin_id: 'ADM000001',
  email: 'john.smith@admission.edu',
  first_name: 'John',
  last_name: 'Smith',
  role: 'super_admin',
  role_label: 'Super Admin',
  department: 'Administration',
  token: 'mock-token-12345'
}

const mockStats = {
  total: 8,
  pending: 3,
  under_review: 2,
  approved: 2,
  rejected: 1
}

const mockApplications = [
  { id: 1, applicant_id: 1, application_number: 'APP001', first_name: 'Alice', last_name: 'Brown', email: 'alice.brown@email.com', phone: '+1 555-0101', selected_program: 'Computer Science', status: 'pending', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, applicant_id: 2, application_number: 'APP002', first_name: 'Michael', last_name: 'Chen', email: 'michael.chen@email.com', phone: '+1 555-0102', selected_program: 'Engineering', status: 'under_review', created_at: '2024-01-18T10:00:00Z' },
  { id: 3, applicant_id: 3, application_number: 'APP003', first_name: 'Emma', last_name: 'Wilson', email: 'emma.wilson@email.com', phone: '+1 555-0103', selected_program: 'Business Administration', status: 'approved', created_at: '2024-01-20T10:00:00Z' },
  { id: 4, applicant_id: 4, application_number: 'APP004', first_name: 'James', last_name: 'Davis', email: 'james.davis@email.com', phone: '+1 555-0104', selected_program: 'Medicine', status: 'approved', created_at: '2024-01-10T10:00:00Z' },
  { id: 5, applicant_id: 5, application_number: 'APP005', first_name: 'Sophia', last_name: 'Martinez', email: 'sophia.martinez@email.com', phone: '+1 555-0105', selected_program: 'Computer Science', status: 'rejected', created_at: '2024-01-08T10:00:00Z' },
  { id: 6, applicant_id: 6, application_number: 'APP006', first_name: 'William', last_name: 'Taylor', email: 'william.taylor@email.com', phone: '+1 555-0106', selected_program: 'Engineering', status: 'pending', created_at: '2024-01-22T10:00:00Z' },
  { id: 7, applicant_id: 7, application_number: 'APP007', first_name: 'Olivia', last_name: 'Anderson', email: 'olivia.anderson@email.com', phone: '+1 555-0107', selected_program: 'Business Administration', status: 'pending', created_at: '2024-01-23T10:00:00Z' },
  { id: 8, applicant_id: 8, application_number: 'APP008', first_name: 'Benjamin', last_name: 'Thomas', email: 'benjamin.thomas@email.com', phone: '+1 555-0108', selected_program: 'Law', status: 'under_review', created_at: '2024-01-19T10:00:00Z' }
]

const mockActivities = [
  { id: 1, admin_id: 1, action: 'application_submitted', description: 'New application submitted', entity_type: 'application', entity_id: 7, created_at: '2024-01-23T15:00:00Z', first_name: 'Olivia', last_name: 'Anderson' },
  { id: 2, admin_id: 1, action: 'document_uploaded', description: 'Document uploaded', entity_type: 'application', entity_id: 6, created_at: '2024-01-23T14:30:00Z', first_name: 'William', last_name: 'Taylor' },
  { id: 3, admin_id: 1, action: 'status_change', description: 'Application status changed to verified', entity_type: 'application', entity_id: 3, created_at: '2024-01-22T10:00:00Z', first_name: 'Emma', last_name: 'Wilson' },
  { id: 4, admin_id: 1, action: 'application_submitted', description: 'Application approved', entity_type: 'application', entity_id: 4, created_at: '2024-01-21T10:30:00Z', first_name: 'James', last_name: 'Davis' },
  { id: 5, admin_id: 2, action: 'application_submitted', description: 'Application rejected', entity_type: 'application', entity_id: 5, created_at: '2024-01-22T14:15:00Z', first_name: 'Sophia', last_name: 'Martinez' },
  { id: 6, admin_id: 1, action: 'admin_login', description: 'Admin logged in', entity_type: 'admin', entity_id: 1, created_at: '2024-01-23T08:00:00Z', first_name: 'John', last_name: 'Smith' }
]

function mockApiMiddleware(req: any, res: any, next: any) {
  const url = req.url
  
  if (url.startsWith('/api/')) {
    if (url === '/api/admin/login') {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ success: true, data: mockAdmin }))
    }
    
    if (url === '/api/admin/stats' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ success: true, data: { applications: mockStats } }))
    }
    
    if (url === '/api/admin/applicants' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ success: true, data: mockApplications }))
    }
    
    if (url === '/api/admin/activity' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ success: true, data: mockActivities }))
    }
    
    if (url.startsWith('/api/admin/applicant/') && url.includes('/status') && req.method === 'PUT') {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ success: true, message: 'Status updated successfully' }))
    }
  }
  
  next()
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use(mockApiMiddleware)
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})