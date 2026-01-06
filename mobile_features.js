// Mobile-specific features
const MobileApp = {
    // Save to device storage
    exportToDevice() {
        const scans = MockDatabase.attendance;
        if (scans.length === 0) {
            alert('No data to export');
            return;
        }
        
        const csv = MockAPI.exportCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Exported ${scans.length} records to CSV`);
    },
    
    // Backup all data
    backupData() {
        const backup = {
            users: MockDatabase.users,
            students: MockDatabase.students,
            attendance: MockDatabase.attendance,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `icheckpass_backup_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Backup created successfully!');
    },
    
    // Restore from backup
    restoreData(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Validate backup structure
                if (backup.users && backup.students && backup.attendance) {
                    if (confirm('Restore will overwrite current data. Continue?')) {
                        MockDatabase.users = backup.users;
                        MockDatabase.students = backup.students;
                        MockDatabase.attendance = backup.attendance;
                        MockDatabase.save();
                        
                        // Reload page to refresh data
                        location.reload();
                    }
                } else {
                    alert('Invalid backup file format');
                }
            } catch (error) {
                alert('Error reading backup file: ' + error.message);
            }
        };
        reader.readAsText(file);
    },
    
    // QR Code Scanner for mobile (using device camera)
    initMobileScanner() {
        // Check if mobile device
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Camera not available on this device');
            return false;
        }
        
        // Use device camera
        return true;
    },
    
    // Share QR Code
    shareQRCode(qrData) {
        if (navigator.share) {
            navigator.share({
                title: 'My iCheckPass QR Code',
                text: 'Scan this QR code for attendance',
                url: qrData
            }).catch(error => console.log('Sharing cancelled:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(qrData)
                .then(() => alert('QR data copied to clipboard'))
                .catch(() => alert('Failed to copy QR data'));
        }
    },
    
    // Check device features
    checkDeviceFeatures() {
        const features = {
            camera: !!navigator.mediaDevices?.getUserMedia,
            storage: !!window.localStorage,
            clipboard: !!navigator.clipboard,
            share: !!navigator.share,
            online: navigator.onLine
        };
        
        console.log('Device features:', features);
        return features;
    }
};

// Add to global scope
window.MobileApp = MobileApp;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    MobileApp.checkDeviceFeatures();
    
    // Add mobile menu if on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        MobileApp.addMobileMenu();
    }
});

// Simple server simulation using localStorage sync
class SimpleServer {
    constructor() {
        this.key = 'icheckpass_server_data';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify({
                scans: [],
                students: [],
                teachers: []
            }));
        }
    }

    // Add scan (works cross-device)
    addScan(scanData) {
        const data = JSON.parse(localStorage.getItem(this.key));
        data.scans.unshift({
            ...scanData,
            device: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.key, JSON.stringify(data));
        return true;
    }

    // Get student scans
    getStudentScans(studentNumber) {
        const data = JSON.parse(localStorage.getItem(this.key));
        return data.scans.filter(scan => 
            scan.data && JSON.parse(scan.data).number === studentNumber
        );
    }
}

window.Server = new SimpleServer();

// Usage:
// Instead of localStorage, use: Server.addScan(scanData)
// Instead of filtering, use: Server.getStudentScans(studentNumber)

// mobile_features.js - ADD THIS AT THE END

// ==============================================
// CROSS-DEVICE SYNC SIMULATION
// ==============================================

const CrossDeviceSync = {
    serverKey: 'icheckpass_server_simulation',
    maxSyncAttempts: 3,
    
    // Initialize server
    initServer() {
        if (!localStorage.getItem(this.serverKey)) {
            localStorage.setItem(this.serverKey, JSON.stringify({
                scans: [],
                lastSync: new Date().toISOString(),
                version: '1.0'
            }));
        }
        console.log('Cross-device sync server initialized');
    },
    
    // Save scan to server (simulated)
    saveScanToServer(scanData) {
        const server = this.getServerData();
        
        server.scans.unshift({
            ...scanData,
            deviceId: this.getDeviceId(),
            syncTime: new Date().toISOString(),
            syncId: Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        });
        
        // Keep only last 1000 scans
        if (server.scans.length > 1000) {
            server.scans.pop();
        }
        
        server.lastSync = new Date().toISOString();
        this.saveServerData(server);
        
        console.log('Scan saved to server simulation:', scanData.studentNumber);
        return true;
    },
    
    // Get scans for specific student
    getStudentScans(studentNumber) {
        const server = this.getServerData();
        return server.scans.filter(scan => 
            scan.studentNumber === studentNumber
        );
    },
    
    // Get all scans (for debugging)
    getAllScans() {
        return this.getServerData().scans;
    },
    
    // Get server data
    getServerData() {
        try {
            const data = localStorage.getItem(this.serverKey);
            return data ? JSON.parse(data) : { scans: [], lastSync: null };
        } catch (e) {
            return { scans: [], lastSync: null };
        }
    },
    
    // Save server data
    saveServerData(data) {
        try {
            localStorage.setItem(this.serverKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving server data:', e);
            return false;
        }
    },
    
    // Generate unique device ID
    getDeviceId() {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    },
    
    // Sync between tabs/windows (same browser)
    setupTabSync() {
        // Listen for storage events (cross-tab sync)
        window.addEventListener('storage', (event) => {
            if (event.key === this.serverKey) {
                console.log('Data synced from another tab');
                
                // Update UI if student dashboard is open
                const savedStudentQR = localStorage.getItem('studentQR');
                if (savedStudentQR) {
                    try {
                        const studentData = JSON.parse(savedStudentQR);
                        if (document.getElementById('studentDashboardSection') && 
                            !document.getElementById('studentDashboardSection').classList.contains('hidden')) {
                            updateStudentDashboard(studentData);
                        }
                    } catch (e) {}
                }
            }
        });
    },
    
    // Export server data (for backup)
    exportServerData() {
        const server = this.getServerData();
        return JSON.stringify({
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalScans: server.scans.length,
            scans: server.scans,
            summary: {
                uniqueStudents: [...new Set(server.scans.map(s => s.studentNumber))].length,
                uniqueTeachers: [...new Set(server.scans.map(s => s.scannedBy))].length,
                dateRange: server.scans.length > 0 ? {
                    oldest: server.scans[server.scans.length - 1].syncTime,
                    newest: server.scans[0].syncTime
                } : null
            }
        }, null, 2);
    },
    
    // Import server data
    importServerData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveServerData({
                scans: data.scans || [],
                lastSync: new Date().toISOString(),
                version: '1.0'
            });
            return { success: true, count: data.scans?.length || 0 };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    // Cleanup old data (older than 60 days)
    cleanupOldData() {
        const server = this.getServerData();
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const originalLength = server.scans.length;
        server.scans = server.scans.filter(scan => {
            const scanDate = new Date(scan.syncTime || scan.timestamp);
            return scanDate > sixtyDaysAgo;
        });
        
        if (server.scans.length < originalLength) {
            this.saveServerData(server);
            console.log(`Cleaned up ${originalLength - server.scans.length} old scans`);
        }
    }
};

// Initialize on load
CrossDeviceSync.initServer();
CrossDeviceSync.setupTabSync();
CrossDeviceSync.cleanupOldData();

// Add to global scope
window.CrossDeviceSync = CrossDeviceSync;