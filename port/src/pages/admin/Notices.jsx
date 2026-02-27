import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, FileText, BookOpen, Bell, MessageSquare, Mail, LogOut,
  ChevronRight, Plus, Edit, Trash2, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Notices.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const mockNotices = [
  { id: 1, title: 'Admission Deadline Extended', content: 'The admission deadline for the 2024/2025 academic session has been extended to March 31st.', date: '2024-01-15', priority: 'high' },
  { id: 2, title: 'New Programs Available', content: 'We are excited to announce two new programs: Data Science and Artificial Intelligence.', date: '2024-01-10', priority: 'normal' },
  { id: 3, title: 'Holiday Notice', content: 'The school will be closed from December 23rd to January 2nd for the holiday season.', date: '2024-01-05', priority: 'normal' },
];

const Notices = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState(mockNotices);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdd = () => {
    setEditingNotice(null);
    setFormData({ title: '', content: '', priority: 'normal' });
    setShowModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNotice) {
      setNotices(notices.map(n => 
        n.id === editingNotice.id 
          ? { ...n, ...formData, date: new Date().toISOString().split('T')[0] }
          : n
      ));
    } else {
      setNotices([{ 
        ...formData, 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0]
      }, ...notices]);
    }
    setShowModal(false);
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
            <h1>Notices</h1>
            <p>Manage school notices and announcements</p>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} /> Post Notice
          </button>
        </header>

        <div className="notices-list">
          {notices.map(notice => (
            <motion.div 
              key={notice.id}
              className="notice-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="notice-header">
                <div className="notice-title-row">
                  <h3>{notice.title}</h3>
                  <span className={`priority-badge ${notice.priority}`}>
                    {notice.priority}
                  </span>
                </div>
                <span className="notice-date">{notice.date}</span>
              </div>
              <p className="notice-content">{notice.content}</p>
              <div className="notice-actions">
                <button className="action-btn edit" onClick={() => handleEdit(notice)}>
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(notice.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingNotice ? 'Edit Notice' : 'Post New Notice'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="input-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Content</label>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingNotice ? 'Update' : 'Post'} Notice
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notices;
