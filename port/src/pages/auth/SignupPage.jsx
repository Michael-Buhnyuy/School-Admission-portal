import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 10 || !/[A-Z]/.test(password)) return { strength: 2, label: 'Fair' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { strength: 3, label: 'Good' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return { strength: 4, label: 'Strong' };
    return { strength: 2, label: 'Fair' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob
      });
      navigate('/applicant');
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: '4',
        email: 'newgoogleuser@gmail.com',
        name: 'New Google User',
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
            <h1>Join Our Community</h1>
            <p>Create your account and start your journey to academic excellence</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Easy online application</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Track application in real-time</span>
              </div>
              <div className="auth-feature">
                <span className="feature-check">✓</span>
                <span>Instant notifications</span>
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
            <h2>Create Account</h2>
            <p className="auth-subtitle">Fill in your details to get started</p>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                 
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                 
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Date of Birth</label>
                  <div className="input-with-icon">
                    
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-with-icon">
               
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
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
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill strength-${passwordStrength.strength}`}
                        style={{ width: `${passwordStrength.strength * 25}%` }}
                      ></div>
                    </div>
                    <span className={`strength-label strength-${passwordStrength.strength}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                
                  <input 
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label className="checkbox-label terms-checkbox">
                <input 
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button type="button" className="btn btn-google" onClick={handleGoogleSignup}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
