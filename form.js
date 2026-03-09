// ==============================
// PROGRESSIVE FORM STEPPER
// ==============================

let currentStep = 1;
const totalSteps = 7;

// Subject data (for step 4)
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Economics', 'Computer Science', 'Literature', 'Religious Studies'];

// Program data structure
const programData = {
    "School of Engineering": {
        "HND": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"],
        "TOP UP": ["Structural Engineering", "Power Systems", "Industrial Engineering"],
        "DIRECT BSc": ["Advanced Engineering", "Project Management"],
        "MASTERS": ["Advanced Engineering", "Project Management"]
    },
    "School of Management Science": {
        "HND": ["Business Administration", "Accounting", "Economics"],
        "TOP UP": ["Financial Management", "Marketing", "Human Resources"],
        "DIRECT BSc": ["Strategic Management", "Entrepreneurship"],
        "MASTERS": ["Advanced Engineering", "Project Management"]
    },
    "School of Health Science": {
        "HND": ["Nursing", "Public Health", "Laboratory Science"],
        "TOP UP": ["Nursing Practice", "Health Administration"],
        "DIRECT BSc": ["Advanced Nursing", "Health Research"],
        "MASTERS": ["Advanced Engineering", "Project Management"]
    }
};

// ==============================
// INITIALIZE FORM
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    updateStepperUI();
    initializeSubjectTable();
    setupFileUploads();
});

// ==============================
// STEP NAVIGATION
// ==============================

function changeStep(direction) {
    // Validate current step before moving
    if (direction === 1 && !validateStep(currentStep)) {
        showAlert('Please fill in all required fields correctly', 'error');
        return;
    }

    // Update step
    const nextStep = currentStep + direction;
    
    if (nextStep >= 1 && nextStep <= totalSteps) {
        currentStep = nextStep;
        updateStepperUI();
        populateReview();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==============================
// UPDATE STEPPER UI
// ==============================

function updateStepperUI() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    // Update stepper items
    document.querySelectorAll('.stepper-item').forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active', 'completed');
        
        if (stepNum === currentStep) {
            item.classList.add('active');
        } else if (stepNum < currentStep) {
            item.classList.add('completed');
        }
    });
    
    // Update button visibility
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = currentStep === totalSteps ? 'block' : 'none';
    
    // Update button text for last step
    if (currentStep === totalSteps - 1) {
        document.getElementById('nextBtn').innerHTML = '<i class="fas fa-arrow-right ms-2"></i>Review';
    } else if (currentStep < totalSteps - 1) {
        document.getElementById('nextBtn').innerHTML = 'Next <i class="fas fa-arrow-right ms-2"></i>';
    }
}

// ==============================
// FORM VALIDATION
// ==============================

function validateStep(step) {
    const form = document.getElementById('admissionForm');
    
    switch(step) {
        case 1:
            return validateStudentInfo();
        case 2:
            return validateParentInfo();
        case 3:
            return validateEducationInfo();
        case 4:
            return validateAcademicHistory();
        case 5:
            return validateDocuments();
        case 6:
            return validateAuxiliaries();
        case 7:
            return form.querySelector('input[name="agree"]').checked;
        default:
            return true;
    }
}

function validateStudentInfo() {
    const fname = document.querySelector('input[name="s_fname"]').value.trim();
    const lname = document.querySelector('input[name="s_lname"]').value.trim();
    const phone = document.querySelector('input[name="s_phone"]').value.trim();
    const email = document.querySelector('input[name="s_email"]').value.trim();
    const address = document.querySelector('textarea[name="s_address"]').value.trim();
    
    if (!fname || !lname || !phone || !email || !address) {
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    return true;
}

function validateParentInfo() {
    const fname = document.querySelector('input[name="p_fname"]').value.trim();
    const lname = document.querySelector('input[name="p_lname"]').value.trim();
    const phone = document.querySelector('input[name="p_phone"]').value.trim();
    const email = document.querySelector('input[name="p_email"]').value.trim();
    const address = document.querySelector('textarea[name="p_address"]').value.trim();
    
    if (!fname || !lname || !phone || !email || !address) {
        return false;
    }
    
    return true;
}

function validateEducationInfo() {
    const school = document.getElementById('schoolSelect').value;
    const level = document.getElementById('levelSelect').value;
    const courseCheckboxes = document.querySelectorAll('input[name="program"]:checked');
    
    return school && level && courseCheckboxes.length > 0;
}

function validateAcademicHistory() {
    const rows = document.querySelectorAll('#subjectTable tbody tr');
    
    if (rows.length < 1) {
        return false;
    }
    
    let validRows = 0;
    rows.forEach(row => {
        // Subject can be select or input
        const subjectSelect = row.querySelector('select[name="subject"]');
        const subjectInput = row.querySelector('input[name="subject"]');
        const subject = (subjectSelect || subjectInput) ? (subjectSelect || subjectInput).value.trim() : '';
        
        const gradeInput = row.querySelector('input[name="grade"]');
        const grade = gradeInput ? gradeInput.value.trim() : '';
        
        if (subject && grade) {
            validRows++;
        }
    });
    
    // Require minimum 2 valid subjects to proceed
    return validRows >= 2;
}

// Check academic eligibility rules at final submission
function checkAcademicEligibility() {
    const rows = document.querySelectorAll('#subjectTable tbody tr');
    let validRows = 0;
    let hasReligious = false;

    rows.forEach(row => {
        const subjectSelect = row.querySelector('select[name="subject"]');
        const subjectInput = row.querySelector('input[name="subject"]');
        const subject = (subjectSelect || subjectInput) ? (subjectSelect || subjectInput).value.trim() : '';
        const gradeInput = row.querySelector('input[name="grade"]');
        const grade = gradeInput ? gradeInput.value.trim() : '';

        if (subject && grade) {
            validRows++;
            if (subject.toLowerCase() === 'religious studies') {
                hasReligious = true;
            }
        }
    });

    if (validRows < 2) {
        return { ok: false, message: 'You are not eligible: at least 2 valid subjects are required.' };
    }

    // If exactly 2 subjects provided and one of them is Religious Studies, reject
    if (validRows === 2 && hasReligious) {
        return { ok: false, message: 'You are not eligible: when only 2 subjects are provided, Religious Studies cannot be one of them.' };
    }

    return { ok: true, message: null };
}

function validateDocuments() {
    const certs = document.getElementById('certificates').files.length;
    const passport = document.getElementById('passport').files.length;
    
    return certs > 0 && passport > 0;
}

// ==============================
// AUXILIARIES
// ==============================

function validateAuxiliaries() {
    const certFrom = document.querySelector('input[name="cert_obtained_from"]').value.trim();
    const certName = document.querySelector('input[name="cert_name"]').value.trim();
    const isPatient = document.getElementById('is_patient').checked;
    const sicknessInfo = document.getElementById('sickness_info');

    if (!certFrom || !certName) return false;
    if (isPatient) {
        return sicknessInfo && sicknessInfo.value.trim().length > 0;
    }
    return true;
}

function togglePatientDetails(checked) {
    const details = document.getElementById('patientDetails');
    const sicknessInput = document.getElementById('sickness_info');
    if (checked) {
        details.style.display = 'block';
        if (sicknessInput) sicknessInput.setAttribute('required', 'required');
    } else {
        details.style.display = 'none';
        if (sicknessInput) sicknessInput.removeAttribute('required');
    }
}

// ==============================
// EDUCATION FUNCTIONS
// ==============================

function updateLevels() {
    const schoolSelect = document.getElementById('schoolSelect');
    const levelSelect = document.getElementById('levelSelect');
    const selectedSchool = schoolSelect.value;
    
    levelSelect.innerHTML = '<option value="">-- Select Level --</option>';
    levelSelect.disabled = true;
    document.getElementById('courseContainer').style.display = 'none';
    
    if (selectedSchool && programData[selectedSchool]) {
        const levels = Object.keys(programData[selectedSchool]);
        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            levelSelect.appendChild(option);
        });
        levelSelect.disabled = false;
    }
}

function updateCourses() {
    const schoolSelect = document.getElementById('schoolSelect');
    const levelSelect = document.getElementById('levelSelect');
    const courseCheckboxes = document.getElementById('courseCheckboxes');
    
    const selectedSchool = schoolSelect.value;
    const selectedLevel = levelSelect.value;
    
    courseCheckboxes.innerHTML = '';
    
    if (selectedSchool && selectedLevel && programData[selectedSchool][selectedLevel]) {
        const courses = programData[selectedSchool][selectedLevel];
        
        courses.forEach(course => {
            const label = document.createElement('label');
            label.className = 'form-check';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'form-check-input';
            input.name = 'program';
            input.value = course;
            
            const span = document.createElement('label');
            span.className = 'form-check-label';
            span.textContent = course;
            
            label.appendChild(input);
            label.appendChild(span);
            courseCheckboxes.appendChild(label);
        });
        
        document.getElementById('courseContainer').style.display = 'block';
    }
}

// ==============================
// SUBJECT TABLE FUNCTIONS
// ==============================

function initializeSubjectTable() {
    // Add initial empty row
    addSubjectRow();
}

function addSubjectRow() {
    const tbody = document.querySelector('#subjectTable tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <select class="form-select form-select-sm" name="subject" required>
                <option value="">-- Select Subject --</option>
                ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" name="grade" placeholder="e.g., A, B, C" required>
        </td>
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-danger" onclick="removeSubjectRow(this)">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function removeSubjectRow(button) {
    const tbody = document.querySelector('#subjectTable tbody');
    if (tbody.children.length > 1) {
        button.closest('tr').remove();
    } else {
        showAlert('You must have at least one subject', 'warning');
    }
}

// ==============================
// FILE UPLOAD FUNCTIONS
// ==============================

function setupFileUploads() {
    // Certificate uploads
    const certInput = document.getElementById('certificates');
    certInput.addEventListener('change', function() {
        displayFilePreview(this, 'cert-preview');
    });
    
    // Passport upload
    const passportInput = document.getElementById('passport');
    passportInput.addEventListener('change', function() {
        displayFilePreview(this, 'passport-preview');
    });
    
    // Drag and drop for certificate area
    const certArea = document.querySelector('[onclick*="certificates"]').closest('.upload-area');
    setupDragAndDrop(certArea, certInput);
    
    // Drag and drop for passport area
    const passportArea = document.querySelector('[onclick*="passport"]').closest('.upload-area');
    setupDragAndDrop(passportArea, passportInput);
}

function displayFilePreview(input, previewId) {
    const previewDiv = document.getElementById(previewId);
    previewDiv.innerHTML = '';
    
    const files = input.files;
    
    if (files.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'list-group mt-2';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlert(`File ${file.name} is too large (max 5MB)`, 'error');
                continue;
            }
            
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
        }
        
        previewDiv.appendChild(ul);
    }
}

function setupDragAndDrop(area, input) {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.style.backgroundColor = 'rgba(13, 110, 253, 0.15)';
        area.style.borderColor = '#0d6efd';
    });
    
    area.addEventListener('dragleave', () => {
        area.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
        area.style.borderColor = '#0d6efd';
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
        const files = e.dataTransfer.files;
        input.files = files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ==============================
// REVIEW SECTION
// ==============================

function populateReview() {
    if (currentStep !== 7) return;

    // Student info
    const studentData = {
        'First Name': document.querySelector('input[name="s_fname"]').value,
        'Last Name': document.querySelector('input[name="s_lname"]').value,
        'Email': document.querySelector('input[name="s_email"]').value,
        'Phone': document.querySelector('input[name="s_phone"]').value
    };
    populateReviewSection(studentData, 'review-student');

    // Parent info
    const parentData = {
        'First Name': document.querySelector('input[name="p_fname"]').value,
        'Last Name': document.querySelector('input[name="p_lname"]').value,
        'Relationship': document.querySelector('select[name="p_relationship"]').value,
        'Email': document.querySelector('input[name="p_email"]').value
    };
    populateReviewSection(parentData, 'review-parent');

    // Program selection
    const programData = {
        'School': document.getElementById('schoolSelect').value,
        'Level': document.getElementById('levelSelect').value,
        'Programs': Array.from(document.querySelectorAll('input[name="program"]:checked'))
            .map(cb => cb.value)
            .join(', ')
    };
    populateReviewSection(programData, 'review-program');

    // Auxiliaries
    const auxData = {
        'Certificate From': document.querySelector('input[name="cert_obtained_from"]').value,
        'Certificate Name': document.querySelector('input[name="cert_name"]').value,
        'Is Patient': document.getElementById('is_patient').checked ? 'Yes' : 'No',
        'Medical Details': document.getElementById('sickness_info') ? document.getElementById('sickness_info').value : ''
    };
    populateReviewSection(auxData, 'review-auxiliary');
}

function populateReviewSection(data, sectionId) {
    const section = document.getElementById(sectionId);
    section.innerHTML = '';
    
    for (const [key, value] of Object.entries(data)) {
        if (value) {
            const item = document.createElement('div');
            item.className = 'review-item';
            item.innerHTML = `
                <div class="review-label">${key}</div>
                <div class="review-value">${value}</div>
            `;
            section.appendChild(item);
        }
    }
}

// ==============================
// FORM SUBMISSION
// ==============================

function submitForm(event) {
    event.preventDefault();
    
    if (!validateStep(currentStep)) {
        showAlert('Please accept the terms to submit', 'error');
        return;
    }
    
    // Run academic eligibility checks before submitting
    const eligibility = checkAcademicEligibility();
    if (!eligibility.ok) {
        showAlert(eligibility.message, 'error');
        return;
    }
    
    // Collect all form data
    const formData = new FormData(document.getElementById('admissionForm'));
    
    // Simulate submission
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        showAlert('Application submitted successfully! 🎉', 'success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            document.getElementById('admissionForm').reset();
            currentStep = 1;
            updateStepperUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }, 2000);
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the form card
    const formCard = document.querySelector('.form-card');
    formCard.insertBefore(alertDiv, formCard.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ==============================
// KEYBOARD NAVIGATION
// ==============================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentStep < totalSteps) {
        changeStep(1);
    } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        changeStep(-1);
    }
});
