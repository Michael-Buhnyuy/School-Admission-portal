import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
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
        navigate('/applicant');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: '3',
        email: 'googleuser@gmail.com',
        name: 'Google User',
        role: 'applicant',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      };
      localStorage.setItem('admissionPortalUser', JSON.stringify(user));
      navigate('/applicant');
    }, 1000);
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your journey towards academic excellence</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Track your application status</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Access exclusive resources</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Connect with admissions team</span>
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
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to access your account</p>

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
                    placeholder="Enter your email"
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button type="button" className="btn btn-google" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="auth-switch">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
