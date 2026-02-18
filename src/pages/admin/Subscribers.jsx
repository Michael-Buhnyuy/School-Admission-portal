import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, FileText, BookOpen, Bell, MessageSquare, Mail, LogOut,
  ChevronRight, Download, Trash2, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Subscribers.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const mockSubscribers = [
  { id: 1, email: 'john.smith@example.com', name: 'John Smith', subscribedDate: '2024-01-10', status: 'active' },
  { id: 2, email: 'sarah.johnson@example.com', name: 'Sarah Johnson', subscribedDate: '2024-01-08', status: 'active' },
  { id: 3, email: 'michael.brown@example.com', name: 'Michael Brown', subscribedDate: '2024-01-05', status: 'active' },
  { id: 4, email: 'emily.davis@example.com', name: 'Emily Davis', subscribedDate: '2024-01-03', status: 'active' },
  { id: 5, email: 'david.wilson@example.com', name: 'David Wilson', subscribedDate: '2024-01-01', status: 'inactive' },
  { id: 6, email: 'lisa.anderson@example.com', name: 'Lisa Anderson', subscribedDate: '2023-12-28', status: 'active' },
  { id: 7, email: 'robert.taylor@example.com', name: 'Robert Taylor', subscribedDate: '2023-12-25', status: 'active' },
  { id: 8, email: 'jennifer.white@example.com', name: 'Jennifer White', subscribedDate: '2023-12-20', status: 'active' },
];

const Subscribers = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers] = useState(mockSubscribers);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(search.toLowerCase()) ||
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Date,Status\n"
      + subscribers.map(s => `${s.name},${s.email},${s.subscribedDate},${s.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1>Subscribers</h1>
            <p>Manage your newsletter subscribers</p>
          </div>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={18} /> Export CSV
          </button>
        </header>

        <div className="subscribers-stats">
          <div className="stat-card">
            <span className="stat-value">{subscribers.length}</span>
            <span className="stat-label">Total Subscribers</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{subscribers.filter(s => s.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{subscribers.filter(s => s.status === 'inactive').length}</span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>

        <div className="subscribers-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="subscribers-table-wrapper">
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber, index) => (
                <tr key={subscriber.id}>
                  <td>{index + 1}</td>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td>{subscriber.subscribedDate}</td>
                  <td>
                    <span className={`status-badge ${subscriber.status}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn delete" title="Remove">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Subscribers;
