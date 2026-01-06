// cross_device_sync.js
window.CrossDeviceSync = {
    SERVER_KEY: 'icheckpass_cross_device_server',
    TEACHERS_DATA_KEY: 'icheckpass_teachers_global_data',
    STUDENT_SCANS_KEY: 'icheckpass_student_scans_global',
    
    // Initialize cross-device storage
    init() {
        if (!localStorage.getItem(this.SERVER_KEY)) {
            localStorage.setItem(this.SERVER_KEY, JSON.stringify({
                lastSync: new Date().toISOString(),
                devices: {},
                version: '2.0'
            }));
        }
        
        if (!localStorage.getItem(this.TEACHERS_DATA_KEY)) {
            localStorage.setItem(this.TEACHERS_DATA_KEY, JSON.stringify({
                teachers: {},
                lastUpdate: new Date().toISOString()
            }));
        }
        
        if (!localStorage.getItem(this.STUDENT_SCANS_KEY)) {
            localStorage.setItem(this.STUDENT_SCANS_KEY, JSON.stringify([]));
        }
        
        console.log('✅ Cross-device sync initialized');
    },
    
    // ==============================================
    // TEACHER DATA SYNC (Cross-Device)
    // ==============================================
    
    // Save teacher scan to cross-device storage
    saveTeacherScan(teacherId, scanData) {
        try {
            // Get current teacher data
            const teachersData = JSON.parse(localStorage.getItem(this.TEACHERS_DATA_KEY) || '{}');
            
            if (!teachersData.teachers) teachersData.teachers = {};
            if (!teachersData.teachers[teacherId]) {
                teachersData.teachers[teacherId] = {
                    scans: [],
                    info: SimpleLogin.getTeacherById(teacherId) || { id: teacherId }
                };
            }
            
            // Generate unique scan ID
            const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const enhancedScan = {
                ...scanData,
                scanId: scanId,
                teacherId: teacherId,
                deviceId: this.getDeviceId(),
                syncTime: new Date().toISOString(),
                timestamp: scanData.timestamp || new Date().toISOString()
            };
            
            // Check for duplicates (same student, same day, same teacher)
            const isDuplicate = teachersData.teachers[teacherId].scans.some(existingScan => {
                try {
                    const existingData = JSON.parse(existingScan.data);
                    const newData = JSON.parse(scanData.data);
                    
                    // If same student number and same day
                    if (existingData.number === newData.number) {
                        const existingDate = new Date(existingScan.timestamp).toDateString();
                        const newDate = new Date(scanData.timestamp).toDateString();
                        return existingDate === newDate;
                    }
                } catch (e) {}
                return false;
            });
            
            if (!isDuplicate) {
                teachersData.teachers[teacherId].scans.unshift(enhancedScan);
                
                // Keep only last 1000 scans per teacher
                if (teachersData.teachers[teacherId].scans.length > 1000) {
                    teachersData.teachers[teacherId].scans.pop();
                }
                
                teachersData.lastUpdate = new Date().toISOString();
                localStorage.setItem(this.TEACHERS_DATA_KEY, JSON.stringify(teachersData));
                
                console.log(`✅ Scan saved to cross-device storage for teacher ${teacherId}`);
                
                // Also update device registry
                this.registerDeviceActivity();
                
                return {
                    success: true,
                    scanId: scanId,
                    message: 'Scan saved to all devices'
                };
            } else {
                return {
                    success: false,
                    message: 'Duplicate scan (same student already scanned today)'
                };
            }
            
        } catch (error) {
            console.error('❌ Cross-device save error:', error);
            return {
                success: false,
                message: 'Failed to sync across devices'
            };
        }
    },
    
    // Get all teacher scans from cross-device storage
    getTeacherScans(teacherId) {
        try {
            const teachersData = JSON.parse(localStorage.getItem(this.TEACHERS_DATA_KEY) || '{}');
            return teachersData.teachers?.[teacherId]?.scans || [];
        } catch (error) {
            console.error('❌ Error getting teacher scans:', error);
            return [];
        }
    },
    
    // Merge local teacher scans with cross-device storage
    syncTeacherData(teacherId) {
        console.log(`🔄 Syncing teacher ${teacherId} data across devices...`);
        
        // Get local scans
        const localScans = TeacherStorage.getScans(teacherId);
        
        // Get cross-device scans
        const cloudScans = this.getTeacherScans(teacherId);
        
        let uploaded = 0;
        let downloaded = 0;
        
        // Upload local scans to cloud
        localScans.forEach(localScan => {
            const existsInCloud = cloudScans.some(cloudScan => 
                cloudScan.data === localScan.data && 
                Math.abs(new Date(cloudScan.timestamp) - new Date(localScan.timestamp)) < 60000
            );
            
            if (!existsInCloud) {
                this.saveTeacherScan(teacherId, localScan);
                uploaded++;
            }
        });
        
        // Download cloud scans to local
        cloudScans.forEach(cloudScan => {
            const existsLocally = localScans.some(localScan => 
                localScan.data === cloudScan.data && 
                Math.abs(new Date(localScan.timestamp) - new Date(cloudScan.timestamp)) < 60000
            );
            
            if (!existsLocally) {
                TeacherStorage.saveScan(teacherId, cloudScan);
                downloaded++;
            }
        });
        
        console.log(`✅ Sync complete: +${downloaded} downloaded, ↑${uploaded} uploaded`);
        
        return {
            uploaded,
            downloaded,
            totalLocal: TeacherStorage.getScans(teacherId).length,
            totalCloud: this.getTeacherScans(teacherId).length
        };
    },
    
    // ==============================================
    // STUDENT DATA SYNC (For Student Dashboard)
    // ==============================================
    
    // Save student scan to global student database
    saveStudentScan(studentData) {
        try {
            const studentScans = JSON.parse(localStorage.getItem(this.STUDENT_SCANS_KEY) || '[]');
            
            // Generate unique ID
            const scanId = `student_scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const enhancedStudentScan = {
                ...studentData,
                scanId: scanId,
                syncTime: new Date().toISOString(),
                deviceId: this.getDeviceId()
            };
            
            // Add to array
            studentScans.unshift(enhancedStudentScan);
            
            // Keep only last 5000 student scans
            if (studentScans.length > 5000) {
                studentScans.pop();
            }
            
            localStorage.setItem(this.STUDENT_SCANS_KEY, JSON.stringify(studentScans));
            
            console.log(`✅ Student scan saved to cross-device database: ${studentData.studentName || 'Unknown'}`);
            
            return {
                success: true,
                scanId: scanId
            };
            
        } catch (error) {
            console.error('❌ Student scan save error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    },
    
    // Get all scans for a specific student
    getStudentScans(studentNumber) {
        try {
            const allScans = JSON.parse(localStorage.getItem(this.STUDENT_SCANS_KEY) || '[]');
            
            // Filter for this student
            return allScans.filter(scan => {
                try {
                    if (scan.studentNumber) {
                        return scan.studentNumber === studentNumber;
                    }
                    
                    // Also check if data is in JSON format
                    if (scan.data) {
                        const data = JSON.parse(scan.data);
                        return data.number === studentNumber;
                    }
                } catch (e) {}
                return false;
            }).sort((a, b) => new Date(b.timestamp || b.syncTime) - new Date(a.timestamp || a.syncTime));
            
        } catch (error) {
            console.error('❌ Error getting student scans:', error);
            return [];
        }
    },
    
    // ==============================================
    // DEVICE MANAGEMENT
    // ==============================================
    
    // Get or create device ID
    getDeviceId() {
        let deviceId = localStorage.getItem('icheckpass_device_id');
        if (!deviceId) {
            deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('icheckpass_device_id', deviceId);
        }
        return deviceId;
    },
    
    // Register device activity
    registerDeviceActivity() {
        try {
            const serverData = JSON.parse(localStorage.getItem(this.SERVER_KEY) || '{}');
            
            if (!serverData.devices) serverData.devices = {};
            
            const deviceId = this.getDeviceId();
            
            serverData.devices[deviceId] = {
                lastActive: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };
            
            serverData.lastSync = new Date().toISOString();
            
            localStorage.setItem(this.SERVER_KEY, JSON.stringify(serverData));
            
        } catch (error) {
            console.error('Device registration error:', error);
        }
    },
    
    // Get all active devices
    getActiveDevices() {
        try {
            const serverData = JSON.parse(localStorage.getItem(this.SERVER_KEY) || '{}');
            return serverData.devices || {};
        } catch (error) {
            return {};
        }
    },
    
    // ==============================================
    // AUTO-SYNC SYSTEM
    // ==============================================
    
    // Auto-sync on login
    autoSyncOnLogin(teacherId) {
        if (!teacherId) return;
        
        console.log(`🔄 AUTO-SYNC starting for teacher ${teacherId}...`);
        
        // 1. Sync teacher data
        const teacherSyncResult = this.syncTeacherData(teacherId);
        
        // 2. Register device
        this.registerDeviceActivity();
        
        // 3. Show notification if new data
        if (teacherSyncResult.downloaded > 0) {
            this.showSyncNotification(teacherSyncResult.downloaded);
        }
        
        // 4. Update dashboard if open
        if (typeof updateDashboard === 'function') {
            setTimeout(() => updateDashboard(), 1000);
        }
        
        return teacherSyncResult;
    },
    
    // Manual sync trigger
    manualSync(teacherId) {
        if (!teacherId) {
            const teacher = SimpleLogin.getCurrentTeacher();
            if (teacher) teacherId = teacher.id;
        }
        
        if (!teacherId) {
            alert('Please login as teacher first!');
            return;
        }
        
        const result = this.autoSyncOnLogin(teacherId);
        
        if (result) {
            alert(`Sync complete!\n• Downloaded: ${result.downloaded} scans\n• Uploaded: ${result.uploaded} scans\n• Total scans: ${result.totalLocal}`);
        }
    },
    
    // Show sync notification
    showSyncNotification(newScansCount) {
        // Remove existing notification
        const existingNotif = document.getElementById('syncNotification');
        if (existingNotif) existingNotif.remove();
        
        const notification = document.createElement('div');
        notification.id = 'syncNotification';
        notification.className = 'fixed top-20 right-4 z-[99999] animate-slideInRight';
        notification.innerHTML = `
            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-xl border border-green-200 dark:border-green-800 p-4 max-w-sm">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">Sync Complete!</h4>
                        <p class="text-gray-600 dark:text-gray-300 text-xs">
                            <span class="font-bold text-green-600">${newScansCount} new scans</span> downloaded from other devices
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            All your attendance data is now up to date
                        </p>
                    </div>
                    <button onclick="document.getElementById('syncNotification').remove()" class="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },
    
    // ==============================================
    // STATISTICS & REPORTING
    // ==============================================
    
    // Get sync statistics
    getSyncStats(teacherId) {
        const localScans = TeacherStorage.getScans(teacherId);
        const cloudScans = this.getTeacherScans(teacherId);
        const activeDevices = this.getActiveDevices();
        
        return {
            teacherId: teacherId,
            localScans: localScans.length,
            cloudScans: cloudScans.length,
            activeDevices: Object.keys(activeDevices).length,
            lastSync: localStorage.getItem(`last_sync_${teacherId}`) || 'Never',
            deviceId: this.getDeviceId(),
            storageUsed: this.calculateStorageUsage()
        };
    },
    
    // Calculate storage usage
    calculateStorageUsage() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
        return (total / 1024).toFixed(2) + ' KB';
    },
    
    // Export all data for backup
    exportAllData() {
        const teachersData = JSON.parse(localStorage.getItem(this.TEACHERS_DATA_KEY) || '{}');
        const studentScans = JSON.parse(localStorage.getItem(this.STUDENT_SCANS_KEY) || '[]');
        const serverData = JSON.parse(localStorage.getItem(this.SERVER_KEY) || '{}');
        
        const backup = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            teachersData: teachersData,
            studentScans: studentScans,
            serverData: serverData,
            summary: {
                totalTeachers: Object.keys(teachersData.teachers || {}).length,
                totalStudentScans: studentScans.length,
                activeDevices: Object.keys(serverData.devices || {}).length
            }
        };
        
        return JSON.stringify(backup, null, 2);
    },
    
    // Import backup data
    importBackup(backupData) {
        try {
            const backup = JSON.parse(backupData);
            
            if (backup.version !== '2.0') {
                return {
                    success: false,
                    message: 'Unsupported backup version'
                };
            }
            
            // Import data
            if (backup.teachersData) {
                localStorage.setItem(this.TEACHERS_DATA_KEY, JSON.stringify(backup.teachersData));
            }
            
            if (backup.studentScans) {
                localStorage.setItem(this.STUDENT_SCANS_KEY, JSON.stringify(backup.studentScans));
            }
            
            if (backup.serverData) {
                localStorage.setItem(this.SERVER_KEY, JSON.stringify(backup.serverData));
            }
            
            return {
                success: true,
                message: `Backup imported successfully\n• Teachers: ${backup.summary.totalTeachers}\n• Scans: ${backup.summary.totalStudentScans}\n• Devices: ${backup.summary.activeDevices}`
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'Error importing backup: ' + error.message
            };
        }
    },
    
    // ==============================================
    // CLEANUP & MAINTENANCE
    // ==============================================
    
    // Clean old data (auto-run daily)
    cleanupOldData() {
        try {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            
            // Clean teacher scans
            const teachersData = JSON.parse(localStorage.getItem(this.TEACHERS_DATA_KEY) || '{}');
            Object.keys(teachersData.teachers || {}).forEach(teacherId => {
                if (teachersData.teachers[teacherId]?.scans) {
                    teachersData.teachers[teacherId].scans = teachersData.teachers[teacherId].scans.filter(scan => {
                        const scanDate = new Date(scan.timestamp || scan.syncTime);
                        return scanDate > ninetyDaysAgo;
                    });
                }
            });
            
            // Clean student scans
            const studentScans = JSON.parse(localStorage.getItem(this.STUDENT_SCANS_KEY) || '[]');
            const filteredStudentScans = studentScans.filter(scan => {
                const scanDate = new Date(scan.timestamp || scan.syncTime);
                return scanDate > ninetyDaysAgo;
            });
            
            // Save cleaned data
            localStorage.setItem(this.TEACHERS_DATA_KEY, JSON.stringify(teachersData));
            localStorage.setItem(this.STUDENT_SCANS_KEY, JSON.stringify(filteredStudentScans));
            
            console.log('🧹 Old data cleaned up');
            
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    },
    
    // Get system status
    getSystemStatus() {
        return {
            initialized: true,
            lastSync: localStorage.getItem(this.SERVER_KEY) ? 
                JSON.parse(localStorage.getItem(this.SERVER_KEY)).lastSync : 'Never',
            storage: this.calculateStorageUsage(),
            deviceId: this.getDeviceId(),
            userAgent:navigator.userAgent
        };
    }
};

// Initialize on load
CrossDeviceSync.init();

// Auto-cleanup every 24 hours
setInterval(() => CrossDeviceSync.cleanupOldData(), 24 * 60 * 60 * 1000);

// Run cleanup once on load
CrossDeviceSync.cleanupOldData();

// ==============================================
// INTEGRATION WITH EXISTING SYSTEM
// ==============================================

// Override the save function in TeacherStorage to also save to cross-device
const originalSaveScan = TeacherStorage.saveScan;
TeacherStorage.saveScan = function(teacherId, qrData) {
    // Save locally first
    const result = originalSaveScan.call(this, teacherId, qrData);
    
    // Also save to cross-device storage
    setTimeout(() => {
        CrossDeviceSync.saveTeacherScan(teacherId, qrData);
    }, 100);
    
    return result;
};

// Add to TeacherCloud for backward compatibility
window.TeacherCloud = CrossDeviceSync;

// Add to cross_device_sync.js (at the end, before closing })
window.SyncManager = {
    // Manual sync with loading animation
    manualSync() {
        const teacher = SimpleLogin.getCurrentTeacher();
        if (!teacher) {
            alert('Please login as teacher first!');
            return;
        }
        
        // Get the sync button
        const syncBtn = document.getElementById('syncAllDevicesBtn');
        if (syncBtn) {
            // Show loading state
            syncBtn.disabled = true;
            const originalHTML = syncBtn.innerHTML;
            syncBtn.innerHTML = '<div class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Syncing...</span></div>';
            
            // Perform sync
            setTimeout(() => {
                const result = CrossDeviceSync.autoSyncOnLogin(teacher.id);
                
                // Restore button
                syncBtn.disabled = false;
                syncBtn.innerHTML = originalHTML;
                
                // Show result
                if (result) {
                    this.showSyncResult(result);
                }
            }, 500);
        } else {
            // Fallback if button not found
            const result = CrossDeviceSync.autoSyncOnLogin(teacher.id);
            if (result) {
                this.showSyncResult(result);
            }
        }
    },
    
    // Show sync result in a nice modal
    showSyncResult(result) {
        // Remove existing modal
        const existingModal = document.getElementById('syncResultModal');
        if (existingModal) existingModal.remove();
        
        const modalHTML = `
            <div id="syncResultModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
                <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sync Complete!</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Data synchronized across all devices</p>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Downloaded scans</span>
                            <span class="font-bold text-green-600">${result.downloaded}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Uploaded scans</span>
                            <span class="font-bold text-blue-600">${result.uploaded}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Total scans</span>
                            <span class="font-bold text-purple-600">${result.totalLocal}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="document.getElementById('syncResultModal').remove()" class="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            Close
                        </button>
                        <button onclick="location.reload()" class="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
    }
};

// Make it globally accessible
CrossDeviceSync.manualSync = function() {
    return SyncManager.manualSync();
};