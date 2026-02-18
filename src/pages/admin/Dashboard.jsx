import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Users, BookOpen, Bell, MessageSquare, Mail, Settings, LogOut,
  ChevronRight, FileText, CheckCircle, Clock, XCircle, UserPlus, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { applications, programs, notices, enquiries, registeredUsers, totalApplications, pendingApplications, selectedApplications, rejectedApplications } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get recent 5 applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
    .slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Total Applications', value: totalApplications, icon: Users, color: 'primary', change: totalApplications > 0 ? '+' + Math.round((totalApplications / 10) * 10) + '%' : '0%' },
    { label: 'Pending', value: pendingApplications, icon: Clock, color: 'warning', change: pendingApplications > 0 ? '+' + pendingApplications : '0' },
    { label: 'Selected', value: selectedApplications, icon: CheckCircle, color: 'success', change: selectedApplications > 0 ? '+' + selectedApplications : '0' },
    { label: 'Rejected', value: rejectedApplications, icon: XCircle, color: 'error', change: rejectedApplications > 0 ? '-' + rejectedApplications : '0' },
  ];

  const secondaryStats = [
    { label: 'Total Programs', value: programs.length, icon: BookOpen },
    { label: 'Total Notices', value: notices.length, icon: Bell },
    { label: 'Total Enquiries', value: enquiries.length, icon: MessageSquare },
    { label: 'Subscribers', value: registeredUsers.length, icon: Mail },
  ];

  const getStatusBadge = (status) => {
    return <span className={`status-badge ${status}`}>{status}</span>;
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
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening with your admissions</p>
          </div>
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">5</span>
          </button>
        </header>

        <div className="dashboard-content">
          {/* Main Stats */}
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <span className={`stat-change ${stat.color}`}>
                  <TrendingUp size={14} /> {stat.change}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Secondary Stats */}
          <motion.div 
            className="secondary-stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {secondaryStats.map((stat, index) => (
              <div key={index} className="secondary-stat-card">
                <div className="secondary-stat-icon">
                  <stat.icon size={20} />
                </div>
                <div className="secondary-stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Recent Applications */}
          <motion.div 
            className="recent-applications-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-header">
              <h3>Recent Applications</h3>
              <button className="view-all-btn" onClick={() => navigate('/admin/applications')}>
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="applications-table">
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Name</th>
                    <th>Program</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length > 0 ? (
                    recentApplications.map(app => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>{app.fullName}</td>
                        <td>{app.program}</td>
                        <td>{app.applicationDate}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                          <button className="action-btn" onClick={() => navigate('/admin/applications')}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No applications yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="quick-actions-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => navigate('/admin/applications')}>
                <Users size={20} />
                <span>Review Applications</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/admin/programs')}>
                <BookOpen size={20} />
                <span>Manage Programs</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/admin/notices')}>
                <Bell size={20} />
                <span>Post Notice</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/admin/enquiries')}>
                <MessageSquare size={20} />
                <span>View Enquiries</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
