const SIMPLE_TEACHERS = [
    {
        id: 1,
        username: "sir.jhino",
        password: "icpmeyc2025",
        fullName: "Jhino Lazaro",
        position: "ICP Teacher",
        welcomeMessage:"Welcome Sir Jhino Lazaro! Your class awaits."
    },
    {
        id: 2,
        username: "sir.allen", 
        password: "icpmeyc2025",
        fullName: "Allen Jay Cruz",
        position: "ICP SHS Teacher",
        welcomeMessage: "Welcome Sir Allen! new day, new knowledge"
    },
    {
        id: 3,
        username: "sir.zyreel",
        password: "icpmeyc2025",
        fullName: "Zyreel Liquiran",
        position: "ICP SHS Teacher",
        welcomeMessage: "Good day Sir Zy! Let's make today productive!"
    },
    {
    id: 4,
    username: "sir.chester",
    password: "icpmeyc2025",
    fullName: "Chester Pineda",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Sir Chester! Your students are all set!"
    },
    {
    id: 5,
    username: "maam.julie",
    password: "icpmeyc2025",
    fullName: "Julie Ann Victoriano",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Ma'am Julie! Ready for another great lesson?"
    },
    {
    id: 6,
    username: "sir.paulo",
    password: "icpmeyc2025",
    fullName: "Paulo Gatbonton",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Sir Paulo! Let’s make today awesome!"
    },
    {
    id: 7,
    username: "maam.cherielyn",
    password: "icpmeyc2025",
    fullName: "Cherielyn Surio",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Ma’am Cherielyn! Let the learning begin!"
    },
    {
    id: 8,
    username: "sir.charlie",
    password: "icpmeyc2025",
    fullName: "Charlie Leal Mercader",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Sir Charlie! Ready to learn and have fun"
    },
    {
    id: 9,
    username: "maam.georgi",
    password: "icpmeyc2025",
    fullName: "Georgi Dela Peña",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome athletes! Ready for some exercise?"
    },
    {
    id: 10,
    username: "sir.reymark",
    password: "icpmeyc2025",
    fullName: "Reymark Dacillo",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Sir Reymark! Ready to learn and have fun?"
    },
    {
    id: 11,
    username: "maam.singcol",
    password: "icpmeyc2025",
    fullName: "Cristina Singcol",
    position: "ICP SHS Teacher",
    welcomeMessage: "Welcome Ma’am Jacquilyn! We’re ready for today’s lessons"
    }
];

window.SimpleLogin = {
    checkLogin(username, password) {
        const teacher = SIMPLE_TEACHERS.find(t => 
            t.username === username && t.password === password
        );
        
        if (teacher) {
            localStorage.setItem('current_teacher', JSON.stringify({
                id: teacher.id,
                username: teacher.username,
                fullName: teacher.fullName,
                position: teacher.position,
                welcomeMessage: teacher.welcomeMessage
            }));
            
            localStorage.setItem('is_logged_in', 'true');
            
            return {
                success: true,
                teacher: {
                    id: teacher.id,
                    username: teacher.username,
                    fullName: teacher.fullName,
                    position: teacher.position,
                    welcomeMessage: teacher.welcomeMessage
                }
            };
        }
        
        return {
            success: false,
            message: "Wrong username or password"
        };
    },
    
    // Get current teacher
    getCurrentTeacher() {
        const data = localStorage.getItem('current_teacher');
        return data ? JSON.parse(data) : null;
    },
    
    // Logout
    logout() {
        localStorage.removeItem('current_teacher');
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('teacher_name');
    },
    
    // Check if logged in
    isLoggedIn() {
        return localStorage.getItem('is_logged_in') === 'true';
    }
};

// ==============================================
// TEACHER-SPECIFIC DATA STORAGE
// For per-teacher dashboard functionality
// ==============================================

window.TeacherStorage = {
    // Save scan to specific teacher
    saveScan(teacherId, qrData) {
        const key = `teacher_${teacherId}_scans`;
        const scans = JSON.parse(localStorage.getItem(key) || '[]');
        
        const scanRecord = {
            data: qrData,
            timestamp: new Date().toISOString(),
            teacherId: teacherId
        };
        
        scans.unshift(scanRecord); // Add to beginning
        localStorage.setItem(key, JSON.stringify(scans));
        return scanRecord;
    },
    
    // Get all scans for a teacher
    getScans(teacherId) {
        const key = `teacher_${teacherId}_scans`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    
    // Clear scans for a teacher
    clearScans(teacherId) {
        const key = `teacher_${teacherId}_scans`;
        localStorage.removeItem(key);
    },
    
    // Clear ALL teacher data (for debugging)
    clearAllTeacherData() {
        // Clear all teacher scans
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('teacher_') && key.endsWith('_scans')) {
                localStorage.removeItem(key);
            }
        }
    },
    
    // Get teacher statistics
    getStats(teacherId) {
        const scans = this.getScans(teacherId);
        const today = new Date().toDateString();
        
        const todayScans = scans.filter(scan => {
            const scanDate = new Date(scan.timestamp).toDateString();
            return scanDate === today;
        });
        
        const uniqueStudents = new Set();
        scans.forEach(scan => {
            try {
                const data = JSON.parse(scan.data);
                if (data.number) uniqueStudents.add(data.number);
            } catch (e) {}
        });
        
        // Get last week/month stats
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const weekScans = scans.filter(scan => 
            new Date(scan.timestamp) >= oneWeekAgo
        );
        
        const monthScans = scans.filter(scan => 
            new Date(scan.timestamp) >= oneMonthAgo
        );
        
        return {
            total: scans.length,
            today: todayScans.length,
            week: weekScans.length,
            month: monthScans.length,
            unique: uniqueStudents.size,
            lastScan: scans.length > 0 ? new Date(scans[0].timestamp) : null
        };
    },
    
    // Export teacher data
    exportData(teacherId) {
        const scans = this.getScans(teacherId);
        return JSON.stringify({
            teacherId: teacherId,
            teacher: SimpleLogin.getCurrentTeacher(),
            exportDate: new Date().toISOString(),
            totalRecords: scans.length,
            scans: scans
        }, null, 2);
    },
    
    // Import teacher data
    importData(teacherId, data) {
        try {
            const parsed = JSON.parse(data);
            const key = `teacher_${teacherId}_scans`;
            
            // Validate imported data
            if (parsed.scans && Array.isArray(parsed.scans)) {
                localStorage.setItem(key, JSON.stringify(parsed.scans));
                return {
                    success: true,
                    count: parsed.scans.length,
                    message: `Imported ${parsed.scans.length} scans`
                };
            } else {
                return {
                    success: false,
                    message: "Invalid data format"
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Error parsing data: " + error.message
            };
        }
    },
    
    // Get scan summary by date
    getDailySummary(teacherId) {
        const scans = this.getScans(teacherId);
        const summary = {};
        
        scans.forEach(scan => {
            try {
                const date = new Date(scan.timestamp).toDateString();
                if (!summary[date]) {
                    summary[date] = {
                        date: date,
                        count: 0,
                        students: new Set()
                    };
                }
                
                summary[date].count++;
                const data = JSON.parse(scan.data);
                if (data.number) {
                    summary[date].students.add(data.number);
                }
            } catch (e) {}
        });
        
        // Convert to array
        return Object.values(summary).map(day => ({
            date: day.date,
            totalScans: day.count,
            uniqueStudents: day.students.size
        }));
    },
    
    // Get student attendance summary
    getStudentAttendance(teacherId) {
        const scans = this.getScans(teacherId);
        const studentMap = {};
        
        scans.forEach(scan => {
            try {
                const data = JSON.parse(scan.data);
                if (data.number) {
                    if (!studentMap[data.number]) {
                        studentMap[data.number] = {
                            name: data.name || 'Unknown',
                            number: data.number,
                            strand: data.strand || 'N/A',
                            section: data.section || 'N/A',
                            scanCount: 0,
                            firstScan: new Date(scan.timestamp),
                            lastScan: new Date(scan.timestamp)
                        };
                    }
                    
                    studentMap[data.number].scanCount++;
                    const scanDate = new Date(scan.timestamp);
                    
                    if (scanDate < studentMap[data.number].firstScan) {
                        studentMap[data.number].firstScan = scanDate;
                    }
                    
                    if (scanDate > studentMap[data.number].lastScan) {
                        studentMap[data.number].lastScan = scanDate;
                    }
                }
            } catch (e) {}
        });
        
        return Object.values(studentMap);
    }
};

// ==============================================
// TEACHER MANAGEMENT FUNCTIONS
// ==============================================

window.TeacherManager = {
    // Get all teachers (for admin purposes)
    getAllTeachers() {
        return SIMPLE_TEACHERS;
    },
    
    // Get teacher by ID
    getTeacherById(id) {
        return SIMPLE_TEACHERS.find(t => t.id === parseInt(id));
    },
    
    // Add new teacher (for future expansion)
    addTeacher(teacherData) {
        // Generate new ID
        const newId = SIMPLE_TEACHERS.length > 0 
            ? Math.max(...SIMPLE_TEACHERS.map(t => t.id)) + 1 
            : 1;
        
        const newTeacher = {
            id: newId,
            ...teacherData
        };
        
        // Note: This would need backend integration in real app
        console.log('New teacher added (simulated):', newTeacher);
        return newTeacher;
    },
    
    // Update teacher
    updateTeacher(id, teacherData) {
        const index = SIMPLE_TEACHERS.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            // Note: This would need backend integration
            console.log('Teacher updated (simulated):', teacherData);
            return true;
        }
        return false;
    },
    
    // Check if username exists
    usernameExists(username) {
        return SIMPLE_TEACHERS.some(t => t.username === username);
    }
};

// ==============================================
// BACKUP & RESTORE TEACHER DATA
// ==============================================

window.TeacherBackup = {
    // Backup all teacher data
    backupAllData() {
        const backup = {
            version: '1.0',
            backupDate: new Date().toISOString(),
            teachers: []
        };
        
        // Get all teacher data
        SIMPLE_TEACHERS.forEach(teacher => {
            const scans = TeacherStorage.getScans(teacher.id);
            if (scans.length > 0) {
                backup.teachers.push({
                    teacherId: teacher.id,
                    teacherInfo: teacher,
                    scans: scans,
                    stats: TeacherStorage.getStats(teacher.id)
                });
            }
        });
        
        return JSON.stringify(backup, null, 2);
    },
    
    // Restore from backup
    restoreFromBackup(backupData) {
        try {
            const backup = JSON.parse(backupData);
            
            if (backup.version !== '1.0') {
                return {
                    success: false,
                    message: "Unsupported backup version"
                };
            }
            
            let totalRestored = 0;
            backup.teachers.forEach(teacherData => {
                const key = `teacher_${teacherData.teacherId}_scans`;
                localStorage.setItem(key, JSON.stringify(teacherData.scans));
                totalRestored += teacherData.scans.length;
            });
            
            return {
                success: true,
                message: `Restored ${totalRestored} scans for ${backup.teachers.length} teachers`
            };
            
        } catch (error) {
            return {
                success: false,
                message: "Error restoring backup: " + error.message
            };
        }
    },
    
    // Export teacher-specific backup
    exportTeacherBackup(teacherId) {
        const teacher = SimpleLogin.getCurrentTeacher();
        if (!teacher || teacher.id !== teacherId) {
            return null;
        }
        
        const scans = TeacherStorage.getScans(teacherId);
        const stats = TeacherStorage.getStats(teacherId);
        
        const backup = {
            version: '1.0',
            backupDate: new Date().toISOString(),
            teacher: teacher,
            stats: stats,
            scans: scans,
            summary: {
                totalScans: scans.length,
                uniqueStudents: stats.unique,
                dateRange: scans.length > 0 ? {
                    from: new Date(scans[scans.length - 1].timestamp),
                    to: new Date(scans[0].timestamp)
                } : null
            }
        };
        
        return JSON.stringify(backup, null, 2);
    }
};

// ==============================================
// INITIALIZATION
// ==============================================

// Initialize teacher data on first load
(function initTeacherStorage() {
    // Create empty scan arrays for each teacher if they don't exist
    SIMPLE_TEACHERS.forEach(teacher => {
        const key = `teacher_${teacher.id}_scans`;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    });
    
    console.log('Teacher storage initialized');
})();

// Add this to teachers_db.js after the existing functions:

// Get teacher display name
SimpleLogin.getTeacherName = function() {
    const currentTeacher = this.getCurrentTeacher();
    return currentTeacher ? currentTeacher.fullName : null;
};

// Get teacher username
SimpleLogin.getTeacherUsername = function() {
    const currentTeacher = this.getCurrentTeacher();
    return currentTeacher ? currentTeacher.username : null;
};

// Check if specific teacher is logged in
SimpleLogin.isTeacherLoggedIn = function(username) {
    const currentTeacher = this.getCurrentTeacher();
    return currentTeacher && currentTeacher.username === username;
};

// Get teacher position (CHANGED: department -> position)
SimpleLogin.getTeacherDepartment = function() {
    const currentTeacher = this.getCurrentTeacher();
    return currentTeacher ? currentTeacher.position : null; // CHANGED: .position
};