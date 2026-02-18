import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Masombe Tressy',
    email: user?.email || 'masombetressy@gmail.com',
    phone: '+237 678875141',
    address: '123 Main Street, City, State 12345',
    dob: '2000-05-15',
    nationality: 'American',
    state: 'California',
    city: 'Los Angeles'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Link to="/applicant" className="back-link">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-header-section">
            <div className="profile-avatar">
              <button className="edit-avatar-btn">
                <Edit size={16} />
              </button>
            </div>
            <div className="profile-title">
              <h2>{profileData.name}</h2>
              <p>Applicant</p>
              <span className={`status-badge ${user?.applicationStatus || 'pending'}`}>
                {user?.applicationStatus === 'pending' ? 'Pending Review' : 
                 user?.applicationStatus === 'accepted' ? 'Accepted' :
                 user?.applicationStatus === 'rejected' ? 'Rejected' : 'Not Started'}
              </span>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit size={16} /> Edit Profile</>}
            </button>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <User size={18} />
                  </div>
                  <div className="info-content">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.name}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="info-content">
                    <label>Date of Birth</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        name="dob"
                        value={profileData.dob}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.dob}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={18} />
                  </div>
                  <div className="info-content">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.email}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={18} />
                  </div>
                  <div className="info-content">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Location Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-content">
                    <label>Address</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.address}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-content">
                    <label>City</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.city}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-content">
                    <label>State</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="state"
                        value={profileData.state}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.state}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-content">
                    <label>Nationality</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="nationality"
                        value={profileData.nationality}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.nationality}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                <X size={16} /> Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
