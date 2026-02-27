import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, FileText, BookOpen, Bell, MessageSquare, Mail, LogOut,
  ChevronRight, CheckCircle, Reply
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Enquiries.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const mockEnquiries = [
  { id: 1, name: 'John Smith', email: 'john@example.com', subject: 'Admission Requirements', message: 'What are the admission requirements for the Engineering program?', date: '2024-01-15', status: 'pending' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', subject: 'Scholarship Info', message: 'Do you offer scholarships for international students?', date: '2024-01-14', status: 'resolved' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', subject: 'Hostel Accommodation', message: 'Is hostel accommodation available for first-year students?', date: '2024-01-14', status: 'pending' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', subject: 'Application Fee', message: 'What is the application fee for international applicants?', date: '2024-01-13', status: 'resolved' },
];

const Enquiries = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResolve = (id) => {
    setEnquiries(enquiries.map(e => 
      e.id === id ? { ...e, status: 'resolved' } : e
    ));
  };

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
          <img src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} alt="Admin" className="user-avatar" />
          <div className="user-info">
            <h4>{user?.name || 'Admin'}</h4>
            <p>Administrator</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="nav-arrow" />
            </div>
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
            <h1>Enquiries</h1>
            <p>Manage inquiries from prospective students</p>
          </div>
        </header>

        <div className="enquiries-stats">
          <div className="stat-item">
            <span className="stat-value">{enquiries.filter(e => e.status === 'total').length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-value">{enquiries.filter(e => e.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item resolved">
            <span className="stat-value">{enquiries.filter(e => e.status === 'resolved').length}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>

        <div className="enquiries-list">
          {enquiries.map(enquiry => (
            <motion.div 
              key={enquiry.id}
              className="enquiry-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedEnquiry(enquiry)}
            >
              <div className="enquiry-header">
                <div className="enquiry-info">
                  <h3>{enquiry.subject}</h3>
                  <p className="enquiry-from">From: {enquiry.name} ({enquiry.email})</p>
                </div>
                <span className={`status-badge ${enquiry.status}`}>
                  {enquiry.status}
                </span>
              </div>
              <p className="enquiry-message">{enquiry.message}</p>
              <div className="enquiry-footer">
                <span className="enquiry-date">{enquiry.date}</span>
                {enquiry.status === 'pending' && (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(enquiry.id);
                    }}
                  >
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedEnquiry(null)}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedEnquiry.subject}</h2>
              <button className="close-btn" onClick={() => setSelectedEnquiry(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="enquiry-detail">
                <div className="detail-row">
                  <label>From:</label>
                  <span>{selectedEnquiry.name} ({selectedEnquiry.email})</span>
                </div>
                <div className="detail-row">
                  <label>Date:</label>
                  <span>{selectedEnquiry.date}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedEnquiry.status}`}>{selectedEnquiry.status}</span>
                </div>
                <div className="detail-row">
                  <label>Message:</label>
                  <p>{selectedEnquiry.message}</p>
                </div>
              </div>
              <div className="reply-section">
                <textarea placeholder="Type your reply..."></textarea>
                <button className="btn btn-primary">
                  <Reply size={16} /> Send Reply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Enquiries;
