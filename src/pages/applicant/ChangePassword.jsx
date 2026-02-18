import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const getPasswordStrength = () => {
    const { newPassword } = formData;
    if (!newPassword) return { strength: 0, label: '' };
    if (newPassword.length < 6) return { strength: 1, label: 'Weak' };
    if (newPassword.length < 10 || !/[A-Z]/.test(newPassword)) return { strength: 2, label: 'Fair' };
    if (newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) return { strength: 3, label: 'Good' };
    if (newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*]/.test(newPassword)) return { strength: 4, label: 'Strong' };
    return { strength: 2, label: 'Fair' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess(false);
    }, 3000);
  };

  const requirements = [
    { label: 'At least 6 characters', met: formData.newPassword.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[!@#$%^&*]/.test(formData.newPassword) },
  ];

  return (
    <div className="change-password-page">
      <div className="password-header">
        <Link to="/applicant" className="back-link">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
        <h1>Change Password</h1>
      </div>

      <div className="password-content">
        <motion.div 
          className="password-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {success ? (
            <div className="success-message">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <CheckCircle size={64} className="success-icon" />
              </motion.div>
              <h2>Password Changed Successfully!</h2>
              <p>Your password has been updated. Please remember to use your new password next time you log in.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>Update Your Password</h3>
              <p className="form-description">Enter your current password and choose a new password</p>

              <div className="input-group">
                <label>Current Password</label>
                <div className="password-input">
                  <input 
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePassword('current')}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>New Password</label>
                <div className="password-input">
                  <input 
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePassword('new')}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.newPassword && (
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

              <div className="password-requirements">
                <h4>Password Requirements</h4>
                <ul>
                  {requirements.map((req, index) => (
                    <li key={index} className={req.met ? 'met' : ''}>
                      {req.met ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="input-group">
                <label>Confirm New Password</label>
                <div className="password-input">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePassword('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Lock size={18} /> Update Password
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
