import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, FileText, CreditCard, User, Lock, Bell, LogOut,
  ChevronRight, Clock, CheckCircle, XCircle, Upload, ArrowRight,
  Download, Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const { applications, addEnquiry } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    subject: '',
    message: ''
  });
  const [enquirySent, setEnquirySent] = useState(false);
  
  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (enquiryForm.subject && enquiryForm.message) {
      addEnquiry({
        name: user?.name,
        email: user?.email,
        subject: enquiryForm.subject,
        message: enquiryForm.message,
        type: 'enquiry'
      });
      setEnquiryForm({ subject: '', message: '' });
      setEnquirySent(true);
      setTimeout(() => setEnquirySent(false), 3000);
    }
  };

  // Get user's application if exists
  const userApplication = applications.find(app => app.email === user?.email);

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
      case 'rejected': return <XCircle className="status-icon rejected" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'selected': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Not Started';
    }
  };

  // Get notifications from DataContext
  const notifications = [
    { id: 1, title: 'Application Submitted', message: 'Your application has been submitted successfully', time: '2 hours ago', read: false },
    { id: 2, title: 'Document Verification', message: 'Please upload your passport photo', time: '1 day ago', read: true },
    { id: 3, title: 'Welcome', message: 'Welcome to Excellence Academy!', time: '3 days ago', read: true },
  ];

  // Calculate progress
  const applicationStatus = userApplication?.status || user?.applicationStatus || 'not_started';
  const hasApplication = applicationStatus !== 'not_started';
  const isPending = applicationStatus === 'pending';
  const isAccepted = applicationStatus === 'selected' || applicationStatus === 'accepted';
  const isRejected = applicationStatus === 'rejected';

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
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p>Track your application status and manage your profile</p>
          </div>
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
        </header>

        <div className="dashboard-content">
          {/* Status Card */}
          <motion.div 
            className="status-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="status-header">
              <h3>Application Status</h3>
              <span className={`status-badge ${applicationStatus}`}>
                {getStatusLabel(applicationStatus)}
              </span>
            </div>
            <div className="status-icon-large">
              {getStatusIcon(applicationStatus)}
            </div>
            <div className="status-details">
              <div className="detail-item">
                <span className="detail-label">Application ID</span>
                <span className="detail-value">{userApplication?.id || user?.applicationId || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submitted Date</span>
                <span className="detail-value">{userApplication?.applicationDate || 'Not submitted yet'}</span>
              </div>
              {userApplication?.program && (
                <div className="detail-item">
                  <span className="detail-label">Program</span>
                  <span className="detail-value">{userApplication.program}</span>
                </div>
              )}
            </div>
            <Link to="/applicant/application" className="btn btn-primary">
              {hasApplication ? 'View Application' : 'Start Application'}
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="progress-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3>Application Progress</h3>
            <div className="progress-steps">
              <div className={`progress-step completed`}>
                <div className="step-icon"><CheckCircle size={20} /></div>
                <div className="step-content">
                  <h4>Registration</h4>
                  <p>Account created</p>
                </div>
              </div>
              <div className={`progress-step ${hasApplication ? 'completed' : ''}`}>
                <div className="step-icon">{hasApplication ? <CheckCircle size={20} /> : <FileText size={20} />}</div>
                <div className="step-content">
                  <h4>Application Form</h4>
                  <p>Details submitted</p>
                </div>
              </div>
              <div className={`progress-step ${isPending || isAccepted ? 'completed' : ''}`}>
                <div className="step-icon"><CreditCard size={20} /></div>
                <div className="step-content">
                  <h4>Payment</h4>
                  <p>Registration fee</p>
                </div>
              </div>
              <div className={`progress-step ${isAccepted ? 'completed' : ''}`}>
                <div className="step-icon">{isAccepted ? <CheckCircle size={20} /> : <Clock size={20} />}</div>
                <div className="step-content">
                  <h4>Decision</h4>
                  <p>Application result</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-card">
              <div className="stat-icon"><FileText /></div>
              <div className="stat-info">
                <span className="stat-value">{hasApplication ? '1' : '0'}</span>
                <span className="stat-label">Application Submitted</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><CheckCircle /></div>
              <div className="stat-info">
                <span className="stat-value">{hasApplication ? '1' : '0'}</span>
                <span className="stat-label">Completed Steps</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Clock /></div>
              <div className="stat-info">
                <span className="stat-value">{userApplication?.applicationDate ? '1' : '0'}</span>
                <span className="stat-label">Days Since Apply</span>
              </div>
            </div>
          </motion.div>

          {/* Application Letter - Only visible when applicant is accepted or rejected */}
          {(isAccepted || isRejected) && userApplication?.letter && (
            <motion.div 
              className="application-letter-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h3>{isAccepted ? 'Admission Letter' : 'Rejection Letter'}</h3>
                <FileText size={20} />
              </div>
              <div className="letter-content">
                <div className="letter-icon">
                  <FileText size={40} />
                </div>
                <div className="letter-info">
                  <h4>{isAccepted ? 'Your Admission Letter is Ready' : 'Your Application Status'}</h4>
                  <p>{isAccepted ? 'Click the button below to download your official admission letter.' : 'Click the button below to view your application status letter.'}</p>
                  <p className="letter-date">{userApplication?.letterDate ? `Generated on: ${new Date(userApplication.letterDate).toLocaleDateString()}` : `Generated on: ${new Date().toLocaleDateString()}`}</p>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => {
                // Use the stored letter from DataContext
                const letterContent = userApplication?.letter || '';
                
                // Create and download the letter
                const blob = new Blob([letterContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${isAccepted ? 'Admission' : 'Rejection'}_Letter_${userApplication?.id || 'N/A'}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>
                <Download size={18} />
                Download Letter
              </button>
            </motion.div>
          )}
          
          {/* Application Letter - For rejected applicants without stored letter */}
          {isRejected && !userApplication?.letter && (
            <motion.div 
              className="application-letter-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h3>Application Status</h3>
                <FileText size={20} />
              </div>
              <div className="letter-content">
                <div className="letter-icon">
                  <XCircle size={40} className="rejected-icon" />
                </div>
                <div className="letter-info">
                  <h4>Your Application has been Rejected</h4>
                  <p>We regret to inform you that your application was not successful this time.</p>
                  <p className="letter-date">Please contact the admissions office for more information.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Send Enquiry Section */}
          <motion.div 
            className="enquiry-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header">
              <h3>Send Enquiry to Admin</h3>
              <Send size={20} />
            </div>
            {enquirySent ? (
              <div className="enquiry-success">
                <CheckCircle size={40} />
                <h4>Enquiry Sent Successfully!</h4>
                <p>Your enquiry has been sent to the admin. We will get back to you soon.</p>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    placeholder="Enter subject"
                    value={enquiryForm.subject}
                    onChange={(e) => setEnquiryForm({...enquiryForm, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    placeholder="Enter your enquiry or notice"
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                    required
                    rows="4"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Send size={18} />
                  Send Enquiry
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ApplicantDashboard;
