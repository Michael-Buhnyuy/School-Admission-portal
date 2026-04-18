export type ApplicationStatus = 'pending' | 'reviewed' | 'verified' | 'approved' | 'rejected';

export type DocumentType = 'certificate' | 'transcript' | 'identification' | 'other';

export type DocumentStatus = 'verified' | 'flagged' | 'missing' | 'pending';

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  program: string;
  status: ApplicationStatus;
  appliedDate: string;
  gpa: number;
  previousSchool: string;
}

export interface Document {
  id: string;
  applicantId: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  uploadedDate: string;
  notes: string;
}

export interface Decision {
  id: string;
  applicationId: string;
  officerId: string;
  officerName: string;
  decision: 'approved' | 'rejected';
  reason: string;
  timestamp: string;
}

export interface Message {
  id: string;
  applicantId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AdmissionOfficer {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'officer';
}

export interface Activity {
  id: string;
  type: 'application_submitted' | 'document_uploaded' | 'status_changed' | 'message_sent' | 'decision_made';
  description: string;
  applicantId: string;
  applicantName: string;
  officerId?: string;
  officerName?: string;
  timestamp: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  reviewedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  applicationsPerProgram: { program: string; count: number }[];
}
