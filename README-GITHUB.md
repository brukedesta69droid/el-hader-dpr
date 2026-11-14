# 📋 El-Hadar Projects - Daily Progress Report System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

A comprehensive web-based Daily Progress Report (DPR) system for construction project management with advanced features including multi-level approval workflow, user authentication, and automatic calculations.

## ✨ Features

### 📊 Core Functionality
- **Daily Execution Tracking** - Record work activities with automatic amount calculation (Qty × Unit Rate)
- **Equipment Management** - Track equipment status (Operational/Idle/Down)
- **Manpower Management** - Direct & Indirect manpower with automatic OT calculations
  - Normal hours and OT hours tracking
  - Flexible OT multipliers (1.5x, 2.0x, 2.5x)
  - Trader/contractor name tracking
  - Automatic pay calculations
- **Safety Monitoring** - Track incidents, observations, and safety status
- **Contract Tracking** - Auto-calculate elapsed/remaining days
- **Payment Status** - Track payments with retention, withhold, penalties

### 🔐 Authentication & Authorization
- **Role-Based Access Control** (7 roles)
- **Project-Based Permissions** - Users only see assigned projects
- **Admin Panel** - Complete user management interface
- **Secure Login** - Password-protected accounts

### ✅ 6-Level Approval Workflow
1. Office Engineer
2. Project Engineer
3. Follow up Engineer
4. Project Coordinator
5. Project Manager
6. CDGM (Final Approval)

**Workflow Features:**
- Sequential approval enforcement
- Visual workflow progress indicator
- "Your Turn" notifications
- Real-time approval badge counter
- Full audit trail with timestamps
- Edit protection after approvals

### 📎 File Attachments
- Attach photos, PDFs, documents to:
  - Daily execution items
  - Equipment entries
  - Direct manpower
  - Indirect manpower
- Max 5MB per file
- Supported formats: Images, PDF, Word, Excel

### 🎨 User Interface
- Modern, responsive design
- Professional blue gradient theme
- Mobile-friendly layout
- Animated notifications
- Dashboard with KPI cards
- Search and filter capabilities

## 🚀 Quick Start

### Option 1: Download and Run Locally

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/el-hadar-dpr.git
   cd el-hadar-dpr
   ```

2. **Open in Browser**
   - Double-click `index.html`
   - Or right-click → Open with → Your Browser

3. **Login**
   ```
   Username: Admin
   Password: admin@Elhader
   ```

4. **Create Users**
   - Click "👥 Users" button
   - Add users for each role
   - Assign projects to each user

### Option 2: GitHub Pages Deployment

1. **Fork this repository**

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main (or master)
   - Folder: / (root)
   - Click Save

3. **Access your site**
   ```
   https://yourusername.github.io/el-hadar-dpr/
   ```

### Option 3: Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/el-hadar-dpr)

1. Click the button above
2. Connect your GitHub account
3. Deploy!

## 📁 Project Structure

```
el-hadar-dpr/
├── index.html              # Main application file
├── app.js                  # Application logic (73KB)
├── style.css               # Styling (21KB)
├── README.md               # Main documentation
├── USER-GUIDE.md          # User manual & workflow guide
├── ATTACHMENTS-GUIDE.md   # File attachment instructions
├── INSTALLATION.md        # Installation & setup guide
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

## 🔧 Configuration

### Default Admin Account
```javascript
Username: Admin
Password: admin@Elhader
```
⚠️ **Change this password immediately after first login!**

### Create New Users
1. Login as Admin
2. Click "👥 Users"
3. Click "➕ Add New User"
4. Fill in user details:
   - Username
   - Full Name
   - Role (7 options)
   - Password
   - Projects (comma-separated or "ALL")
5. Save

### User Roles
- **Admin** - User management only (cannot approve)
- **Office Engineer** - Approval step 1
- **Project Engineer** - Approval step 2
- **Follow up Engineer** - Approval step 3
- **Project Coordinator** - Approval step 4
- **Project Manager** - Approval step 5
- **CDGM** - Final approval step 6

## 💾 Data Storage

**Storage Method:** Browser localStorage

**Data Persistence:**
- Survives page refreshes
- Survives browser restarts
- Per-user, per-computer basis
- ⚠️ Cleared if browser cache is cleared

**Backup Recommendations:**
1. Regular exports (see USER-GUIDE.md)
2. Keep backup files in secure location
3. Consider server-based solution for production

## 📖 Documentation

- **[README.md](README.md)** - System overview and features
- **[USER-GUIDE.md](USER-GUIDE.md)** - Complete user manual with workflow
- **[ATTACHMENTS-GUIDE.md](ATTACHMENTS-GUIDE.md)** - File upload guide
- **[INSTALLATION.md](INSTALLATION.md)** - Setup and configuration

## 🔒 Security Notes

### For Production Use:
1. ✅ Change default Admin password
2. ✅ Use strong passwords for all users
3. ✅ Deploy on HTTPS (GitHub Pages provides this)
4. ✅ Regular backups
5. ✅ Restrict file access to authorized personnel
6. ⚠️ localStorage is not encrypted - don't store sensitive data

### For Enterprise Deployment:
Consider adding:
- Backend database (MySQL, PostgreSQL, MongoDB)
- Server-side authentication (JWT, OAuth)
- Encrypted data storage
- Multi-device synchronization
- Cloud backup integration

## 🌐 Browser Compatibility

| Browser | Supported | Version |
|---------|-----------|---------|
| Chrome | ✅ | 90+ |
| Firefox | ✅ | 88+ |
| Edge | ✅ | 90+ |
| Safari | ✅ | 14+ |
| Opera | ✅ | 76+ |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **El-Hadar Projects** - Initial work

## 🙏 Acknowledgments

- Built for construction project management
- Designed for daily progress tracking
- Optimized for ease of use and efficiency

## 📧 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check documentation in `/docs` folder
- Review USER-GUIDE.md for workflow help

## 🔄 Version History

### v1.0.0 (Current)
- ✅ User authentication with 7 roles
- ✅ 6-level approval workflow
- ✅ Automatic calculations (OT, amount, dates)
- ✅ File attachments (5MB max)
- ✅ Project-based access control
- ✅ Notification system
- ✅ Admin user management
- ✅ Mobile responsive design
- ✅ Modern UI with animations

## 🔮 Roadmap

Potential future features:
- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Charts and analytics
- [ ] Photo gallery view
- [ ] Backend database integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Weather tracking
- [ ] GPS location tagging

## 💡 Tips

1. **First Time Setup**: Create CDGM account first for final approvals
2. **Project Names**: Use consistent naming (e.g., "Project A", "Project B")
3. **Regular Backups**: Export data weekly
4. **Browser**: Chrome recommended for best experience
5. **Mobile Use**: Works on tablets, best on 10"+ screens

## 🎯 Use Cases

Perfect for:
- Construction project daily reporting
- Progress tracking and documentation
- Multi-level approval workflows
- Contractor management
- Safety monitoring
- Equipment tracking
- Manpower and OT calculations
- Contract timeline tracking

---

**Made with ❤️ for Construction Project Management**

**El-Hadar Projects © 2024**
