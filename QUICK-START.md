# 🚀 Quick Start Guide - El-Hadar Manpower Report System

## 📋 Report Sections (What You Track)

### 1. Direct Manpower 👷
Track contractors and trades working on site:
- **Who**: Trader name (company/contractor)
- **What**: Trade/position (e.g., Mason, Carpenter)
- **How Many**: Quantity of workers
- **What Job**: Job description
- **Hours**: Normal hours (default 8) + OT hours
- **Rate**: Hourly rate in ETB
- **OT Multiplier**: 1.5x, 2.0x, or 2.5x
- **Result**: Automatic pay calculations

### 2. Indirect Manpower 🧑‍💼
Track staff and management:
- **Who**: Trader name (company/contractor)
- **What**: Role/position (e.g., Site Engineer, Foreman)
- **How Many**: Quantity of staff
- **Hours**: Normal hours (default 8) + OT hours
- **Rate**: Hourly rate in ETB
- **OT Multiplier**: 1.5x, 2.0x, or 2.5x
- **Result**: Automatic pay calculations

### 3. Safety ⛑
Track daily safety metrics:
- Lost Time Incidents (LTI)
- Near Misses
- Safety Observations
- First Aid Cases
- Toolbox Talks Conducted
- Safety Status: Green / Yellow / Red
- Safety Remarks (optional text)

### 4. General Notes 📝
Add any additional comments or information

---

## 🔐 Default Login

**First Time Login:**
- Username: `Admin`
- Password: `admin@Elhader`

⚠️ **Important:** Change this password after first login!

---

## 👥 Setting Up Users (Admin Only)

1. Login as Admin
2. Click "👥 Users" button
3. Click "➕ Add New User"
4. Fill in:
   - **Username** (for login, e.g., john.doe)
   - **Full Name** (e.g., John Doe)
   - **Role** (select from dropdown)
   - **Password** (user will use this to login)
   - **Project Access** (comma-separated or "ALL")
5. Click "💾 Save User"

### Roles Explained
1. **Admin** - Manages users, cannot approve reports
2. **Office Engineer** - 1st approver
3. **Project Engineer** - 2nd approver
4. **Follow up Engineer** - 3rd approver
5. **Project Coordinator** - 4th approver
6. **Project Manager** - 5th approver
7. **CDGM** - Final approver, can edit all reports

---

## 📝 Creating a Report

1. Click "➕ New Report"
2. Fill in report header:
   - Project Name
   - Report Date
   - Report Number (optional)

3. **Add Direct Manpower:**
   - Click "+ Add Trade"
   - Fill in all fields
   - Numbers auto-calculate as you type
   - Add file attachment if needed
   - Repeat for each trade

4. **Add Indirect Manpower:**
   - Click "+ Add Role"
   - Fill in all fields
   - Numbers auto-calculate as you type
   - Add file attachment if needed
   - Repeat for each role

5. **Fill Safety Section:**
   - Enter counts for each metric
   - Select safety status
   - Add remarks if any incidents

6. **Add Notes** (optional)

7. Click "💾 Save Report"

---

## ✅ Approval Process

### How It Works
Reports must be approved in this order:
1. Office Engineer
2. Project Engineer
3. Follow up Engineer
4. Project Coordinator
5. Project Manager
6. CDGM (final)

### To Approve a Report
1. Dashboard shows badge with pending count
2. Click report to view
3. If it's your turn, you'll see "✓ Approve" button (pulsing)
4. Click "✓ Approve"
5. Enter your name
6. Enter your password (to confirm)
7. Click "✓ Approve"

### Status Indicators
- **Draft** 📝 - No approvals yet
- **Partial** ⏳ - Some approvals (shows count)
- **Approved** ✅ - All approvals complete (locked)

---

## 📊 Dashboard

### Features
- **Search Bar** - Search by project name, date, or report number
- **Project Filter** - Filter by specific project
- **Pending Badge** - Shows reports awaiting your approval
- **Quick Actions**:
  - 👁 View - See report details
  - ✏ Edit - Edit draft reports (if you have permission)
  - ✓ Approve - Approve report (if it's your turn)

### Understanding Access
- You only see reports for **your assigned projects**
- CDGM sees **all projects**
- Admin sees **all projects** but cannot approve

---

## 💰 Pay Calculations (Automatic)

### Formula
```
Normal Pay = Quantity × Normal Hours × Hourly Rate (ETB)
OT Pay = Quantity × OT Hours × Hourly Rate × OT Multiplier
Total Pay = Normal Pay + OT Pay
```

### Example
- **Quantity:** 5 workers
- **Normal Hours:** 8
- **OT Hours:** 2
- **Hourly Rate:** ETB 625 (25 USD equivalent)
- **OT Multiplier:** 1.5x

**Calculations:**
- Normal Pay = 5 × 8 × ETB 625 = **ETB 25,000**
- OT Pay = 5 × 2 × ETB 625 × 1.5 = **ETB 9,375**
- Total Pay = **ETB 34,375**

All calculations happen **automatically** as you type!

---

## 📎 File Attachments

### How to Attach
1. In any manpower row, click "📎 Attachment (optional)"
2. Select file from your computer
3. File appears with icon and name
4. Click ✕ to remove if needed

### Supported Files
- Images: JPG, PNG, GIF
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Archives: ZIP, RAR

### Limits
- Maximum size: 5MB per file
- Multiple files: One per manpower entry

---

## 🛠️ Common Tasks

### Edit a Report
1. Find report in dashboard
2. Click "✏ Edit" button
3. Make changes
4. Click "💾 Save Report"

**Note:** Can only edit if:
- Report is draft (no approvals), OR
- You are Admin or CDGM (partial approvals only)

### Delete a Row
Click "✕ Remove" button on the row

### View Totals
Totals automatically update and display below each section:
- Total Workers
- Total Normal Hours
- Total OT Hours
- Total Normal Pay
- Total OT Pay
- **Grand Total Pay** (highlighted in blue)

### Print a Report
1. Click report to view
2. Click "🖨 Print"
3. Select printer

### Change Password (User)
Currently, only Admin can change passwords through User Management.

### Logout
Click "🚪 Logout" button in top right

---

## ⚠️ Important Notes

### Data Storage
- All data saved in **browser localStorage**
- Use same browser and computer
- **Don't clear browser data** or you'll lose reports!
- Consider regular backups

### Edit Permissions
- **Draft reports:** Anyone with project access can edit
- **Partially approved:** Only Admin/CDGM can edit
- **Fully approved:** Nobody can edit (locked)

### Approval Rules
- Must approve in sequence
- Cannot skip approvers
- Must enter correct password
- Admin role cannot approve (management only)

### Project Access
- Assigned during user creation
- Contact Admin to change project access
- "ALL" means access to all projects

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check username/password are correct (case-sensitive) |
| Can't see reports | Check if you're assigned to that project |
| Can't edit report | Report may have approvals (only Admin/CDGM can edit) |
| Can't approve | Check if it's your turn in the sequence |
| Calculations wrong | All fields must be filled with numbers |
| File won't attach | Check file size (max 5MB) and format |
| Lost data | Don't clear browser cache/data |
| Numbers not updating | Type in all fields, they auto-calculate |

---

## 📱 Mobile Use

System works on mobile devices:
- Responsive design adapts to screen size
- Touch-friendly buttons
- Horizontal scroll for tables
- All features available

---

## 🎯 Best Practices

1. **Daily Reports:** Create one report per day per project
2. **Accurate Data:** Double-check quantities and hours
3. **Safety First:** Always fill safety section completely
4. **Attachments:** Add photos, timesheets for documentation
5. **Timely Approvals:** Approve reports promptly
6. **Backup Data:** Regular browser data exports
7. **Strong Passwords:** Use unique passwords for each user

---

## 📞 Need Help?

Contact your system administrator or Admin user for:
- Creating/editing user accounts
- Resetting passwords
- Project access changes
- Technical issues
- Data recovery

---

**Remember:** Your system focuses on **Manpower + Safety** tracking. Keep it simple, track accurately, and approve promptly! 🎉
