import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Form.css';

// Exact program data from form.js
const programData: Record<string, Record<string, string[]>> = {
"School of Engineering": {
    "HND": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"],
    "TOPUP": ["Structural Engineering", "Power Systems", "Industrial Engineering"],
    "DEGREE": ["Advanced Engineering", "Project Management"],
    "MASTERS": ["Advanced Engineering", "Project Management"]
  },
  "School of Management Science": {
    "HND": ["Business Administration", "Accounting", "Economics"],
    "TOPUP": ["Financial Management", "Marketing", "Human Resources"],
    "DEGREE": ["Strategic Management", "Entrepreneurship"],
    "MASTERS": ["Advanced Engineering", "Project Management"]
  },
  "School of Health Science": {
    "HND": ["Nursing", "Public Health", "Laboratory Science"],
    "TOPUP": ["Nursing Practice", "Health Administration"],
    "DEGREE": ["Advanced Nursing", "Health Research"],
    "MASTERS": ["Advanced Engineering", "Project Management"]
  }
};

const subjects = ['Mathematics', 'Physics', 'Chemistry', "Biology", 'English', 'History', 'Geography', 'Economics', 'Computer Science', 'Literature', 'Religious Studies'];

const Form: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalSteps] = useState<number>(7);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [subjectsData, setSubjectsData] = useState<{subject: string, grade: string}[]>([]);
  const [courseCheckboxes, setCourseCheckboxes] = useState<string[]>([]);
  const [files, setFiles] = useState<{certificates: File[], passport: File | null}>({certificates: [], passport: null});
  const [alerts, setAlerts] = useState<{message: string, type: 'info' | 'success' | 'error' | 'warning' }[]>([]);
  const [levelDisabled, setLevelDisabled] = useState(true);
  const [courseContainerVisible, setCourseContainerVisible] = useState(false);
  const [patientDetailsVisible, setPatientDetailsVisible] = useState(false);

  // Refs for file inputs and DOM manipulation
  const formRef = useRef<HTMLFormElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const courseCheckboxesRef = useRef<HTMLDivElement>(null);

  // Init
  useEffect(() => {
    initializeForm();
  }, []);

  useEffect(() => {
    updateStepperUI();
    if (currentStep === 7) {
      populateReview();
    }
  }, [currentStep]);

  const initializeForm = () => {
    // Initial empty subject row
    setSubjectsData([{subject: '', grade: ''}]);
  };

  // Generic input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'radio' ? value : value
    }));
  }, []);

  // File change handlers
  const handleCertificatesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    setFiles(prev => ({ ...prev, certificates: validFiles }));
    displayFilePreview('cert-preview', validFiles);
  }, []);

  const handlePassportChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size <= 5 * 1024 * 1024) {
      setFiles(prev => ({ ...prev, passport: file }));
      displayFilePreview('passport-preview', [file]);
    }
  }, []);

  // Display file preview
  const displayFilePreview = (previewId: string, files: File[]) => {
    const previewDiv = document.getElementById(previewId);
    if (previewDiv) {
      previewDiv.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'list-group mt-2';
      files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <div>
            <i class="fas fa-file me-2"></i>
            <strong>${file.name}</strong>
            <small class="text-muted ms-2">(${formatFileSize(file.size)})</small>
          </div>
          <span class="badge bg-success rounded-pill">Ready</span>
        `;
        ul.appendChild(li);
      });
      previewDiv.appendChild(ul);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Drag & drop setup (useEffect + refs)
  useEffect(() => {
    const certArea = document.querySelector('.upload-area[onclick*="certificates"]');
    const passportArea = document.querySelector('.upload-area[onclick*="passport"]');
    
    const handleDragOver = (e: DragEvent) => {
      e?.preventDefault();
      (e?.currentTarget as HTMLElement).style.backgroundColor = 'rgba(13, 110, 253, 0.15)';
    };
    
    const handleDragLeave = (e: DragEvent) => {
      (e?.currentTarget as HTMLElement).style.backgroundColor = 'rgba(29, 71, 70, 0.05)';
    };
    
    const handleDrop = (e: DragEvent, inputRef: React.RefObject<HTMLInputElement>) => {
      e?.preventDefault();
      const dt = e.dataTransfer;
      if (dt?.files) {
        const fileList = Array.from(dt.files);
        const event = new Event('change', { bubbles: true });
        if (inputRef.current) {
          const dataTransfer = new DataTransfer();
          fileList.forEach(file => dataTransfer.items.add(file));
          inputRef.current.files = dataTransfer.files;
          inputRef.current.dispatchEvent(event);
        }
      }
    };

    if (certArea) {
      certArea.addEventListener('dragover', handleDragOver);
      certArea.addEventListener('dragleave', handleDragLeave);
      certArea.addEventListener('drop', (e) => handleDrop(e, certInputRef));
    }
    if (passportArea) {
      passportArea.addEventListener('dragover', handleDragOver);
      passportArea.addEventListener('dragleave', handleDragLeave);
      passportArea.addEventListener('drop', (e) => handleDrop(e, passportInputRef));
    }

    return () => {
      certArea?.removeEventListener('dragover', handleDragOver);
      certArea?.removeEventListener('dragleave', handleDragLeave);
      certArea?.removeEventListener('drop', (e) => handleDrop(e, certInputRef));
      passportArea?.removeEventListener('dragover', handleDragOver);
      passportArea?.removeEventListener('dragleave', handleDragLeave);
      passportArea?.removeEventListener('drop', (e) => handleDrop(e, passportInputRef));
    };
  }, []);

  // Step navigation
  const changeStep = (direction: number) => {
    if (direction === 1 && !validateStep(currentStep)) {
      showAlert('Please fill in all required fields correctly', 'error');
      return;
    }
    const nextStep = currentStep + direction;
    if (nextStep >= 1 && nextStep <= totalSteps) {
      setCurrentStep(nextStep);
    }
  };

  // Update stepper UI (minimal DOM for Bootstrap compatibility)
  const updateStepperUI = () => {
    // Stepper items
    document.querySelectorAll('.stepper-item').forEach((item, index) => {
      const stepNum = index + 1;
      (item as HTMLElement).classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        (item as HTMLElement).classList.add('active');
      } else if (stepNum < currentStep) {
        (item as HTMLElement).classList.add('completed');
      }
    });

    // Hide/show steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
      if (index + 1 === currentStep) {
        (step as HTMLElement).classList.add('active');
      } else {
        (step as HTMLElement).classList.remove('active');
      }
    });

    // Buttons
    const prevBtn = document.getElementById('prevBtn') as HTMLElement;
    const nextBtn = document.getElementById('nextBtn') as HTMLElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLElement;
    
    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';

    // Next button text
    if (nextBtn && currentStep === totalSteps - 1) {
      nextBtn.innerHTML = '<i class="fas fa-arrow-right ms-2"></i>Review';
    } else if (nextBtn && currentStep < totalSteps - 1) {
      nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ms-2"></i>';
    }
  };

  // Exact validation from JS
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: return validateStudentInfo();
      case 2: return validateParentInfo();
      case 3: return validateEducationInfo();
      case 4: return validateAcademicHistory();
      case 5: return validateDocuments();
      case 6: return validateAuxiliaries();
      case 7: return !!formData.agree;
      default: return true;
    }
  };

  const validateStudentInfo = (): boolean => {
    const required = ['s_fname', 's_lname', 's_phone', 's_email', 's_address'];
    for (const field of required) {
      if (!formData[field]?.trim()) return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.s_email || '');
  };

  const validateParentInfo = (): boolean => {
    const required = ['p_fname', 'p_lname', 'p_phone', 'p_email', 'p_address'];
    for (const field of required) {
      if (!formData[field]?.trim()) return false;
    }
    return true;
  };

  const validateEducationInfo = (): boolean => {
    return !!(formData.school && formData.level && courseCheckboxes.length > 0);
  };

  const validateAcademicHistory = (): boolean => {
    const validRows = subjectsData.filter(s => s.subject.trim() && s.grade.trim()).length;
    return validRows >= 2;
  };

  const validateDocuments = (): boolean => {
    return files.certificates.length > 0 && !!files.passport;
  };

  const validateAuxiliaries = (): boolean => {
    if (!formData.cert_obtained_from?.trim() || !formData.cert_name?.trim()) return false;
    if (patientDetailsVisible && !formData.sickness_info?.trim()) return false;
    return true;
  };

  // Academic eligibility (exact rules)
  const checkAcademicEligibility = (): {ok: boolean, message?: string} => {
    const validRows = subjectsData.filter(s => s.subject.trim() && s.grade.trim()).length;
    const hasReligious = subjectsData.some(s => s.subject.toLowerCase().includes('religious'));
    
    if (validRows < 2) {
      return { ok: false, message: 'You are not eligible: at least 2 valid subjects are required.' };
    }
    if (validRows === 2 && hasReligious) {
      return { ok: false, message: 'You are not eligible: when only 2 subjects are provided, Religious Studies cannot be one of them.' };
    }
    return { ok: true };
  };

  // Education handlers
  const handleSchoolChange = (school: string) => {
    setFormData(prev => ({ ...prev, school }));
    setLevelDisabled(!school);
    setCourseContainerVisible(false);
    setCourseCheckboxes([]);
  };

  const handleLevelChange = (level: string) => {
    setFormData(prev => ({ ...prev, level }));
    const school = formData.school;
    if (school && level && programData[school as keyof typeof programData]?.[level as keyof typeof programData['School of Engineering']]) {
      setCourseContainerVisible(true);
    } else {
      setCourseContainerVisible(false);
      setCourseCheckboxes([]);
    }
  };

  const handleCourseChange = (course: string, checked: boolean) => {
    setCourseCheckboxes(prev => 
      checked ? [...prev, course] : prev.filter(c => c !== course)
    );
  };

  // Subjects handlers
  const addSubjectRow = () => {
    setSubjectsData(prev => [...prev, {subject: '', grade: ''}]);
  };

  const removeSubjectRow = (index: number) => {
    if (subjectsData.length > 1) {
      setSubjectsData(prev => prev.filter((_, i) => i !== index));
    } else {
      showAlert('You must have at least one subject', 'warning');
    }
  };

  const updateSubject = (index: number, field: 'subject' | 'grade', value: string) => {
    setSubjectsData(prev => prev.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    ));
  };

  // Patient toggle
  const togglePatientDetails = (checked: boolean) => {
    setPatientDetailsVisible(checked);
    setFormData(prev => ({ ...prev, is_patient: checked }));
  };

  // Review population (step 7)
  const populateReview = () => {
    // Student
    const studentData = {
      'First Name': formData.s_fname || '',
      'Last Name': formData.s_lname || '',
      'Email': formData.s_email || '',
      'Phone': formData.s_phone || ''
    };
    updateReviewSection('review-student', studentData);

    // Parent
    const parentData = {
      'First Name': formData.p_fname || '',
      'Last Name': formData.p_lname || '',
      'Relationship': formData.p_relationship || '',
      'Email': formData.p_email || ''
    };
    updateReviewSection('review-parent', parentData);

    // Program
    const programDataReview = {
      'School': formData.school || '',
      'Level': formData.level || '',
      'Programs': courseCheckboxes.join(', ')
    };
    updateReviewSection('review-program', programDataReview);

    // Auxiliary
    const auxData = {
      'Certificate From': formData.cert_obtained_from || '',
      'Certificate Name': formData.cert_name || '',
      'Is Patient': formData.is_patient ? 'Yes' : 'No',
      'Medical Details': formData.sickness_info || ''
    };
    updateReviewSection('review-auxiliary', auxData);
  };

  const updateReviewSection = (sectionId: string, data: Record<string, string>) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.innerHTML = '';
      Object.entries(data).forEach(([key, value]) => {
        if (value.trim()) {
          const item = document.createElement('div');
          item.className = 'review-item';
          item.innerHTML = `
            <div class="review-label">${key}</div>
            <div class="review-value">${value}</div>
          `;
          section.appendChild(item);
        }
      });
    }
  };

  // Alerts
  const showAlert = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    const alert: {message: string, type: string} = { message, type: type === 'error' ? 'danger' : type };
    setAlerts(prev => [...prev, alert]);
    
    setTimeout(() => {
      setAlerts(prev => prev.slice(1));
    }, 5000);
  };

  // Submit (exact simulation)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(7)) {
      showAlert('Please accept the terms to submit', 'error');
      return;
    }

    const eligibility = checkAcademicEligibility();
    if (!eligibility.ok) {
      showAlert(eligibility.message || '', 'error');
      return;
    }

    // Simulate submission
    const submitBtn = document.getElementById('submitBtn') as HTMLElement;
    const originalText = submitBtn?.innerHTML;
    (submitBtn as any).disabled = true;
    submitBtn!.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';

    setTimeout(() => {
      (submitBtn as any).disabled = false;
      submitBtn!.innerHTML = originalText!;
      showAlert('Application submitted successfully! 🎉', 'success');
      
      // Reset
      setTimeout(() => {
        if (formRef.current) formRef.current.reset();
        setCurrentStep(1);
        setFormData({});
        setSubjectsData([{subject: '', grade: ''}]);
        setCourseCheckboxes([]);
        setFiles({certificates: [], passport: null});
        setPatientDetailsVisible(false);
      }, 2000);
    }, 2000);
  };

  // Render exact HTML structure with controlled inputs
  return (
    <>
      {/* Alerts */}
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type} alert-dismissible fade show position-fixed`} 
             style={{top: '20px', right: '20px', zIndex: 9999}}>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlerts([])}></button>
        </div>
      ))}

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header + Progress Stepper - EXACT HTML */}
            <div className="header-panel mb-4 rounded-3">
              <div className="text-center mb-3">
                <h1 className="display-5 fw-bold mb-2">Student Admission Form</h1>
                <p className="text-muted">Complete this form to apply for admission</p>
              </div>

              <div className="stepper-container">
                <div className="stepper-wrapper">
                  <div className="stepper-item active" data-step="1">
                    <div className="step-circle">1</div>
                    <div className="step-label">Student Info</div>
                  </div>
                  <div className="stepper-item" data-step="2">
                    <div className="step-circle">2</div>
                    <div className="step-label">Parent Info</div>
                  </div>
                  <div className="stepper-item" data-step="3">
                    <div className="step-circle">3</div>
                    <div className="step-label">Education</div>
                  </div>
                  <div className="stepper-item" data-step="4">
                    <div className="step-circle">4</div>
                    <div className="step-label">Subjects</div>
                  </div>
                  <div className="stepper-item" data-step="5">
                    <div className="step-circle">5</div>
                    <div className="step-label">Documents</div>
                  </div>
                  <div className="stepper-item" data-step="6">
                    <div className="step-circle">6</div>
                    <div className="step-label">Auxiliaries</div>
                  </div>
                  <div className="stepper-item" data-step="7">
                    <div className="step-circle">7</div>
                    <div className="step-label">Review</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - EXACT structure */}
            <form ref={formRef} id="admissionForm" className="form-card" onSubmit={handleSubmit}>
              {/* STEP 1: Student Info - EXACT */}
              <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} id="step-1">
                <h3 className="step-title mb-4">
                  <i className="fas fa-user-graduate text-primary me-2"></i>Student Information
                </h3>
                
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">First Name *</label>
                    <input type="text" className="form-control" name="s_fname" value={formData.s_fname || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Middle Name</label>
                    <input type="text" className="form-control" name="s_mname" value={formData.s_mname || ''} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Last Name *</label>
                    <input type="text" className="form-control" name="s_lname" value={formData.s_lname || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender *</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="s_sex" value="Male" id="male" checked={formData.s_sex === 'Male'} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="male">Male</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="s_sex" value="Female" id="female" checked={formData.s_sex === 'Female'} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="female">Female</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date of Birth *</label>
                    <input type="date" className="form-control" name="s_dob" value={formData.s_dob || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input type="tel" className="form-control" name="s_phone" placeholder="+1234567890" value={formData.s_phone || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email *</label>
                    <input type="email" className="form-control" name="s_email" value={formData.s_email || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">Address *</label>
                  <textarea className="form-control" name="s_address" rows={3} value={formData.s_address || ''} onChange={handleInputChange} required />
                </div>
              </div>

              {/* STEP 2: Parent Info - EXACT */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} id="step-2">
                <h3 className="step-title mb-4">
                  <i className="fas fa-users text-primary me-2"></i>Parent/Guardian Information
                </h3>
                
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">First Name *</label>
                    <input type="text" className="form-control" name="p_fname" value={formData.p_fname || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Middle Name</label>
                    <input type="text" className="form-control" name="p_mname" value={formData.p_mname || ''} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Last Name *</label>
                    <input type="text" className="form-control" name="p_lname" value={formData.p_lname || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Relationship *</label>
                    <select className="form-control" name="p_relationship" value={formData.p_relationship || ''} onChange={handleInputChange} required>
                      <option value="">-- Select --</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Occupation</label>
                    <input type="text" className="form-control" name="p_occupation" value={formData.p_occupation || ''} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input type="tel" className="form-control" name="p_phone" value={formData.p_phone || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email *</label>
                    <input type="email" className="form-control" name="p_email" value={formData.p_email || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">Address *</label>
                  <textarea className="form-control" name="p_address" rows={3} value={formData.p_address || ''} onChange={handleInputChange} required />
                </div>
              </div>

              {/* STEP 3: Education - Dynamic */}
              <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} id="step-3">
                <h3 className="step-title mb-4">
                  <i className="fas fa-school text-primary me-2"></i>School & Program Selection
                </h3>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Select School *</label>
                    <select className="form-control" id="schoolSelect" name="school" value={formData.school || ''} onChange={(e) => handleSchoolChange(e.target.value)} required>
                      <option value="">-- Select School --</option>
                      <option value="School of Engineering">School of Engineering</option>
                      <option value="School of Management Science">School of Management Science</option>
                      <option value="School of Health Science">School of Health Science</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Select Level *</label>
                    <select className="form-control" id="levelSelect" name="level" value={formData.level || ''} onChange={(e) => handleLevelChange(e.target.value)} disabled={levelDisabled} required>
                      <option value="">-- Select Level --</option>
                      <option value="HND">HND</option>
                      <option value="DEGREE">DEGREE</option>
                      <option value="TOPUP">TOPUP</option>
                      <option value="MASTERS">MASTERS</option>
                    </select>
                  </div>
                </div>

                {courseContainerVisible && (
                  <div className="mt-4" id="courseContainer">
                    <label className="form-label fw-semibold">Available Programs *</label>
                    <div ref={courseCheckboxesRef} id="courseCheckboxes" className="program-grid">
                      {(formData.school && formData.level && programData[formData.school as keyof typeof programData]?.[formData.level as string]) ? 
                        programData[formData.school as keyof typeof programData][formData.level as keyof typeof programData['School of Engineering']]!.map((course: string) => (
                          <div key={course} className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              name="program" 
                              value={course}
                              checked={courseCheckboxes.includes(course)}
                              onChange={(e) => handleCourseChange(course, e.target.checked)}
                            />
                            <label className="form-check-label">{course}</label>
                          </div>
                        )) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: Subjects Table - Dynamic */}
              <div className={`form-step ${currentStep === 4 ? 'active' : ''}`} id="step-4">
                <h3 className="step-title mb-4">
                  <i className="fas fa-book text-primary me-2"></i>Academic History
                </h3>
                
                <p className="text-muted mb-3">Enter your subjects and grades. You must have at least 2 valid subjects.</p>
                
                <div className="table-responsive">
                  <table className="table table-hover" id="subjectTable">
                    <thead className="table-light">
                      <tr>
                        <th>Subject Name</th>
                        <th>Grade</th>
                        <th width="80">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectsData.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <select className="form-select form-select-sm" name="subject" value={row.subject} onChange={(e) => updateSubject(index, 'subject', e.target.value)} required>
                              <option value="">-- Select Subject --</option>
                              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td>
                            <input type="text" className="form-control form-control-sm" name="grade" placeholder="e.g., A, B, C" value={row.grade} onChange={(e) => updateSubject(index, 'grade', e.target.value)} required />
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSubjectRow(index)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" onClick={addSubjectRow} className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-plus me-2"></i>Add Subject
                </button>
              </div>

              {/* STEP 5: Documents */}
              <div className={`form-step ${currentStep === 5 ? 'active' : ''}`} id="step-5">
                <h3 className="step-title mb-4">
                  <i className="fas fa-file-upload text-primary me-2"></i>Document Upload
                </h3>
                
                <div className="alert alert-info" role="alert">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Upload Requirements:</strong> Accepted formats: PDF, JPG, PNG (Max 5MB each)
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Certificates (PDF/Image) *</label>
                  <div className="upload-area" onClick={() => certInputRef.current?.click()}>
                    <i className="fas fa-cloud-upload-alt fa-2x text-primary mb-2"></i>
                    <p>Click to upload or drag files here</p>
                    <small className="text-muted">PDF, JPG, PNG up to 5MB</small>
                  </div>
                  <input ref={certInputRef} type="file" id="certificates" name="certificates" multiple accept=".pdf,.jpg,.png" style={{display: 'none'}} onChange={handleCertificatesChange} required />
                  <div id="cert-preview" className="mt-2"></div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Passport Photo *</label>
                  <div className="upload-area" onClick={() => passportInputRef.current?.click()}>
                    <i className="fas fa-image fa-2x text-primary mb-2"></i>
                    <p>Click to upload passport photo</p>
                    <small className="text-muted">JPG, PNG up to 5MB</small>
                  </div>
                  <input ref={passportInputRef} type="file" id="passport" name="passport" accept=".jpg,.png" style={{display: 'none'}} onChange={handlePassportChange} required />
                  <div id="passport-preview" className="mt-2"></div>
                </div>
              </div>

              {/* STEP 6: Auxiliaries */}
              <div className={`form-step ${currentStep === 6 ? 'active' : ''}`} id="step-6">
                <h3 className="step-title mb-4">
                  <i className="fas fa-file-alt text-primary me-2"></i>Additional Information
                </h3>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Certificate Obtained From *</label>
                    <input type="text" className="form-control" name="cert_obtained_from" placeholder="School/College Name" value={formData.cert_obtained_from || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Certificate Name *</label>
                    <input type="text" className="form-control" name="cert_name" placeholder="e.g., WAEC, NECO, JAMB" value={formData.cert_name || ''} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="is_patient" name="is_patient" checked={patientDetailsVisible} onChange={(e) => togglePatientDetails(e.target.checked)} />
                    <label className="form-check-label" htmlFor="is_patient">
                      <strong>Are you a patient with a medical condition?</strong>
                    </label>
                  </div>
                </div>

                {patientDetailsVisible && (
                  <div id="patientDetails" className="mt-4">
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Please provide details about your medical condition so we can accommodate your needs.
                    </div>
                    <label className="form-label fw-semibold">Medical Condition Details *</label>
                    <textarea className="form-control" id="sickness_info" name="sickness_info" rows={4} placeholder="Describe your medical condition and any special accommodations you may need..." value={formData.sickness_info || ''} onChange={handleInputChange} />
                  </div>
                )}
              </div>

              {/* STEP 7: Review */}
              <div className={`form-step ${currentStep === 7 ? 'active' : ''}`} id="step-7">
                <h3 className="step-title mb-4">
                  <i className="fas fa-check-circle text-primary me-2"></i>Review & Submit
                </h3>
                
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  All information looks good! Review the details below and submit your application.
                </div>

                <div className="review-section">
                  <h5 className="mb-3">Student Information</h5>
                  <div id="review-student" className="review-grid"></div>
                </div>

                <div className="review-section mt-4">
                  <h5 className="mb-3">Parent Information</h5>
                  <div id="review-parent" className="review-grid"></div>
                </div>

                <div className="review-section mt-4">
                  <h5 className="mb-3">Program Selection</h5>
                  <div id="review-program" className="review-grid"></div>
                </div>

                <div className="review-section mt-4">
                  <h5 className="mb-3">Additional Information</h5>
                  <div id="review-auxiliary" className="review-grid"></div>
                </div>

                <div className="form-check mt-4 mb-3">
                  <input className="form-check-input" type="checkbox" id="agree" name="agree" onChange={handleInputChange} required />
                  <label className="form-check-label" htmlFor="agree">
                    I confirm that all information provided is accurate and complete.
                  </label>
                </div>
              </div>
            </form>

            {/* Navigation Buttons - EXACT */}
            <div className="d-flex gap-2 mt-5">
              <button type="button" id="prevBtn" onClick={() => changeStep(-1)} className="btn btn-outline-secondary btn-lg flex-grow-1" style={{display: 'none'}}>
                <i className="fas fa-arrow-left me-2"></i>Previous
              </button>
              <button type="button" id="nextBtn" onClick={() => changeStep(1)} className="btn btn-primary btn-lg flex-grow-1">
                Next <i className="fas fa-arrow-right ms-2"></i>
              </button>
              <button type="submit" id="submitBtn" form="admissionForm" className="btn btn-success btn-lg flex-grow-1" style={{display: 'none'}}>
                <i className="fas fa-check me-2"></i>Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;