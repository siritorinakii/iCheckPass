//Loader Page
window.addEventListener("load", () => {
setTimeout(() => {
document.getElementById("loader").style.display = "none";
document.getElementById("content").style.display = "block";
}, 1500);
});
// Back Button
const backBtn = document.getElementById('backBtn');
// Page History Stack (Temporarily)
let pageHistory = [];
function updateBackButton() {
const currentPage = pageHistory[pageHistory.length - 1];
if (currentPage && currentPage.id !== "titlePage") {
backBtn.classList.remove("hidden");
} else {
backBtn.classList.add("hidden");
}
}
// Function to go back one page
function goBack() {
if (pageHistory.length <= 1) return;
pageHistory.pop();
const previousPage = pageHistory[pageHistory.length - 1];
// Hide all sections
document.querySelectorAll('section').forEach(section => {
section.classList.add('hidden');
});
// Show previous page
previousPage.classList.remove('hidden');
updateBackButton();
}
// A Back Button Click
backBtn.addEventListener('click', goBack);
// Title Page or the Second Page that'll appear
const titlePage = document.getElementById('titlePage');
const roleSelection = document.getElementById('roleSelection');
const continueToRoleBtn = document.getElementById('continueToRole');
const continueToDashboardBtn = document.getElementById('continueToDashboard');
const teacherCard = document.getElementById('teacherCard');
const studentCard = document.getElementById('studentCard');
// Student Elements
const studentInfoSection = document.getElementById('studentInfoSection');
    const studentInfoForm = document.getElementById('studentInfoForm');
    const submitStudentInfoBtn = document.getElementById('submitStudentInfo');
const studentInfoConfirmSection = document.getElementById('studentInfoConfirmSection');
const confirmName = document.getElementById('confirmName');
const confirmNumber = document.getElementById('confirmNumber');
const confirmStrandCategory = document.getElementById('confirmStrandCategory');
const confirmStrand = document.getElementById('confirmStrand');
const confirmSection = document.getElementById('confirmSection');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');
const qrCodeSection = document.getElementById('qrCodeSection');
const qrDoneBtn = document.getElementById('qrDoneBtn');
let qrcode;
// Teacher Elements
const teacherVerifySection = document.getElementById('teacherVerifySection');
const teacherVerifyBtn = document.getElementById('teacherVerifyBtn');
const teacherLoginStep = document.getElementById('teacherLoginStep');
const teacherLoginFormStep = document.getElementById('teacherLoginFormStep');
const teacherNameInput = document.getElementById("teacherName");
const teacherPasswordInput = document.getElementById("teacherPasswordStep");
const teacherLoginContinueBtn = document.getElementById("teacherLoginContinueBtn");
const teacherClassInfoStep = document.getElementById("teacherClassInfoStep");
const teacherClassForm = document.getElementById("teacherClassForm");
const teacherStrandCategorySelect = document.getElementById("teacherStrandCategory");
const teacherStrandSelect = document.getElementById("teacherStrand");
const teacherGradeSelect = document.getElementById("teacherGrade");
const teacherSectionInput = document.getElementById("teacherSection");
const teacherScheduleStart = document.getElementById("teacherScheduleStart");
const teacherScheduleEnd = document.getElementById("teacherScheduleEnd");
const teacherDate = document.getElementById("teacherDate");
const teacherAttendanceStep = document.getElementById("teacherAttendanceStep");
const teacherAttendanceForm = document.getElementById("teacherAttendanceForm");
const lateTime = document.getElementById("lateTime");
const absentTime = document.getElementById("absentTime");
const teacherConfirmStep = document.getElementById("teacherConfirmStep");
const confirmTeacherName = document.getElementById("confirmTeacherName");
const confirmTeacherSection = document.getElementById("confirmTeacherSection");
const confirmTeacherSchedule = document.getElementById("confirmTeacherSchedule");
const confirmTeacherDateTime = document.getElementById("confirmTeacherDateTime");
const confirmAttendanceMarks = document.getElementById("confirmAttendanceMarks");
const teacherConfirmBtn = document.getElementById("teacherConfirmBtn");
const teacherScannerSection = document.getElementById("teacherScannerSection");
const backToRoleTeacher = document.getElementById("backToRoleTeacher");
// QR Scanner Elements
const teacherVideo = document.getElementById('teacherVideo');
const overlay = document.getElementById('overlayCanvas');
const overlayCtx = overlay.getContext('2d');
const startScannerBtn = document.getElementById('startScannerBtn');
const qrResults = document.getElementById('qrResults');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const qrModal = document.getElementById('qrModal');
const qrModalText = document.getElementById('qrModalText');
const strandCategorySelect = document.getElementById('strandCategory');
const strandSelect = document.getElementById('strand');
const strands = {
"Academic Strand": ["STEM", "GAS", "HUMMS", "ABM"],
"Technical Vocational Livelihood": ["HRCTO", "ICT"]
};
strandCategorySelect.addEventListener('change', () => {
strandSelect.innerHTML = '<option disabled selected value="">Select Strand</option>';
strandSelect.disabled = false;
strands[strandCategorySelect.value]?.forEach(s => {
const opt = document.createElement('option');
opt.value = s;
opt.textContent = s;
strandSelect.appendChild(opt);
});
});

// Teachers Strand Category
teacherStrandCategorySelect.addEventListener('change', () => {
teacherStrandSelect.innerHTML = '<option disabled selected value="">Select Strand</option>';
teacherStrandSelect.disabled = false;
strands[teacherStrandCategorySelect.value]?.forEach(s => {
const opt = document.createElement('option');
opt.value = s;
opt.textContent = s;
teacherStrandSelect.appendChild(opt);
});
});

// Continue Buttons
continueToRoleBtn.addEventListener('click', () => {
pageHistory = [titlePage];
titlePage.classList.add('hidden');
roleSelection.classList.remove('hidden');
updateBackButton();
});
let selectedRole = null;
function resetRoleSelection() {
selectedRole = null;
continueToDashboardBtn.disabled = true;
continueToDashboardBtn.classList.add('btn-disabled');
continueToDashboardBtn.classList.remove('btn-primary');
teacherCard.classList.remove('border-blue-600', 'bg-blue-50');
studentCard.classList.remove('border-blue-600', 'bg-blue-50');
pageHistory = []; // -- Reset history when back to roles
updateBackButton();
}
function selectRole(role) {
selectedRole = role;
continueToDashboardBtn.disabled = false;
continueToDashboardBtn.classList.remove('btn-disabled');
continueToDashboardBtn.classList.add('btn-primary');
if (role === 'Teacher') {
teacherCard.classList.add('border-blue-600', 'bg-blue-50');
studentCard.classList.remove('border-blue-600', 'bg-blue-50');
} else if (role === 'Student') {
studentCard.classList.add('border-blue-600', 'bg-blue-50');
teacherCard.classList.remove('border-blue-600', 'bg-blue-50');
}
}
teacherCard.addEventListener('click', () => selectRole('Teacher'));
teacherCard.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') {
e.preventDefault(); selectRole('Teacher'); } });
studentCard.addEventListener('click', () => selectRole('Student'));
studentCard.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') {
e.preventDefault(); selectRole('Student'); } });
// Student Information Flow
let studentData = {};
studentInfoForm.addEventListener('input', () => {
const allFilled =
studentInfoForm.studentName.value.trim() &&
studentInfoForm.studentNumber.value.trim() &&
strandCategorySelect.value &&
strandSelect.value &&
studentInfoForm.section.value.trim();
submitStudentInfoBtn.disabled = !allFilled;
});
studentInfoForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // ✅ DAPAT GANITO - MAY GRADE:
    studentData = {
        name: document.getElementById('studentName').value.trim(),
        number: document.getElementById('studentNumber').value.trim(),
        strandCategory: strandCategorySelect.value,
        strand: strandSelect.value,
        grade: document.getElementById('studentGrade').value, // ✅ ITO ANG DAGDAG
        section: document.getElementById('studentSection').value
    };
    
    console.log("Student Data with Grade:", studentData); // Remove this if using SPCK
    
    pageHistory.push(studentInfoConfirmSection);
    studentInfoSection.classList.add('hidden');
    studentInfoConfirmSection.classList.remove('hidden');
    
    // ✅ DAPAT MAY GRADE DIN DITO:
    confirmName.textContent = "Name: " + studentData.name;
    confirmNumber.textContent = "Student Number: " + studentData.number;
    confirmStrandCategory.textContent = "Strand Category: " + studentData.strandCategory;
    confirmStrand.textContent = "Strand: " + studentData.strand;
    confirmGrade.textContent = "Grade: " + studentData.grade; // ✅ ITO IMPORTANTE
    confirmSection.textContent = "Section: " + studentData.section;
    
    updateBackButton();
});
confirmYesBtn.addEventListener('click', () => {
    // Make sure ALL student data is included
    studentData = {
        name: document.getElementById('studentName').value.trim(),
        number: document.getElementById('studentNumber').value.trim(),
        strandCategory: document.getElementById('strandCategory').value,
        strand: document.getElementById('strand').value,
        grade: document.getElementById('studentGrade').value, // ADD THIS LINE
        section: document.getElementById('studentSection').value
    };
    
    const qrData = JSON.stringify(studentData);
    
    // Clear previous QR code
    document.getElementById("qrcode").innerHTML = "";
    
    // Generate new QR code
    qrcode = new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
    
    // Save to localStorage
    localStorage.setItem("studentQR", qrData);
    
    // Navigate to QR section
    pageHistory.push(qrCodeSection);
    studentInfoConfirmSection.classList.add('hidden');
    qrCodeSection.classList.remove('hidden');
    
    // Enable QR Done button
    qrDoneBtn.disabled = false;
    qrDoneBtn.classList.remove('btn-disabled');
    qrDoneBtn.classList.add('btn-primary');
    
    updateBackButton();
    
    // Show trouble section
    document.getElementById('troubleSection').classList.remove('hidden');
});

confirmNoBtn.addEventListener('click', () => {
    pageHistory.pop();
    studentInfoConfirmSection.classList.add('hidden');
    studentInfoSection.classList.remove('hidden');
    updateBackButton();
});

// IDAGDAG ANG EVENT LISTENER NA ITO PARA SA confirmYesBtn:
confirmYesBtn.addEventListener('click', () => {
    // Generate QR Code from studentData
    const qrData = JSON.stringify(studentData);
    
    // Clear previous QR code
    document.getElementById("qrcode").innerHTML = "";
    
    // Generate new QR code
    qrcode = new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
    
    // Save to localStorage
    localStorage.setItem("studentQR", qrData);
    
    // Navigate to QR section
    pageHistory.push(qrCodeSection);
    studentInfoConfirmSection.classList.add('hidden');
    qrCodeSection.classList.remove('hidden');
    
    // Enable QR Done button
    qrDoneBtn.disabled = false;
    qrDoneBtn.classList.remove('btn-disabled');
    qrDoneBtn.classList.add('btn-primary');
    
    updateBackButton();
    
    // Show trouble section
    document.getElementById('troubleSection').classList.remove('hidden');
});
// Verifying a Teacher
let teacherData = {};
teacherVerifyBtn.addEventListener('click', () => {
pageHistory.push(teacherLoginStep);
teacherVerifySection.classList.add('hidden');
teacherLoginStep.classList.remove('hidden');
updateBackButton();
});
function validateTeacherLogin(){
teacherLoginContinueBtn.disabled = !(teacherNameInput.value.trim() &&
teacherPasswordInput.value.trim());
}
teacherNameInput.addEventListener("input", validateTeacherLogin);
teacherPasswordInput.addEventListener("input", validateTeacherLogin);
teacherLoginFormStep.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = teacherNameInput.value.trim();
    const password = teacherPasswordInput.value.trim();
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    // Show loading
    teacherLoginContinueBtn.disabled = true;
    teacherLoginContinueBtn.textContent = 'Logging in...';
    
    // Use MockAPI for mobile
    const result = MockAPI.login(username, password);
    
    if (result.success) {
        // Save teacher data
        localStorage.setItem('teacherData', JSON.stringify(result.user));
        
        // Redirect to teacher bookmark
        pageHistory.push(teacherBookmark);
        teacherLoginStep.classList.add('hidden');
        teacherBookmark.classList.remove('hidden');
        updateBackButton();
        
        // Show logout button
        document.getElementById('logoutBtn')?.classList.remove('hidden');
    } else {
        alert(result.message);
    }
    
    // Reset button
    teacherLoginContinueBtn.disabled = false;
    teacherLoginContinueBtn.textContent = 'Continue';
});

teacherClassForm.addEventListener('input', () => {
    const allFilled = 
        teacherSectionInput.value.trim() && 
        teacherScheduleStart.value &&
        teacherScheduleEnd.value && 
        teacherDate.value && 
        teacherStrandCategorySelect.value &&
        teacherStrandSelect.value &&
        teacherGradeSelect.value;
    
    teacherClassForm.querySelector('button[type="submit"]').disabled = !allFilled;
});
teacherClassForm.addEventListener('submit', e => {
    e.preventDefault();
    
    teacherData.section = teacherSectionInput.value.trim();
    teacherData.schedule = teacherScheduleStart.value + " - " + teacherScheduleEnd.value;
    teacherData.date = teacherDate.value;
    teacherData.strandCategory = teacherStrandCategorySelect.value;
    teacherData.strand = teacherStrandSelect.value;
    teacherData.grade = teacherGradeSelect.value;
    
    pageHistory.push(teacherAttendanceStep);
    teacherClassInfoStep.classList.add('hidden');
    teacherAttendanceStep.classList.remove('hidden');
    updateBackButton();
});

// Teachers Section
teacherClassForm.addEventListener('input', () => {
const allFilled = teacherSectionInput.value.trim() && teacherScheduleStart.value &&
teacherScheduleEnd.value && teacherDate.value && teacherStrandCategorySelect.value
&& teacherStrandSelect.value;
teacherClassForm.querySelector('button[type="submit"]').disabled = !allFilled;
});
teacherClassForm.addEventListener('submit', e => {
e.preventDefault();
teacherData.section = teacherSectionInput.value.trim();
teacherData.schedule = teacherScheduleStart.value + " - " + teacherScheduleEnd.value;
teacherData.date = teacherDate.value;
teacherData.strandCategory = teacherStrandCategorySelect.value;
teacherData.strand = teacherStrandSelect.value;
pageHistory.push(teacherAttendanceStep);
teacherClassInfoStep.classList.add('hidden');
teacherAttendanceStep.classList.remove('hidden');
updateBackButton();
});
// Teachers Section
teacherAttendanceForm.addEventListener('input', () => {
const allFilled = lateTime.value && absentTime.value;
teacherAttendanceForm.querySelector('button[type="submit"]').disabled = !allFilled;
});
teacherAttendanceForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const teacher = SimpleLogin.getCurrentTeacher();
    
    if (teacher) {
        teacherData.name = teacher.fullName;
    } else {
        teacherData.name = "Teacher";
    }
    
    if (teacherData.grade) {
    
        
    } else {
        teacherData.grade = "Grade 11";
    }
    
    teacherData.late = "Late: " + lateTime.value;
    teacherData.absent = "Absent: " + absentTime.value;
    
    // Navigate to confirmation
    pageHistory.push(teacherConfirmStep);
    teacherAttendanceStep.classList.add('hidden');
    
    // Update confirmation display
    confirmTeacherName.textContent = "Name: " + teacherData.name;
    confirmTeacherSection.textContent = "Section: " + teacherData.section;
    confirmTeacherSchedule.textContent = "Schedule: " + teacherData.schedule;
    confirmTeacherDateTime.textContent = "Date: " + teacherData.date;
    
    // Add grade to confirmation
    let gradeDisplay = document.getElementById('confirmTeacherGrade');
    if (!gradeDisplay) {
        gradeDisplay = document.createElement('p');
        gradeDisplay.id = 'confirmTeacherGrade';
        gradeDisplay.className = 'text-blue-700 dark:text-blue-300';
        
        // Insert in correct order
        const sectionElement = document.getElementById('confirmTeacherSection');
        if (sectionElement && sectionElement.parentNode) {
            // Insert after section
            sectionElement.parentNode.insertBefore(gradeDisplay, sectionElement.nextSibling);
        }
    }
    gradeDisplay.textContent = "Grade: " + teacherData.grade;
    
    confirmAttendanceMarks.textContent = teacherData.late + " | " + teacherData.absent;
    
    teacherConfirmStep.classList.remove('hidden');
    teacherConfirmBtn.disabled = false;
    teacherConfirmBtn.classList.remove('btn-disabled');
    teacherConfirmBtn.classList.add('btn-primary');
    updateBackButton();
});
// Report a problem Flow
const troubleSection = document.getElementById("troubleSection");
const troubleBtn = document.getElementById("troubleBtn");
const troubleOptions = document.getElementById("troubleOptions");
const troubleYes = document.getElementById("troubleYes");
const troubleNo = document.getElementById("troubleNo");
const troubleYesBox = document.getElementById("troubleYesBox");
if (troubleBtn) troubleBtn.addEventListener("click", () => {
troubleOptions.classList.remove("hidden"); });
if (troubleYes) troubleYes.addEventListener("click", () => {
troubleYesBox.classList.remove("hidden"); });
if (troubleNo) troubleNo.addEventListener("click", () => {
troubleOptions.classList.add("hidden");
troubleYesBox.classList.add("hidden");
qrCodeSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

const regenerateQrBtn = document.getElementById("regenerateQrBtn");
if (regenerateQrBtn) regenerateQrBtn.addEventListener("click", () => {
    const desc = document.getElementById("troubleDescription").value.trim();
    
    if (!desc) { 
        alert("Please describe your problem first."); 
        return; 
    }
    
    // Check regeneration count
    let regenerateCount = parseInt(localStorage.getItem('qrRegenerateCount') || '0');
    regenerateCount++;
    localStorage.setItem('qrRegenerateCount', regenerateCount.toString());
    
    // If 2nd time or more, show warning and redirect
    if (regenerateCount >= 2) {
        // Show custom warning modal
        showRegenerationWarning(desc, studentData, regenerateCount);
        return;
    }
    
    // First time regeneration - proceed normally
    const newQRData = JSON.stringify({ 
        ...studentData, 
        issue: desc, 
        regenerated: true,
        regenerateCount: regenerateCount,
        lastRegeneration: new Date().toISOString()
    });
    
    localStorage.setItem("studentQR", newQRData);
    document.getElementById("qrcode").innerHTML = "";
    
    qrcode = new QRCode(document.getElementById("qrcode"), { 
        text: newQRData, 
        width: 250,
        height: 250 
    });
    
    alert("Your QR has been regenerated successfully!");
    
    // Clear the description
    document.getElementById("troubleDescription").value = "";
});


function showRegenerationWarning(issueDescription, studentData, count) {
    // Get the saved student data from localStorage
    let savedStudent = null;
    try {
        const savedQR = localStorage.getItem('studentQR');
        if (savedQR) {
            savedStudent = JSON.parse(savedQR);
        }
    } catch (e) {
        console.error('Error parsing saved student QR:', e);
    }
    
    // Use saved data if available, otherwise use current studentData
    const displayData = savedStudent || studentData;
    
    // Create beautiful warning modal
    const modalHTML = `
        <div id="regenerateWarningModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <!-- Header with warning icon -->
                <div class="flex items-center justify-center mb-4">
                    <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                    Multiple QR Regeneration Detected
                </h3>
                
                <!-- Message -->
                <div class="mb-6 text-center">
                    <p class="text-gray-600 dark:text-gray-400 mb-3">
                        You've regenerated your QR code <span class="font-bold text-yellow-600">${count} times</span>.
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        This might indicate a technical issue. For better assistance, please contact our support team.
                    </p>
                </div>
                
                <!-- Student Info -->
                <div class="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <p class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Student Information:</p>
                    <p class="text-sm font-bold text-gray-800 dark:text-gray-200">${displayData.name || 'Unknown Student'}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">Student ID: ${displayData.number || 'Not specified'}</p>
                    ${displayData.strand ? `<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">${displayData.strand} • ${displayData.section || ''}</p>` : ''}
                </div>
                
                <!-- Issue Reported -->
                <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-6">
                    <p class="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-1">Issue Reported:</p>
                    <p class="text-xs text-yellow-700 dark:text-yellow-400">${issueDescription || 'No description provided'}</p>
                </div>
                
                <!-- Buttons -->
                <div class="grid grid-cols-2 gap-3">
                    <!-- Cancel Button -->
                    <button id="cancelRegenerateBtn" 
                            class="py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 
                                   text-gray-700 dark:text-gray-300 font-medium 
                                   hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        Cancel
                    </button>
                    
                    <!-- Contact Support Button -->
                    <button id="goToContactBtn" 
                            class="py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 
                                   text-white font-medium transition">
                        Contact Support
                    </button>
                </div>
                
                <!-- Footer Note -->
                <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                    For technical assistance and faster resolution
                </p>
            </div>
        </div>
    `;
    
    // Add modal to page
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        #regenerateWarningModal {
            animation: fadeIn 0.3s ease-out;
        }
        
        #regenerateWarningModal > div {
            animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Button Events
    document.getElementById('cancelRegenerateBtn').addEventListener('click', () => {
        modalDiv.remove();
        style.remove();
    });
    
    document.getElementById('goToContactBtn').addEventListener('click', () => {
        modalDiv.remove();
        style.remove();
        
        // Redirect to Contact Section
        redirectToContactSection(issueDescription, displayData, count);
    });
    
    // Close on background click
    modalDiv.addEventListener('click', (e) => {
        if (e.target.id === 'regenerateWarningModal') {
            modalDiv.remove();
            style.remove();
        }
    });
}

function redirectToContactSection(issueDescription, studentData, regenerateCount) {
    console.log("Redirecting to Contact Section...");
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show contact section
    const contactSection = document.getElementById('contactSection');
    if (contactSection) {
        contactSection.classList.remove('hidden');
        
        // Update page history
        pageHistory.push(contactSection);
        updateBackButton();
        
        // Auto-fill contact form
        setTimeout(() => {
            
            const contactName = document.getElementById('contactName');
            const contactEmail = document.getElementById('contactEmail');
            const contactMessage = document.getElementById('contactMessage');
            
            if (contactName && contactMessage) {
                // Auto-fill student name
                contactName.value = studentData.name || '';
                
                // Auto-generate email from student number
                if (studentData.number && contactEmail) {
                    const cleanNumber = studentData.number.replace(/[^0-9]/g, '').substring(0, 8);
                    contactEmail.value = `${cleanNumber}@gmail.com`;
                }
            
                // Auto-fill message with detailed issue
                const autoMessage = `
QR CODE REGENERATION ISSUE - URGENT

STUDENT INFORMATION:
• Name: ${studentData.name || 'Not provided'}
• Student Number: ${studentData.number || 'Not provided'}
• Strand: ${studentData.strand || 'Not provided'}
• Section: ${studentData.section || 'Not provided'}

TECHNICAL DETAILS:
• Regeneration Attempts: ${regenerateCount} times
• Last Attempt: ${new Date().toLocaleString()}
• Issue Description: ${issueDescription}

PLEASE ASSIST WITH:
1. QR code not scanning properly
2. Multiple regeneration attempts needed
3. Technical support required

ADDITIONAL NOTES:
This is an automated report from the QR regeneration system.
`.trim();
                
                contactMessage.value = autoMessage;
                
                // Scroll to contact form
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the message area
                contactMessage.style.border = '2px solid #3b82f6';
                contactMessage.style.backgroundColor = '#f0f9ff';
                
                setTimeout(() => {
                    contactMessage.style.border = '';
                    contactMessage.style.backgroundColor = '';
                }, 3000);
                
                console.log("✅ Contact form auto-filled with regeneration details");
            }
        }, 300);
    } else {
        console.error("Contact section not found!");
        alert("Contact section not available. Please navigate manually.");
    }
}
// Scanner Code Section
let stream = null;
let scanning = false;
let scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
let lastScannedCode = null;
function renderScannedCodes() {
    qrResults.innerHTML = '';
  //  document.getElementById('scanCount').textContent = `(${scannedCodes.length})`;
    if (scannedCodes.length === 0) {
        qrResults.innerHTML = '<div class="text-center text-gray-500 dark:text-gray-400 text-sm py-10 italic">No students scanned yet</div>';
        return;
    }

    // Show latest on top
    scannedCodes.slice().reverse().forEach(code => {
        const div = document.createElement('div');
        div.className = 'p-4 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200';

        try {
            const info = JSON.parse(code.data);
            const time = new Date(code.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', minute: '2-digit' 
            });

            // Sa renderScannedCodes() function (around line 680-720):
div.innerHTML = `
    <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-900 dark:text-gray-100 truncate">${info.name || 'Unknown'}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">${info.number || '—'}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                ${info.strand || ''} ${info.section ? '• ' + info.section : ''}
            </div>
        <div class="text-right shrink-0">
            <div class="text-xs font-medium text-blue-600 dark:text-blue-400">${time}</div>
        </div>
    </div>
`;
        } catch {
            div.innerHTML = `<div class="text-sm text-red-600 dark:text-red-400">Invalid QR Code</div>`;
        }
        qrResults.appendChild(div);
    });
}
clearHistoryBtn.addEventListener('click', () => {
if (confirm('Clear all scanned QR codes?')) {
scannedCodes = [];
localStorage.setItem('scannedQRCodes', JSON.stringify(scannedCodes));
renderScannedCodes();
}
});
startScannerBtn.addEventListener('click', startCamera);
async function startCamera() {
try {
startScannerBtn.textContent = 'Starting Camera...';
startScannerBtn.disabled = true;
stream = await navigator.mediaDevices.getUserMedia({
video: {
facingMode: 'environment',
width: { ideal: 640 },
height: { ideal: 480 }
}
});
teacherVideo.srcObject = stream;
teacherVideo.addEventListener('loadedmetadata', () => {
overlay.width = teacherVideo.videoWidth;
overlay.height = teacherVideo.videoHeight;
scanning = true;
lastScannedCode = null;
startScannerBtn.textContent = 'Scanning...';
scanQR();
}, { once: true });
teacherVideo.play();
} catch (err) {
console.error('CAMERA ERROR:', err);
alert('CAMERA NOT WORKING!\n\n1. Check camera permission\n2. Try different browser\n3. Mobile = Use Chrome');
startScannerBtn.textContent = 'Start Camera';
startScannerBtn.disabled = false;
}
}
function stopCamera() {
scanning = false;
lastScannedCode = null;
if (stream) {
stream.getTracks().forEach(track => track.stop());
stream = null;
}
startScannerBtn.textContent = 'Start Camera';
startScannerBtn.disabled = false;
qrModal.style.display = 'none';
}
function scanQR() {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
function loop() {
if (!scanning) return;
if (teacherVideo.readyState === teacherVideo.HAVE_ENOUGH_DATA) {
canvas.width = teacherVideo.videoWidth;
canvas.height = teacherVideo.videoHeight;
ctx.drawImage(teacherVideo, 0, 0, canvas.width, canvas.height);
overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const code = jsQR(imageData.data, imageData.width, imageData.height);
   // Hanapin ang linyang ito (around line 720-760):
if (code && code.data !== lastScannedCode) {
    lastScannedCode = code.data;

    let studentInfo = {};
    try {
        studentInfo = JSON.parse(code.data);
    } catch (e) {
        studentInfo = { name: "Invalid QR Code", number: "N/A" };
    }
   
   // Sa scanQR() function, idagdag ito pagkatapos mag-save:
// AFTER saving to scannedCodes, add:

// Sa scanQR() function, palitan ang AttendanceSync.saveScanForStudent() ng:

// Save to CROSS-DEVICE SERVER
CrossDeviceSync.saveScanToServer({
    studentName: studentInfo.name,
    studentNumber: studentInfo.number,
    strand: studentInfo.strand,
    section: studentInfo.section,
    grade: studentInfo.grade,
    scannedBy: studentInfo.scannedBy || 'Unknown Teacher',
    scannedByUsername: studentInfo.scannedByUsername || '',
    timestamp: new Date().toISOString(),
    location: 'School',
    type: 'QR Scan',
    teacherDevice: CrossDeviceSync.getDeviceId()
});

console.log(`✅ Scan saved to server for student ${studentInfo.number}`);
    
    // DAGDAGAN NG TEACHER NAME DITO:
    // Get current teacher
    const teacher = SimpleLogin.getCurrentTeacher();
    if (teacher) {
        studentInfo.scannedBy = teacher.fullName || teacher.username;
        studentInfo.scannedByUsername = teacher.username;
    }
    
    // Save the updated data
    const updatedQRData = JSON.stringify(studentInfo);

// Success Modal with Teacher Name
qrModalText.innerHTML = `
    <div class="text-center">
        <p class="text-2xl font-bold text-green-600">${studentInfo.name || 'Unknown Student'}</p>
        <p class="text-lg text-gray-700">${studentInfo.number || ''}</p>
        <p class="text-sm text-green-500 font-bold mt-2">Attendance Recorded!</p>
    </div>
`;
    qrModal.classList.remove('hidden');

    // Saved locally (offline backup)
    const timestamp = new Date().toLocaleString();
    if (!scannedCodes.some(item => item.data === code.data)) {
        scannedCodes.unshift({
            data: code.data,
            timestamp: timestamp,
            name: studentInfo.name || 'Unknown'
        });
        // Keep only last 10
        if (scannedCodes.length > 10) scannedCodes.pop();

        localStorage.setItem('scannedQRCodes', JSON.stringify(scannedCodes));
        renderScannedCodes();
    }

    // Auto-hide after 2.5 seconds
    setTimeout(() => {
        qrModal.classList.add('hidden');
        lastScannedCode = null;
    }, 2500);
}
}
requestAnimationFrame(loop);
}
loop();
}
backToRoleTeacher.addEventListener('click', () => {
stopCamera();
pageHistory = []; // -- Reset to roles
teacherScannerSection.classList.add('hidden');
resetRoleSelection();
roleSelection.classList.remove('hidden');
});
window.addEventListener('pagehide', stopCamera);
renderScannedCodes();

const academicTrackCard = document.getElementById("academicTrackCard");
const tvlTrackCard = document.getElementById("tvlTrackCard");
const trackModalOverlay = document.getElementById("trackModalOverlay");
const trackModal = document.getElementById("trackModal");
const modalStrandGrid = document.getElementById("modalStrandGrid");
const gradeSectionContainer = document.getElementById("gradeSectionContainer");
const grade11Btn = document.getElementById("grade11Btn");
const grade12Btn = document.getElementById("grade12Btn");
const sectionButtons = document.getElementById("sectionButtons");
const continueToScheduleBtn = document.getElementById("continueToScheduleBtn");
const goToScannerBtn = document.getElementById("goToScannerBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let selectedTrack = null, selectedStrand = null, selectedGrade = "Grade 12", selectedSection = null;
const lastClassData = JSON.parse(localStorage.getItem("lastTeacherClass") || "null");

const sectionsCount = {
    "STEM": { 11: 6, 12: 5 },
    "ABM": { 11: 4, 12: 3 },
    "HUMSS": { 11: 3, 12: 4 },
    "GAS": { 11: 1, 12: 1 },
    "ICT": { 11: 1, 12: 2 },
    "HRCTO": { 11: 3, 12: 3 }
};

function openModal(track) {
    selectedTrack = track;
    selectedStrand = null;
    selectedSection = null;
    modalStrandGrid.innerHTML = "";
    gradeSectionContainer.classList.add("hidden");
    continueToScheduleBtn.disabled = true;
    continueToScheduleBtn.classList.add("opacity-60");
    goToScannerBtn.disabled = true;
    goToScannerBtn.classList.add("bg-gray-300", "text-gray-600", "cursor-not-allowed");

    const strands = track === "Academic Strand" ? ["STEM", "ABM", "HUMSS", "GAS"] : ["HRCTO", "ICT"];
    strands.forEach(s => {
        const btn = document.createElement("button");
        btn.className = "px-8 py-6 rounded-full border-4 border-blue-300 text-blue-700 font-bold text-xl hover:border-blue-600 transition-all";
        btn.textContent = s;
        btn.onclick = () => {
            modalStrandGrid.querySelectorAll("button").forEach(b => b.classList.remove("border-blue-600", "bg-blue-50"));
            btn.classList.add("border-blue-600", "bg-blue-50");
            selectedStrand = s;
            gradeSectionContainer.classList.remove("hidden");
            showSections(s, 12);
        };
        modalStrandGrid.appendChild(btn);
    });

    trackModalOverlay.classList.remove("hidden");
    setTimeout(() => trackModal.classList.replace("opacity-0", "opacity-100"), 50);
}

function showSections(strand, gradeNum) {
    selectedGrade = gradeNum === 11 ? "Grade 11" : "Grade 12";
    sectionButtons.innerHTML = "";
    const count = sectionsCount[strand]?.[gradeNum] || 1;

    for (let i = 1; i <= count; i++) {
        const btn = document.createElement("button");
        btn.className = "px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-full transition-all";
        btn.textContent = `Section ${i}`;
        btn.onclick = () => {
            sectionButtons.querySelectorAll("button").forEach(b => b.classList.remove("ring-4", "ring-blue-300"));
            btn.classList.add("ring-4", "ring-blue-300");
            selectedSection = `Section ${i}`;
            teacherData.strandCategory = selectedTrack;
            teacherData.strand = strand;
            teacherData.section = selectedSection;
            teacherData.grade = selectedGrade;

            continueToScheduleBtn.disabled = false;
            continueToScheduleBtn.classList.remove("opacity-60");

            if (lastClassData && lastClassData.strand === strand && lastClassData.section === selectedSection && lastClassData.grade === selectedGrade) {
                goToScannerBtn.disabled = false;
                goToScannerBtn.classList.remove("bg-gray-300", "text-gray-600", "cursor-not-allowed");
                goToScannerBtn.classList.add("bg-blue-600", "hover:bg-blue-700", "text-white");
            }
        };
        sectionButtons.appendChild(btn);
    }
}

grade11Btn.onclick = () => { grade11Btn.classList.add("border-blue-600", "bg-blue-100"); grade12Btn.classList.remove("border-blue-600", "bg-blue-100"); if(selectedStrand) showSections(selectedStrand, 11); };
grade12Btn.onclick = () => { grade12Btn.classList.add("border-blue-600", "bg-blue-100"); grade11Btn.classList.remove("border-blue-600", "bg-blue-100"); if(selectedStrand) showSections(selectedStrand, 12); };

academicTrackCard.onclick = () => openModal("Academic Strand");
tvlTrackCard.onclick = () => openModal("Technical Vocational Livelihood");

function closeModal() {
    trackModal.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => trackModalOverlay.classList.add("hidden"), 300);
}
closeModalBtn.onclick = closeModal;
trackModalOverlay.onclick = e => e.target === trackModalOverlay && closeModal();

continueToScheduleBtn.onclick = () => {
    localStorage.setItem("lastTeacherClass", JSON.stringify({
        strandCategory: selectedTrack,
        strand: selectedStrand,
        section: selectedSection,
        grade: selectedGrade
    }));
    
    Object.assign(teacherData, {
        strandCategory: selectedTrack,
        strand: selectedStrand,
        section: selectedSection,
        grade: selectedGrade
    });
    
    pageHistory.push(teacherClassInfoStep);
    teacherBookmark.classList.add('hidden');
    teacherClassInfoStep.classList.remove('hidden');

    teacherStrandCategorySelect.value = selectedTrack;
    teacherStrandCategorySelect.dispatchEvent(new Event("change"));
    
    setTimeout(() => {
        teacherStrandSelect.value = selectedStrand;
        teacherGradeSelect.value = selectedGrade; // AUTO-FILL ANG GRADE
        teacherSectionInput.value = selectedSection;
    }, 100);
    
    closeModal();
    updateBackButton();
};

goToScannerBtn.onclick = () => {
    if (!lastClassData) return;
    
    Object.assign(teacherData, lastClassData);
    closeModal();
    
    if (teacherGradeSelect && lastClassData.grade) {
        teacherGradeSelect.value = lastClassData.grade;
    }
    
    pageHistory.push(teacherScannerSection); 
    teacherBookmark.classList.add('hidden'); 
    teacherScannerSection.classList.remove('hidden');
    
    scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]'); 
    renderScannedCodes(); 
    updateBackButton();
};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const toggleKnob = document.getElementById('toggleKnob');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    // Load saved theme only (hindi na titingin sa system)
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        toggleKnob.style.transform = 'translateX(28px)';
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        toggleKnob.style.transform = 'translateX(0)';
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light'); // force save
    }

    // Toggle manually lang
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            localStorage.setItem('theme', 'dark');
            toggleKnob.style.transform = 'translateX(28px)';
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('theme', 'light');
            toggleKnob.style.transform = 'translateX(0)';
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });

});
    
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
                toggleKnob.style.transform = 'translateX(28px)';
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                document.documentElement.classList.remove('dark');
                toggleKnob.style.transform = 'translateX(0)';
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    });

// ABOUT & CONTACT
document.getElementById('aboutBtn').addEventListener('click', () => {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('aboutSection').classList.remove('hidden');
    pageHistory.push(document.getElementById('aboutSection'));
    updateBackButton();
});

document.getElementById('contactBtn').addEventListener('click', () => {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('contactSection').classList.remove('hidden');
    pageHistory.push(document.getElementById('contactSection'));
    updateBackButton();
});

// Auto: 4 digits → dash, 8 digits → + -ICPMY
function formatWithDashAndICPMY(input) {
    // Remove everything except numbers
    let digits = input.value.replace(/[^0-9]/g, '').substring(0,8);
    
    // Add dash after 4 digits
    if (digits.length > 4) {
        digits = digits.substring(0,4) + '-' + digits.substring(4);
    }
    
    // If exactly 8 digits → add -ICPMY
    if (digits.length === 9) { // 4 + '-' + 4 = 9 characters
        input.value = digits + '-ICPMY';
    } else {
        input.value = digits;
    }
}

// Block submit kung wala pang -ICPMY
document.getElementById('studentInfoForm').addEventListener('submit', function(e) {
    const val = document.getElementById('studentNumber').value;
    if (!val.includes('-ICPMY')) {
        e.preventDefault();
        alert('Please type your 8-digit ID number.\nIt will auto-format to: 2024-0001-ICPMY');
        document.getElementById('studentNumber').focus();
    }
});


document.getElementById('togglePassword')?.addEventListener('click', function () {
    const passwordInput = document.getElementById('teacherPasswordStep');
    const eyeIcon = document.getElementById('eyeIcon');           // Open eye = HIDE password
    const eyeSlashIcon = document.getElementById('eyeSlashIcon'); // Closed eye = SHOW password

    if (passwordInput.type === 'password') {
        // From hidden → show password
        passwordInput.type = 'text';
        eyeIcon.classList.add('hidden');
        eyeSlashIcon.classList.remove('hidden');
    } else {
        // From visible → hide password
        passwordInput.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyeSlashIcon.classList.add('hidden');
    }
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileAboutBtn = document.getElementById('mobileAboutBtn');
const mobileContactBtn = document.getElementById('mobileContactBtn');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

// Toggle mobile menu
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Mobile menu buttons functionality
if (mobileAboutBtn) {
    mobileAboutBtn.addEventListener('click', () => {
        document.getElementById('aboutBtn').click();
        mobileMenu.classList.add('hidden');
    });
}

if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', () => {
        document.getElementById('contactBtn').click();
        mobileMenu.classList.add('hidden');
    });
}

if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', () => {
        document.getElementById('logoutBtn').click();
        mobileMenu.classList.add('hidden');
    });
}

// Update mobile logout button visibility
function updateMobileLogoutButton() {
    const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (teacherData.username) {
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
    } else {
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
    }
}

// Check login status periodically
setInterval(updateMobileLogoutButton, 2000);

// Load TeacherDB script
function loadTeacherDB() {
    console.log("Teacher Database loaded");
}

// Enhanced Teacher Login with Database
teacherLoginFormStep.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = teacherNameInput.value.trim();
    const password = teacherPasswordInput.value.trim();
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    // Show loading
    teacherLoginContinueBtn.disabled = true;
    teacherLoginContinueBtn.textContent = 'Logging in...';
    
    // Use Teacher Database
    const result = TeacherDB.login(username, password);
    
    if (result.success) {
        // Save current teacher
        TeacherDB.setCurrentTeacher(result.teacher);
        
        // Show welcome message
        const teacherName = result.teacher.fullName || result.teacher.username;
        
        // Update navbar with teacher info
        updateNavbarForTeacher(result.teacher);
        
        // Continue to next step
        pageHistory.push(teacherBookmark);
        teacherLoginStep.classList.add('hidden');
        teacherBookmark.classList.remove('hidden');
        updateBackButton();
        
        // Show welcome alert
        setTimeout(() => {
            alert(`Welcome, ${teacherName}!`);
        }, 500);
        
    } else {
        alert(result.message);
    }
    
    // Reset button
    teacherLoginContinueBtn.disabled = false;
    teacherLoginContinueBtn.textContent = 'Continue';
});

// Update navbar to show teacher info
function updateNavbarForTeacher(teacher) {
    const topNav = document.getElementById('topNav');
    
    // Add teacher badge if not exists
    if (!document.getElementById('teacherBadge')) {
        const badge = document.createElement('div');
        badge.id = 'teacherBadge';
        badge.className = 'hidden md:flex items-center space-x-2 ml-4';
        badge.innerHTML = `
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ${teacher.fullName ? teacher.fullName.charAt(0) : 'T'}
            </div>
            <span class="text-sm text-blue-700 dark:text-blue-300 font-medium">
                ${teacher.fullName || teacher.username}
            </span>
        `;
        
        // Insert before theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.parentNode.insertBefore(badge, themeToggle);
    }
    
    // Show logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.classList.remove('hidden');
    }
}

// Enhanced logout function
async function logoutTeacher() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear teacher data
        TeacherDB.logout();
        
        // Hide teacher badge
        const badge = document.getElementById('teacherBadge');
        if (badge) {
            badge.remove();
        }
        
        // Hide logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.classList.add('hidden');
        }
        
        // logout flow
        pageHistory = [];
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        roleSelection.classList.remove('hidden');
        resetRoleSelection();
        updateBackButton();
        
        alert('Logged out successfully!');
    }
}

// Save scanned students to teacher's database
function saveScanToTeacherDB(qrData) {
    const currentTeacher = TeacherDB.getCurrentTeacher();
    
    if (currentTeacher) {
        const result = TeacherDB.saveScannedStudent(currentTeacher.id, qrData);
        console.log("Saved to teacher DB:", result);
        
        // Update teacher stats in navbar if exists
        updateTeacherStats();
    }
}

// Update teacher stats display
function updateTeacherStats() {
    const currentTeacher = TeacherDB.getCurrentTeacher();
    if (!currentTeacher) return;
    
    const stats = TeacherDB.getTeacherStats(currentTeacher.id);
    
    // Update stats badge if exists
    let statsBadge = document.getElementById('teacherStatsBadge');
    if (!statsBadge) {
        statsBadge = document.createElement('div');
        statsBadge.id = 'teacherStatsBadge';
        statsBadge.className = 'hidden md:block text-xs text-gray-600 dark:text-gray-400 ml-2';
        const teacherBadge = document.getElementById('teacherBadge');
        if (teacherBadge) {
            teacherBadge.appendChild(statsBadge);
        }
    }
    
    statsBadge.innerHTML = `📊 ${stats.todayScans} today`;
}

// Save class settings to teacher DB
function saveClassSettingsToDB(settings) {
    const currentTeacher = TeacherDB.getCurrentTeacher();
    
    if (currentTeacher) {
        const result = TeacherDB.saveClassSettings(currentTeacher.id, settings);
        console.log("Class settings saved:", result);
    }
}

// Export teacher data
function exportTeacherData() {
    const currentTeacher = TeacherDB.getCurrentTeacher();
    
    if (!currentTeacher) {
        alert('Please login first!');
        return;
    }
    
    const data = TeacherDB.exportTeacherData(currentTeacher.id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `icheckpass_${currentTeacher.username}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Data exported for ${currentTeacher.fullName || currentTeacher.username}`);
}

// Load on page ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if teacher is already logged in
    const currentTeacher = TeacherDB.getCurrentTeacher();
    if (currentTeacher) {
        updateNavbarForTeacher(currentTeacher);
        updateTeacherStats();
        
        // If on teacher section, show teacher name
        if (teacherScannerSection && !teacherScannerSection.classList.contains('hidden')) {
            const welcomeText = document.createElement('p');
            welcomeText.className = 'text-center text-blue-600 dark:text-blue-400 mb-4';
            welcomeText.textContent = `Logged in as: ${currentTeacher.fullName || currentTeacher.username}`;
            teacherScannerSection.prepend(welcomeText);
        }
    }
    
    loadTeacherDB();
});

// Override teacher login
teacherLoginFormStep.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = teacherNameInput.value.trim();
    const password = teacherPasswordInput.value.trim();
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    // Check credentials
    const result = SimpleLogin.checkLogin(username, password);
    
    if (result.success) {
        // Save teacher name for display
        localStorage.setItem('teacher_name', result.teacher.fullName);
        
        // Your existing code - continue to next step
        pageHistory.push(teacherBookmark);
        teacherLoginStep.classList.add('hidden');
        teacherBookmark.classList.remove('hidden');
        updateBackButton();
    }
});

// Show teacher name in scanner
function showTeacherNameInScanner() {
    const teacher = SimpleLogin.getCurrentTeacher();
    if (teacher && teacherScannerSection) {
        const teacherNameDiv = document.createElement('div');
        teacherNameDiv.className = 'text-center mb-4';
        teacherNameDiv.innerHTML = `
            <p class="text-blue-700 dark:text-blue-300 font-semibold">
                 Teacher: ${teacher.fullName}
            </p>
        `;
        
        // Add to scanner section if not already there
        if (!document.getElementById('teacherNameDisplay')) {
            teacherNameDiv.id = 'teacherNameDisplay';
            teacherScannerSection.querySelector('.container').prepend(teacherNameDiv);
        }
    }
}

// Check if teacher is logged in
function checkTeacherLogin() {
    return SimpleLogin.isLoggedIn();
}

// Logout button
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Logout?')) {
            SimpleLogin.logout();
            localStorage.removeItem('teacher_name');
            location.reload(); // Simple reload
        }
    });
}

// Show logout button when teacher is logged in
setInterval(() => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        if (SimpleLogin.isLoggedIn()) {
            logoutBtn.classList.remove('hidden');
        } else {
            logoutBtn.classList.add('hidden');
        }
    }
}, 1000);

// Show teacher name in scanner if on that page
if (teacherScannerSection && !teacherScannerSection.classList.contains('hidden')) {
    showTeacherNameInScanner();
}

// Check if already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const isLoggedIn = SimpleLogin.isLoggedIn();
    const teacher = SimpleLogin.getCurrentTeacher();
    
    if (isLoggedIn && teacher) {
        // If on teacher role selection, skip login
        if (teacherVerifySection && !teacherVerifySection.classList.contains('hidden')) {
            skipToTeacherBookmark();
        }
        
        // If on login page, skip to teacher section
        if (teacherLoginStep && !teacherLoginStep.classList.contains('hidden')) {
            skipToTeacherBookmark();
        }
        
        // Show teacher name in scanner if already there
        if (teacherScannerSection && !teacherScannerSection.classList.contains('hidden')) {
            showTeacherNameInScanner();
        }
        
        // Show logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.classList.remove('hidden');
        }
    }
}

function skipToTeacherBookmark() {
    const teacher = SimpleLogin.getCurrentTeacher();
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Go directly to teacher bookmark
    if (teacherBookmark) {
        teacherBookmark.classList.remove('hidden');
        pageHistory = [teacherBookmark];
        updateBackButton();
        
        // Optional: Show welcome message
        console.log(`Welcome back, ${teacher.fullName}!`);
    }
}

// Override teacher login form
teacherLoginFormStep.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = teacherNameInput.value.trim();
    const password = teacherPasswordInput.value.trim();
    
    if (!username || !password) {
        alert('Pakilagay ang username at password');
        return;
    }
    
    // Show loading
    teacherLoginContinueBtn.disabled = true;
    teacherLoginContinueBtn.textContent = 'Logging in...';
    
    // Check credentials
    const result = SimpleLogin.checkLogin(username, password);
    
    if (result.success) {
        // Clear form
        teacherNameInput.value = '';
        teacherPasswordInput.value = '';
        
        // Show welcome modal
        showTeacherWelcomeModal(result.teacher);
        
    } else {
        teacherLoginContinueBtn.disabled = false;
        teacherLoginContinueBtn.textContent = 'Continue';
        alert(result.message || 'Invalid login credentials');
    }
});

function showTeacherWelcomeModal(teacher) {
    // Create modal HTML
    const modalHTML = `
        <div id="welcomeModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
            <div class="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-blue-100 dark:border-gray-700">
                
                <!-- Header with decorative top -->
                <div class="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                
                <div class="p-8">
                    <!-- Teacher Avatar & Info -->
                    <div class="flex flex-col items-center mb-6">
                        <div class="w-24 h-24 mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span class="text-white text-3xl font-bold">
                                ${teacher.fullName.charAt(0)}
                            </span>
                        </div>
                        
                        <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-300 text-center mb-2">
                            Welcome, ${teacher.fullName}!
                        </h3>
                        
                        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                          <span class="text-sm font-medium">${teacher.position || 'Senior High School'}</span>
                        </div>
                        
                        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-xs">${new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    
                    <!-- Welcome Message -->
                    <div class="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-5 mb-6 border border-blue-100 dark:border-blue-800/30">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-full">
                                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="text-blue-800 dark:text-blue-300 font-medium mb-1">Welcome Message</p>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">${teacher.welcomeMessage || "Ready to manage your class attendance!"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="grid grid-cols-3 gap-3 mb-6">
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Scanned Today</div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Present</div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700">
                            <div class="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Classes</div>
                        </div>
                    </div>
                    
                    <!-- Continue Button -->
                    <button id="enterDashboardBtn" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                        <div class="flex items-center justify-center gap-3">
                            <span>Enter Teacher Dashboard</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </div>
                    </button>
                    
                    <!-- Footer Note -->
                    <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                        iCheckPass Teacher Portal • ICP Meycauayan
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        #welcomeModal {
            animation: fadeIn 0.4s ease-out;
        }
        
        #welcomeModal > div {
            animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add button event
    document.getElementById('enterDashboardBtn').addEventListener('click', function() {
        // Add loading effect to button
        this.disabled = true;
        this.innerHTML = `
            <div class="flex items-center justify-center gap-3">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entering...</span>
            </div>
        `;
        
        // Close modal and proceed after 1 second
        setTimeout(() => {
            modalDiv.remove();
            style.remove();
            
            // Hide login section
            teacherLoginStep.classList.add('hidden');
            
            // Go to teacher bookmark
            teacherBookmark.classList.remove('hidden');
            pageHistory.push(teacherBookmark);
            updateBackButton();
            
            // Show logout button
            document.getElementById('logoutBtn')?.classList.remove('hidden');
            document.getElementById('mobileLogoutBtn')?.classList.remove('hidden');
            
            // Reset login button
            teacherLoginContinueBtn.disabled = false;
            teacherLoginContinueBtn.textContent = 'Continue';
        }, 1000);
    });
    
    // Close modal on background click
    modalDiv.addEventListener('click', function(e) {
        if (e.target.id === 'welcomeModal') {
            modalDiv.remove();
            style.remove();
        }
    });
}

// Teacher verify button, skip login if already logged in
teacherVerifyBtn.addEventListener('click', function() {
    if (SimpleLogin.isLoggedIn()) {
        // Already logged in, skip to bookmark
        teacherVerifySection.classList.add('hidden');
        teacherBookmark.classList.remove('hidden');
        pageHistory.push(teacherBookmark);
        updateBackButton();
    } else {
        // Not logged in, show login
        teacherVerifySection.classList.add('hidden');
        teacherLoginStep.classList.remove('hidden');
        pageHistory.push(teacherLoginStep);
        updateBackButton();
    }
});

// Show teacher name in scanner
function showTeacherNameInScanner() {
    const teacher = SimpleLogin.getCurrentTeacher();
    if (teacher && teacherScannerSection) {
        // Remove existing display if any
        const existingDisplay = document.getElementById('teacherNameDisplay');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        // Create new display
        const teacherNameDiv = document.createElement('div');
        teacherNameDiv.id = 'teacherNameDisplay';
        teacherNameDiv.className = 'text-center mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg';
        teacherNameDiv.innerHTML = `
            <p class="text-blue-700 dark:text-blue-300 font-semibold text-lg">
                👨‍🏫 Teacher: ${teacher.fullName}
            </p>
            <p class="text-sm text-blue-600 dark:text-blue-400">
                Logged in as ${teacher.username}
            </p>
        `;
        
        // Add to scanner section
        const container = teacherScannerSection.querySelector('.container');
        if (container) {
            const title = container.querySelector('h1');
            if (title) {
                title.parentNode.insertBefore(teacherNameDiv, title.nextSibling);
            } else {
                container.prepend(teacherNameDiv);
            }
        }
    }
}

// Logout function
function logoutTeacher() {
    if (confirm('Logout from iCheckPass?')) {
        SimpleLogin.logout();
        
        // Hide logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.classList.add('hidden');
        }
        
        // Remove teacher name from scanner
        const teacherDisplay = document.getElementById('teacherNameDisplay');
        if (teacherDisplay) {
            teacherDisplay.remove();
        }
        
        // Go back to role selection
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        
        roleSelection.classList.remove('hidden');
        resetRoleSelection();
        pageHistory = [roleSelection];
        updateBackButton();
        
        alert('Logged out successfully!');
    }
}

// Logout button event
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logoutTeacher);
}

// Also add logout to mobile menu if exists
if (document.getElementById('mobileLogoutBtn')) {
    document.getElementById('mobileLogoutBtn').addEventListener('click', logoutTeacher);
}

// Auto-hide login section if already logged in
setInterval(() => {
    if (SimpleLogin.isLoggedIn()) {
        // Hide login section if visible
        if (teacherLoginStep && !teacherLoginStep.classList.contains('hidden')) {
            teacherLoginStep.classList.add('hidden');
            teacherBookmark.classList.remove('hidden');
        }
        
        // Hide verify section if visible
        if (teacherVerifySection && !teacherVerifySection.classList.contains('hidden')) {
            teacherVerifySection.classList.add('hidden');
            teacherBookmark.classList.remove('hidden');
        }
        
        // Update mobile logout button
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.remove('hidden');
        }
    }
}, 500);

// ==============================================
// BEAUTIFUL LOGOUT FUNCTION (SAFE - NO DELETIONS)
// ==============================================

function beautifulLogout() {
    // 1. Create custom modal (NO BROWSER ALERT!)
    const modalHTML = `
        <div id="customLogoutModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all duration-300 scale-100">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Ready to logout?</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">You'll need to login again to access teacher features.</p>
                </div>
                <div class="flex gap-3">
                    <button id="cancelBtn" class="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
                    <button id="proceedBtn" class="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">Yes, Logout</button>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    document.getElementById('cancelBtn').addEventListener('click', () => {
        modalDiv.remove();
    });
        
    document.getElementById('proceedBtn').addEventListener('click', () => {
        const modalContent = document.querySelector('#customLogoutModal > div');
        
        // Show loading
        modalContent.innerHTML = `
            <div class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div class="loader-medium"></div>
                </div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Logging out...</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Please wait a moment</p>
            </div>
        `;
        
        // Add loader style
        const style = document.createElement('style');
        style.textContent = `
            .loader-medium {
                width: 40px;
                height: 40px;
                border: 4px solid #e5e7eb;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Wait 1 second then logout
        setTimeout(() => {
            
            SimpleLogin.logout();
            
            // Show success
            modalContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Logged out!</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Redirecting to home page...</p>
                </div>
            `;
            
            // Wait 1.5 seconds then redirect
            setTimeout(() => {
                modalDiv.remove();
                style.remove();
                
                // Go back to role selection
                document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
                roleSelection.classList.remove('hidden');
                resetRoleSelection();
                pageHistory = [roleSelection];
                updateBackButton();
                
                // Hide logout buttons
                document.getElementById('logoutBtn')?.classList.add('hidden');
                document.getElementById('mobileLogoutBtn')?.classList.add('hidden');
                
            }, 1500);
        }, 1000);
    });
    
    document.getElementById('customLogoutModal').addEventListener('click', (e) => {
        if (e.target.id === 'customLogoutModal') {
            modalDiv.remove();
        }
    });
}

const oldLogoutBtn = document.getElementById('logoutBtn');
const oldMobileLogoutBtn = document.getElementById('mobileLogoutBtn');

if (oldLogoutBtn) {
    const newLogoutBtn = oldLogoutBtn.cloneNode(true);
    oldLogoutBtn.parentNode.replaceChild(newLogoutBtn, oldLogoutBtn);
    
    // Add new listener
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        beautifulLogout();
    });
}

if (oldMobileLogoutBtn) {
    const newMobileBtn = oldMobileLogoutBtn.cloneNode(true);
    oldMobileLogoutBtn.parentNode.replaceChild(newMobileBtn, oldMobileLogoutBtn);
    
    document.getElementById('mobileLogoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        beautifulLogout();
    });
}

// Dashboard Elements
const teacherDashboard = document.getElementById('teacherDashboard');
const dashboardTableBody = document.getElementById('dashboardTableBody');
const totalScannedElement = document.getElementById('totalScanned');
const todayScannedElement = document.getElementById('todayScanned');
const uniqueStudentsElement = document.getElementById('uniqueStudents');
const lastScanTimeElement = document.getElementById('lastScanTime');
const filterDateElement = document.getElementById('filterDate');
const refreshDashboardBtn = document.getElementById('refreshDashboard');
const exportDashboardCSVBtn = document.getElementById('exportDashboardCSV');
const printDashboardBtn = document.getElementById('printDashboard');
const backToScannerFromDashboardBtn = document.getElementById('backToScannerFromDashboard');
const backToBookmarkFromDashboardBtn = document.getElementById('backToBookmarkFromDashboard');

// Add Dashboard button to navbar (mobile and desktop)
function addDashboardButtonToNav() {
    // Desktop button
    const desktopButtons = document.querySelector('.hidden.md\\:flex.items-center.space-x-5');
    if (desktopButtons && !document.getElementById('desktopDashboardBtn')) {
        const dashboardBtn = document.createElement('button');
        dashboardBtn.id = 'desktopDashboardBtn';
        dashboardBtn.className = 'text-blue-700 dark:text-blue-300 font-semibold hover:text-blue-900 dark:hover:text-blue-100 transition';
        dashboardBtn.textContent = 'Dashboard';
        dashboardBtn.addEventListener('click', showDashboard);
        
        // Insert before About button
        const aboutBtn = document.getElementById('aboutBtn');
        if (aboutBtn) {
            desktopButtons.insertBefore(dashboardBtn, aboutBtn);
        } else {
            desktopButtons.appendChild(dashboardBtn);
        }
    }
  
// Refresh Dashboard Button
document.getElementById('refreshDashboard')?.addEventListener('click', function() {
    // Simple refresh without animation
    updateDashboard();
    
    // Simple confirmation (no alert)
    console.log('Dashboard refreshed');
});

    // Mobile menu button
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !document.getElementById('mobileDashboardBtn')) {
        const mobileDashboardBtn = document.createElement('button');
        mobileDashboardBtn.id = 'mobileDashboardBtn';
        mobileDashboardBtn.className = 'block w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-700 dark:text-blue-300';
        mobileDashboardBtn.textContent = 'Dashboard';
        mobileDashboardBtn.addEventListener('click', () => {
            showDashboard();
            mobileMenu.classList.add('hidden');
        });
        
        // Insert before About button
        const mobileAboutBtn = document.getElementById('mobileAboutBtn');
        if (mobileAboutBtn) {
            mobileMenu.insertBefore(mobileDashboardBtn, mobileAboutBtn);
        } else {
            mobileMenu.appendChild(mobileDashboardBtn);
        }
    }
}

// Show Dashboard
function showDashboard() {
    // Check if teacher is logged in
    if (!SimpleLogin.isLoggedIn()) {
        alert('Please login as teacher first!');
        return;
    }
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show dashboard
    teacherDashboard.classList.remove('hidden');
    
    // Update history
    pageHistory.push(teacherDashboard);
    updateBackButton();
    
    // Load dashboard data
    updateDashboard();
}

// Replace/Add this function:
function updateDashboard() {
    console.log("Refreshing dashboard...");
    
    // Get scanned data
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    
    // Calculate statistics
    const today = new Date().toDateString();
    const todayScans = scannedCodes.filter(scan => {
        const scanDate = new Date(scan.timestamp).toDateString();
        return scanDate === today;
    });
    
    // Get unique students
    const uniqueStudents = new Set();
    scannedCodes.forEach(scan => {
        try {
            const data = JSON.parse(scan.data);
            if (data.number) uniqueStudents.add(data.number);
        } catch (e) {}
    });
    
    // Update stats
    if (document.getElementById('totalScanned')) {
        document.getElementById('totalScanned').textContent = scannedCodes.length;
    }
    
    if (document.getElementById('todayScanned')) {
        document.getElementById('todayScanned').textContent = todayScans.length;
    }
    
    if (document.getElementById('uniqueStudents')) {
        document.getElementById('uniqueStudents').textContent = uniqueStudents.size;
    }
    
    // Last scan time
    if (document.getElementById('lastScanTime')) {
        if (scannedCodes.length > 0) {
            const lastScan = scannedCodes[0];
            const lastTime = new Date(lastScan.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', minute: '2-digit' 
            });
            document.getElementById('lastScanTime').textContent = lastTime;
        } else {
            document.getElementById('lastScanTime').textContent = 'Never';
        }
    }
    
    // Update table
    updateDashboardTable();
    
    console.log("Dashboard refreshed!");
}

// Update Dashboard Table
function updateDashboardTable() {
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    const filterValue = filterDateElement.value;
    
    // Apply filter
    let filteredScans = scannedCodes;
    if (filterValue === 'today') {
        const today = new Date().toDateString();
        filteredScans = scannedCodes.filter(scan => {
            const scanDate = new Date(scan.timestamp).toDateString();
            return scanDate === today;
        });
    } else if (filterValue === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredScans = scannedCodes.filter(scan => {
            const scanDate = new Date(scan.timestamp);
            return scanDate >= oneWeekAgo;
        });
    } else if (filterValue === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredScans = scannedCodes.filter(scan => {
            const scanDate = new Date(scan.timestamp);
            return scanDate >= oneMonthAgo;
        });
    }
    
    // Clear table
    dashboardTableBody.innerHTML = '';
    
    if (filteredScans.length === 0) {
        dashboardTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No scanned students found with selected filter.
                </td>
            </tr>
        `;
        return;
    }
    
    // Add rows (show latest first)
    filteredScans.slice().reverse().forEach((scan, index) => {
        try {
            const data = JSON.parse(scan.data);
            const scanTime = new Date(scan.timestamp).toLocaleString();
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                            <span class="text-blue-700 dark:text-blue-300 font-semibold">
                                ${data.name ? data.name.charAt(0) : '?'}
                            </span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                ${data.name || 'Unknown'}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                ${data.grade || 'N/A'}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-300 font-mono">
                        ${data.number || 'N/A'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-300">
                        ${data.strand || 'N/A'}
                    </div>
                </td>
<td class="px-6 py-4 whitespace-nowrap">
    <div class="text-sm text-gray-900 dark:text-gray-300">
        ${data.grade || 'N/A'}
    </div>
</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-300">
                        ${data.section || 'N/A'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="text-gray-900 dark:text-gray-300">
                        ${scanTime}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button onclick="viewStudentDetails('${encodeURIComponent(scan.data)}')" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        View
                    </button>
                    <button onclick="deleteScan('${encodeURIComponent(scan.data)}', ${index})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30">
                        Remove
                    </button>
                </td>
            `;
            dashboardTableBody.appendChild(row);
        } catch (e) {
            console.error('Error parsing scan data:', e);
        }
    });
}

// View Student Details Modal
function viewStudentDetails(encodedData) {
    try {
        const data = JSON.parse(decodeURIComponent(encodedData));
        
        // Create organized student info
        const modalHTML = `
            <div id="studentDetailsModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
                <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-blue-700 dark:text-blue-300">Student Details</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">QR Code Information</p>
                        </div>
                        <button onclick="document.getElementById('studentDetailsModal').remove()" 
                                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl">
                            &times;
                        </button>
                    </div>
                    
                    <!-- Student Basic Info -->
                    <div class="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="text-blue-700 dark:text-blue-300 font-bold text-lg">
                                ${data.name ? data.name.charAt(0) : '?'}
                            </span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-gray-800 dark:text-gray-100 truncate">${data.name || 'Unknown Student'}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 font-mono truncate">${data.number || 'No ID Number'}</p>
                        </div>
                    </div>
                    
                    <!-- Information Grid -->
                    <div class="space-y-4 mb-6">
                        <div class="grid grid-cols-2 gap-3">
                            <!-- Grade -->
                            <div class="space-y-1">
                                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Grade Level</p>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${data.grade || 'N/A'}</p>
                            </div>
                            
                            <!-- Strand Category -->
                            <div class="space-y-1">
                                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Strand Category</p>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${data.strandCategory || 'N/A'}</p>
                            </div>
                            
                            <!-- Strand -->
                            <div class="space-y-1">
                                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Strand</p>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${data.strand || 'N/A'}</p>
                            </div>
                            
                            <!-- Section -->
                            <div class="space-y-1">
                                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Section</p>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${data.section || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Issue Reported (if any) -->
                    ${data.issue ? `
                    <div class="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                            </svg>
                            <div>
                                <p class="text-xs font-medium text-yellow-800 dark:text-yellow-300">Issue Reported</p>
                                <p class="text-xs text-yellow-700 dark:text-yellow-400 mt-1">${data.issue}</p>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- QR Data Preview -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">QR Data Format</p>
                            <button onclick="copyQRData('${encodeURIComponent(JSON.stringify(data, null, 2))}')" 
                                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Copy
                            </button>
                        </div>
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-h-48 overflow-auto">
                            <pre class="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap break-words leading-5">
${JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    </div>
                    
                    <!-- Close Button -->
                    <div class="flex justify-end">
                        <button onclick="document.getElementById('studentDetailsModal').remove()" 
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
    } catch (e) {
        console.error('Error viewing student details:', e);
        alert('Error viewing student details');
    }
}

// Simple copy function
function copyQRData(data) {
    try {
        const decoded = decodeURIComponent(data);
        navigator.clipboard.writeText(decoded)
            .then(() => {
                // Simple feedback
                const copyBtn = document.querySelector('[onclick*="copyQRData"]');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = 'Copied!';
                    copyBtn.classList.add('text-green-600');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.classList.remove('text-green-600');
                    }, 1500);
                }
            });
    } catch (e) {
        console.error('Failed to copy');
    }
}

// Delete Scan
function deleteScan(qrData) {
    if (confirm('Remove this scan from records?')) {
        const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
        const updatedCodes = scannedCodes.filter(scan => scan.data !== qrData);
        
        localStorage.setItem('scannedQRCodes', JSON.stringify(updatedCodes));
        updateDashboard();
        renderScannedCodes();
    }
}

// FIXED VERSION - replace lines ~1990-2005
function exportDashboardCSV() {
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    const teacher = SimpleLogin.getCurrentTeacher();
    
    if (scannedCodes.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // CSV Headers - GRADE LEVEL FIXED
    let csv = 'Timestamp,Student Name,Student Number,Grade Level,Strand,Section\n';
    
    scannedCodes.forEach(scan => {
        try {
            const data = JSON.parse(scan.data);
            const teacherName = teacher ? teacher.fullName : localStorage.getItem('teacher_name') || 'Unknown';
            
            const grade = data.grade  || 'N/A';
            
            csv += `"${scan.timestamp}",`;
            csv += `"${data.name || ''}",`;
            csv += `"${data.number || ''}",`;
            csv += `"${grade}",`;
            csv += `"${data.strand || ''}",`;
            csv += `"${data.section || ''}",`;
        } catch (e) {
            csv += `"${scan.timestamp}","Invalid QR Code","","N/A","","","${teacher ? teacher.fullName : 'Unknown'}"\n`;
        }
    });
    
    // Create and download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`Exported ${scannedCodes.length} records to CSV (including Grade)`);
}

// Print Dashboard
function printDashboard() {
    // Create a printable version of the dashboard
    const printWindow = window.open('', '_blank');
    
    const teacher = SimpleLogin.getCurrentTeacher();
    const teacherName = teacher ? teacher.fullName : 'Unknown Teacher';
    const currentDate = new Date().toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString();
    
    // Get scanned data
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    const todayScans = scannedCodes.filter(scan => {
        const scanDate = new Date(scan.timestamp).toDateString();
        return scanDate === new Date().toDateString();
    });
    
    // Build printable HTML
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>iCheckPass - Attendance Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #2563eb;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #2563eb;
                    margin: 0;
                }
                .teacher-info {
                    background: #f0f9ff;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin: 25px 0;
                }
                .stat-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                }
                .stat-card .number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #2563eb;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 25px 0;
                }
                th {
                    background-color: #2563eb;
                    color: white;
                    padding: 12px;
                    text-align: left;
                }
                td {
                    padding: 10px;
                    border-bottom: 1px solid #e2e8f0;
                }
                tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                    body {
                        padding: 0;
                    }
                }
                @page {
                    margin: 0.5in;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>iCheckPass Attendance Report</h1>
                <p>Immaculate Conception Polytechnic, Meycauayan</p>
                <div class="teacher-info">
                    <p><strong>Teacher:</strong> ${teacherName}</p>
                    <p><strong>Report Date:</strong> ${currentDate} ${currentTime}</p>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="number">${scannedCodes.length}</div>
                    <div>Total Scanned</div>
                </div>
                <div class="stat-card">
                    <div class="number">${todayScans.length}</div>
                    <div>Today's Scans</div>
                </div>
                <div class="stat-card">
                    <div class="number">${
                        new Set(scannedCodes.map(scan => {
                            try {
                                const data = JSON.parse(scan.data);
                                return data.number;
                            } catch { return null; }
                        }).filter(Boolean)).size
                    }</div>
                    <div>Unique Students</div>
                </div>
                <div class="stat-card">
                    <div class="number">${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}</div>
                    <div>Current Time</div>
                </div>
            </div>
            
            <h2>Attendance Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student Number</th>
                        <th>Strand</th>
                        <th>Grade</th>
                        <th>Section</th>
                        <th>Scan Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${scannedCodes.map(scan => {
                        try {
                            const data = JSON.parse(scan.data);
                            const time = new Date(scan.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit'
                            });
                            return `
                                <tr>
                                    <td>${data.name || 'Unknown'}</td>
                                    <td>${data.number || 'N/A'}</td>
                                    <td>${data.strand || 'N/A'}</td>
                                    <td>${data.grade || 'N/A'}</td>
                                    <td>${data.section || 'N/A'}</td>
                                    <td>${time}</td>
                                </tr>
                            `;
                        } catch (e) {
                            return '';
                        }
                    }).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Generated by iCheckPass - ICP Meycauayan Attendance System</p>
                <p>This is an official attendance record</p>
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Print Report
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #64748b; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    Close
                </button>
            </div>
            
            <script>
                // Auto-print when page loads
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Alert Modal Helper
function alertModal(title, content) {
    const modalHTML = `
        <div id="alertModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-blue-700 dark:text-blue-300">${title}</h3>
                    <button onclick="document.getElementById('alertModal').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        &times;
                    </button>
                </div>
                <div class="mb-6">${content}</div>
                <div class="text-right">
                    <button onclick="document.getElementById('alertModal').remove()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
}

// Gawing:
if (refreshDashboardBtn) {
    refreshDashboardBtn.addEventListener('click', function() {
        // Add loading animation
        this.disabled = true;
        this.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Refreshing...</span>
            </div>
        `;
        
        // Update dashboard
        updateDashboard();
        
        // Revert button after 1 second
        setTimeout(() => {
            this.disabled = false;
            this.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh Data
            `;
        }, 1000);
    });
}

if (exportDashboardCSVBtn) {
    exportDashboardCSVBtn.addEventListener('click', exportDashboardCSV);
}

if (printDashboardBtn) {
    printDashboardBtn.addEventListener('click', printDashboard);
}

if (backToScannerFromDashboardBtn) {
    backToScannerFromDashboardBtn.addEventListener('click', () => {
        teacherDashboard.classList.add('hidden');
        teacherScannerSection.classList.remove('hidden');
        pageHistory.push(teacherScannerSection);
        updateBackButton();
    });
}

if (backToBookmarkFromDashboardBtn) {
    backToBookmarkFromDashboardBtn.addEventListener('click', () => {
        teacherDashboard.classList.add('hidden');
        teacherBookmark.classList.remove('hidden');
        pageHistory.push(teacherBookmark);
        updateBackButton();
    });
}

if (filterDateElement) {
    filterDateElement.addEventListener('change', updateDashboardTable);
}

// Auto-update dashboard every 30 seconds when visible
setInterval(() => {
    if (!teacherDashboard.classList.contains('hidden')) {
        updateDashboard();
    }
}, 30000);

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    addDashboardButtonToNav();
});

function addDashboardToMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !document.getElementById('mobileDashboardBtn')) {
    }
}


setInterval(addDashboardButtonToNav, 1000);

const originalUpdateBackButton = updateBackButton;

updateBackButton = function() {
    const currentPage = pageHistory[pageHistory.length - 1];
    
    // Show back button except on title page
    if (currentPage && currentPage.id !== "titlePage") {
        backBtn.classList.remove("hidden");
    } else {
        backBtn.classList.add("hidden");
    }
};

// Fix navigation for about/contact
document.getElementById('aboutBtn').addEventListener('click', function() {
    // Store current section
    const currentSection = document.querySelector('section:not(.hidden)');
    if (currentSection && currentSection.id !== "aboutSection") {
        pageHistory.push(currentSection);
    }
    
    // Hide all, show about
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('aboutSection').classList.remove('hidden');
    updateBackButton();
});

document.getElementById('contactBtn').addEventListener('click', function() {
    // Store current section
    const currentSection = document.querySelector('section:not(.hidden)');
    if (currentSection && currentSection.id !== "contactSection") {
        pageHistory.push(currentSection);
    }
    
    // Hide all, show contact
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('contactSection').classList.remove('hidden');
    updateBackButton();
});

// Mobile menu buttons
document.getElementById('mobileAboutBtn')?.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.add('hidden');
    document.getElementById('aboutBtn').click();
});

document.getElementById('mobileContactBtn')?.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.add('hidden');
    document.getElementById('contactBtn').click();
});

// Override goBack function for special cases
const originalGoBack = goBack;
goBack = function() {
    const currentPage = pageHistory[pageHistory.length - 1];
    
    // If we're on about/contact, go back to previous page
    if (currentPage && (currentPage.id === "aboutSection" || currentPage.id === "contactSection")) {
        // Hide current
        currentPage.classList.add('hidden');
        
        // Find and show previous page
        if (pageHistory.length > 1) {
            const previousPage = pageHistory[pageHistory.length - 2];
            if (previousPage) {
                previousPage.classList.remove('hidden');
                pageHistory.pop();
                updateBackButton();
                return;
            }
        }
    }
    
    // Default behavior
    originalGoBack();
};

// CONTACT FORM HANDLER
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    

    const subject = `iCheckPass Feedback`;
    const body = message;
    
    // Open default email client
    window.location.href = `mailto:icheckpass2025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Show confirmation
    alert('Thank you for your feedback!');
    
    // Clear form
    this.reset();
});


document.addEventListener('DOMContentLoaded', function() {
    // Override back button click
    document.getElementById('backBtn').addEventListener('click', function() {
        // Get current visible section
        const currentSection = document.querySelector('section:not(.hidden)');
        
        // If current is about or contact, go to title page
        if (currentSection && (currentSection.id === 'aboutSection' || currentSection.id === 'contactSection')) {
            document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
            document.getElementById('titlePage').classList.remove('hidden');
            return;
        }
        
        // Otherwise use original goBack
        goBack();
    });
});

// View Student Details Modal
function viewStudentDetails(encodedData) {
    try {
        const data = JSON.parse(decodeURIComponent(encodedData));
        
        // Create modal HTML
        const modalHTML = `
            <div id="studentDetailsModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
                <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-blue-700 dark:text-blue-300">Student Details</h3>
                        <button onclick="document.getElementById('studentDetailsModal').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl">
                            &times;
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span class="text-blue-700 dark:text-blue-300 text-xl font-bold">
                                    ${data.name ? data.name.charAt(0) : '?'}
                                </span>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100">${data.name || 'Unknown'}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${data.number || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400">Grade Level</p>
                                <p class="font-medium text-gray-800 dark:text-gray-200">${data.grade || 'N/A'}</p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400">Strand Category</p>
                                <p class="font-medium text-gray-800 dark:text-gray-200">${data.strandCategory || 'N/A'}</p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400">Strand</p>
                                <p class="font-medium text-gray-800 dark:text-gray-200">${data.strand || 'N/A'}</p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400">Section</p>
                                <p class="font-medium text-gray-800 dark:text-gray-200">${data.section || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">QR Data</p>
                            <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                                <code class="text-xs text-gray-700 dark:text-gray-300">
                                    ${JSON.stringify(data, null, 2)}
                                </code>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-right">
                        <button onclick="document.getElementById('studentDetailsModal').remove()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
    } catch (e) {
        alert('Error viewing student details: ' + e.message);
    }
}

// Delete Scan Function
function deleteScan(encodedData, index) {
    if (confirm('Are you sure you want to remove this student from the records?')) {
        try {
            const qrData = decodeURIComponent(encodedData);
            const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
            
            // Find and remove the scan
            const updatedCodes = scannedCodes.filter(scan => scan.data !== qrData);
            
            // Save back to localStorage
            localStorage.setItem('scannedQRCodes', JSON.stringify(updatedCodes));
            
            // Show success message
            alert('Student record removed successfully!');
            
            // Update both dashboard and scanner view
            updateDashboard();
            renderScannedCodes();
            
        } catch (e) {
            alert('Error removing record: ' + e.message);
        }
    }
}


qrDoneBtn.addEventListener('click', () => {
    // Go back to ROLE SELECTION (not title page)
    qrCodeSection.classList.add('hidden');
    
    // Reset role selection
    resetRoleSelection();
    roleSelection.classList.remove('hidden');
    
    // Update history
    pageHistory = [titlePage, roleSelection];
    updateBackButton();
    
    console.log('QR Done → Back to Role Selection');
});


document.addEventListener('DOMContentLoaded', function() {
    console.log('iCheckPass loaded');
});

studentCard.addEventListener('click', () => {
    const savedStudentQR = localStorage.getItem('studentQR');
    
    if (savedStudentQR) {
        // MERON NA SAVED QR - AUTO-LOAD IT
        console.log('📱 Found saved student QR, auto-loading...');
        selectRole('Student');
        
        // Show loading on continue button
        continueToDashboardBtn.innerHTML = 'Loading saved QR...';
        continueToDashboardBtn.disabled = true;
        
        // Simulate loading for 1 second
        setTimeout(() => {
            // Auto-click continue to dashboard
            simulateStudentContinue();
        }, 800);
        
    } else {
        // WALANG SAVED QR - normal selection
        console.log('📱 No saved student, normal selection');
        selectRole('Student');
    }
});

// ==============================================
// 3. SIMULATE STUDENT CONTINUE (AUTO-LOAD QR)
// ==============================================

function simulateStudentContinue() {
    const savedStudentQR = localStorage.getItem('studentQR');
    
    if (!savedStudentQR) {
        // No saved QR - go to normal form
        console.log('❌ No saved QR, going to form');
        goToStudentForm();
        return;
    }
    
    try {
        const studentData = JSON.parse(savedStudentQR);
        console.log('✅ Auto-loading saved student:', studentData.name);
        
        // 1. Hide role selection
        roleSelection.classList.add('hidden');
        
        // 2. Generate QR from saved data
        document.getElementById("qrcode").innerHTML = "";
        qrcode = new QRCode(document.getElementById("qrcode"), {
            text: savedStudentQR,
            width: 250,
            height: 250,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
        
        // 3. Show QR section
        qrCodeSection.classList.remove('hidden');
        
        // 4. Enable QR Done button
        qrDoneBtn.disabled = false;
        qrDoneBtn.classList.remove('btn-disabled');
        qrDoneBtn.classList.add('btn-primary');
        
        // 5. Show trouble section
        document.getElementById('troubleSection').classList.remove('hidden');
        
        // 6. Update history
        pageHistory.push(qrCodeSection);
        updateBackButton();
        
        // 7. Reset continue button
        continueToDashboardBtn.innerHTML = 'Continue';
        continueToDashboardBtn.disabled = false;
        
        // 8. Show notification
        showWelcomeBackNotification(studentData);
        
    } catch (error) {
        console.error('❌ Error loading saved QR:', error);
        // Fallback to normal form
        goToStudentForm();
    }
}

// ==============================================
// 4. GO TO STUDENT FORM (IF NO SAVED QR)
// ==============================================

function goToStudentForm() {
    roleSelection.classList.add('hidden');
    studentInfoSection.classList.remove('hidden');
    studentInfoForm.reset();
    submitStudentInfoBtn.disabled = true;
    pageHistory.push(studentInfoSection);
    updateBackButton();
}

// ==============================================
// 5. WELCOME BACK NOTIFICATION
// ==============================================

// ==============================================
// 5. WELCOME BACK NOTIFICATION (NO NEW STUDENT BUTTON)
// ==============================================

function showWelcomeBackNotification(studentData) {
    try {
        // Create notification HTML - SIMPLE VERSION WITHOUT ANY BUTTONS
        const notificationHTML = `
            <div id="welcomeBackNotification" class="fixed top-20 right-4 z-[99999] animate-slideInRight">
                <div class="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-xl border border-blue-200 dark:border-blue-800 p-5 max-w-sm">
                    <div class="flex items-start gap-4">
                        <!-- Student Avatar -->
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="text-white font-bold text-lg">
                                ${studentData.name ? studentData.name.charAt(0) : 'S'}
                            </span>
                        </div>
                        
                        <!-- Message -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm">Welcome back!</h4>
                            </div>
                            
                            <p class="text-gray-600 dark:text-gray-300 text-xs">
                                Loaded your saved profile for <strong class="text-blue-700 dark:text-blue-300">${studentData.name || 'Student'}</strong>
                            </p>
                            
                            <div class="flex items-center justify-between mt-3">
                                <div class="flex items-center gap-2 text-xs">
                                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                        ${studentData.number || 'ID: N/A'}
                                    </span>
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                        ${studentData.strand || 'Strand'}
                                    </span>
                                </div>
                                
                                <button onclick="document.getElementById('welcomeBackNotification').remove()" 
                                        class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const notifDiv = document.createElement('div');
        notifDiv.innerHTML = notificationHTML;
        document.body.appendChild(notifDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notifDiv.parentNode) {
                notifDiv.remove();
            }
        }, 5000);
        
    } catch (error) {
        console.log('Could not show notification:', error);
    }
}

continueToDashboardBtn.addEventListener('click', () => {
    if (!selectedRole) return;
    
    if (selectedRole === 'Teacher') {
        // Teacher - normal flow
        roleSelection.classList.add('hidden');
        pageHistory.push(roleSelection, teacherVerifySection);
        teacherVerifySection.classList.remove('hidden');
        updateBackButton();
        
    } else if (selectedRole === 'Student') {
        // Student - check if saved
        const savedStudentQR = localStorage.getItem('studentQR');
        
        if (savedStudentQR) {
            // HAS SAVED QR - AUTO-LOAD
            simulateStudentContinue();
        } else {
            // NO SAVED QR - GO TO FORM
            roleSelection.classList.add('hidden');
            studentInfoSection.classList.remove('hidden');
            studentInfoForm.reset();
            submitStudentInfoBtn.disabled = true;
            pageHistory.push(roleSelection, studentInfoSection);
            updateBackButton();
        }
    }
});

// ==============================================
// 7. SHOW SAVED INDICATOR ON STUDENT CARD
// ==============================================

function updateStudentCardIndicator() {
    const savedStudentQR = localStorage.getItem('studentQR');
    const badge = document.getElementById('studentSavedBadge');
    const message = document.getElementById('studentAutoLoadMessage');
    
    if (savedStudentQR && badge && message) {
        try {
            const studentData = JSON.parse(savedStudentQR);
            badge.classList.remove('hidden');
            message.classList.remove('hidden');
            
            // Update message with student name
            message.innerHTML = `✓ Will load: <strong>${studentData.name}</strong>`;
            
            console.log('✅ Showing saved indicator for:', studentData.name);
        } catch (error) {
            console.error('Error showing indicator:', error);
        }
    } else {
        if (badge) badge.classList.add('hidden');
        if (message) message.classList.add('hidden');
    }
}

// Check on page load and periodically
document.addEventListener('DOMContentLoaded', updateStudentCardIndicator);
setInterval(updateStudentCardIndicator, 2000);

// Also check when QR is saved
function checkQRAfterSave() {
    setTimeout(updateStudentCardIndicator, 500);
}

// Call this after saving QR (in confirmYesBtn event):
confirmYesBtn.addEventListener('click', () => {
    // ... your existing code ...
    checkQRAfterSave(); // Add this line
});

// ==============================================
// REGISTER NEW STUDENT FUNCTION
// ==============================================

function registerNewStudent() {
    if (confirm('Register new student? This will clear your current saved profile.')) {
        // Clear saved QR
        localStorage.removeItem('studentQR');
        
        // Hide mobile menu
        document.getElementById('mobileMenu').classList.add('hidden');
        
        // Go to role selection
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        
        roleSelection.classList.remove('hidden');
        resetRoleSelection();
        pageHistory = [roleSelection];
        updateBackButton();
        
        // Update student card indicator
        updateStudentCardIndicator();
        
        alert('You can now register as a new student!');
    }
}

// EMERGENCY FIX - Copy and paste this at the very end of script.js
document.addEventListener('DOMContentLoaded', function() {
    // Override the submit button completely
    const submitBtn = document.getElementById('submitStudentInfo');
    if (submitBtn) {
        submitBtn.onclick = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('studentName').value.trim();
            const number = document.getElementById('studentNumber').value.trim();
            const strandCategory = document.getElementById('strandCategory').value;
            const strand = document.getElementById('strand').value;
            const section = document.getElementById('studentSection').value;
            
            if (!name || !number || !strandCategory || !strand || !section) {
                alert('Please fill all fields!');
                return;
            }
            
            if (!number.includes('-ICPMY')) {
                alert('Student number must end with -ICPMY (e.g., 2024-0001-ICPMY)');
                return;
            }
            
            // Proceed with submission
            studentData = {
                name: name,
                number: number,
                strandCategory: strandCategory,
                strand: strand,
                section: section
            };
            
            // Navigate to confirmation
            pageHistory.push(studentInfoConfirmSection);
            studentInfoSection.classList.add('hidden');
            studentInfoConfirmSection.classList.remove('hidden');
            
            // Update confirmation display
            confirmName.textContent = "Name: " + studentData.name;
            confirmNumber.textContent = "Student Number: " + studentData.number;
            confirmStrandCategory.textContent = "Strand Category: " + studentData.strandCategory;
            confirmStrand.textContent = "Strand: " + studentData.strand;
            confirmSection.textContent = "Section: " + studentData.section;
            
            updateBackButton();
        };
        
        // Always enable the button for now
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
        submitBtn.classList.add('btn-primary');
    }
});

// Add student dashboard button functionality
const studentDashboardBtn = document.getElementById('studentDashboardBtn');
const studentDashboardSection = document.getElementById('studentDashboardSection');

if (studentDashboardBtn && studentDashboardSection) {
    studentDashboardBtn.addEventListener('click', function() {
        // Check if student has QR saved
        const savedStudentQR = localStorage.getItem('studentQR');
        
        if (!savedStudentQR) {
            alert('Please generate your QR code first by going through the student registration process.');
            return;
        }
        
        try {
            const studentData = JSON.parse(savedStudentQR);
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show student dashboard
            studentDashboardSection.classList.remove('hidden');
            
            // Update history
            pageHistory.push(studentDashboardSection);
            updateBackButton();
            
            // Hide mobile menu
            mobileMenu.classList.add('hidden');
            
            // Update dashboard stats
            updateStudentDashboard(studentData);
            
        } catch (error) {
            alert('Error loading student dashboard. Please regenerate your QR code.');
        }
    });
    
    // Show/hide student dashboard button based on whether student has QR
    function updateStudentDashboardButton() {
        const savedStudentQR = localStorage.getItem('studentQR');
        if (savedStudentQR) {
            studentDashboardBtn.classList.remove('hidden');
        } else {
            studentDashboardBtn.classList.add('hidden');
        }
    }
    
    // Check periodically
    setInterval(updateStudentDashboardButton, 2000);
    updateStudentDashboardButton();
}

// Palitan ang updateStudentDashboard() function:

function updateStudentDashboard(studentData) {
    if (!studentDashboardSection || !studentData) return;
    
    // ✅ GET FROM CROSS-DEVICE SERVER
    const studentAttendance = CrossDeviceSync.getStudentScans(studentData.number);
    
    // Update stats
    document.getElementById('totalAttendance').textContent = studentAttendance.length;
    
    // Get today's scans
    const today = new Date().toDateString();
    const todayScans = studentAttendance.filter(scan => {
        const scanDate = new Date(scan.timestamp || scan.syncTime).toDateString();
        return scanDate === today;
    });
    document.getElementById('todayAttendance').textContent = todayScans.length;
    
    // Update last scan time
    if (studentAttendance.length > 0) {
        const lastScan = studentAttendance[0];
        const lastTime = new Date(lastScan.timestamp || lastScan.syncTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('studentLastScanTime').textContent = lastTime;
    } else {
        document.getElementById('studentLastScanTime').textContent = 'Never';
    }
    
    // Update attendance history
    const historyContainer = document.getElementById('studentAttendanceHistory');
    if (historyContainer) {
        historyContainer.innerHTML = '';
        
        if (studentAttendance.length === 0) {
            historyContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 italic py-8">No attendance records yet</p>';
            return;
        }
        
        // Show latest first
        studentAttendance.forEach(scan => {
            const scanTime = new Date(scan.timestamp || scan.syncTime).toLocaleString();
            
            const scanItem = document.createElement('div');
            scanItem.className = 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left mb-3';
            scanItem.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium text-gray-800 dark:text-gray-200">${scanTime}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Teacher: ${scan.scannedBy || 'Unknown'}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ${scan.strand || ''} • ${scan.section || ''}
                        </p>
                        <p class="text-xs text-blue-500 dark:text-blue-400 mt-1">
                            📍 ${scan.location || 'School'}
                        </p>
                    </div>
                    <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        Present
                    </span>
                </div>
            `;
            historyContainer.appendChild(scanItem);
        });
    }
}

if (teacherConfirmBtn) {
    teacherConfirmBtn.addEventListener('click', function() {
        console.log('Continue to Scanner clicked');
        
        const classInfo = {
            section: teacherData.section,
            grade: teacherData.grade,
            strand: teacherData.strand,
            date: teacherData.date,
            schedule: teacherData.schedule,
            late: teacherData.late,
            absent: teacherData.absent
        };
        
        localStorage.setItem('currentClassInfo', JSON.stringify(classInfo));
        
        teacherConfirmStep.classList.add('hidden');
        teacherScannerSection.classList.remove('hidden');
        
        pageHistory.push(teacherScannerSection);
        updateBackButton();
        
        if (scannedCodes.length > 0) {
            renderScannedCodes();
        }
        
        console.log('Navigated to scanner section');
    });
}


// Idagdag sa script.js - para ma-notify ang student kapag may bagong scan

function checkForNewScans(studentNumber) {
    const lastCheckTime = localStorage.getItem(`lastCheck_${studentNumber}`);
    const studentAttendance = AttendanceSync.getStudentAttendance(studentNumber);
    
    if (studentAttendance.length > 0) {
        const latestScan = studentAttendance[0];
        const scanTime = new Date(latestScan.timestamp || latestScan.syncTime).getTime();
        const lastCheck = lastCheckTime ? parseInt(lastCheckTime) : 0;
        
        // If new scan since last check
        if (scanTime > lastCheck) {
            showNewScanNotification(latestScan);
            localStorage.setItem(`lastCheck_${studentNumber}`, Date.now().toString());
        }
    }
}

function showNewScanNotification(scan) {
    // Create notification
    const notification = document.createElement('div');
    notification.id = 'newScanNotification';
    notification.className = 'fixed top-20 right-4 z-[99999] animate-slideInRight';
    notification.innerHTML = `
        <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-xl border border-green-200 dark:border-green-800 p-4 max-w-sm">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">New Attendance Recorded!</h4>
                    <p class="text-gray-600 dark:text-gray-300 text-xs">
                        Scanned by <strong>${data.scannedBy || 'Teacher'}</strong>
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        ${new Date(scan.timestamp || scan.syncTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </p>
                </div>
                <button onclick="document.getElementById('newScanNotification').remove()" class="text-gray-400 hover:text-gray-600">
                    ✕
                </button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Sa student dashboard, mag-auto-check every 10 seconds
let scanCheckInterval;

function startScanMonitoring(studentNumber) {
    if (scanCheckInterval) clearInterval(scanCheckInterval);
    
    scanCheckInterval = setInterval(() => {
        if (!studentDashboardSection.classList.contains('hidden')) {
            checkForNewScans(studentNumber);
            updateStudentDashboard(JSON.parse(localStorage.getItem('studentQR')));
        }
    }, 10000); // Check every 10 seconds
}

// ==============================================
// MANUAL SYNC - EXPORT SCANNED DATA
// ==============================================

document.getElementById('exportSyncData')?.addEventListener('click', function() {
    const teacher = SimpleLogin.getCurrentTeacher();
    
    if (!teacher) {
        alert('Please login first!');
        return;
    }
    
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    
    if (scannedCodes.length === 0) {
        alert('No data to export. Scan some students first!');
        return;
    }
    
    // Create sync data package
    const syncData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exportedBy: {
            teacherId: teacher.id,
            teacherName: teacher.fullName,
            username: teacher.username
        },
        deviceId: CrossDeviceSync.getDeviceId(),
        totalRecords: scannedCodes.length,
        scannedStudents: scannedCodes.map(scan => {
            try {
                const studentData = JSON.parse(scan.data);
                return {
                    studentName: studentData.name,
                    studentNumber: studentData.number,
                    strand: studentData.strand,
                    strandCategory: studentData.strandCategory,
                    grade: studentData.grade,
                    section: studentData.section,
                    timestamp: scan.timestamp,
                    scannedBy: teacher.fullName,
                    scannedByUsername: teacher.username
                };
            } catch (e) {
                return null;
            }
        }).filter(Boolean), // Remove null entries
        summary: {
            uniqueStudents: new Set(scannedCodes.map(s => {
                try {
                    return JSON.parse(s.data).number;
                } catch { return null; }
            }).filter(Boolean)).size,
            dateRange: {
                oldest: scannedCodes[scannedCodes.length - 1]?.timestamp,
                newest: scannedCodes[0]?.timestamp
            }
        }
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(syncData, null, 2);
    
    // Create download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iCheckPass_Sync_${teacher.username}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success modal
    showSyncSuccessModal('export', scannedCodes.length);
});

// ==============================================
// MANUAL SYNC - IMPORT SCANNED DATA (FIXED)
// ==============================================

document.getElementById('importSyncData')?.addEventListener('click', function() {
    const teacher = SimpleLogin.getCurrentTeacher();
    
    if (!teacher) {
        alert('Please login first!');
        return;
    }
    
    console.log('Import button clicked'); // Debug
    
    // Get or create file input
    let fileInput = document.getElementById('syncFileInput');
    
    if (!fileInput) {
        console.log('Creating new file input'); // Debug
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'syncFileInput';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Add event listener to the new input
        fileInput.addEventListener('change', handleSyncFileImport);
    }
    
    // Trigger click
    console.log('Triggering file input click'); // Debug
    fileInput.click();
});

// Separate function to handle file import
function handleSyncFileImport(e) {
    const file = e.target.files[0];
    console.log('File selected:', file); // Debug
    
    if (!file) {
        console.log('No file selected'); // Debug
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            console.log('File loaded, parsing...'); // Debug
            const syncData = JSON.parse(event.target.result);
            
            // Validate sync data
            if (!syncData.version || !syncData.scannedStudents || !Array.isArray(syncData.scannedStudents)) {
                throw new Error('Invalid sync file format');
            }
            
            console.log('Valid sync data:', syncData); // Debug
            
            // Show import confirmation modal
            showImportConfirmationModal(syncData);
            
        } catch (error) {
            console.error('Error parsing file:', error); // Debug
            alert('Error reading sync file: ' + error.message + '\n\nPlease make sure you selected a valid iCheckPass sync file.');
        }
        
        // Reset file input
        e.target.value = '';
    };
    
    reader.onerror = function() {
        console.error('Error reading file'); // Debug
        alert('Failed to read the file. Please try again.');
    };
    
    console.log('Starting file read...'); // Debug
    reader.readAsText(file);
}

// Also add listener to existing file input if it exists
document.getElementById('syncFileInput')?.addEventListener('change', handleSyncFileImport);

// ==============================================
// IMPORT CONFIRMATION MODAL
// ==============================================

function showImportConfirmationModal(syncData) {
    const teacher = SimpleLogin.getCurrentTeacher();
    const currentScans = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]').length;
    
    const modalHTML = `
        <div id="importConfirmModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Import Sync Data</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Review before importing</p>
                        </div>
                    </div>
                    <button onclick="document.getElementById('importConfirmModal').remove()" 
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">
                        ×
                    </button>
                </div>
                
                <!-- Sync File Info -->
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                    <p class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">📁 Sync File Information</p>
                    <div class="space-y-1 text-sm">
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Exported by:</span> ${syncData.exportedBy.teacherName}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Username:</span> ${syncData.exportedBy.username}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Export date:</span> ${new Date(syncData.exportDate).toLocaleString()}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Total records:</span> ${syncData.totalRecords}
                        </p>
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Unique students:</span> ${syncData.summary.uniqueStudents}
                        </p>
                    </div>
                </div>
                
                <!-- Current Data Warning -->
                ${currentScans > 0 ? `
                <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
                    <div class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">You have existing data</p>
                            <p class="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                You currently have ${currentScans} scanned records. Choose how to handle them:
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Import Options -->
                <div class="space-y-3 mb-6">
                    <label class="flex items-start gap-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
                        <input type="radio" name="importMode" value="merge" checked class="mt-1">
                        <div>
                            <p class="font-medium text-gray-800 dark:text-gray-100">🔄 Merge with existing data</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Keep current scans and add imported ones</p>
                        </div>
                    </label>
                    
                    <label class="flex items-start gap-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-red-500 transition">
                        <input type="radio" name="importMode" value="replace" class="mt-1">
                        <div>
                            <p class="font-medium text-gray-800 dark:text-gray-100">⚠️ Replace existing data</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Delete current scans and use only imported data</p>
                        </div>
                    </label>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button onclick="document.getElementById('importConfirmModal').remove()" 
                            class="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        Cancel
                    </button>
                    <button onclick="proceedWithImport()" 
                            class="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                        Import Data
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    // Store sync data temporarily
    window.tempSyncData = syncData;
}

// ==============================================
// PROCEED WITH IMPORT
// ==============================================

window.proceedWithImport = function() {
    const syncData = window.tempSyncData;
    if (!syncData) return;
    
    const importMode = document.querySelector('input[name="importMode"]:checked')?.value;
    
    if (!importMode) {
        alert('Please select an import mode');
        return;
    }
    
    // Get current scans
    let currentScans = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');
    
    // Convert imported data to scannedQRCodes format
    const importedScans = syncData.scannedStudents.map(student => ({
        data: JSON.stringify({
            name: student.studentName,
            number: student.studentNumber,
            strand: student.strand,
            strandCategory: student.strandCategory,
            grade: student.grade,
            section: student.section,
            scannedBy: student.scannedBy,
            scannedByUsername: student.scannedByUsername
        }),
        timestamp: student.timestamp,
        name: student.studentName
    }));
    
    let finalScans;
    
    if (importMode === 'replace') {
        // Replace mode - use only imported data
        finalScans = importedScans;
    } else {
        // Merge mode - combine and remove duplicates
        const mergedMap = new Map();
        
        // Add current scans first
        currentScans.forEach(scan => {
            const key = scan.data + scan.timestamp;
            mergedMap.set(key, scan);
        });
        
        // Add imported scans (will overwrite if same key)
        importedScans.forEach(scan => {
            const key = scan.data + scan.timestamp;
            mergedMap.set(key, scan);
        });
        
        finalScans = Array.from(mergedMap.values());
        
        // Sort by timestamp (newest first)
        finalScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // Save to localStorage
    localStorage.setItem('scannedQRCodes', JSON.stringify(finalScans));
    
    // Also save to CrossDeviceSync server
    finalScans.forEach(scan => {
        try {
            const studentData = JSON.parse(scan.data);
            CrossDeviceSync.saveScanToServer({
                studentName: studentData.name,
                studentNumber: studentData.number,
                strand: studentData.strand,
                strandCategory: studentData.strandCategory,
                grade: studentData.grade,
                section: studentData.section,
                scannedBy: studentData.scannedBy,
                scannedByUsername: studentData.scannedByUsername,
                timestamp: scan.timestamp
            });
        } catch (e) {
            console.error('Error syncing to server:', e);
        }
    });
    
    // Close modal
    document.getElementById('importConfirmModal').remove();
    
    // Show success modal
    showSyncSuccessModal('import', importedScans.length, importMode);
    
    // Update dashboard
    updateDashboard();
    
    // Clean up temp data
    delete window.tempSyncData;
};

// ==============================================
// SYNC SUCCESS MODAL
// ==============================================

function showSyncSuccessModal(type, count, mode = null) {
    const isExport = type === 'export';
    
    const modalHTML = `
        <div id="syncSuccessModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        ${isExport ? '✅ Export Successful!' : '✅ Import Successful!'}
                    </h3>
                    
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        ${isExport 
                            ? `Successfully exported ${count} student records.` 
                            : `Successfully ${mode === 'replace' ? 'replaced with' : 'imported'} ${count} student records.`
                        }
                    </p>
                    
                    ${isExport ? `
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 text-left">
                        <p class="text-sm text-blue-700 dark:text-blue-300 mb-2">📱 <strong>To restore on another device:</strong></p>
                        <ol class="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Copy the downloaded file to the other device</li>
                            <li>Login as the same teacher</li>
                            <li>Go to Teacher Dashboard</li>
                            <li>Click "Import Sync File"</li>
                            <li>Select the file you just saved</li>
                        </ol>
                    </div>
                    ` : `
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                        <p class="text-sm text-blue-700 dark:text-blue-300">
                            ${mode === 'replace' 
                                ? '⚠️ Previous data has been replaced' 
                                : '🔄 Data has been merged with existing records'
                            }
                        </p>
                    </div>
                    `}
                    
                    <button onclick="document.getElementById('syncSuccessModal').remove()" 
                            class="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                        ${isExport ? 'Done' : 'View Dashboard'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    // Auto-close after 8 seconds for export
    if (isExport) {
        setTimeout(() => {
            const modal = document.getElementById('syncSuccessModal');
            if (modal) modal.remove();
        }, 8000);
    }
}

// ==============================================
// CONTINUE WITH EXISTING CODE BELOW
// ==============================================