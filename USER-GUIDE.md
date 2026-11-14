# 👤 User Authentication & Workflow Guide
## El-Hadar Projects - Daily Progress Report System

## Overview

The El-Hadar Projects Daily Progress Report (DPR) system includes:
- **User Authentication** - Login required to access the system
- **Project-Based Access Control** - Users only see their assigned projects
- **6-Level Approval Workflow** - Sequential approvals required
- **CDGM Override Authority** - CDGM can see all projects and edit reports with approvals

---

## 🔐 Login System

### How to Login

1. Open the application in your browser
2. Enter your **username** and **password**
3. Click **"🔐 Login"**

### Demo Accounts

| Username | Password | Role | Project Access |
|----------|----------|------|----------------|
| `office1` | `office123` | Office Engineer | Project A, B |
| `project1` | `project123` | Project Engineer | Project A |
| `followup1` | `followup123` | Follow up Engineer | Project A, B |
| `coordinator1` | `coordinator123` | Project Coordinator | Project B |
| `manager1` | `manager123` | Project Manager | Project A, B, C |
| **`cdgm`** | **`cdgm123`** | **CDGM** | **ALL Projects** |

---

## 📊 Project Access Control

### Regular Users
- **See only assigned projects** in the dashboard
- **Cannot see** reports from other projects
- **Can create** new reports for their assigned projects
- **Can edit** draft reports (before any approvals)

### CDGM (Super Admin)
- **Sees ALL projects** across the system
- **Can edit reports** that have approvals (but not fully approved)
- **Full override authority** for quality control
- **Final approval** locks the report permanently

---

## ✅ 6-Level Approval Workflow

### Approval Sequence

Reports must be approved in this exact order:

1. **Office Engineer** → Creates and submits initial report
2. **Project Engineer** → Reviews technical details
3. **Follow up Engineer** → Verifies progress tracking
4. **Project Coordinator** → Confirms logistics and coordination
5. **Project Manager** → Reviews overall project status
6. **CDGM** → Final approval and permanent lock

### Approval Rules

#### ✏️ **Editing Rules:**
- ✅ **Draft reports** (0 approvals): Can be edited by anyone with project access
- 🔒 **Reports with approvals** (1-5 approvals): **Only CDGM can edit**
- 🔒 **Fully approved** (6 approvals): **Nobody can edit** - Permanently locked

#### 🗑 **Deletion Rules:**
- ✅ **Draft reports** (0 approvals): Can be deleted
- 🔒 **Reports with approvals**: **Cannot be deleted**
- 🔒 **Fully approved**: **Cannot be deleted**

---

## 🔄 Workflow Example

### Scenario: Project A Daily Report

**Day 1 - 8:00 AM:**
- `office1` (Office Engineer) logs in
- Creates a new daily report for **Project A**
- Enters execution data, equipment status, manpower
- Saves the report (**Status: Draft**)

**Day 1 - 10:00 AM:**
- `office1` clicks **"✓ Start Approval"**
- Enters password: `office123`
- Report moves to **Status: 1/6 Approved**
- ⚠️ **Report is now locked for regular users**

**Day 1 - 11:00 AM:**
- `project1` (Project Engineer) logs in
- Sees the report (Status: ⏳ 1/6 Approved)
- Reviews and clicks **"✓ Next Approval"**
- Enters password: `project123`
- Report moves to **Status: 2/6 Approved**

**Day 1 - 2:00 PM:**
- `followup1` (Follow up Engineer) approves
- Report moves to **Status: 3/6 Approved**

**Day 1 - 3:00 PM:**
- `coordinator1` (Project Coordinator) approves
- Report moves to **Status: 4/6 Approved**

**Day 1 - 4:00 PM:**
- `manager1` (Project Manager) approves
- Report moves to **Status: 5/6 Approved**

**Day 1 - 5:00 PM:**
- `cdgm` (CDGM) logs in
- Reviews all approvals
- Gives final approval
- Report moves to **Status: ✓ Fully Approved**
- 🔒 **Report is now permanently locked**

---

## 🔑 CDGM Special Permissions

### What CDGM Can Do:

#### 1. See All Projects
```
Regular User Dashboard: "Project A" (their assignment)
CDGM Dashboard: "Project A, Project B, Project C, ..." (all)
```

#### 2. Edit Reports with Approvals
```
Scenario: Report has 3/6 approvals
Regular User: "🔒 Cannot edit"
CDGM: "✏️ Edit (CDGM)" button available
```

**Use Case:** Quality control, fixing errors before final approval

#### 3. Override Workflow (Not Skip)
- CDGM can edit reports that have partial approvals
- CDGM still must approve in sequence (cannot skip steps)
- Previous approvals are preserved

#### 4. System-Wide Visibility
- Dashboard shows reports from all projects
- Can filter by specific project
- Sees all KPI metrics across organization

---

## 🚀 Common Workflows

### Creating a New Report

1. Login with your credentials
2. Click **"➕ New Report"**
3. Fill in Contract & Project Info
   - **Important:** Select project name from your assigned list
4. Add daily execution, equipment, manpower data
5. Attach files if needed
6. Click **"💾 Save Report"**
7. Report is saved as **Draft**

### Approving a Report

1. Login with your credentials
2. Go to Dashboard
3. Find the report that needs your approval
4. Click the report to view details
5. Review the approval status banner
6. Click **"✓ Approve"** or **"✓ Next Approval"**
7. Confirm your name (pre-filled)
8. Enter your password
9. Click **"✓ Approve"**

### Editing a Draft Report (Before Approvals)

1. Login with your credentials
2. Find the draft report in Dashboard
3. Click **"✏️ Edit"**
4. Make changes
5. Click **"💾 Save Report"**

### CDGM: Editing Report with Approvals

1. Login as `cdgm` / `cdgm123`
2. Find the report with partial approvals
3. Click **"✏️ Edit (CDGM)"**
4. Make corrections
5. Click **"💾 Save Report"**
6. **Note:** Existing approvals are preserved
7. Workflow continues from where it left off

---

## 🛠 Adding New Users

To add a new user account, edit the `USERS` object in `app.js`:

```javascript
const USERS = {
  'newuser': {
    password: 'newpassword123',
    role: 'Project Engineer',
    name: 'John Doe',
    projects: ['Project A', 'Project D'] // Array of project names
  }
  // ... other users
};
```

### User Configuration Fields:

- **username** (key): Login username
- **password**: User password
- **role**: One of the 6 workflow roles
- **name**: Full display name
- **projects**: 
  - Array of project names: `['Project A', 'Project B']`
  - OR special value: `'ALL'` (for CDGM only)

---

## 🔒 Security Features

### 1. Session Persistence
- Login state saved in browser
- Remains logged in across page refreshes
- Must click "🚪 Logout" to end session

### 2. Password Protection
- Each user has unique password
- Password required for approval
- Passwords stored in `app.js` (change in production)

### 3. Access Control
- Users cannot see unauthorized projects
- Dashboard automatically filters by permission
- Edit/delete blocked for protected reports

### 4. Audit Trail
- Each approval records:
  - Role name
  - Approver name
  - Username
  - Exact timestamp
- Full approval history visible in report view

---

## 📋 Status Indicators

### Dashboard Badges

| Badge | Meaning | Actions Available |
|-------|---------|-------------------|
| 📝 **Draft** | No approvals yet | Edit, Delete, Start Approval |
| ⏳ **3/6 Approved** | Partial approvals | View, Next Approval, CDGM can Edit |
| ✓ **Fully Approved** | All 6 approvals complete | View only, Print |

### Report View Banner Colors

- **Blue** (📝 Draft): Report can still be edited
- **Yellow** (⏳ Approval in Progress): Locked for regular users
- **Green** (✓ Fully Approved): Permanently locked

---

## ❓ FAQs

### Q: I can't see my project in the dashboard?
**A:** You are not assigned to that project. Contact CDGM to update your access.

### Q: Why can't I edit this report?
**A:** Reports with approvals can only be edited by CDGM. Draft reports can be edited by anyone with project access.

### Q: Can I skip an approval step?
**A:** No. Approvals must follow the 6-step sequence. However, any role can technically approve at any step (not recommended).

### Q: What happens if I forget my password?
**A:** Contact your system administrator to reset it in the `USERS` object in `app.js`.

### Q: Can I approve my own report?
**A:** Yes, if you are the next required approver. The system tracks approvals by role, not by who created the report.

### Q: Can CDGM edit a fully approved report?
**A:** No. Once all 6 approvals are complete, the report is permanently locked for everyone, including CDGM.

### Q: How do I assign projects to a user?
**A:** Edit the `projects` array in the user's entry in the `USERS` object in `app.js`.

### Q: Can I have multiple users with the same role?
**A:** Yes! Create different usernames with the same role. Example:
```javascript
'office1': { role: 'Office Engineer', ... },
'office2': { role: 'Office Engineer', ... }
```

### Q: What if an approver is unavailable?
**A:** CDGM can coordinate with other users of the same role to approve on their behalf. Contact your organization's workflow policy.

---

## 🎯 Best Practices

### For Regular Users:
1. **Complete your report thoroughly before starting approvals**
2. **Double-check all data** - editing becomes restricted after first approval
3. **Attach all necessary files** before submitting for approval
4. **Approve promptly** when reports are assigned to you
5. **Logout when done** for security

### For Project Managers:
1. **Review approvals regularly** to ensure reports flow smoothly
2. **Monitor dashboard** for pending approvals
3. **Coordinate with team** if approvers are unavailable
4. **Ensure data quality** before giving your approval

### For CDGM:
1. **Review systemwide KPIs** daily
2. **Use edit override carefully** - document reasons for changes
3. **Verify all 5 previous approvals** before final approval
4. **Manage user access** as projects and teams change
5. **Backup reports regularly** (see main README.md)

---

## 📞 Support

For technical issues or access requests:
- Contact your system administrator
- Refer to `README.md` for general application help
- Check `ATTACHMENTS-GUIDE.md` for file upload help

---

**Last Updated:** [Automatically generated with system]
**Version:** 1.0 with Authentication & Workflow
