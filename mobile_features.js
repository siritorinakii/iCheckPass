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