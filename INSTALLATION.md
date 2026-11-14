# 🚀 Installation & Setup Guide
## El-Hadar Projects - Daily Progress Report System

---

## 📦 System Requirements

### Minimum Requirements:
- **Operating System:** Windows 7 or later / macOS / Linux
- **Web Browser:** 
  - Chrome 90+ (Recommended)
  - Firefox 88+
  - Edge 90+
  - Safari 14+
- **Storage:** 50 MB free disk space
- **No Internet Required:** Runs completely offline

### Recommended:
- **Screen Resolution:** 1366x768 or higher
- **RAM:** 4 GB or more
- Modern browser with JavaScript enabled

---

## 📥 Installation Steps

### Option 1: Already Installed (Current Location)

The system is already installed at:
```
c:\Users\El-Hadar-Admin\Downloads\El-Hadar-Projects-DPR\
```

**To use immediately:**
1. Open File Explorer
2. Navigate to: `c:\Users\El-Hadar-Admin\Downloads\El-Hadar-Projects-DPR\`
3. Double-click `index.html`
4. The application opens in your default browser
5. Login with: `cdgm` / `cdgm123`

---

### Option 2: Copy to Another Location

**To move the system to a different folder:**

1. Open File Explorer
2. Navigate to: `c:\Users\El-Hadar-Admin\Downloads\`
3. Right-click on `El-Hadar-Projects-DPR` folder
4. Select **Copy** or **Cut**
5. Navigate to your desired location (e.g., `C:\El-Hadar-DPR\`)
6. Right-click and select **Paste**
7. Open the folder and double-click `index.html`

**Recommended Locations:**
- `C:\El-Hadar-DPR\` (for all users)
- `C:\Program Files\El-Hadar-DPR\` (requires admin)
- Network drive for shared access

---

### Option 3: Deploy on Network Share

**For multiple users accessing the same reports:**

1. Copy the `El-Hadar-Projects-DPR` folder to a network share
   Example: `\\Server\Shared\El-Hadar-DPR\`

2. All users should access the same location:
   - Open File Explorer
   - Navigate to `\\Server\Shared\El-Hadar-DPR\`
   - Double-click `index.html`

3. **Important Notes:**
   - Each user's browser stores their login separately
   - All users share the same reports database
   - Data saved in browser localStorage (per user, per computer)

⚠️ **Warning:** Network deployment may have data sync issues. See "Data Backup" section below.

---

## 🔧 Configuration

### 1. Configure User Accounts

**Edit user accounts in `app.js`:**

1. Open `app.js` in a text editor (Notepad, VS Code, etc.)
2. Find the `USERS` object (around line 10)
3. Modify existing users or add new ones:

```javascript
const USERS = {
  'username': {
    password: 'password123',
    role: 'Office Engineer',
    name: 'Full Name',
    projects: ['Project A', 'Project B']
  },
  // Add more users here
};
```

4. Save the file
5. Refresh the browser to apply changes

### 2. Configure Projects

**Edit project list when creating reports:**

Projects are defined dynamically when users create reports. The `projectName` field is a free text input.

**Recommendation:** Create a standardized list in your workflow documentation.

### 3. Change Passwords

**To change default passwords:**

1. Open `app.js`
2. Find each user in the `USERS` object
3. Change the `password` value
4. Save and refresh

**Example:**
```javascript
'cdgm': {
  password: 'NewSecurePassword123!',  // Changed from 'cdgm123'
  role: 'CDGM',
  name: 'CDGM Admin',
  projects: 'ALL'
}
```

### 4. Customize Branding

**Change logo and colors in `style.css`:**

```css
/* Header gradient */
background: linear-gradient(135deg, #YOUR-COLOR-1 0%, #YOUR-COLOR-2 100%);

/* Logo text in index.html */
<div class="logo">🏗 YourLogo</div>
```

---

## 💾 Data Storage & Backup

### How Data is Stored

- **Location:** Browser localStorage (per user, per computer)
- **Format:** JSON
- **Size Limit:** 5-10 MB (browser dependent)
- **Persistence:** Data remains until browser cache is cleared

### Manual Backup

**To backup your reports:**

1. Open the application in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type: 
   ```javascript
   localStorage.getItem('dailyProgressReports')
   ```
5. Copy the output (JSON text)
6. Save to a text file: `backup-2024-11-11.json`

### Manual Restore

**To restore from backup:**

1. Open the application in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type:
   ```javascript
   localStorage.setItem('dailyProgressReports', 'PASTE_YOUR_BACKUP_HERE')
   ```
5. Refresh the page

### Automated Backup (Advanced)

Create a backup script (save as `backup.js`):

```javascript
// Run this in browser console
function backupReports() {
  const data = localStorage.getItem('dailyProgressReports');
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dpr-backup-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
}

// Run backup
backupReports();
```

---

## 🔒 Security Recommendations

### Production Deployment

1. **Change all default passwords** in `app.js`
2. **Use strong passwords** (minimum 12 characters)
3. **Restrict file access** to authorized personnel only
4. **Regular backups** (daily or weekly)
5. **Keep backup files secure** (encrypted folder/drive)

### Access Control

- Store `app.js` in a read-only location (users cannot modify passwords)
- Use Windows file permissions to restrict access
- Consider deploying on a server with proper authentication

### Data Protection

- **Regular backups** prevent data loss
- **Clear browser cache carefully** (will delete all data)
- **Export important reports** to PDF before clearing data
- **Multi-computer sync** requires manual backup/restore

---

## 🌐 Network Deployment (Advanced)

### Option A: Shared Folder Access

**Setup:**
1. Copy folder to network share: `\\Server\DPR\`
2. Users open `\\Server\DPR\index.html` in browser
3. Each user maintains separate login session
4. Reports stored per user, per computer

**Limitations:**
- Data not synchronized across users
- Each computer has its own database
- Not suitable for collaborative reporting

### Option B: Web Server Deployment

**For centralized database and multi-user access:**

This requires backend development with:
- Web server (Node.js, Apache, IIS)
- Database (MySQL, PostgreSQL, MongoDB)
- Backend API for report storage
- User authentication system

**Contact a web developer for this advanced setup.**

---

## 📱 Mobile Access

The system is mobile-responsive but works best on desktop/tablet.

**To access on mobile:**
1. Install the files on a computer on the same network
2. Share the folder or deploy on local web server
3. Access from mobile browser using computer IP address
4. Or: Open the HTML file directly on mobile (limited functionality)

**Best Practice:** Use tablet (10" or larger) for comfortable data entry.

---

## 🆘 Troubleshooting

### Application Won't Open

**Problem:** Double-clicking `index.html` does nothing

**Solution:**
1. Right-click `index.html`
2. Select "Open with"
3. Choose your web browser (Chrome, Firefox, Edge)
4. Check "Always use this app"

---

### Login Not Working

**Problem:** "Invalid username or password" error

**Solution:**
1. Check username is spelled correctly (case-sensitive)
2. Try default credentials: `cdgm` / `cdgm123`
3. Check if `app.js` was modified incorrectly
4. Clear browser cache and try again

---

### Reports Not Saving

**Problem:** Reports disappear after refresh

**Solution:**
1. Check browser localStorage is enabled
2. Check you're not in Private/Incognito mode
3. Check available disk space
4. Try a different browser

---

### File Attachments Too Large

**Problem:** "File too large" error

**Solution:**
1. Compress images before uploading
2. Maximum file size: 5 MB
3. Use online image compressor tools
4. Split large PDFs into smaller files

---

### Data Lost After Browser Update

**Problem:** All reports disappeared

**Solution:**
1. Check if you have a backup file
2. Restore from backup (see Backup section above)
3. Check if browser cache was cleared
4. Future: Set up regular automated backups

---

## 📞 Support & Help

### Documentation Files

- **README.md** - Overview and features
- **USER-GUIDE.md** - Authentication and workflow
- **ATTACHMENTS-GUIDE.md** - File upload help
- **INSTALLATION.md** - This file

### Getting Help

For technical support:
1. Check troubleshooting section above
2. Review relevant documentation
3. Contact your IT administrator
4. Contact El-Hadar Projects system administrator

---

## 📋 System Files Reference

```
El-Hadar-Projects-DPR/
│
├── index.html              # Main application (open this)
├── app.js                  # Application logic & user config
├── style.css               # Styles and design
│
├── README.md               # System overview
├── USER-GUIDE.md          # User & workflow manual
├── ATTACHMENTS-GUIDE.md   # File upload guide
└── INSTALLATION.md        # This file
```

**Do Not Delete Any Files** - All files are required for the system to work.

---

## ✅ Post-Installation Checklist

After installation, verify:

- [ ] `index.html` opens in browser
- [ ] Login page displays correctly
- [ ] Can login with demo credentials
- [ ] Dashboard loads without errors
- [ ] Can create a new report
- [ ] Can save a report
- [ ] Can view saved reports
- [ ] Can attach files to reports
- [ ] Can approve reports
- [ ] All 6 user roles are configured
- [ ] Passwords have been changed from defaults
- [ ] Backup procedure is documented
- [ ] Users trained on system workflow

---

**Installation Complete!** 🎉

Your El-Hadar Projects Daily Progress Report System is ready to use.

**Next Steps:**
1. Change default passwords in `app.js`
2. Configure user accounts for your team
3. Train users on the workflow (see USER-GUIDE.md)
4. Set up regular backup schedule
5. Start creating daily progress reports!

---

**El-Hadar Projects**  
Daily Progress Report System v1.0  
© 2024 All Rights Reserved
