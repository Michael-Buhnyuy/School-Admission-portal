import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, FileText, BookOpen, Bell, MessageSquare, Mail, LogOut,
  ChevronRight, Plus, Edit, Trash2, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Programs.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
  { id: 'applications', icon: FileText, label: 'Applications', path: '/admin/applications' },
  { id: 'programs', icon: BookOpen, label: 'Programs', path: '/admin/programs' },
  { id: 'notices', icon: Bell, label: 'Notices', path: '/admin/notices' },
  { id: 'enquiries', icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  { id: 'subscribers', icon: Mail, label: 'Subscribers', path: '/admin/subscribers' },
];

const mockPrograms = [
  { id: 1, name: 'Science', description: 'Explore physics, chemistry, and biology', duration: '4 Years', seats: 100, status: 'active' },
  { id: 2, name: 'Arts', description: 'Literature, history, and fine arts', duration: '4 Years', seats: 80, status: 'active' },
  { id: 3, name: 'Commerce', description: 'Business principles and economics', duration: '4 Years', seats: 120, status: 'active' },
  { id: 4, name: 'Engineering', description: 'Cutting-edge engineering programs', duration: '5 Years', seats: 60, status: 'active' },
  { id: 5, name: 'Medicine', description: 'Accredited medical program', duration: '6 Years', seats: 40, status: 'active' },
  { id: 6, name: 'Law', description: 'Comprehensive law degree', duration: '5 Years', seats: 50, status: 'active' },
];

const Programs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState(mockPrograms);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    seats: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData({ name: '', description: '', duration: '', seats: '' });
    setShowModal(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
      seats: program.seats.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProgram) {
      setPrograms(programs.map(p => 
        p.id === editingProgram.id 
          ? { ...p, ...formData, seats: parseInt(formData.seats) }
          : p
      ));
    } else {
      setPrograms([...programs, { 
        ...formData, 
        id: Date.now(), 
        seats: parseInt(formData.seats),
        status: 'active' 
      }]);
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
            <h1>Programs</h1>
            <p>Manage your academic programs</p>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} /> Add Program
          </button>
        </header>

        <div className="programs-grid">
          {programs.map(program => (
            <motion.div 
              key={program.id}
              className="program-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="program-header">
                <h3>{program.name}</h3>
                <span className={`status ${program.status}`}>{program.status}</span>
              </div>
              <p className="program-description">{program.description}</p>
              <div className="program-meta">
                <span>Duration: {program.duration}</span>
                <span>Seats: {program.seats}</span>
              </div>
              <div className="program-actions">
                <button className="action-btn edit" onClick={() => handleEdit(program)}>
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(program.id)}>
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
                <h2>{editingProgram ? 'Edit Program' : 'Add New Program'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="input-group">
                  <label>Program Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 4 Years"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Seats</label>
                    <input 
                      type="number" 
                      value={formData.seats}
                      onChange={(e) => setFormData({...formData, seats: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProgram ? 'Update' : 'Add'} Program
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

export default Programs;
