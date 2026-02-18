import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, FileText, BookOpen, Bell, MessageSquare, Mail, LogOut,
  ChevronRight, Search, Filter, CheckCircle, XCircle, Eye, Edit, Trash2, Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './Applications.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const Applications = () => {
  const { user, logout } = useAuth();
  const { applications, updateApplicationStatus, programs } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                         app.email?.toLowerCase().includes(search.toLowerCase()) ||
                         app.id?.toLowerCase().includes(search.toLowerCase()) ||
                         app.program?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Generate admission letter
  const generateAdmissionLetter = (app) => {
    return `
EXCELLENCE ACADEMY
OFFICIAL ADMISSION LETTER

Date: ${new Date().toLocaleDateString()}

Dear ${app.fullName},

Congratulations! We are pleased to inform you that your application to Excellence Academy has been ACCEPTED.

Application Details:
- Application ID: ${app.id}
- Program: ${app.program}
- Date Applied: ${app.applicationDate}

Dear ${app.fullName}, we are delighted to welcome you to Excellence Academy. You have demonstrated exceptional qualities that make you an ideal candidate for our institution.

Next Steps:
1. Visit the admissions office to complete your registration
2. Submit required documents
3. Pay your tuition fees

Please keep this letter for your records.

We look forward to seeing you at Excellence Academy!

Best regards,
Excellence Academy Admissions Team
    `.trim();
  };

  // Generate rejection letter
  const generateRejectionLetter = (app) => {
    return `
EXCELLENCE ACADEMY
APPLICATION STATUS NOTIFICATION

Date: ${new Date().toLocaleDateString()}

Dear ${app.fullName},

Thank you for applying to Excellence Academy.

After careful consideration of your application, we regret to inform you that we are unable to offer you admission at this time.

Application Details:
- Application ID: ${app.id}
- Program: ${app.program}
- Date Applied: ${app.applicationDate}

We received a high number of qualified applicants this year, and the selection process was extremely competitive. While your application was strong, we were unable to offer you a place this time.

We encourage you to apply again in the future and wish you the best in your academic pursuits.

For more information, please contact the admissions office.

Best regards,
Excellence Academy Admissions Team
    `.trim();
  };

  const handleStatusChange = (applicationId, newStatus, letter = null) => {
    updateApplicationStatus(applicationId, newStatus, letter);
    // Update selected app if it's the one being modified
    if (selectedApp && selectedApp.id === applicationId) {
      setSelectedApp({ ...selectedApp, status: newStatus, letter: letter || selectedApp.letter });
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter(a => a.status === status).length;
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
            <h1>Applications</h1>
            <p>Manage and review all admission applications</p>
          </div>
        </header>

        <div className="applications-content">
          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({getStatusCount('all')})
              </button>
              <button 
                className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({getStatusCount('pending')})
              </button>
              <button 
                className={`filter-tab ${filter === 'selected' ? 'active' : ''}`}
                onClick={() => setFilter('selected')}
              >
                Selected ({getStatusCount('selected')})
              </button>
              <button 
                className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({getStatusCount('rejected')})
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="applications-table-wrapper">
            {filteredApps.length > 0 ? (
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>App No</th>
                    <th>Program</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app, index) => (
                    <tr key={app.id}>
                      <td>{index + 1}</td>
                      <td>{app.id}</td>
                      <td>{app.program}</td>
                      <td>{app.fullName}</td>
                      <td>{app.email}</td>
                      <td>{app.applicationDate}</td>
                      <td>
                        <span className={`status-badge ${app.status}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => setSelectedApp(app)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button 
                                className="action-btn accept"
                                onClick={() => handleStatusChange(app.id, 'selected')}
                                title="Accept"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                className="action-btn reject"
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <FileText size={48} />
                <h3>No Applications Found</h3>
                <p>There are no applications matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApp(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Application Details</h2>
                <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Full Name</label>
                      <span>{selectedApp.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <span>{selectedApp.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <span>{selectedApp.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth</label>
                      <span>{selectedApp.dateOfBirth}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address</label>
                      <span>{selectedApp.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nationality</label>
                      <span>{selectedApp.nationality}</span>
                    </div>
                    <div className="detail-item">
                      <label>State</label>
                      <span>{selectedApp.state}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Application Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Application No</label>
                      <span>{selectedApp.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Program</label>
                      <span>{selectedApp.program}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date Applied</label>
                      <span>{selectedApp.applicationDate}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span className={`status-badge ${selectedApp.status}`}>{selectedApp.status}</span>
                    </div>
                  </div>
                </div>
                {selectedApp.primarySchool && (
                  <div className="detail-section">
                    <h3>Educational Information</h3>
                    <div className="detail-grid">
                      {selectedApp.primarySchool && (
                        <div className="detail-item">
                          <label>Primary School</label>
                          <span>{selectedApp.primarySchool}</span>
                        </div>
                      )}
                      {selectedApp.secondarySchool && (
                        <div className="detail-item">
                          <label>Secondary School</label>
                          <span>{selectedApp.secondarySchool}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedApp.status === 'pending' && (
                  <>
                    <button 
                      className="btn btn-success"
                      onClick={() => {
                        handleStatusChange(selectedApp.id, 'selected');
                        setSelectedApp(null);
                      }}
                    >
                      <CheckCircle size={16} /> Accept
                    </button>
                    <button 
                      className="btn btn-error"
                      onClick={() => {
                        handleStatusChange(selectedApp.id, 'rejected');
                        setSelectedApp(null);
                      }}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
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

export default Applications;
