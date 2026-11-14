# El-Hadar Projects - Manpower Report System

A simplified daily manpower tracking and approval system for construction projects.

## 🎯 Features

### Core Functionality
- **Manpower Tracking**
  - Direct Manpower (trades, contractors)
  - Indirect Manpower (staff, engineers)
  - Automatic pay calculations (Normal + OT)
  - OT multipliers: 1.5x, 1.75x, 2.0x, 2.5x
  - File attachments per entry
  
- **Safety Tracking**
  - LTI (Lost Time Incidents)
  - Near Misses
  - Safety Observations
  - First Aid Cases
  - Toolbox Talks
  - Safety status (Green/Yellow/Red)

- **Multi-Level Approval Workflow**
  - 6-step approval process
  - Office Engineer → Project Engineer → Follow up Engineer → Project Coordinator → Project Manager → CDGM
  - Password-protected approvals
  - Approval history tracking

- **User Management**
  - Admin can create/edit/delete users
  - Role-based access control (7 roles)
  - Project-based access restrictions
  - CDGM has access to all projects

### Roles
1. **Admin** - User management only, no approval rights
2. **Office Engineer** - First approver
3. **Project Engineer** - Second approver
4. **Follow up Engineer** - Third approver
5. **Project Coordinator** - Fourth approver
6. **Project Manager** - Fifth approver
7. **CDGM** - Final approver, can edit all reports

## 🚀 Quick Start

### Installation
1. Extract all files to a folder
2. Double-click `START-HERE.bat` or open `index.html` in your browser
3. Login with default admin account:
   - **Username:** Admin
   - **Password:** admin@Elhader

### First Steps
1. Login as Admin
2. Click "👥 Users" to create user accounts
3. Assign roles and projects to each user
4. Logout and have users login with their credentials
5. Start creating manpower reports!

## 📊 Report Sections

### 1. Direct Manpower
Track trades and contractors:
- Trade/Position
- Trader Name (company/contractor)
- Quantity of workers
- Job description
- Normal working hours (default: 8)
- OT hours
- Hourly rate (Ethiopian Birr)
- OT multiplier (1.5x, 2x, 2.5x)
- **Auto-calculated:** Normal Pay, OT Pay, Total Pay
- Optional file attachment

### 2. Indirect Manpower
Track staff and management:
- Role/Position (e.g., Site Engineer, Foreman)
- Trader Name (company/contractor)
- Quantity of workers
- Normal working hours (default: 8)
- OT hours
- Hourly rate (Ethiopian Birr)
- OT multiplier (1.5x, 2x, 2.5x)
- **Auto-calculated:** Normal Pay, OT Pay, Total Pay
- Optional file attachment

### 3. Safety
Track safety metrics:
- Lost Time Incidents (LTI)
- Near Misses
- Safety Observations
- First Aid Cases
- Toolbox Talks Conducted
- Safety Status (Green/Yellow/Red)
- Safety Remarks/Details

### 4. General Notes
Free-form text for additional comments

## 🔐 Access Control

### Project Access
- Users can be assigned specific projects or "ALL"
- Users only see reports for their assigned projects
- CDGM and Admin see all projects

### Edit Permissions
- **Draft reports:** Anyone with project access can edit
- **Partially approved:** Only Admin and CDGM can edit
- **Fully approved:** Locked, no one can edit

## ✅ Approval Workflow

### Process
1. User creates report (Draft status)
2. Reports follow sequential approval:
   - Office Engineer approves first
   - Then Project Engineer
   - Then Follow up Engineer
   - Then Project Coordinator
   - Then Project Manager
   - Finally CDGM
3. Each approver must enter their password
4. After final approval, report is locked

### Notifications
- Dashboard shows pending approval count
- "YOUR TURN" badge when it's your turn to approve
- Pulsing approve button for clarity

## 💾 Data Storage

All data is stored in browser localStorage:
- `dprUsers` - User accounts
- `currentUser` - Active session
- `dailyProgressReports` - All reports

**⚠️ Important:** Data is browser-specific. Use the same browser and don't clear browser data.

## 🖨️ Printing

Click "🖨 Print" in report view for a clean printable format.

## 📱 Responsive Design

Works on desktop, tablet, and mobile devices.

## 🔧 Technical Details

- **Technology:** Pure HTML, CSS, JavaScript
- **Storage:** Browser localStorage
- **File Uploads:** Base64 encoding (max 5MB per file)
- **Calculations:** Real-time automatic calculations
- **No Server Required:** Runs completely offline

## 📝 Calculations

### Manpower Pay
- **Normal Pay** = Quantity × Normal Hours × Hourly Rate (ETB)
- **OT Pay** = Quantity × OT Hours × Hourly Rate × OT Multiplier
- **Total Pay** = Normal Pay + OT Pay

### Totals Displayed
- Total Workers
- Total Normal Hours
- Total OT Hours
- Normal Pay (subtotal)
- OT Pay (subtotal)
- Total Pay (grand total)

## 🛠️ Troubleshooting

### Can't login
- Check username and password (case-sensitive)
- Default admin: Admin / admin@Elhader

### Can't edit report
- Check if report has approvals (only Admin/CDGM can edit)
- Check if you have access to that project

### Lost data
- Don't clear browser cache/data
- Use browser export/backup tools
- Consider backing up localStorage regularly

### File won't attach
- Maximum file size: 5MB
- Supported formats: Images, PDF, Office docs, ZIP

## 📖 Best Practices

1. **Daily Reports:** Create one report per day per project
2. **Attachments:** Add photos, timesheets, safety docs
3. **Safety Section:** Always fill out safety metrics
4. **Approvals:** Approve promptly to avoid delays
5. **Backup:** Export data regularly (browser tools)

## 🔒 Security Notes

- Change default admin password immediately
- Store user passwords securely
- Don't share login credentials
- Use strong passwords for all accounts
- Admin account is hidden from user list

## 📞 Support

For issues or questions about El-Hadar Projects DPR system, contact your system administrator.

---

**Version:** 2.0 (Manpower Focus)  
**Last Updated:** 2026  
**Developer:** El-Hadar Projects
