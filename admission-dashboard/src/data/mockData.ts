import type { Applicant, Document, Decision, Message, AdmissionOfficer, Activity, DashboardStats } from '../types';

export const admissionOfficers: AdmissionOfficer[] = [
  {
    id: 'OFF001',
    username: 'admin',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@edu.com',
    role: 'admin'
  },
  {
    id: 'OFF002',
    username: 'officer',
    password: 'officer123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@edu.com',
    role: 'officer'
  }
];

export const applicants: Applicant[] = [
  {
    id: 'APP001',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@email.com',
    phone: '+1 555-0101',
    dateOfBirth: '2005-03-15',
    address: '123 Oak Street, Boston, MA',
    program: 'Computer Science',
    status: 'pending',
    appliedDate: '2024-01-15',
    gpa: 3.8,
    previousSchool: 'Boston High School'
  },
  {
    id: 'APP002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 555-0102',
    dateOfBirth: '2005-07-22',
    address: '456 Maple Ave, Cambridge, MA',
    program: 'Engineering',
    status: 'reviewed',
    appliedDate: '2024-01-18',
    gpa: 3.5,
    previousSchool: 'Cambridge High School'
  },
  {
    id: 'APP003',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1 555-0103',
    dateOfBirth: '2005-11-08',
    address: '789 Pine Road, Somerville, MA',
    program: 'Business Administration',
    status: 'verified',
    appliedDate: '2024-01-20',
    gpa: 3.9,
    previousSchool: 'Somerville High School'
  },
  {
    id: 'APP004',
    firstName: 'James',
    lastName: 'Davis',
    email: 'james.davis@email.com',
    phone: '+1 555-0104',
    dateOfBirth: '2004-05-12',
    address: '321 Elm Street, Quincy, MA',
    program: 'Medicine',
    status: 'approved',
    appliedDate: '2024-01-10',
    gpa: 3.95,
    previousSchool: 'Quincy High School'
  },
  {
    id: 'APP005',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@email.com',
    phone: '+1 555-0105',
    dateOfBirth: '2005-09-30',
    address: '654 Cedar Lane, Brookline, MA',
    program: 'Computer Science',
    status: 'rejected',
    appliedDate: '2024-01-08',
    gpa: 2.8,
    previousSchool: 'Brookline High School'
  },
  {
    id: 'APP006',
    firstName: 'William',
    lastName: 'Taylor',
    email: 'william.taylor@email.com',
    phone: '+1 555-0106',
    dateOfBirth: '2005-02-14',
    address: '987 Birch Blvd, Newton, MA',
    program: 'Engineering',
    status: 'pending',
    appliedDate: '2024-01-22',
    gpa: 3.6,
    previousSchool: 'Newton High School'
  },
  {
    id: 'APP007',
    firstName: 'Olivia',
    lastName: 'Anderson',
    email: 'olivia.anderson@email.com',
    phone: '+1 555-0107',
    dateOfBirth: '2005-06-25',
    address: '147 Walnut St, Medford, MA',
    program: 'Business Administration',
    status: 'pending',
    appliedDate: '2024-01-23',
    gpa: 3.7,
    previousSchool: 'Medford High School'
  },
  {
    id: 'APP008',
    firstName: 'Benjamin',
    lastName: 'Thomas',
    email: 'benjamin.thomas@email.com',
    phone: '+1 555-0108',
    dateOfBirth: '2004-12-01',
    address: '258 Spruce Ave, Malden, MA',
    program: 'Law',
    status: 'reviewed',
    appliedDate: '2024-01-19',
    gpa: 3.85,
    previousSchool: 'Malden High School'
  }
];

export const documents: Document[] = [
  {
    id: 'DOC001',
    applicantId: 'APP001',
    type: 'transcript',
    name: 'High School Transcript',
    status: 'verified',
    uploadedDate: '2024-01-15',
    notes: 'All grades verified'
  },
  {
    id: 'DOC002',
    applicantId: 'APP001',
    type: 'certificate',
    name: 'Graduation Certificate',
    status: 'verified',
    uploadedDate: '2024-01-15',
    notes: 'Valid certificate'
  },
  {
    id: 'DOC003',
    applicantId: 'APP001',
    type: 'identification',
    name: 'ID Card',
    status: 'pending',
    uploadedDate: '2024-01-15',
    notes: ''
  },
  {
    id: 'DOC004',
    applicantId: 'APP002',
    type: 'transcript',
    name: 'High School Transcript',
    status: 'verified',
    uploadedDate: '2024-01-18',
    notes: 'Verified'
  },
  {
    id: 'DOC005',
    applicantId: 'APP002',
    type: 'certificate',
    name: 'Graduation Certificate',
    status: 'flagged',
    uploadedDate: '2024-01-18',
    notes: 'Issue with date - needs clarification'
  },
  {
    id: 'DOC006',
    applicantId: 'APP003',
    type: 'transcript',
    name: 'High School Transcript',
    status: 'verified',
    uploadedDate: '2024-01-20',
    notes: ''
  },
  {
    id: 'DOC007',
    applicantId: 'APP003',
    type: 'identification',
    name: 'Passport',
    status: 'verified',
    uploadedDate: '2024-01-20',
    notes: ''
  },
  {
    id: 'DOC008',
    applicantId: 'APP004',
    type: 'transcript',
    name: 'High School Transcript',
    status: 'verified',
    uploadedDate: '2024-01-10',
    notes: ''
  },
  {
    id: 'DOC009',
    applicantId: 'APP004',
    type: 'certificate',
    name: 'Graduation Certificate',
    status: 'verified',
    uploadedDate: '2024-01-10',
    notes: ''
  },
  {
    id: 'DOC010',
    applicantId: 'APP005',
    type: 'transcript',
    name: 'High School Transcript',
    status: 'missing',
    uploadedDate: '',
    notes: 'Not uploaded yet'
  }
];

export const decisions: Decision[] = [
  {
    id: 'DEC001',
    applicationId: 'APP004',
    officerId: 'OFF001',
    officerName: 'John Smith',
    decision: 'approved',
    reason: 'Excellent academic record and strong recommendation letters',
    timestamp: '2024-01-21T10:30:00Z'
  },
  {
    id: 'DEC002',
    applicationId: 'APP005',
    officerId: 'OFF002',
    officerName: 'Sarah Johnson',
    decision: 'rejected',
    reason: 'GPA below minimum requirement (2.8 < 3.0)',
    timestamp: '2024-01-22T14:15:00Z'
  }
];

export const messages: Message[] = [
  {
    id: 'MSG001',
    applicantId: 'APP001',
    senderId: 'OFF001',
    senderName: 'John Smith',
    recipientId: 'APP001',
    subject: 'Application Received',
    content: 'Your application has been received and is under review.',
    timestamp: '2024-01-16T09:00:00Z',
    read: true
  },
  {
    id: 'MSG002',
    applicantId: 'APP002',
    senderId: 'APP002',
    senderName: 'Michael Chen',
    recipientId: 'OFF001',
    subject: 'Question about documents',
    content: 'I wanted to ask about the additional documents required.',
    timestamp: '2024-01-19T11:30:00Z',
    read: true
  }
];

export const activities: Activity[] = [
  {
    id: 'ACT001',
    type: 'application_submitted',
    description: 'New application submitted',
    applicantId: 'APP007',
    applicantName: 'Olivia Anderson',
    timestamp: '2024-01-23T15:00:00Z'
  },
  {
    id: 'ACT002',
    type: 'document_uploaded',
    description: 'Document uploaded',
    applicantId: 'APP006',
    applicantName: 'William Taylor',
    timestamp: '2024-01-23T14:30:00Z'
  },
  {
    id: 'ACT003',
    type: 'status_changed',
    description: 'Application status changed to verified',
    applicantId: 'APP003',
    applicantName: 'Emma Wilson',
    officerId: 'OFF001',
    officerName: 'John Smith',
    timestamp: '2024-01-22T10:00:00Z'
  },
  {
    id: 'ACT004',
    type: 'decision_made',
    description: 'Application approved',
    applicantId: 'APP004',
    applicantName: 'James Davis',
    officerId: 'OFF001',
    officerName: 'John Smith',
    timestamp: '2024-01-21T10:30:00Z'
  },
  {
    id: 'ACT005',
    type: 'decision_made',
    description: 'Application rejected',
    applicantId: 'APP005',
    applicantName: 'Sophia Martinez',
    officerId: 'OFF002',
    officerName: 'Sarah Johnson',
    timestamp: '2024-01-22T14:15:00Z'
  },
  {
    id: 'ACT006',
    type: 'message_sent',
    description: 'Message sent to applicant',
    applicantId: 'APP001',
    applicantName: 'Alice Brown',
    officerId: 'OFF001',
    officerName: 'John Smith',
    timestamp: '2024-01-16T09:00:00Z'
  }
];

export const getDashboardStats = (): DashboardStats => {
  const programCounts: { [key: string]: number } = {};
  
  applicants.forEach(app => {
    programCounts[app.program] = (programCounts[app.program] || 0) + 1;
  });

  return {
    totalApplications: applicants.length,
    pendingApplications: applicants.filter(a => a.status === 'pending').length,
    reviewedApplications: applicants.filter(a => a.status === 'reviewed').length,
    approvedApplications: applicants.filter(a => a.status === 'approved').length,
    rejectedApplications: applicants.filter(a => a.status === 'rejected').length,
    applicationsPerProgram: Object.entries(programCounts).map(([program, count]) => ({ program, count }))
  };
};
