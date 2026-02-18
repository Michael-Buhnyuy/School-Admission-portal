import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Upload, CheckCircle, User, 
  GraduationCap, BookOpen, FileText, Eye, Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './ApplicationForm.css';

const steps = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Educational Details', icon: GraduationCap },
  { id: 3, title: 'Program Selection', icon: BookOpen },
  { id: 4, title: 'Review & Submit', icon: FileText },
];

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    nationality: '',
    passportPhoto: null,
    
    // Educational Details
    primarySchool: '',
    primaryYear: '',
    secondarySchool: '',
    secondaryYear: '',
    secondaryCertificate: null,
    tertiaryInstitution: '',
    tertiaryCourse: '',
    
    // Program Selection
    selectedProgram: '',
    campus: '',
    intake: '',
  });
  const [errors, setErrors] = useState({});

  const { user, updateUser } = useAuth();
  const { addApplication, programs } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    }
    
    if (step === 2) {
      if (!formData.secondarySchool) newErrors.secondarySchool = 'Secondary school is required';
      if (!formData.secondaryYear) newErrors.secondaryYear = 'Graduation year is required';
    }
    
    if (step === 3) {
      if (!formData.selectedProgram) newErrors.selectedProgram = 'Please select a program';
      if (!formData.campus) newErrors.campus = 'Please select a campus';
      if (!formData.intake) newErrors.intake = 'Please select an intake';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Get the program name from the programs list
    const selectedProgramName = programs.find(p => p.id === formData.selectedProgram)?.name || 'Unknown Program';
    
    // Create application object
    const applicationData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email || user?.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      nationality: formData.nationality,
      primarySchool: formData.primarySchool,
      primaryYear: formData.primaryYear,
      secondarySchool: formData.secondarySchool,
      secondaryYear: formData.secondaryYear,
      tertiaryInstitution: formData.tertiaryInstitution,
      tertiaryCourse: formData.tertiaryCourse,
      program: selectedProgramName,
      campus: formData.campus,
      intake: formData.intake,
    };
    
    // Add application to DataContext (global state)
    const newApplication = addApplication(applicationData);
    
    // Update user status
    updateUser({
      applicationStatus: 'pending',
      applicationId: newApplication.id
    });
    
    navigate('/applicant');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Personal Details</h2>
            <p className="step-description">Please provide your personal information</p>
            
            <div className="form-grid">
              <div className="input-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              
              <div className="input-group">
                <label>Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
              
              <div className="input-group">
                <label>Date of Birth *</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
              </div>
              
              <div className="input-group">
                <label>Gender *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
              
              <div className="input-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="input-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
              
              <div className="input-group full-width">
                <label>Address *</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
              
              <div className="input-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group">
                <label>State *</label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              
              <div className="input-group">
                <label>Nationality *</label>
                <input 
                  type="text" 
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={errors.nationality ? 'error' : ''}
                />
                {errors.nationality && <span className="error-text">{errors.nationality}</span>}
              </div>
              
              <div className="input-group full-width">
                <label>Passport Photo</label>
                <div className="file-upload">
                  <Upload size={20} />
                  <span>Click to upload passport photo</span>
                  <input 
                    type="file" 
                    name="passportPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Educational Details</h2>
            <p className="step-description">Provide your educational background</p>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Primary School Name</label>
                <input 
                  type="text" 
                  name="primarySchool"
                  value={formData.primarySchool}
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group">
                <label>Completion Year</label>
                <input 
                  type="text" 
                  name="primaryYear"
                  value={formData.primaryYear}
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group full-width">
                <label>Secondary School *</label>
                <input 
                  type="text" 
                  name="secondarySchool"
                  value={formData.secondarySchool}
                  onChange={handleChange}
                  className={errors.secondarySchool ? 'error' : ''}
                />
                {errors.secondarySchool && <span className="error-text">{errors.secondarySchool}</span>}
              </div>
              
              <div className="input-group">
                <label>Graduation Year *</label>
                <input 
                  type="text" 
                  name="secondaryYear"
                  value={formData.secondaryYear}
                  onChange={handleChange}
                  className={errors.secondaryYear ? 'error' : ''}
                />
                {errors.secondaryYear && <span className="error-text">{errors.secondaryYear}</span>}
              </div>
              
              <div className="input-group">
                <label>Upload Certificate</label>
                <div className="file-upload">
                  <Upload size={20} />
                  <span>Click to upload certificate</span>
                  <input 
                    type="file" 
                    name="secondaryCertificate"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="input-group full-width">
                <label>Tertiary Institution (Optional)</label>
                <input 
                  type="text" 
                  name="tertiaryInstitution"
                  value={formData.tertiaryInstitution}
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group">
                <label>Course Studied</label>
                <input 
                  type="text" 
                  name="tertiaryCourse"
                  value={formData.tertiaryCourse}
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Program Selection</h2>
            <p className="step-description">Choose your preferred program</p>
            
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Select Program *</label>
                <div className="programs-grid">
                  {programs.map(program => (
                    <div 
                      key={program.id}
                      className={`program-option ${formData.selectedProgram === program.id ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, selectedProgram: program.id })}
                    >
                      <h4>{program.name}</h4>
                      <p>{program.duration}</p>
                      <span className="seats">{program.capacity} seats available</span>
                      {formData.selectedProgram === program.id && <CheckCircle className="check-icon" />}
                    </div>
                  ))}
                </div>
                {errors.selectedProgram && <span className="error-text">{errors.selectedProgram}</span>}
              </div>
              
              <div className="input-group">
                <label>Select Campus *</label>
                <select 
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  className={errors.campus ? 'error' : ''}
                >
                  <option value="">Select Campus</option>
                  <option value="main">Main Campus</option>
                  <option value="north">North Campus</option>
                  <option value="south">South Campus</option>
                </select>
                {errors.campus && <span className="error-text">{errors.campus}</span>}
              </div>
              
              <div className="input-group">
                <label>Select Intake *</label>
                <select 
                  name="intake"
                  value={formData.intake}
                  onChange={handleChange}
                  className={errors.intake ? 'error' : ''}
                >
                  <option value="">Select Intake</option>
                  <option value="september">September 2024</option>
                  <option value="january">January 2025</option>
                  <option value="may">May 2025</option>
                </select>
                {errors.intake && <span className="error-text">{errors.intake}</span>}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Review & Submit</h2>
            <p className="step-description">Review your application before submitting</p>
            
            <div className="review-sections">
              <div className="review-section">
                <div className="review-header">
                  <h3><User size={18} /> Personal Details</h3>
                  <button className="edit-btn" onClick={() => setCurrentStep(1)}><Edit size={16} /></button>
                </div>
                <div className="review-grid">
                  <div><span>Name:</span> {formData.firstName} {formData.lastName}</div>
                  <div><span>Email:</span> {formData.email}</div>
                  <div><span>Phone:</span> {formData.phone}</div>
                  <div><span>Date of Birth:</span> {formData.dateOfBirth}</div>
                  <div><span>Gender:</span> {formData.gender}</div>
                  <div><span>Address:</span> {formData.address}, {formData.city}, {formData.state}</div>
                </div>
              </div>
              
              <div className="review-section">
                <div className="review-header">
                  <h3><GraduationCap size={18} /> Educational Details</h3>
                  <button className="edit-btn" onClick={() => setCurrentStep(2)}><Edit size={16} /></button>
                </div>
                <div className="review-grid">
                  <div><span>Primary School:</span> {formData.primarySchool || 'N/A'}</div>
                  <div><span>Secondary School:</span> {formData.secondarySchool}</div>
                  <div><span>Graduation Year:</span> {formData.secondaryYear}</div>
                  <div><span>Tertiary:</span> {formData.tertiaryInstitution || 'N/A'}</div>
                </div>
              </div>
              
              <div className="review-section">
                <div className="review-header">
                  <h3><BookOpen size={18} /> Program Selection</h3>
                  <button className="edit-btn" onClick={() => setCurrentStep(3)}><Edit size={16} /></button>
                </div>
                <div className="review-grid">
                  <div><span>Program:</span> {programs.find(p => p.id === formData.selectedProgram)?.name || 'N/A'}</div>
                  <div><span>Campus:</span> {formData.campus || 'N/A'}</div>
                  <div><span>Intake:</span> {formData.intake || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="submit-confirmation">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>I confirm that all information provided is true and accurate</span>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="application-form-page">
      <div className="form-header">
        <Link to="/applicant" className="back-link">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
        <h1>Admission Application Form</h1>
      </div>
      
      <div className="form-progress">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`progress-item ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            onClick={() => currentStep > step.id && setCurrentStep(step.id)}
          >
            <div className="step-number">
              {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
            </div>
            <span className="step-title">{step.title}</span>
            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>
      
      <div className="form-container">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
        
        <div className="form-actions">
          {currentStep > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              <ChevronLeft size={18} /> Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button className="btn btn-primary" onClick={nextStep}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              <CheckCircle size={18} /> Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
