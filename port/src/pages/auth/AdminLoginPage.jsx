import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="auth-visual"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-visual-content">
            <div className="auth-logo">
              <div className="logo-icon">E</div>
              <span>Excellence Academy</span>
            </div>
            <h1>Admin Portal</h1>
            <p>Manage applications, programs, notices, and more from one place</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Review and manage applications</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Add and manage programs</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Publish notices to applicants</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>View and respond to enquiries</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-form-wrapper">
            <h2>Admin Login</h2>
            <p className="auth-subtitle">Enter your admin credentials to access the dashboard</p>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                
                  <input 
                    type="email" 
                    placeholder="admin@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-with-icon">
                  
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In as Admin'}
                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="auth-switch">
                Go back to <Link to="/">Home</Link> or <Link to="/login">Applicant Login</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
