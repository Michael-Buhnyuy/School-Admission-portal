import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, FileText, CreditCard, User, Lock, Bell, LogOut,
  ChevronRight, Clock, CheckCircle, XCircle, ArrowLeft, FileDown, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './ApplicationStatus.css';

const ApplicationStatus = () => {
  const { user, logout } = useAuth();
  const { applications } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('status');
  const [showLetter, setShowLetter] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/applicant' },
    { id: 'application', icon: FileText, label: 'Application Form', path: '/applicant/application' },
    { id: 'status', icon: Clock, label: 'View Application Status', path: '/applicant/status' },
    { id: 'payment', icon: CreditCard, label: 'Payment', path: '/applicant/payment' },
    { id: 'profile', icon: User, label: 'My Profile', path: '/applicant/profile' },
    { id: 'password', icon: Lock, label: 'Change Password', path: '/applicant/change-password' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'selected': return <CheckCircle className="status-icon accepted" />;
      case 'accepted': return <CheckCircle className="status-icon accepted" />;
      case 'rejected': return <XCircle className="status-icon rejected" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'selected': return 'Accepted';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Not Started';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'selected': return '#22c55e';
      case 'accepted': return '#22c55e';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Get user's actual application from DataContext
  const userApplication = applications.find(app => app.email === user?.email);
  
  // Use actual application data or fall back to user data
  const applicationData = userApplication ? {
    applicationId: userApplication.id || 'N/A',
    appliedDate: userApplication.applicationDate || 'N/A',
    program: userApplication.program || 'N/A',
    status: userApplication.status || 'pending',
    personalDetails: {
      fullName: userApplication.fullName || user?.name || 'N/A',
      dateOfBirth: userApplication.dateOfBirth || 'N/A',
      gender: userApplication.gender || 'N/A',
      email: userApplication.email || user?.email || 'N/A',
      phone: userApplication.phone || 'N/A',
      address: userApplication.address || 'N/A',
      nationality: userApplication.nationality || 'N/A',
      state: userApplication.state || 'N/A',
    },
    educationalDetails: {
      primarySchool: userApplication.primarySchool || 'N/A',
      secondarySchool: userApplication.secondarySchool || 'N/A',
      secondaryYear: userApplication.secondaryYear || 'N/A',
      grade: userApplication.grade || 'N/A',
    },
    letter: userApplication.letter || null,
  } : {
    applicationId: 'N/A',
    appliedDate: 'N/A',
    program: 'N/A',
    status: 'not_started',
    personalDetails: {
      fullName: user?.name || 'N/A',
      dateOfBirth: 'N/A',
      gender: 'N/A',
      email: user?.email || 'N/A',
      phone: 'N/A',
      address: 'N/A',
      nationality: 'N/A',
      state: 'N/A',
    },
    educationalDetails: {
      primarySchool: 'N/A',
      secondarySchool: 'N/A',
      secondaryYear: 'N/A',
      grade: 'N/A',
    },
    letter: null,
  };

  const hasApplication = userApplication !== undefined;
  const isAccepted = applicationData.status === 'selected' || applicationData.status === 'accepted';
  const isRejected = applicationData.status === 'rejected';
  const showLetterButton = isAccepted || isRejected;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">E</div>
            <span>Excellence</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <h4>{user?.name || 'User'}</h4>
            <p>Applicant</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link 
              key={item.id} 
              to={item.path}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="nav-arrow" />
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>View Application Status</h1>
            <p>Track your application progress and view details</p>
          </div>
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
        </header>

        <div className="status-content">
          {/* Status Banner */}
          <motion.div 
            className="status-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderLeftColor: getStatusColor(applicationData.status) }}
          >
            <div className="status-banner-icon">
              {getStatusIcon(applicationData.status)}
            </div>
            <div className="status-banner-content">
              <h2>Application Status: {getStatusLabel(applicationData.status)}</h2>
              <p>Application ID: {applicationData.applicationId}</p>
            </div>
          </motion.div>

          {/* Application Details */}
          <div className="status-grid">
            {/* Personal Information */}
            <motion.div 
              className="status-card-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card-header-detail">
                <User size={20} />
                <h3>Personal Information</h3>
              </div>
              <div className="card-body-detail">
                <div className="detail-row">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{applicationData.personalDetails.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{applicationData.personalDetails.dateOfBirth}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{applicationData.personalDetails.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{applicationData.personalDetails.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{applicationData.personalDetails.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{applicationData.personalDetails.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nationality</span>
                  <span className="detail-value">{applicationData.personalDetails.nationality}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">State</span>
                  <span className="detail-value">{applicationData.personalDetails.state}</span>
                </div>
              </div>
            </motion.div>

            {/* Educational Information */}
            <motion.div 
              className="status-card-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-header-detail">
                <FileText size={20} />
                <h3>Educational Information</h3>
              </div>
              <div className="card-body-detail">
                <div className="detail-row">
                  <span className="detail-label">Primary School</span>
                  <span className="detail-value">{applicationData.educationalDetails.primarySchool}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Secondary School</span>
                  <span className="detail-value">{applicationData.educationalDetails.secondarySchool}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Year of Completion</span>
                  <span className="detail-value">{applicationData.educationalDetails.secondaryYear}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Grade/GPA</span>
                  <span className="detail-value">{applicationData.educationalDetails.grade}</span>
                </div>
              </div>
            </motion.div>

            {/* Application Summary */}
            <motion.div 
              className="status-card-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header-detail">
                <CreditCard size={20} />
                <h3>Application Summary</h3>
              </div>
              <div className="card-body-detail">
                <div className="detail-row">
                  <span className="detail-label">Application ID</span>
                  <span className="detail-value">{applicationData.applicationId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Program</span>
                  <span className="detail-value">{applicationData.program}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Applied Date</span>
                  <span className="detail-value">{applicationData.appliedDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value status-text" style={{ color: getStatusColor(applicationData.status) }}>
                    {getStatusLabel(applicationData.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View and Download Admission Letter Buttons */}
          {showLetterButton && (
            <motion.div 
              className="letter-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                className={`btn ${isAccepted ? 'btn-success' : 'btn-error'}`}
                onClick={() => setShowLetter(true)}
              >
                <FileDown size={18} />
                View {isAccepted ? 'Admission' : 'Rejection'} Letter
              </button>
              <button 
                className={`btn btn-primary`}
                onClick={() => {
                  // Generate letter content for download
                  const letterContent = isAccepted 
                    ? `EXCELLENCE ACADEMY
Official Admission Letter

Date: ${new Date().toLocaleDateString()}
Application ID: ${applicationData.applicationId}
Applicant Name: ${applicationData.personalDetails.fullName}
Program: ${applicationData.program}

Dear ${applicationData.personalDetails.fullName},

We are pleased to inform you that your application to Excellence Academy has been ACCEPTED.

Congratulations on your achievement! We believe you will be a valuable addition to our academic community.

Please find below your admission details:
- Admission ID: ADM-${applicationData.applicationId}
- Program: ${applicationData.program}
- Status: Accepted

We look forward to welcoming you to Excellence Academy.

Best regards,
Admissions Committee
Excellence Academy`
                    : `EXCELLENCE ACADEMY
Official Rejection Letter

Date: ${new Date().toLocaleDateString()}
Application ID: ${applicationData.applicationId}
Applicant Name: ${applicationData.personalDetails.fullName}
Program: ${applicationData.program}

Dear ${applicationData.personalDetails.fullName},

We regret to inform you that your application to Excellence Academy has been NOT ACCEPTED.

We appreciate the time and effort you put into your application. Unfortunately, we are unable to offer you admission at this time.

We encourage you to apply again in the future and wish you the best in your academic pursuits.

Best regards,
Admissions Committee
Excellence Academy`;
                  
                  // Create and download the letter
                  const blob = new Blob([letterContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${isAccepted ? 'Admission' : 'Rejection'}_Letter_${applicationData.applicationId}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={18} />
                Download Letter
              </button>
            </motion.div>
          )}

          {/* Progress Timeline */}
          <motion.div 
            className="timeline-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Application Timeline</h3>
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-icon"><CheckCircle size={16} /></div>
                <div className="timeline-content">
                  <h4>Application Submitted</h4>
                  <p>{applicationData.appliedDate}</p>
                </div>
              </div>
              <div className={`timeline-item ${hasApplication ? 'completed' : ''}`}>
                <div className="timeline-icon">
                  {hasApplication ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <div className="timeline-content">
                  <h4>Under Review</h4>
                  <p>Your application is being reviewed by the admissions team</p>
                </div>
              </div>
              <div className={`timeline-item ${isAccepted ? 'completed' : ''}`}>
                <div className="timeline-icon">
                  {isAccepted ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <div className="timeline-content">
                  <h4>Decision</h4>
                  <p>Final decision on your application</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="back-section">
            <Link to="/applicant" className="btn btn-secondary">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Letter Modal */}
      <AnimatePresence>
        {showLetter && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLetter(false)}
          >
            <motion.div 
              className="modal-content letter-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{isAccepted ? 'Admission' : 'Rejection'} Letter</h2>
                <button className="close-btn" onClick={() => setShowLetter(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="letter-document">
                  <div className="letter-header">
                    <h3>EXCELLENCE ACADEMY</h3>
                    <p>Official {isAccepted ? 'Admission' : 'Rejection'} Letter</p>
                  </div>
                  <div className="letter-body">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Application ID:</strong> {applicationData.applicationId}</p>
                    <p><strong>Applicant Name:</strong> {applicationData.personalDetails.fullName}</p>
                    <p><strong>Program:</strong> {applicationData.program}</p>
                    <hr />
                    {isAccepted ? (
                      <>
                        <h4>Dear {applicationData.personalDetails.fullName},</h4>
                        <p>We are pleased to inform you that your application to Excellence Academy has been <strong>ACCEPTED</strong>.</p>
                        <p>Congratulations on your achievement! We believe you will be a valuable addition to our academic community.</p>
                        <p>Please find below your admission details:</p>
                        <ul>
                          <li><strong>Admission ID:</strong> ADM-{applicationData.applicationId}</li>
                          <li><strong>Program:</strong> {applicationData.program}</li>
                          <li><strong>Status:</strong> Accepted</li>
                        </ul>
                        <p>We look forward to welcoming you to Excellence Academy.</p>
                        <p>Best regards,<br/>Admissions Committee<br/>Excellence Academy</p>
                      </>
                    ) : (
                      <>
                        <h4>Dear {applicationData.personalDetails.fullName},</h4>
                        <p>We regret to inform you that your application to Excellence Academy has been <strong>NOT ACCEPTED</strong>.</p>
                        <p>We appreciate the time and effort you put into your application. Unfortunately, we are unable to offer you admission at this time.</p>
                        <p>We encourage you to apply again in the future and wish you the best in your academic pursuits.</p>
                        <p>Best regards,<br/>Admissions Committee<br/>Excellence Academy</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowLetter(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationStatus;
