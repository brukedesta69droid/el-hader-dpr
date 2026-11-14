// ========== STATE & CONFIG ==========
let reports = [];
let currentReportId = null;
let editingReportId = null;
let currentUser = null;

// User accounts with passwords and assigned projects
const USERS = {
  'Admin': {
    password: 'admin@Elhader',
    role: 'Admin',
    name: 'System Administrator',
    projects: 'ALL'
  }
};

// Project Database - Admin manages this
const PROJECTS = {};

// Save projects to localStorage
function saveProjects() {
  localStorage.setItem('dprProjects', JSON.stringify(PROJECTS));
}

function loadProjects() {
  const stored = localStorage.getItem('dprProjects');
  if (stored) {
    const loadedProjects = JSON.parse(stored);
    Object.assign(PROJECTS, loadedProjects);
  } else {
    // Default projects
    PROJECTS['Sample Project 1'] = {
      name: 'Sample Project 1',
      location: 'Addis Ababa',
      status: 'Active'
    };
    PROJECTS['Sample Project 2'] = {
      name: 'Sample Project 2',
      location: 'Bahir Dar',
      status: 'Active'
    };
    saveProjects();
  }
}

// Populate project dropdown
function populateProjectDropdown() {
  const dropdown = document.getElementById('f_projectName_selector');
  if (!dropdown) return;
  
  // Clear existing options
  dropdown.innerHTML = '<option value="">-- Select Project --</option>';
  
  // Add projects from database
  Object.keys(PROJECTS).forEach(projectName => {
    const project = PROJECTS[projectName];
    if (project.status === 'Active' && canAccessProject(projectName)) {
      dropdown.innerHTML += `<option value="${projectName}">${projectName}</option>`;
    }
  });
}

// Confirm project selection and show form
function confirmProjectSelection() {
  const selector = document.getElementById('f_projectName_selector');
  const selectedProject = selector ? selector.value : '';
  
  if (!selectedProject) {
    showToast('Please select a project first', 'error');
    return;
  }
  
  // Set the project name in the readonly field
  const projectField = document.getElementById('f_projectName');
  if (projectField) {
    projectField.value = selectedProject;
  }
  
  // Show selected project display
  const displayDiv = document.getElementById('selectedProjectDisplay');
  const projectNameSpan = document.getElementById('selectedProjectName');
  if (displayDiv && projectNameSpan) {
    projectNameSpan.textContent = selectedProject;
    displayDiv.style.display = 'block';
  }
  
  // Hide project selection step
  const selectionStep = document.getElementById('projectSelectionStep');
  if (selectionStep) {
    selectionStep.style.display = 'none';
  }
  
  // Show main report form
  const mainForm = document.getElementById('mainReportForm');
  if (mainForm) {
    mainForm.style.display = 'block';
  }
  
  showToast('Project selected! Fill the report details below', 'success');
}

// Change project selection
function changeProject() {
  // Show project selection step
  const selectionStep = document.getElementById('projectSelectionStep');
  if (selectionStep) {
    selectionStep.style.display = 'block';
  }
  
  // Hide selected project display
  const displayDiv = document.getElementById('selectedProjectDisplay');
  if (displayDiv) {
    displayDiv.style.display = 'none';
  }
  
  // Hide main report form
  const mainForm = document.getElementById('mainReportForm');
  if (mainForm) {
    mainForm.style.display = 'none';
  }
  
  // Clear the form data (but keep project selector value)
  const projectSelector = document.getElementById('f_projectName_selector');
  const currentProject = projectSelector ? projectSelector.value : '';
  
  // Reset form fields but don't reset editingReportId
  document.getElementById('f_projectName').value = '';
  document.getElementById('f_reportNo').value = '';
  document.getElementById('f_reporter').value = '';
  setDefaultReportDate();
  
  document.getElementById('f_lti').value = '0';
  document.getElementById('f_nearMiss').value = '0';
  document.getElementById('f_safetyObs').value = '0';
  document.getElementById('f_firstAid').value = '0';
  document.getElementById('f_toolbox').value = '0';
  document.getElementById('f_safetyStatus').value = 'Green';
  document.getElementById('f_safetyRemarks').value = '';
  
  document.getElementById('f_notes').value = '';
  
  document.getElementById('directMPRows').innerHTML = '';
  document.getElementById('indirectMPRows').innerHTML = '';
  
  directMPCounter = 0;
  indirectMPCounter = 0;
  
  addRow('directMP');
  addRow('indirectMP');
}


// Populate reporter dropdown with users
function populateReporterDropdown() {
  const dropdown = document.getElementById('f_reporter');
  if (!dropdown) return;
  
  // Clear existing options
  dropdown.innerHTML = '<option value="">-- Select Reporter --</option>';
  
  // Add users from database (exclude Admin)
  Object.keys(USERS).sort().forEach(username => {
    const user = USERS[username];
    // Don't include Admin in reporter list
    if (user.role !== 'Admin') {
      dropdown.innerHTML += `<option value="${username}">${user.name} (${user.role})</option>`;
    }
  });
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem('dprUsers', JSON.stringify(USERS));
}

function loadUsers() {
  const stored = localStorage.getItem('dprUsers');
  if (stored) {
    const loadedUsers = JSON.parse(stored);
    Object.assign(USERS, loadedUsers);
  } else {
    saveUsers();
  }
}

// Approval workflow
const APPROVAL_WORKFLOW = [
  'Project Admin',
  'Office Engineer',
  'Project Engineer',
  'Project Manager',
  'Project Follow up',
  'Project Coordinator',
  'CDGM'
];

// Row counters
let directMPCounter = 0;
let indirectMPCounter = 0;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadProjects(); // Load projects database
  loadReports();
  loadCurrentUser();
  
  if (!currentUser) {
    showLoginPage();
  } else {
    showMainApp();
  }
});

function loadCurrentUser() {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    currentUser = JSON.parse(stored);
  }
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('currentUser');
  }
}

function showLoginPage() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  
  setTodayDate();
  setDefaultReportDate();
  updateUserInfo();
  populateProjectDropdown(); // Populate project dropdown
  populateReporterDropdown(); // Populate reporter dropdown
  renderDashboard();
  
  // Add one initial row for each section
  addRow('directMP');
  addRow('indirectMP');
}

function updateUserInfo() {
  if (currentUser) {
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userRoleDisplay').textContent = currentUser.role;
    
    const userMgmtBtn = document.getElementById('userManagementBtn');
    const projectMgmtBtn = document.getElementById('projectManagementBtn');
    if (currentUser.role === 'Admin') {
      userMgmtBtn.style.display = 'inline-block';
      projectMgmtBtn.style.display = 'inline-block';
    } else {
      userMgmtBtn.style.display = 'none';
      projectMgmtBtn.style.display = 'none';
    }
    
    updatePendingApprovalsCount();
    
    if (currentUser.projects !== 'ALL') {
      const projectsText = currentUser.projects.join(', ');
      document.getElementById('userProjectsDisplay').textContent = 'Projects: ' + projectsText;
      document.getElementById('userProjectsDisplay').style.display = 'block';
    } else {
      document.getElementById('userProjectsDisplay').style.display = 'none';
    }
  }
}

function updatePendingApprovalsCount() {
  if (!currentUser || currentUser.role === 'Admin') {
    document.getElementById('approvalBadge').style.display = 'none';
    return;
  }
  
  let pendingCount = 0;
  
  reports.forEach(report => {
    if (report.isFullyApproved) return;
    if (!canAccessProject(report.projectName)) return;
    if (!report.approvals) report.approvals = [];
    
    const alreadyApproved = report.approvals.some(a => a.role === currentUser.role);
    if (alreadyApproved) return;
    
    const nextRole = getNextRequiredApprover(report);
    if (nextRole === currentUser.role) {
      pendingCount++;
    }
  });
  
  const badge = document.getElementById('approvalBadge');
  if (pendingCount > 0) {
    badge.textContent = pendingCount;
    badge.style.display = 'inline-block';
    badge.title = `${pendingCount} report(s) awaiting your approval`;
  } else {
    badge.style.display = 'none';
  }
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showToast('Please enter username and password', 'error');
    return;
  }
  
  const user = USERS[username];
  
  if (!user || user.password !== password) {
    showToast('Invalid username or password', 'error');
    document.getElementById('loginPassword').value = '';
    return;
  }
  
  currentUser = {
    username: username,
    name: user.name,
    role: user.role,
    projects: user.projects
  };
  
  saveCurrentUser();
  showToast('Welcome, ' + currentUser.name, 'success');
  showMainApp();
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    currentUser = null;
    saveCurrentUser();
    showLoginPage();
    
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
  }
}

function canAccessProject(projectName) {
  if (!currentUser) return false;
  if (currentUser.projects === 'ALL') return true;
  return currentUser.projects.includes(projectName);
}

function canEdit(report) {
  if (!currentUser) return false;
  
  if (currentUser.role === 'Admin') {
    return !report.isFullyApproved;
  }
  
  if (currentUser.role === 'CDGM') {
    return !report.isFullyApproved;
  }
  
  if (report.approvals && report.approvals.length > 0) {
    return false;
  }
  
  return canAccessProject(report.projectName);
}

function setTodayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);
}

function setDefaultReportDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f_reportDate').value = today;
}

// ========== STORAGE ==========
function loadReports() {
  const stored = localStorage.getItem('dailyProgressReports');
  reports = stored ? JSON.parse(stored) : [];
}

function saveReports() {
  localStorage.setItem('dailyProgressReports', JSON.stringify(reports));
}

// ========== NAVIGATION ==========
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageName).classList.add('active');
  
  if (pageName === 'dashboard') {
    populateDashboardProjectSelector();
    renderDashboard();
  } else if (pageName === 'newReport') {
    populateProjectDropdown(); // Refresh project list
    populateReporterDropdown(); // Refresh reporter list
    if (!editingReportId) {
      clearForm();
    }
  } else if (pageName === 'directDashboard') {
    renderDirectManpowerDashboard();
  } else if (pageName === 'indirectDashboard') {
    renderIndirectManpowerDashboard();
  } else if (pageName === 'safetyDashboard') {
    renderSafetyDashboard();
  }
}

// ========== PROJECT DASHBOARD SELECTION ==========
function populateDashboardProjectSelector() {
  const container = document.getElementById('projectGridSelector');
  if (!container) return;
  
  // Clear existing
  container.innerHTML = '';
  
  // Get accessible projects
  const accessibleProjects = [];
  Object.keys(PROJECTS).forEach(projectName => {
    const project = PROJECTS[projectName];
    if (project.status === 'Active' && canAccessProject(projectName)) {
      accessibleProjects.push({ name: projectName, ...project });
    }
  });
  
  if (accessibleProjects.length === 0) {
    container.innerHTML = '<div class="no-projects-message">No active projects available</div>';
    return;
  }
  
  // Create project cards
  accessibleProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => selectProjectForDashboard(project.name);
    
    card.innerHTML = `
      <div class="project-card-icon">📁</div>
      <div class="project-card-name">${project.name}</div>
      ${project.location ? `<div class="project-card-location">📍 ${project.location}</div>` : ''}
    `;
    
    container.appendChild(card);
  });
}

function selectProjectForDashboard(projectName) {
  selectedDashboardProject = projectName;
  
  // Update banner
  const banner = document.getElementById('selectedProjectBanner');
  const nameDisplay = document.getElementById('selectedProjectNameBanner');
  if (banner && nameDisplay) {
    nameDisplay.textContent = projectName;
    banner.style.display = 'block';
  }
  
  // Show dashboard buttons
  const buttonsDiv = document.getElementById('projectDashboardButtons');
  if (buttonsDiv) {
    buttonsDiv.style.display = 'flex';
  }
  
  // Hide project grid
  const grid = document.getElementById('projectGridSelector');
  if (grid) {
    grid.style.display = 'none';
  }
  
  // Update the reports table to show only selected project
  renderDashboard();
  
  showToast(`Project "${projectName}" selected! Choose a dashboard or view reports below.`, 'success');
}

function clearProjectSelection() {
  selectedDashboardProject = '';
  
  // Hide banner
  const banner = document.getElementById('selectedProjectBanner');
  if (banner) {
    banner.style.display = 'none';
  }
  
  // Hide dashboard buttons
  const buttonsDiv = document.getElementById('projectDashboardButtons');
  if (buttonsDiv) {
    buttonsDiv.style.display = 'none';
  }
  
  // Show project grid again
  const grid = document.getElementById('projectGridSelector');
  if (grid) {
    grid.style.display = 'grid';
  }
  
  // Refresh reports table to show all projects
  renderDashboard();
}

function handleProjectDashboardSelection() {
  // Legacy function - kept for compatibility
  const selector = document.getElementById('dashboardProjectSelector');
  if (selector && selector.value) {
    selectProjectForDashboard(selector.value);
  }
}

let selectedDashboardProject = '';

function showProjectDashboard(type) {
  if (!selectedDashboardProject) {
    showToast('Please select a project first', 'error');
    return;
  }
  
  // Navigate to the appropriate dashboard page
  if (type === 'direct') {
    showPage('directDashboard');
  } else if (type === 'indirect') {
    showPage('indirectDashboard');
  } else if (type === 'safety') {
    showPage('safetyDashboard');
  }
}


// ========== TOAST ==========
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ========== FILE HANDLING ==========
function handleFileUpload(rowId, type) {
  const input = document.getElementById(rowId + '_fileInput');
  const file = input.files[0];
  
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large. Maximum size is 5MB', 'error');
    input.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const fileName = file.name;
    const fileType = file.type;
    
    const row = document.getElementById(rowId);
    row.dataset.fileName = fileName;
    row.dataset.fileData = base64;
    row.dataset.fileType = fileType;
    
    const preview = document.getElementById(rowId + '_filePreview');
    preview.innerHTML = `
      <div class="file-attached">
        <span class="file-icon">${getFileIcon(fileName)}</span>
        <span class="file-name">${fileName}</span>
        <button class="btn-file-remove" onclick="removeFile('${rowId}', event)" title="Remove file">✕</button>
      </div>
    `;
    
    showToast('File attached: ' + fileName, 'success');
  };
  
  reader.onerror = function() {
    showToast('Error reading file', 'error');
  };
  
  reader.readAsDataURL(file);
}

function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const icons = {
    'pdf': '📄', 'jpg': '🖼', 'jpeg': '🖼', 'png': '🖼', 'gif': '🖼',
    'doc': '📝', 'docx': '📝', 'xls': '📊', 'xlsx': '📊', 'zip': '📦', 'rar': '📦'
  };
  return icons[ext] || '📎';
}

function removeFile(rowId, event) {
  event.stopPropagation();
  event.preventDefault();
  
  const row = document.getElementById(rowId);
  delete row.dataset.fileName;
  delete row.dataset.fileData;
  delete row.dataset.fileType;
  
  const input = document.getElementById(rowId + '_fileInput');
  if (input) input.value = '';
  
  const preview = document.getElementById(rowId + '_filePreview');
  preview.innerHTML = '<span class="no-file">No file attached</span>';
  
  showToast('File removed', 'success');
}

function downloadFile(fileName, fileData) {
  const link = document.createElement('a');
  link.href = fileData;
  link.download = fileName;
  link.click();
}

// ========== DYNAMIC ROWS ==========
function addRow(type) {
  const container = document.getElementById(type + 'Rows');
  const rowId = type + '_' + (++window[type + 'Counter']);
  
  let rowHTML = '';
  
  if (type === 'directMP') {
    rowHTML = `
      <div class="dynamic-row" id="${rowId}">
        <div class="row-header">
          <span class="row-label">Trade #${directMPCounter}</span>
          <button class="btn btn-danger" onclick="removeRow('${rowId}', 'directMP')">✕ Remove</button>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>No.</label>
            <input type="number" id="${rowId}_order" placeholder="1" min="1" style="max-width:80px;"/>
          </div>
          <div class="field">
            <label>Name</label>
            <input type="text" id="${rowId}_traderName" placeholder="Name of company/contractor"/>
          </div>
          <div class="field">
            <label>Title</label>
            <input type="text" id="${rowId}_trade" placeholder="e.g. Mason"/>
          </div>
          <div class="field">
            <label>Gross Salary</label>
            <input type="number" id="${rowId}_grossSalary" placeholder="0.00" step="0.01" oninput="calcHourlyRate('${rowId}', 'directMP')"/>
          </div>
          <div class="field">
            <label>Working Days</label>
            <input type="number" id="${rowId}_normalHours" placeholder="8" step="0.5" value="8" oninput="calcManpowerTotals('directMP')"/>
          </div>
          <div class="field">
            <label>Quantity</label>
            <input type="number" id="${rowId}_qty" placeholder="1" min="0" value="1" oninput="calcManpowerTotals('directMP')"/>
          </div>
          <div class="field">
            <label>Job Description</label>
            <input type="text" id="${rowId}_job" placeholder="Task performed"/>
          </div>
          <div class="field">
            <label>Hourly Rate (ETB)</label>
            <input type="number" id="${rowId}_rate" value="0.00" step="0.01" readonly style="background:#f7fafc;"/>
          </div>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>Normal OT(1.5)</label>
            <input type="number" id="${rowId}_otHours_1_5" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('directMP')"/>
          </div>
          <div class="field">
            <label>Night OT(1.75)</label>
            <input type="number" id="${rowId}_otHours_1_75" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('directMP')"/>
          </div>
          <div class="field">
            <label>Sunday(2.00)</label>
            <input type="number" id="${rowId}_otHours_2" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('directMP')"/>
          </div>
          <div class="field">
            <label>Holiday(2.5)</label>
            <input type="number" id="${rowId}_otHours_2_5" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('directMP')"/>
          </div>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>Normal Pay (ETB)</label>
            <input type="number" id="${rowId}_normalPay" value="0.00" readonly style="background:#edf2f7"/>
          </div>
          <div class="field">
            <label>OT Pay</label>
            <input type="number" id="${rowId}_otPay_total" value="0.00" readonly style="background:#edf2f7"/>
          </div>
          <div class="field">
            <label>Total Pay (ETB)</label>
            <input type="number" id="${rowId}_totalPay" value="0.00" readonly style="background:#e6f7ff; font-weight:bold;"/>
          </div>
        </div>
        <input type="hidden" id="${rowId}_otHours_0" value="0" />
        <input type="hidden" id="${rowId}_otPay_0" value="0" />
        <input type="hidden" id="${rowId}_otPay_1_5" value="0" />
        <input type="hidden" id="${rowId}_otPay_1_75" value="0" />
        <input type="hidden" id="${rowId}_otPay_2" value="0" />
        <input type="hidden" id="${rowId}_otPay_2_5" value="0" />
      </div>
    `;
  } else if (type === 'indirectMP') {
    rowHTML = `
      <div class="dynamic-row" id="${rowId}">
        <div class="row-header">
          <span class="row-label">Role #${indirectMPCounter}</span>
          <button class="btn btn-danger" onclick="removeRow('${rowId}', 'indirectMP')">✕ Remove</button>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>No.</label>
            <input type="number" id="${rowId}_order" placeholder="1" min="1" style="max-width:80px;"/>
          </div>
          <div class="field">
            <label>Name</label>
            <input type="text" id="${rowId}_traderName" placeholder="Name of company/contractor"/>
          </div>
          <div class="field">
            <label>Title</label>
            <input type="text" id="${rowId}_trade" placeholder="e.g. Site Engineer"/>
          </div>
          <div class="field">
            <label>Gross Salary</label>
            <input type="number" id="${rowId}_grossSalary" placeholder="0.00" step="0.01" oninput="calcHourlyRate('${rowId}', 'indirectMP')"/>
          </div>
          <div class="field">
            <label>Working Days</label>
            <input type="number" id="${rowId}_normalHours" placeholder="8" step="0.5" value="8" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
          <div class="field">
            <label>Quantity</label>
            <input type="number" id="${rowId}_qty" placeholder="1" min="0" value="1" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
          <div class="field">
            <label>Job Description</label>
            <input type="text" id="${rowId}_job" placeholder="Task performed"/>
          </div>
          <div class="field">
            <label>Hourly Rate (ETB)</label>
            <input type="number" id="${rowId}_rate" value="0.00" step="0.01" readonly style="background:#f7fafc;"/>
          </div>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>Normal OT(1.5)</label>
            <input type="number" id="${rowId}_otHours_1_5" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
          <div class="field">
            <label>Night OT(1.75)</label>
            <input type="number" id="${rowId}_otHours_1_75" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
          <div class="field">
            <label>Sunday(2.00)</label>
            <input type="number" id="${rowId}_otHours_2" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
          <div class="field">
            <label>Holiday(2.5)</label>
            <input type="number" id="${rowId}_otHours_2_5" placeholder="0" step="0.5" value="0" oninput="calcManpowerTotals('indirectMP')"/>
          </div>
        </div>
        <div class="row-fields">
          <div class="field">
            <label>Normal Pay (ETB)</label>
            <input type="number" id="${rowId}_normalPay" value="0.00" readonly style="background:#edf2f7"/>
          </div>
          <div class="field">
            <label>OT Pay</label>
            <input type="number" id="${rowId}_otPay_total" value="0.00" readonly style="background:#edf2f7"/>
          </div>
          <div class="field">
            <label>Total Pay (ETB)</label>
            <input type="number" id="${rowId}_totalPay" value="0.00" readonly style="background:#e6f7ff; font-weight:bold;"/>
          </div>
        </div>
        <input type="hidden" id="${rowId}_otHours_0" value="0" />
        <input type="hidden" id="${rowId}_otPay_0" value="0" />
        <input type="hidden" id="${rowId}_otPay_1_5" value="0" />
        <input type="hidden" id="${rowId}_otPay_1_75" value="0" />
        <input type="hidden" id="${rowId}_otPay_2" value="0" />
        <input type="hidden" id="${rowId}_otPay_2_5" value="0" />
      </div>
    `;
  }
  
  container.insertAdjacentHTML('beforeend', rowHTML);
  
  // Initialize with zero values for display
  if (type === 'directMP' || type === 'indirectMP') {
    const normalPayField = document.getElementById(rowId + '_normalPay');
    const otPayTotalField = document.getElementById(rowId + '_otPay_total');
    const totalPayField = document.getElementById(rowId + '_totalPay');
    if (normalPayField) normalPayField.value = '0.00';
    if (otPayTotalField) otPayTotalField.value = '0.00';
    if (totalPayField) totalPayField.value = '0.00';
  }
}

// Calculate hourly rate from gross salary
function calcHourlyRate(rowId, type) {
  const grossSalary = parseFloat(document.getElementById(rowId + '_grossSalary')?.value || 0);
  const hourlyRate = grossSalary > 0 ? (grossSalary / 30) : 0;
  
  const rateField = document.getElementById(rowId + '_rate');
  if (rateField) {
    rateField.value = hourlyRate.toFixed(2);
  }
  
  // Trigger totals calculation
  calcManpowerTotals(type);
}

function removeRow(rowId, calcType) {
  document.getElementById(rowId).remove();
  if (calcType === 'directMP' || calcType === 'indirectMP') {
    calcManpowerTotals(calcType);
  }
}

// ========== MANPOWER CALCULATIONS ==========
function calcManpowerTotals(type) {
  const container = document.getElementById(type + 'Rows');
  const rows = container.querySelectorAll('.dynamic-row');
  
  let totalQty = 0;
  let totalNormalHours = 0;
  let totalOTHours_0 = 0;
  let totalOTHours_1_5 = 0;
  let totalOTHours_1_75 = 0;
  let totalOTHours_2 = 0;
  let totalOTHours_2_5 = 0;
  let totalNormalPay = 0;
  let totalOTPay_0 = 0;
  let totalOTPay_1_5 = 0;
  let totalOTPay_1_75 = 0;
  let totalOTPay_2 = 0;
  let totalOTPay_2_5 = 0;
  let totalPay = 0;
  
  rows.forEach(row => {
    const id = row.id;
    const qty = parseFloat(document.getElementById(id + '_qty')?.value || 0);
    const normalHours = parseFloat(document.getElementById(id + '_normalHours')?.value || 0);
    const rate = parseFloat(document.getElementById(id + '_rate')?.value || 0);
    
    // Get OT hours for each multiplier
    const otHours_0 = parseFloat(document.getElementById(id + '_otHours_0')?.value || 0);
    const otHours_1_5 = parseFloat(document.getElementById(id + '_otHours_1_5')?.value || 0);
    const otHours_1_75 = parseFloat(document.getElementById(id + '_otHours_1_75')?.value || 0);
    const otHours_2 = parseFloat(document.getElementById(id + '_otHours_2')?.value || 0);
    const otHours_2_5 = parseFloat(document.getElementById(id + '_otHours_2_5')?.value || 0);
    
    // Calculate normal pay
    const normalPay = qty * normalHours * rate;
    
    // Calculate OT pay for each multiplier
    const otPay_0 = qty * otHours_0 * rate * 0;
    const otPay_1_5 = qty * otHours_1_5 * rate * 1.5;
    const otPay_1_75 = qty * otHours_1_75 * rate * 1.75;
    const otPay_2 = qty * otHours_2 * rate * 2;
    const otPay_2_5 = qty * otHours_2_5 * rate * 2.5;
    
    // Total pay
    const total = normalPay + otPay_0 + otPay_1_5 + otPay_1_75 + otPay_2 + otPay_2_5;
    
    // Update normal pay field
    const normalPayField = document.getElementById(id + '_normalPay');
    if (normalPayField) {
      normalPayField.value = normalPay.toFixed(2);
    }
    
    // Update OT pay fields
    const otPayField_0 = document.getElementById(id + '_otPay_0');
    if (otPayField_0) otPayField_0.value = otPay_0.toFixed(2);
    
    const otPayField_1_5 = document.getElementById(id + '_otPay_1_5');
    if (otPayField_1_5) otPayField_1_5.value = otPay_1_5.toFixed(2);
    
    const otPayField_1_75 = document.getElementById(id + '_otPay_1_75');
    if (otPayField_1_75) otPayField_1_75.value = otPay_1_75.toFixed(2);
    
    const otPayField_2 = document.getElementById(id + '_otPay_2');
    if (otPayField_2) otPayField_2.value = otPay_2.toFixed(2);
    
    const otPayField_2_5 = document.getElementById(id + '_otPay_2_5');
    if (otPayField_2_5) otPayField_2_5.value = otPay_2_5.toFixed(2);
    
    // Update total OT Pay field (sum of all OT)
    const totalOT = otPay_0 + otPay_1_5 + otPay_1_75 + otPay_2 + otPay_2_5;
    const otPayTotalField = document.getElementById(id + '_otPay_total');
    if (otPayTotalField) {
      otPayTotalField.value = totalOT.toFixed(2);
    }
    
    // Update total pay field
    const totalPayField = document.getElementById(id + '_totalPay');
    if (totalPayField) {
      totalPayField.value = total.toFixed(2);
    }
    
    // Accumulate totals
    totalQty += qty;
    totalNormalHours += (qty * normalHours);
    totalOTHours_0 += (qty * otHours_0);
    totalOTHours_1_5 += (qty * otHours_1_5);
    totalOTHours_1_75 += (qty * otHours_1_75);
    totalOTHours_2 += (qty * otHours_2);
    totalOTHours_2_5 += (qty * otHours_2_5);
    totalNormalPay += normalPay;
    totalOTPay_0 += otPay_0;
    totalOTPay_1_5 += otPay_1_5;
    totalOTPay_1_75 += otPay_1_75;
    totalOTPay_2 += otPay_2;
    totalOTPay_2_5 += otPay_2_5;
    totalPay += total;
  });
  
  const totalOTHours = totalOTHours_0 + totalOTHours_1_5 + totalOTHours_1_75 + totalOTHours_2 + totalOTHours_2_5;
  const totalOTPay = totalOTPay_0 + totalOTPay_1_5 + totalOTPay_1_75 + totalOTPay_2 + totalOTPay_2_5;
  
  const totalsContainer = document.getElementById(type + 'Totals');
  totalsContainer.innerHTML = `
    <div class="totals-grid">
      <div class="total-item">
        <div class="total-label">Total Workers</div>
        <div class="total-value">${totalQty}</div>
      </div>
      <div class="total-item">
        <div class="total-label">Total Normal Hours</div>
        <div class="total-value">${totalNormalHours.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">Total OT Hours (All)</div>
        <div class="total-value">${totalOTHours.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Hours (No OT)</div>
        <div class="total-value">${totalOTHours_0.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Hours (1.5x)</div>
        <div class="total-value">${totalOTHours_1_5.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Hours (1.75x)</div>
        <div class="total-value">${totalOTHours_1_75.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Hours (2.0x)</div>
        <div class="total-value">${totalOTHours_2.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Hours (2.5x)</div>
        <div class="total-value">${totalOTHours_2_5.toFixed(1)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">Normal Pay</div>
        <div class="total-value">ETB ${totalNormalPay.toFixed(2)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">OT Pay (All)</div>
        <div class="total-value">ETB ${totalOTPay.toFixed(2)}</div>
      </div>
      <div class="total-item">
        <div class="total-label">Total Pay</div>
        <div class="total-value total-highlight">ETB ${totalPay.toFixed(2)}</div>
      </div>
    </div>
  `;
}

// ========== COLLECT FORM DATA ==========
function collectFormData() {
  const projectName = document.getElementById('f_projectName').value;
  const reportDate = document.getElementById('f_reportDate').value;
  const reportNo = document.getElementById('f_reportNo').value;
  const reporter = document.getElementById('f_reporter').value;
  
  // Direct Manpower
  const directMP = [];
  document.querySelectorAll('#directMPRows .dynamic-row').forEach(row => {
    const id = row.id;
    
    // Get all OT hours
    const otHours_0 = parseFloat(document.getElementById(id + '_otHours_0')?.value || 0);
    const otHours_1_5 = parseFloat(document.getElementById(id + '_otHours_1_5')?.value || 0);
    const otHours_1_75 = parseFloat(document.getElementById(id + '_otHours_1_75')?.value || 0);
    const otHours_2 = parseFloat(document.getElementById(id + '_otHours_2')?.value || 0);
    const otHours_2_5 = parseFloat(document.getElementById(id + '_otHours_2_5')?.value || 0);
    
    // Get all OT pays
    const otPay_0 = parseFloat(document.getElementById(id + '_otPay_0')?.value || 0);
    const otPay_1_5 = parseFloat(document.getElementById(id + '_otPay_1_5')?.value || 0);
    const otPay_1_75 = parseFloat(document.getElementById(id + '_otPay_1_75')?.value || 0);
    const otPay_2 = parseFloat(document.getElementById(id + '_otPay_2')?.value || 0);
    const otPay_2_5 = parseFloat(document.getElementById(id + '_otPay_2_5')?.value || 0);
    
    directMP.push({
      order: parseInt(document.getElementById(id + '_order')?.value || 0),
      trade: document.getElementById(id + '_trade')?.value || '',
      traderName: document.getElementById(id + '_traderName')?.value || '',
      qty: parseFloat(document.getElementById(id + '_qty')?.value || 0),
      job: document.getElementById(id + '_job')?.value || '',
      normalHours: parseFloat(document.getElementById(id + '_normalHours')?.value || 0),
      rate: parseFloat(document.getElementById(id + '_rate')?.value || 0),
      grossSalary: parseFloat(document.getElementById(id + '_grossSalary')?.value || 0),
      otHours_0: otHours_0,
      otHours_1_5: otHours_1_5,
      otHours_1_75: otHours_1_75,
      otHours_2: otHours_2,
      otHours_2_5: otHours_2_5,
      normalPay: parseFloat(document.getElementById(id + '_normalPay')?.value || 0),
      otPay_0: otPay_0,
      otPay_1_5: otPay_1_5,
      otPay_1_75: otPay_1_75,
      otPay_2: otPay_2,
      otPay_2_5: otPay_2_5,
      totalPay: parseFloat(document.getElementById(id + '_totalPay')?.value || 0),
      fileName: row.dataset.fileName || null,
      fileData: row.dataset.fileData || null,
      fileType: row.dataset.fileType || null
    });
  });
  
  // Indirect Manpower
  const indirectMP = [];
  document.querySelectorAll('#indirectMPRows .dynamic-row').forEach(row => {
    const id = row.id;
    
    // Get all OT hours
    const otHours_0 = parseFloat(document.getElementById(id + '_otHours_0')?.value || 0);
    const otHours_1_5 = parseFloat(document.getElementById(id + '_otHours_1_5')?.value || 0);
    const otHours_1_75 = parseFloat(document.getElementById(id + '_otHours_1_75')?.value || 0);
    const otHours_2 = parseFloat(document.getElementById(id + '_otHours_2')?.value || 0);
    const otHours_2_5 = parseFloat(document.getElementById(id + '_otHours_2_5')?.value || 0);
    
    // Get all OT pays
    const otPay_0 = parseFloat(document.getElementById(id + '_otPay_0')?.value || 0);
    const otPay_1_5 = parseFloat(document.getElementById(id + '_otPay_1_5')?.value || 0);
    const otPay_1_75 = parseFloat(document.getElementById(id + '_otPay_1_75')?.value || 0);
    const otPay_2 = parseFloat(document.getElementById(id + '_otPay_2')?.value || 0);
    const otPay_2_5 = parseFloat(document.getElementById(id + '_otPay_2_5')?.value || 0);
    
    indirectMP.push({
      role: document.getElementById(id + '_role')?.value || '',
      traderName: document.getElementById(id + '_traderName')?.value || '',
      qty: parseFloat(document.getElementById(id + '_qty')?.value || 0),
      normalHours: parseFloat(document.getElementById(id + '_normalHours')?.value || 0),
      rate: parseFloat(document.getElementById(id + '_rate')?.value || 0),
      otHours_0: otHours_0,
      otHours_1_5: otHours_1_5,
      otHours_1_75: otHours_1_75,
      otHours_2: otHours_2,
      otHours_2_5: otHours_2_5,
      normalPay: parseFloat(document.getElementById(id + '_normalPay')?.value || 0),
      otPay_0: otPay_0,
      otPay_1_5: otPay_1_5,
      otPay_1_75: otPay_1_75,
      otPay_2: otPay_2,
      otPay_2_5: otPay_2_5,
      totalPay: parseFloat(document.getElementById(id + '_totalPay')?.value || 0),
      fileName: row.dataset.fileName || null,
      fileData: row.dataset.fileData || null,
      fileType: row.dataset.fileType || null
    });
  });
  
  // Safety
  const safety = {
    lti: parseInt(document.getElementById('f_lti')?.value || 0),
    nearMiss: parseInt(document.getElementById('f_nearMiss')?.value || 0),
    safetyObs: parseInt(document.getElementById('f_safetyObs')?.value || 0),
    firstAid: parseInt(document.getElementById('f_firstAid')?.value || 0),
    toolbox: parseInt(document.getElementById('f_toolbox')?.value || 0),
    status: document.getElementById('f_safetyStatus')?.value || 'Green',
    remarks: document.getElementById('f_safetyRemarks')?.value || ''
  };
  
  const notes = document.getElementById('f_notes')?.value || '';
  
  return {
    projectName,
    reportDate,
    reportNo,
    reporter,
    directMP,
    indirectMP,
    safety,
    notes,
    createdBy: currentUser.username,
    createdAt: new Date().toISOString()
  };
}

// ========== SAVE REPORT ==========
function saveReport() {
  const data = collectFormData();
  
  if (!data.projectName || !data.reportDate || !data.reporter) {
    showToast('Project Name, Report Date, and Reporter are required', 'error');
    return;
  }
  
  // Check project access
  if (!canAccessProject(data.projectName)) {
    showToast('You do not have access to this project', 'error');
    return;
  }
  
  if (editingReportId) {
    // Update existing report
    const index = reports.findIndex(r => r.id === editingReportId);
    if (index !== -1) {
      const existingReport = reports[index];
      
      // Check if user can edit
      if (!canEdit(existingReport)) {
        showToast('You cannot edit this report (approvals in progress or complete)', 'error');
        return;
      }
      
      data.id = editingReportId;
      data.approvals = existingReport.approvals || [];
      data.isFullyApproved = existingReport.isFullyApproved || false;
      data.createdBy = existingReport.createdBy;
      data.createdAt = existingReport.createdAt;
      data.updatedBy = currentUser.username;
      data.updatedAt = new Date().toISOString();
      
      reports[index] = data;
      showToast('Report updated successfully', 'success');
    }
  } else {
    // Create new report
    data.id = 'RPT-' + Date.now();
    data.approvals = [];
    data.isFullyApproved = false;
    reports.push(data);
    showToast('Report saved successfully', 'success');
  }
  
  saveReports();
  
  // Show action dropdown after save (instead of Save button)
  showActionDropdown(data.id);
  
  // Store report ID for action dropdown
  editingReportId = data.id;
  
  updatePendingApprovalsCount();
}

// ========== ACTION DROPDOWN FUNCTIONS ==========
function showActionDropdown(reportId) {
  const saveBtn = document.getElementById('saveReportBtn');
  const actionContainer = document.getElementById('actionDropdownContainer');
  
  if (saveBtn && actionContainer) {
    saveBtn.style.display = 'none';
    actionContainer.style.display = 'inline-block';
  }
}

function hideActionDropdown() {
  const saveBtn = document.getElementById('saveReportBtn');
  const actionContainer = document.getElementById('actionDropdownContainer');
  
  if (saveBtn && actionContainer) {
    saveBtn.style.display = 'inline-block';
    actionContainer.style.display = 'none';
  }
  
  // Close the menu if open
  const menu = document.getElementById('actionDropdownMenu');
  if (menu) {
    menu.classList.remove('show');
  }
}

function toggleActionDropdown() {
  const menu = document.getElementById('actionDropdownMenu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const actionContainer = document.getElementById('actionDropdownContainer');
  const menu = document.getElementById('actionDropdownMenu');
  const actionBtn = document.querySelector('.action-dropdown-btn');
  
  if (actionContainer && menu && !actionContainer.contains(event.target)) {
    menu.classList.remove('show');
  }
});

function approveFromAction() {
  const menu = document.getElementById('actionDropdownMenu');
  if (menu) menu.classList.remove('show');
  
  if (!editingReportId) {
    showToast('No report selected', 'error');
    return;
  }
  
  const report = reports.find(r => r.id == editingReportId);
  if (!report) {
    showToast('Report not found', 'error');
    return;
  }
  
  // Open the approval modal
  openApprovalModal(report);
}

function cancelReport() {
  const menu = document.getElementById('actionDropdownMenu');
  if (menu) menu.classList.remove('show');
  
  if (!editingReportId) {
    showToast('No report to cancel', 'error');
    return;
  }
  
  if (confirm('Are you sure you want to cancel and delete this report?\n\nThis action cannot be undone.')) {
    // Delete the report
    const idx = reports.findIndex(r => r.id == editingReportId);
    if (idx !== -1) {
      const deletedReport = reports[idx];
      reports.splice(idx, 1);
      saveReports();
      showToast('Report cancelled and deleted', 'success');
      
      // Clear form and go back to dashboard
      clearForm();
      editingReportId = null;
      showPage('dashboard');
    }
  }
}

// ========== CLEAR FORM ==========
function clearForm() {
  editingReportId = null;
  document.getElementById('formTitle').textContent = '📝 New Daily Report';
  
  // Reset button states
  hideActionDropdown();
  
  // Reset project selection step
  const selectionStep = document.getElementById('projectSelectionStep');
  const displayDiv = document.getElementById('selectedProjectDisplay');
  const mainForm = document.getElementById('mainReportForm');
  
  if (selectionStep) selectionStep.style.display = 'block';
  if (displayDiv) displayDiv.style.display = 'none';
  if (mainForm) mainForm.style.display = 'none';
  
  const projectSelector = document.getElementById('f_projectName_selector');
  if (projectSelector) projectSelector.value = '';
  
  document.getElementById('f_projectName').value = '';
  document.getElementById('f_reportNo').value = '';
  document.getElementById('f_reporter').value = '';
  setDefaultReportDate();
  
  document.getElementById('f_lti').value = '0';
  document.getElementById('f_nearMiss').value = '0';
  document.getElementById('f_safetyObs').value = '0';
  document.getElementById('f_firstAid').value = '0';
  document.getElementById('f_toolbox').value = '0';
  document.getElementById('f_safetyStatus').value = 'Green';
  document.getElementById('f_safetyRemarks').value = '';
  
  document.getElementById('f_notes').value = '';
  
  document.getElementById('directMPRows').innerHTML = '';
  document.getElementById('indirectMPRows').innerHTML = '';
  
  directMPCounter = 0;
  indirectMPCounter = 0;
  
  addRow('directMP');
  addRow('indirectMP');
}

// ========== DASHBOARD ==========
function renderDashboard() {
  updatePendingApprovalsCount();
  
  // Filter by project access
  let accessibleReports = reports.filter(r => canAccessProject(r.projectName));
  
  // Filter by selected project if one is selected
  if (selectedDashboardProject) {
    accessibleReports = accessibleReports.filter(r => r.projectName === selectedDashboardProject);
  }
  
  // Filter by date
  const filterDate = document.getElementById('filterDate')?.value || '';
  if (filterDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    accessibleReports = accessibleReports.filter(r => {
      const reportDate = new Date(r.reportDate);
      reportDate.setHours(0, 0, 0, 0);
      
      if (filterDate === 'today') {
        return reportDate.getTime() === today.getTime();
      } else if (filterDate === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return reportDate.getTime() === yesterday.getTime();
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reportDate >= weekAgo && reportDate <= today;
      } else if (filterDate === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return reportDate >= monthAgo && reportDate <= today;
      }
      return true;
    });
  }
  
  // Search filter
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const filterProject = document.getElementById('filterProject')?.value || '';
  
  let filtered = accessibleReports.filter(r => {
    const matchesSearch = !searchTerm || 
      r.projectName.toLowerCase().includes(searchTerm) ||
      r.reportDate.includes(searchTerm) ||
      (r.reportNo && r.reportNo.toLowerCase().includes(searchTerm));
    const matchesProject = !filterProject || r.projectName === filterProject;
    return matchesSearch && matchesProject;
  });
  
  // Update project filter dropdown
  const projects = [...new Set(accessibleReports.map(r => r.projectName))];
  const filterSelect = document.getElementById('filterProject');
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="">All Projects</option>';
    projects.forEach(proj => {
      filterSelect.innerHTML += `<option value="${proj}">${proj}</option>`;
    });
    if (filterProject) {
      filterSelect.value = filterProject;
    }
  }
  
  // Update reports table header to show selected project
  const tableHeader = document.querySelector('#page-dashboard .card-header h2');
  if (tableHeader) {
    let headerText = '📅 Daily Reports History';
    if (selectedDashboardProject) {
      headerText += ` - ${selectedDashboardProject}`;
    }
    if (filterDate) {
      const dateLabels = {
        'today': 'Today',
        'yesterday': 'Yesterday',
        'week': 'This Week',
        'month': 'This Month'
      };
      headerText += ` (${dateLabels[filterDate]})`;
    }
    tableHeader.textContent = headerText;
  }
  
  // Render table
  const tableContainer = document.getElementById('reportsTable');
  if (filtered.length === 0) {
    let emptyMessage = 'No reports match your search criteria';
    if (selectedDashboardProject) {
      emptyMessage = `No reports found for project "${selectedDashboardProject}"`;
    }
    if (filterDate === 'today') {
      emptyMessage = 'No reports posted today';
    }
    
    tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No Reports Found</div>
        <div class="empty-state-text">
          ${emptyMessage}
        </div>
      </div>
    `;
    return;
  }
  
  const showProjectColumn = currentUser && (currentUser.role === 'CDGM' || currentUser.role === 'Admin');
  
  let tableHTML = `
    <table class="reports-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Report No</th>
          ${showProjectColumn ? '<th>Project</th>' : ''}
          <th>Direct MP</th>
          <th>Indirect MP</th>
          <th>Safety</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  filtered.forEach(report => {
    const totalDirect = report.directMP.reduce((sum, mp) => sum + mp.qty, 0);
    const totalIndirect = report.indirectMP.reduce((sum, mp) => sum + mp.qty, 0);
    
    const safetyBadge = report.safety.status === 'Green' ? 'badge-green' : 
                        report.safety.status === 'Yellow' ? 'badge-yellow' : 'badge-red';
    
    let statusBadge = 'badge-draft';
    let statusText = 'Draft';
    if (report.isFullyApproved) {
      statusBadge = 'badge-approved';
      statusText = 'Approved';
    } else if (report.approvals && report.approvals.length > 0) {
      statusBadge = 'badge-partial';
      statusText = `${report.approvals.length}/${APPROVAL_WORKFLOW.length} Approved`;
    }
    
    const canUserEdit = canEdit(report);
    const nextApprover = getNextRequiredApprover(report);
    const isMyTurn = nextApprover === currentUser?.role;
    
    tableHTML += `
      <tr onclick="viewReport('${report.id}')">
        <td>${report.reportDate}</td>
        <td>${report.reportNo || '—'}</td>
        ${showProjectColumn ? `<td><strong>${report.projectName}</strong></td>` : ''}
        <td>${totalDirect}</td>
        <td>${totalIndirect}</td>
        <td><span class="badge ${safetyBadge}">${report.safety.status}</span></td>
        <td><span class="badge ${statusBadge}">${statusText}</span></td>
        <td class="table-actions">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); viewReport('${report.id}')">👁 View</button>
          ${canUserEdit ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); editReport('${report.id}')">✏ Edit</button>` : ''}
          ${isMyTurn && !report.isFullyApproved && currentUser.role !== 'Admin' ? `<button class="btn btn-success btn-sm btn-pulse" onclick="event.stopPropagation(); openApprovalModal('${report.id}')">✓ Approve</button>` : ''}
          ${report.isFullyApproved ? `<button class="btn btn-success btn-sm" onclick="event.stopPropagation(); downloadReport('${report.id}')">⬇ Download</button>` : ''}
        </td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  tableContainer.innerHTML = tableHTML;
  
  // Render detailed manpower breakdown below
  renderManpowerBreakdown();
}

function viewReport(reportId) {
  const report = reports.find(r => r.id === reportId);
  if (!report) return;
  
  currentViewReportId = reportId; // Track current report for download
  
  // Build action buttons for the top
  let actionButtons = '';
  
  // Check if user can edit
  const canUserEdit = canEdit(report);
  if (canUserEdit) {
    actionButtons += `<button class="btn btn-primary" onclick="editReport('${report.id}')">✏ Edit Report</button>`;
  }
  
  // Check if it's user's turn to approve
  const nextApprover = getNextRequiredApprover(report);
  const isMyTurn = nextApprover === currentUser?.role;
  if (isMyTurn && !report.isFullyApproved && currentUser.role !== 'Admin') {
    actionButtons += `<button class="btn btn-success btn-pulse" onclick="openApprovalModal('${report.id}')">✓ Approve Report</button>`;
  }
  
  // Download button for fully approved reports
  if (report.isFullyApproved) {
    actionButtons += `<button class="btn btn-success" onclick="downloadReport('${report.id}')">⬇ Download</button>`;
  }
  
  // Always show Print and Back buttons
  actionButtons += `<button class="btn btn-outline" onclick="printReport()">🖨 Print</button>`;
  actionButtons += `<button class="btn btn-outline" onclick="showPage('dashboard')">← Back</button>`;
  
  // Set action buttons
  const actionButtonsContainer = document.getElementById('reportActionButtons');
  if (actionButtonsContainer) {
    actionButtonsContainer.innerHTML = actionButtons;
  }
  
  let html = `
    <div class="card">
  `;
  
  // Approval banner
  if (report.isFullyApproved) {
    html += `
      <div class="approval-banner approved">
        <div class="approval-icon">✅</div>
        <div class="approval-details">
          <div class="approval-status">Fully Approved</div>
          <div class="approval-info">This report has been approved by all required roles and is now locked.</div>
        </div>
      </div>
    `;
  } else if (report.approvals && report.approvals.length > 0) {
    const nextRole = getNextRequiredApprover(report);
    html += `
      <div class="approval-banner partial">
        <div class="approval-icon">⏳</div>
        <div class="approval-details">
          <div class="approval-status">Partial Approval (${report.approvals.length}/${APPROVAL_WORKFLOW.length})</div>
          <div class="approval-info">Next approval required: <strong>${nextRole}</strong></div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="approval-banner draft">
        <div class="approval-icon">📝</div>
        <div class="approval-details">
          <div class="approval-status">Draft</div>
          <div class="approval-info">No approvals yet. Ready for ${APPROVAL_WORKFLOW[0]} approval.</div>
        </div>
      </div>
    `;
  }
  
  // Report Info
  const showProjectAndUser = currentUser && (currentUser.role === 'CDGM' || currentUser.role === 'Admin');
  
  html += `
    <div class="report-section">
      <h3>📋 Report Information</h3>
      <div class="report-grid">`;
  
  // Show Project Name only for CDGM and Admin
  if (showProjectAndUser) {
    html += `
        <div class="report-item">
          <div class="report-item-label">Project Name</div>
          <div class="report-item-value">${report.projectName}</div>
        </div>`;
  }
  
  html += `
        <div class="report-item">
          <div class="report-item-label">Report Date</div>
          <div class="report-item-value">${report.reportDate}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Report Number</div>
          <div class="report-item-value">${report.reportNo || '—'}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Reporter / Prepared By</div>
          <div class="report-item-value">${report.reporter ? USERS[report.reporter]?.name || report.reporter : '—'}</div>
        </div>`;
  
  // Show Created By only for CDGM and Admin
  if (showProjectAndUser && report.createdBy) {
    html += `
        <div class="report-item">
          <div class="report-item-label">Created By (User)</div>
          <div class="report-item-value">${USERS[report.createdBy]?.name || report.createdBy}</div>
        </div>`;
  }
  
  html += `
      </div>
    </div>
  `;
  
  // Direct Manpower
  if (report.directMP && report.directMP.length > 0) {
    html += `
      <div class="report-section">
        <h3>👷 Direct Manpower</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Title</th>
              <th>Gross Salary (ETB)</th>
              <th>Working Days</th>
              <th>Normal OT{1.5}</th>
              <th>Night OT{1.75}</th>
              <th>Sunday{2.00}</th>
              <th>Holiday{2.5}</th>
              <th>Normal Pay</th>
              <th>OT Pay</th>
              <th>Total Pay</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
    `;
    report.directMP.forEach(mp => {
      html += `
        <tr>
          <td>${mp.order || '—'}</td>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.trade}</td>
          <td>ETB ${mp.rate.toFixed(2)}</td>
          <td>${mp.qty}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${mp.normalPay.toFixed(2)}</td>
          <td>ETB ${(mp.otPay_0 + mp.otPay_1_5 + mp.otPay_1_75 + mp.otPay_2 + mp.otPay_2_5).toFixed(2)}</td>
          <td><strong>ETB ${mp.totalPay.toFixed(2)}</strong></td>
          <td>${mp.fileName ? `<a href="#" class="file-link" onclick="downloadFile('${mp.fileName}', '${mp.fileData}')">${getFileIcon(mp.fileName)} ${mp.fileName}</a>` : '<span class="no-file-text">—</span>'}</td>
        </tr>
      `;
    });
    html += `
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Indirect Manpower
  if (report.indirectMP && report.indirectMP.length > 0) {
    html += `
      <div class="report-section">
        <h3>🧑‍💼 Indirect Manpower</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Gross Salary (ETB)</th>
              <th>Working Days</th>
              <th>Normal OT{1.5}</th>
              <th>Night OT{1.75}</th>
              <th>Sunday{2.00}</th>
              <th>Holiday{2.5}</th>
              <th>Normal Pay</th>
              <th>OT Pay</th>
              <th>Total Pay</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
    `;
    report.indirectMP.forEach(mp => {
      html += `
        <tr>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.role}</td>
          <td>ETB ${mp.rate.toFixed(2)}</td>
          <td>${mp.qty}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${mp.normalPay.toFixed(2)}</td>
          <td>ETB ${((mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0)).toFixed(2)}</td>
          <td><strong>ETB ${mp.totalPay.toFixed(2)}</strong></td>
          <td>${mp.fileName ? `<a href="#" class="file-link" onclick="downloadFile('${mp.fileName}', '${mp.fileData}')">${getFileIcon(mp.fileName)} ${mp.fileName}</a>` : '<span class="no-file-text">—</span>'}</td>
        </tr>
      `;
    });
    html += `
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Safety
  html += `
    <div class="report-section">
      <h3>⛑ Safety</h3>
      <div class="report-grid">
        <div class="report-item">
          <div class="report-item-label">Lost Time Incidents</div>
          <div class="report-item-value">${report.safety.lti}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Near Misses</div>
          <div class="report-item-value">${report.safety.nearMiss}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Safety Observations</div>
          <div class="report-item-value">${report.safety.safetyObs}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">First Aid Cases</div>
          <div class="report-item-value">${report.safety.firstAid}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Toolbox Talks</div>
          <div class="report-item-value">${report.safety.toolbox}</div>
        </div>
        <div class="report-item">
          <div class="report-item-label">Status</div>
          <div class="report-item-value">
            <span class="badge ${report.safety.status === 'Green' ? 'badge-green' : report.safety.status === 'Yellow' ? 'badge-yellow' : 'badge-red'}">${report.safety.status}</span>
          </div>
        </div>
      </div>
      ${report.safety.remarks ? `<p style="margin-top:10px;"><strong>Remarks:</strong> ${report.safety.remarks}</p>` : ''}
    </div>
  `;
  
  // Notes
  if (report.notes) {
    html += `
      <div class="report-section">
        <h3>📝 Notes</h3>
        <p>${report.notes}</p>
      </div>
    `;
  }
  
  // Approval Workflow
  if (report.approvals && report.approvals.length > 0) {
    html += `
      <div class="report-section">
        <h3>✓ Approval History</h3>
        <div class="approval-workflow">
    `;
    APPROVAL_WORKFLOW.forEach((role, index) => {
      const approval = report.approvals.find(a => a.role === role);
      const isNext = !report.isFullyApproved && !approval && (index === 0 || report.approvals.some(a => a.role === APPROVAL_WORKFLOW[index - 1]));
      
      let stepClass = 'pending';
      let stepContent = '?';
      let detailsHTML = '';
      
      if (approval) {
        stepClass = 'completed';
        stepContent = '✓';
        detailsHTML = `
          <div class="step-role">${role}</div>
          <div class="step-name">${approval.name}</div>
          <div class="step-date">${new Date(approval.timestamp).toLocaleDateString()}</div>
        `;
      } else if (isNext) {
        stepClass = 'next';
        stepContent = index + 1;
        detailsHTML = `
          <div class="step-role">${role}</div>
          <div class="step-highlight">YOUR TURN</div>
        `;
      } else {
        stepContent = index + 1;
        detailsHTML = `<div class="step-role">${role}</div>`;
      }
      
      html += `
        <div class="workflow-step ${stepClass}">
          <div class="step-number">${stepContent}</div>
          <div class="step-details">${detailsHTML}</div>
        </div>
      `;
    });
    html += `
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  
  document.getElementById('reportViewContent').innerHTML = html;
  showPage('viewReport');
}

function editReport(reportId) {
  const report = reports.find(r => r.id === reportId);
  if (!report) return;
  
  if (!canEdit(report)) {
    showToast('You cannot edit this report', 'error');
    return;
  }
  
  editingReportId = reportId;
  document.getElementById('formTitle').textContent = '✏ Edit Report';
  
  // Set project in selector and readonly field
  const projectSelector = document.getElementById('f_projectName_selector');
  const projectField = document.getElementById('f_projectName');
  if (projectSelector) projectSelector.value = report.projectName;
  if (projectField) projectField.value = report.projectName;
  
  // Show that project is selected
  const displayDiv = document.getElementById('selectedProjectDisplay');
  const projectNameSpan = document.getElementById('selectedProjectName');
  const selectionStep = document.getElementById('projectSelectionStep');
  const mainForm = document.getElementById('mainReportForm');
  
  if (displayDiv && projectNameSpan) {
    projectNameSpan.textContent = report.projectName;
    displayDiv.style.display = 'block';
  }
  
  if (selectionStep) selectionStep.style.display = 'none';
  if (mainForm) mainForm.style.display = 'block';
  
  // Fill other fields
  document.getElementById('f_reportDate').value = report.reportDate;
  document.getElementById('f_reportNo').value = report.reportNo || '';
  document.getElementById('f_reporter').value = report.reporter || '';
  
  document.getElementById('f_lti').value = report.safety.lti;
  document.getElementById('f_nearMiss').value = report.safety.nearMiss;
  document.getElementById('f_safetyObs').value = report.safety.safetyObs;
  document.getElementById('f_firstAid').value = report.safety.firstAid;
  document.getElementById('f_toolbox').value = report.safety.toolbox;
  document.getElementById('f_safetyStatus').value = report.safety.status;
  document.getElementById('f_safetyRemarks').value = report.safety.remarks;
  
  document.getElementById('f_notes').value = report.notes;
  
  document.getElementById('directMPRows').innerHTML = '';
  document.getElementById('indirectMPRows').innerHTML = '';
  
  directMPCounter = 0;
  indirectMPCounter = 0;
  
  report.directMP.forEach(mp => {
    addRow('directMP');
    const rowId = `directMP_${directMPCounter}`;
    document.getElementById(rowId + '_order').value = mp.order || '';
    document.getElementById(rowId + '_trade').value = mp.trade;
    document.getElementById(rowId + '_traderName').value = mp.traderName || '';
    document.getElementById(rowId + '_qty').value = mp.qty;
    document.getElementById(rowId + '_job').value = mp.job || '';
    document.getElementById(rowId + '_rate').value = mp.rate;
    document.getElementById(rowId + '_normalHours').value = mp.normalHours;
    
    // Set OT hours for each multiplier
    document.getElementById(rowId + '_otHours_0').value = mp.otHours_0 || 0;
    document.getElementById(rowId + '_otHours_1_5').value = mp.otHours_1_5 || 0;
    document.getElementById(rowId + '_otHours_1_75').value = mp.otHours_1_75 || 0;
    document.getElementById(rowId + '_otHours_2').value = mp.otHours_2 || 0;
    document.getElementById(rowId + '_otHours_2_5').value = mp.otHours_2_5 || 0;
    
    if (mp.fileName) {
      const row = document.getElementById(rowId);
      row.dataset.fileName = mp.fileName;
      row.dataset.fileData = mp.fileData;
      row.dataset.fileType = mp.fileType;
      const preview = document.getElementById(rowId + '_filePreview');
      preview.innerHTML = `
        <div class="file-attached">
          <span class="file-icon">${getFileIcon(mp.fileName)}</span>
          <span class="file-name">${mp.fileName}</span>
          <button class="btn-file-remove" onclick="removeFile('${rowId}', event)">✕</button>
        </div>
      `;
    }
  });
  
  report.indirectMP.forEach(mp => {
    addRow('indirectMP');
    const rowId = `indirectMP_${indirectMPCounter}`;
    document.getElementById(rowId + '_role').value = mp.role;
    document.getElementById(rowId + '_traderName').value = mp.traderName || '';
    document.getElementById(rowId + '_qty').value = mp.qty;
    document.getElementById(rowId + '_rate').value = mp.rate;
    document.getElementById(rowId + '_normalHours').value = mp.normalHours;
    
    // Set OT hours for each multiplier
    document.getElementById(rowId + '_otHours_0').value = mp.otHours_0 || 0;
    document.getElementById(rowId + '_otHours_1_5').value = mp.otHours_1_5 || 0;
    document.getElementById(rowId + '_otHours_1_75').value = mp.otHours_1_75 || 0;
    document.getElementById(rowId + '_otHours_2').value = mp.otHours_2 || 0;
    document.getElementById(rowId + '_otHours_2_5').value = mp.otHours_2_5 || 0;
    
    if (mp.fileName) {
      const row = document.getElementById(rowId);
      row.dataset.fileName = mp.fileName;
      row.dataset.fileData = mp.fileData;
      row.dataset.fileType = mp.fileType;
      const preview = document.getElementById(rowId + '_filePreview');
      preview.innerHTML = `
        <div class="file-attached">
          <span class="file-icon">${getFileIcon(mp.fileName)}</span>
          <span class="file-name">${mp.fileName}</span>
          <button class="btn-file-remove" onclick="removeFile('${rowId}', event)">✕</button>
        </div>
      `;
    }
  });
  
  calcManpowerTotals('directMP');
  calcManpowerTotals('indirectMP');
  
  showPage('newReport');
}

function printReport() {
  window.print();
}

// ========== APPROVAL ==========
function getNextRequiredApprover(report) {
  if (!report.approvals) report.approvals = [];
  if (report.isFullyApproved) return null;
  
  for (let i = 0; i < APPROVAL_WORKFLOW.length; i++) {
    const role = APPROVAL_WORKFLOW[i];
    const hasApproved = report.approvals.some(a => a.role === role);
    if (!hasApproved) {
      return role;
    }
  }
  return null;
}

function openApprovalModal(reportId) {
  currentReportId = reportId;
  const report = reports.find(r => r.id === reportId);
  
  if (!report || !currentUser) return;
  
  const nextRole = getNextRequiredApprover(report);
  
  document.getElementById('currentUserRole').textContent = currentUser.role;
  document.getElementById('nextApproverText').textContent = nextRole || 'None';
  
  const modal = document.getElementById('approvalModal');
  modal.style.display = 'flex';
  
  document.getElementById('approverName').value = currentUser.name;
  document.getElementById('approvalPassword').value = '';
}

function closeApprovalModal() {
  document.getElementById('approvalModal').style.display = 'none';
  document.getElementById('approverName').value = '';
  currentReportId = null;
}

function submitApproval() {
  const report = reports.find(r => r.id === currentReportId);
  if (!report || !currentUser) return;
  
  const approverName = document.getElementById('approverName').value.trim();
  
  if (!approverName) {
    showToast('Please enter your name', 'error');
    return;
  }
  
  // Check if it's user's turn
  const nextRole = getNextRequiredApprover(report);
  if (nextRole !== currentUser.role) {
    showToast('It is not your turn to approve', 'error');
    return;
  }
  
  // Add approval
  if (!report.approvals) report.approvals = [];
  
  report.approvals.push({
    role: currentUser.role,
    name: approverName,
    username: currentUser.username,
    timestamp: new Date().toISOString()
  });
  
  // Check if fully approved
  if (report.approvals.length === APPROVAL_WORKFLOW.length) {
    report.isFullyApproved = true;
  }
  
  saveReports();
  closeApprovalModal();
  showToast('✓ Report approved successfully! Note: Once approved, reports cannot be edited.', 'success');
  renderDashboard();
}

// ========== USER MANAGEMENT ==========
function showUserManagement() {
  if (currentUser.role !== 'Admin') {
    showToast('Access denied. Admin only.', 'error');
    return;
  }
  
  renderUserList();
  showPage('userManagement');
}

function renderUserList() {
  let html = `
    <div class="user-management-header">
      <h3>Registered Users</h3>
      <button class="btn btn-primary" onclick="openUserForm('add')">➕ Add New User</button>
    </div>
    <table class="user-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Full Name</th>
          <th>Role</th>
          <th>Projects</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  Object.keys(USERS).forEach(username => {
    if (username === 'Admin') return; // Hide Admin from list
    
    const user = USERS[username];
    const projects = Array.isArray(user.projects) ? user.projects.join(', ') : user.projects;
    
    html += `
      <tr>
        <td><code>${username}</code></td>
        <td>${user.name}</td>
        <td><span class="role-badge">${user.role}</span></td>
        <td>${projects}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openUserForm('edit', '${username}')">✏ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${username}')">🗑 Delete</button>
        </td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  document.getElementById('userListContainer').innerHTML = html;
}

function openUserForm(mode, username = null) {
  document.getElementById('userFormMode').value = mode;
  
  // Populate projects list
  populateUserProjectsList();
  
  if (mode === 'add') {
    document.getElementById('userFormTitle').textContent = 'Add New User';
    document.getElementById('userFormUsername').value = '';
    document.getElementById('userFormUsername').disabled = false;
    document.getElementById('userFormName').value = '';
    document.getElementById('userFormRole').value = 'Office Engineer';
    document.getElementById('userFormPassword').value = '';
    // Clear selections
    clearProjectSelections();
  } else {
    document.getElementById('userFormTitle').textContent = 'Edit User';
    const user = USERS[username];
    document.getElementById('userFormUsername').value = username;
    document.getElementById('userFormUsername').disabled = true;
    document.getElementById('userFormName').value = user.name;
    document.getElementById('userFormRole').value = user.role;
    document.getElementById('userFormPassword').value = user.password;
    
    // Load user's projects
    loadUserProjects(user.projects);
  }
  
  document.getElementById('userFormModal').style.display = 'flex';
}

function populateUserProjectsList() {
  const listContainer = document.getElementById('userFormProjectsList');
  if (!listContainer) return;
  
  // Clear existing
  listContainer.innerHTML = '';
  
  // Add "ALL PROJECTS" option
  listContainer.innerHTML += `
    <label class="project-option all-projects">
      <input type="checkbox" value="ALL" onchange="handleProjectSelection()"/> 
      ALL PROJECTS
    </label>
  `;
  
  // Add active projects from database
  Object.keys(PROJECTS).sort().forEach(projectName => {
    const project = PROJECTS[projectName];
    if (project.status === 'Active') {
      listContainer.innerHTML += `
        <label class="project-option" data-project="${projectName.toLowerCase()}">
          <input type="checkbox" value="${projectName}" onchange="handleProjectSelection()"/> 
          ${projectName}
        </label>
      `;
    }
  });
  
  // Add search functionality
  const searchInput = document.getElementById('userFormProjectsSearch');
  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = filterProjects;
  }
}

function filterProjects() {
  const searchTerm = document.getElementById('userFormProjectsSearch').value.toLowerCase();
  const projectOptions = document.querySelectorAll('.project-option');
  
  projectOptions.forEach(option => {
    // Don't filter "ALL PROJECTS"
    if (option.classList.contains('all-projects')) {
      option.classList.remove('hidden');
      return;
    }
    
    const projectName = option.dataset.project || '';
    
    if (projectName.includes(searchTerm)) {
      option.classList.remove('hidden');
    } else {
      option.classList.add('hidden');
    }
  });
}

function handleProjectSelection() {
  const checkboxes = document.querySelectorAll('#userFormProjectsList input[type="checkbox"]');
  const allCheckbox = document.querySelector('#userFormProjectsList input[value="ALL"]');
  
  // If "ALL" is checked, uncheck others
  if (allCheckbox && allCheckbox.checked) {
    checkboxes.forEach(cb => {
      if (cb !== allCheckbox) {
        cb.checked = false;
      }
    });
  } else {
    // If any other is checked, uncheck "ALL"
    const anyOtherChecked = Array.from(checkboxes).some(cb => cb !== allCheckbox && cb.checked);
    if (anyOtherChecked && allCheckbox) {
      allCheckbox.checked = false;
    }
  }
  
  updateSelectedProjectsDisplay();
}

function updateSelectedProjectsDisplay() {
  const displayContainer = document.getElementById('selectedProjectsDisplay');
  if (!displayContainer) return;
  
  const checkboxes = document.querySelectorAll('#userFormProjectsList input[type="checkbox"]:checked');
  
  if (checkboxes.length === 0) {
    displayContainer.innerHTML = '<div class="no-projects-selected">No projects selected</div>';
    return;
  }
  
  let html = '';
  checkboxes.forEach(cb => {
    const value = cb.value;
    const isAll = value === 'ALL';
    html += `
      <span class="selected-project-tag">
        ${isAll ? '⭐ ALL PROJECTS' : value}
        <span class="remove-tag" onclick="removeProjectTag('${value}')">✕</span>
      </span>
    `;
  });
  
  displayContainer.innerHTML = html;
}

function removeProjectTag(projectValue) {
  const checkbox = document.querySelector(`#userFormProjectsList input[value="${projectValue}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateSelectedProjectsDisplay();
  }
}

function clearProjectSelections() {
  const checkboxes = document.querySelectorAll('#userFormProjectsList input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  updateSelectedProjectsDisplay();
}

function loadUserProjects(userProjects) {
  clearProjectSelections();
  
  if (userProjects === 'ALL') {
    const allCheckbox = document.querySelector('#userFormProjectsList input[value="ALL"]');
    if (allCheckbox) {
      allCheckbox.checked = true;
    }
  } else {
    const projectArray = Array.isArray(userProjects) ? userProjects : [userProjects];
    projectArray.forEach(projectName => {
      const checkbox = document.querySelector(`#userFormProjectsList input[value="${projectName}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }
  
  updateSelectedProjectsDisplay();
}

function getSelectedProjects() {
  const checkboxes = document.querySelectorAll('#userFormProjectsList input[type="checkbox"]:checked');
  
  if (checkboxes.length === 0) {
    return null;
  }
  
  // Check if "ALL" is selected
  const allSelected = Array.from(checkboxes).some(cb => cb.value === 'ALL');
  if (allSelected) {
    return 'ALL';
  }
  
  // Return array of selected project names
  return Array.from(checkboxes).map(cb => cb.value);
}

function populateUserProjectsDropdown() {
  // This function is now replaced by populateUserProjectsList
  // Kept for compatibility
}

function closeUserForm() {
  document.getElementById('userFormModal').style.display = 'none';
}

function saveUser() {
  const mode = document.getElementById('userFormMode').value;
  const username = document.getElementById('userFormUsername').value.trim();
  const name = document.getElementById('userFormName').value.trim();
  const role = document.getElementById('userFormRole').value;
  const password = document.getElementById('userFormPassword').value;
  
  // Get selected projects
  const projects = getSelectedProjects();
  
  if (!username || !name || !password || !projects) {
    showToast('All fields are required. Please select at least one project.', 'error');
    return;
  }
  
  if (mode === 'add') {
    if (USERS[username]) {
      showToast('Username already exists', 'error');
      return;
    }
  }
  
  USERS[username] = {
    name,
    role,
    password,
    projects
  };
  
  saveUsers();
  closeUserForm();
  showToast(mode === 'add' ? 'User created successfully' : 'User updated successfully', 'success');
  renderUserList();
}

function deleteUser(username) {
  if (username === 'Admin') {
    showToast('Cannot delete Admin account', 'error');
    return;
  }
  
  if (!confirm(`Delete user "${username}"? This cannot be undone.`)) {
    return;
  }
  
  delete USERS[username];
  saveUsers();
  showToast('User deleted', 'success');
  renderUserList();
}


// ========== PROJECT MANAGEMENT ==========
function showProjectManagement() {
  if (currentUser.role !== 'Admin') {
    showToast('Access denied. Admin only.', 'error');
    return;
  }
  
  renderProjectList();
  showPage('projectManagement');
}

function renderProjectList() {
  let html = `
    <div class="user-management-header">
      <h3>Project Database</h3>
      <button class="btn btn-primary" onclick="openProjectForm('add')">➕ Add New Project</button>
    </div>
    <table class="user-table">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Location</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  Object.keys(PROJECTS).forEach(projectName => {
    const project = PROJECTS[projectName];
    const statusBadge = project.status === 'Active' ? 'badge-green' : 
                       project.status === 'Completed' ? 'badge-approved' : 'badge-yellow';
    
    html += `
      <tr>
        <td><strong>${project.name}</strong></td>
        <td>${project.location || '—'}</td>
        <td><span class="badge ${statusBadge}">${project.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openProjectForm('edit', '${projectName}')">✏ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${projectName}')">🗑 Delete</button>
        </td>
      </tr>
    `;
  });
  
  if (Object.keys(PROJECTS).length === 0) {
    html += `
      <tr>
        <td colspan="4" style="text-align:center; padding:40px; color:#718096;">
          No projects yet. Click "Add New Project" to create one.
        </td>
      </tr>
    `;
  }
  
  html += `
      </tbody>
    </table>
  `;
  
  document.getElementById('projectListContainer').innerHTML = html;
}

function openProjectForm(mode, projectName = null) {
  document.getElementById('projectFormMode').value = mode;
  
  if (mode === 'add') {
    document.getElementById('projectFormTitle').textContent = 'Add New Project';
    document.getElementById('projectFormName').value = '';
    document.getElementById('projectFormName').disabled = false;
    document.getElementById('projectFormLocation').value = '';
    document.getElementById('projectFormStatus').value = 'Active';
    document.getElementById('projectFormOldName').value = '';
  } else {
    document.getElementById('projectFormTitle').textContent = 'Edit Project';
    const project = PROJECTS[projectName];
    document.getElementById('projectFormName').value = project.name;
    document.getElementById('projectFormName').disabled = true;
    document.getElementById('projectFormLocation').value = project.location || '';
    document.getElementById('projectFormStatus').value = project.status;
    document.getElementById('projectFormOldName').value = projectName;
  }
  
  document.getElementById('projectFormModal').style.display = 'flex';
}

function closeProjectForm() {
  document.getElementById('projectFormModal').style.display = 'none';
}

function saveProject() {
  const mode = document.getElementById('projectFormMode').value;
  const name = document.getElementById('projectFormName').value.trim();
  const location = document.getElementById('projectFormLocation').value.trim();
  const status = document.getElementById('projectFormStatus').value;
  const oldName = document.getElementById('projectFormOldName').value;
  
  if (!name) {
    showToast('Project name is required', 'error');
    return;
  }
  
  if (mode === 'add') {
    if (PROJECTS[name]) {
      showToast('Project name already exists', 'error');
      return;
    }
  }
  
  if (mode === 'edit' && name !== oldName) {
    // Rename - update all references
    delete PROJECTS[oldName];
  }
  
  PROJECTS[name] = {
    name: name,
    location: location,
    status: status
  };
  
  saveProjects();
  populateProjectDropdown(); // Update dropdown
  closeProjectForm();
  showToast(mode === 'add' ? 'Project created successfully' : 'Project updated successfully', 'success');
  renderProjectList();
}

function deleteProject(projectName) {
  if (!confirm(`Delete project "${projectName}"? This cannot be undone.\n\nNote: Existing reports will still reference this project name.`)) {
    return;
  }
  
  delete PROJECTS[projectName];
  saveProjects();
  populateProjectDropdown(); // Update dropdown
  showToast('Project deleted', 'success');
  renderProjectList();
}


// ========== REPORT DOWNLOAD/EXPORT ==========
let currentViewReportId = null;

function downloadReport(reportId) {
  const report = reports.find(r => r.id === reportId);
  if (!report) {
    showToast('Report not found', 'error');
    return;
  }
  
  if (!report.isFullyApproved) {
    showToast('Only fully approved reports can be downloaded', 'error');
    return;
  }
  
  // Generate HTML content for download
  const htmlContent = generateReportHTML(report);
  
  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.projectName}_${report.reportDate}_Report.html`;
  link.click();
  URL.revokeObjectURL(url);
  
  showToast('Report downloaded successfully', 'success');
}

function downloadCurrentReport() {
  if (currentViewReportId) {
    downloadReport(currentViewReportId);
  }
}

function generateReportHTML(report) {
  const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#E67E22" stroke-width="5"/>
    <path d="M 30,25 L 30,75" stroke="#E67E22" stroke-width="4" fill="none"/>
    <path d="M 50,20 L 50,80" stroke="#E67E22" stroke-width="4" fill="none"/>
    <path d="M 70,25 L 70,75" stroke="#E67E22" stroke-width="4" fill="none"/>
    <path d="M 25,40 L 75,60" stroke="#E67E22" stroke-width="4" fill="none"/>
  </svg>`;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.projectName} - Daily Progress Report - ${report.reportDate}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #f7fafc;
      color: #2d3748;
    }
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 4px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    .report-title {
      font-size: 18px;
      color: #718096;
    }
    .report-info {
      text-align: right;
    }
    .report-info div {
      margin-bottom: 5px;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      background: #c6f6d5;
      color: #22543d;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      background: #667eea;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #f7fafc;
      padding: 12px;
      text-align: left;
      border: 2px solid #e2e8f0;
      font-weight: 600;
      color: #4a5568;
      font-size: 13px;
    }
    td {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      font-size: 14px;
    }
    tr:nth-child(even) {
      background: #f7fafc;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-box {
      background: #f7fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .info-label {
      font-size: 12px;
      color: #718096;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      color: #2d3748;
      font-weight: 600;
    }
    .approval-section {
      background: #f0fdf4;
      border: 2px solid #48bb78;
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }
    .approval-title {
      font-size: 18px;
      font-weight: bold;
      color: #22543d;
      margin-bottom: 15px;
    }
    .approval-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .approval-box {
      background: white;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #48bb78;
    }
    .approval-role {
      font-size: 12px;
      color: #718096;
      font-weight: 600;
    }
    .approval-name {
      font-size: 14px;
      color: #2d3748;
      font-weight: bold;
      margin: 5px 0;
    }
    .approval-date {
      font-size: 11px;
      color: #a0aec0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #718096;
      font-size: 12px;
    }
    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        ${logoSVG}
        <div>
          <div class="company-name">El-Hadar Projects</div>
          <div class="report-title">Daily Progress Report</div>
        </div>
      </div>
      <div class="report-info">
        <div><strong>Project:</strong> ${report.projectName}</div>
        <div><strong>Date:</strong> ${report.reportDate}</div>
        <div><strong>Report #:</strong> ${report.reportNo || '—'}</div>
        <div><strong>Reporter:</strong> ${report.reporter ? (USERS[report.reporter]?.name || report.reporter) : '—'}</div>
        <div style="margin-top:10px;"><span class="status-badge">✓ APPROVED</span></div>
      </div>
    </div>`;

  // Direct Manpower
  if (report.directMP && report.directMP.length > 0) {
    let directTotal = 0;
    html += `
    <div class="section">
      <div class="section-title">👷 Direct Manpower</div>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Trade</th>
            <th>Trader Name</th>
            <th>Qty</th>
            <th>Job</th>
            <th>Normal Hrs</th>
            <th>OT Hrs</th>
            <th>Rate (ETB)</th>
            <th>OT Mult</th>
            <th>Total Pay (ETB)</th>
          </tr>
        </thead>
        <tbody>`;
    
    report.directMP.forEach(mp => {
      directTotal += mp.totalPay;
      html += `
          <tr>
            <td>${mp.order || '—'}</td>
            <td>${mp.trade}</td>
            <td>${mp.traderName || '—'}</td>
            <td>${mp.qty}</td>
            <td>${mp.job || '—'}</td>
            <td>${mp.normalHours}</td>
            <td>${mp.otHours}</td>
            <td>${mp.rate.toFixed(2)}</td>
            <td>${mp.otMultiplier}x</td>
            <td><strong>${mp.totalPay.toFixed(2)}</strong></td>
          </tr>`;
    });
    
    html += `
          <tr style="background:#edf2f7;">
            <td colspan="9" style="text-align:right;font-weight:bold;">TOTAL DIRECT MANPOWER:</td>
            <td style="font-weight:bold;font-size:16px;color:#667eea;">ETB ${directTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>`;
  }

  // Indirect Manpower
  if (report.indirectMP && report.indirectMP.length > 0) {
    let indirectTotal = 0;
    html += `
    <div class="section">
      <div class="section-title">🧑‍💼 Indirect Manpower</div>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Trader Name</th>
            <th>Qty</th>
            <th>Normal Hrs</th>
            <th>OT Hrs</th>
            <th>Rate (ETB)</th>
            <th>OT Mult</th>
            <th>Total Pay (ETB)</th>
          </tr>
        </thead>
        <tbody>`;
    
    report.indirectMP.forEach(mp => {
      indirectTotal += mp.totalPay;
      html += `
          <tr>
            <td>${mp.role}</td>
            <td>${mp.traderName || '—'}</td>
            <td>${mp.qty}</td>
            <td>${mp.normalHours}</td>
            <td>${mp.otHours}</td>
            <td>${mp.rate.toFixed(2)}</td>
            <td>${mp.otMultiplier}x</td>
            <td><strong>${mp.totalPay.toFixed(2)}</strong></td>
          </tr>`;
    });
    
    html += `
          <tr style="background:#edf2f7;">
            <td colspan="7" style="text-align:right;font-weight:bold;">TOTAL INDIRECT MANPOWER:</td>
            <td style="font-weight:bold;font-size:16px;color:#667eea;">ETB ${indirectTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>`;
  }

  // Safety
  html += `
    <div class="section">
      <div class="section-title">⛑ Safety</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Lost Time Incidents</div>
          <div class="info-value">${report.safety.lti}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Near Misses</div>
          <div class="info-value">${report.safety.nearMiss}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Safety Observations</div>
          <div class="info-value">${report.safety.safetyObs}</div>
        </div>
        <div class="info-box">
          <div class="info-label">First Aid Cases</div>
          <div class="info-value">${report.safety.firstAid}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Toolbox Talks</div>
          <div class="info-value">${report.safety.toolbox}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Safety Status</div>
          <div class="info-value">${report.safety.status}</div>
        </div>
      </div>
      ${report.safety.remarks ? `<div style="margin-top:15px;padding:15px;background:#f7fafc;border-radius:8px;"><strong>Remarks:</strong> ${report.safety.remarks}</div>` : ''}
    </div>`;

  // Notes
  if (report.notes) {
    html += `
    <div class="section">
      <div class="section-title">📝 General Notes</div>
      <div style="padding:15px;background:#f7fafc;border-radius:8px;line-height:1.6;">
        ${report.notes}
      </div>
    </div>`;
  }

  // Approvals
  if (report.approvals && report.approvals.length > 0) {
    html += `
    <div class="approval-section">
      <div class="approval-title">✓ Approval History</div>
      <div class="approval-grid">`;
    
    report.approvals.forEach(approval => {
      const date = new Date(approval.timestamp).toLocaleDateString();
      html += `
        <div class="approval-box">
          <div class="approval-role">${approval.role}</div>
          <div class="approval-name">✓ ${approval.name}</div>
          <div class="approval-date">${date}</div>
        </div>`;
    });
    
    html += `
      </div>
    </div>`;
  }

  // Footer
  html += `
    <div class="footer">
      <div>Generated from El-Hadar Projects Daily Progress Report System</div>
      <div>Downloaded on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
      <div style="margin-top:10px;">This is an approved and official report.</div>
    </div>
  </div>
</body>
</html>`;

  return html;
}


// ========== EXCEL FILE IMPORT ==========
function importExcelFile(type, inputElement) {
  const file = inputElement.files[0];
  
  if (!file) {
    return;
  }
  
  // Show filename
  const fileNameSpan = document.getElementById(type + 'FileName');
  if (fileNameSpan) {
    fileNameSpan.textContent = `Selected: ${file.name}`;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON (array of arrays)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      // Skip header row (first row) and process data
      const dataRows = jsonData.slice(1).filter(row => row.length > 0 && row.some(cell => cell !== ''));
      
      if (dataRows.length === 0) {
        showToast('No data found in Excel file', 'error');
        return;
      }
      
      // Clear existing rows
      if (type === 'direct') {
        document.getElementById('directMPRows').innerHTML = '';
        directMPCounter = 0;
      } else {
        document.getElementById('indirectMPRows').innerHTML = '';
        indirectMPCounter = 0;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      dataRows.forEach((row, index) => {
        try {
          if (type === 'direct') {
            // Excel Column Mapping for Direct Manpower:
            // Column 0 (A): No. → Order
            // Column 1 (B): Name → Trade Name (Trader Name)
            // Column 2 (C): Title → Trade Position (Trade)
            // Column 3 (D): Gross Salary → Used to calculate hourly rate (Gross Salary / 30)
            // Column 4 (E): Job Description → Job
            // Column 5 (F): Working Days → Normal Hours
            // Columns 6-10: OT Hours (No OT, 1.5x, 1.75x, 2.0x, 2.5x)
            
            if (row.length < 4) {
              errorCount++;
              console.warn(`Row ${index + 2}: Not enough columns (expected at least 4, got ${row.length})`);
              return;
            }
            
            addRow('directMP');
            const rowId = `directMP_${directMPCounter}`;
            
            const order = row[0] || '';
            const traderName = row[1] || '';
            const trade = row[2] || '';
            const grossSalary = parseFloat(row[3]) || 0;
            const job = row[4] || '';
            const normalHours = parseFloat(row[5]) || 8;
            
            // Calculate hourly rate: Gross Salary / 30
            const hourlyRate = grossSalary > 0 ? (grossSalary / 30) : 0;
            
            // Map columns - IMPORTANT: Set grossSalary field FIRST so it shows in the form
            document.getElementById(rowId + '_order').value = order;
            document.getElementById(rowId + '_traderName').value = traderName;
            document.getElementById(rowId + '_trade').value = trade;
            document.getElementById(rowId + '_grossSalary').value = grossSalary.toFixed(2);
            document.getElementById(rowId + '_rate').value = hourlyRate.toFixed(2);
            document.getElementById(rowId + '_job').value = job;
            document.getElementById(rowId + '_qty').value = 1; // Always 1 by default
            document.getElementById(rowId + '_normalHours').value = normalHours;
            
            // OT Hours columns
            document.getElementById(rowId + '_otHours_0').value = parseFloat(row[6]) || 0;
            document.getElementById(rowId + '_otHours_1_5').value = parseFloat(row[7]) || 0;
            document.getElementById(rowId + '_otHours_1_75').value = parseFloat(row[8]) || 0;
            document.getElementById(rowId + '_otHours_2').value = parseFloat(row[9]) || 0;
            document.getElementById(rowId + '_otHours_2_5').value = parseFloat(row[10]) || 0;
            
            calcManpowerTotals('directMP');
            successCount++;
            
          } else if (type === 'indirect') {
            // Excel Column Mapping for Indirect Manpower:
            // Column 0 (A): Name → Trade Name (Trader Name)
            // Column 1 (B): Title → Trade Position (Trade/Role)
            // Column 2 (C): Gross Salary → Used to calculate hourly rate (Gross Salary / 30)
            // Column 3 (D): Job Description → Job
            // Column 4 (E): Working Days → Normal Hours
            // Columns 5-9: OT Hours (No OT, 1.5x, 1.75x, 2.0x, 2.5x)
            
            if (row.length < 3) {
              errorCount++;
              console.warn(`Row ${index + 2}: Not enough columns (expected at least 3, got ${row.length})`);
              return;
            }
            
            addRow('indirectMP');
            const rowId = `indirectMP_${indirectMPCounter}`;
            
            // Excel Column Mapping for Indirect Manpower (same as Direct):
            // Column 0 (A): No. → Order
            // Column 1 (B): Name → Trade Name (Trader Name)
            // Column 2 (C): Title → Trade Position (Trade)
            // Column 3 (D): Gross Salary → Used to calculate hourly rate (Gross Salary / 30)
            // Column 4 (E): Job Description → Job
            // Column 5 (F): Working Days → Normal Hours
            const order = row[0] || '';
            const traderName = row[1] || '';
            const trade = row[2] || '';
            const grossSalary = parseFloat(row[3]) || 0;
            const job = row[4] || '';
            const normalHours = parseFloat(row[5]) || 8;
            
            // Calculate hourly rate: Gross Salary / 30
            const hourlyRate = grossSalary > 0 ? (grossSalary / 30) : 0;
            
            // Map columns - IMPORTANT: Set grossSalary field FIRST so it shows in the form
            document.getElementById(rowId + '_order').value = order;
            document.getElementById(rowId + '_traderName').value = traderName;
            document.getElementById(rowId + '_trade').value = trade;
            document.getElementById(rowId + '_grossSalary').value = grossSalary.toFixed(2);
            document.getElementById(rowId + '_rate').value = hourlyRate.toFixed(2);
            document.getElementById(rowId + '_job').value = job;
            document.getElementById(rowId + '_qty').value = 1; // Always 1 by default
            document.getElementById(rowId + '_normalHours').value = normalHours;
            
            // OT Hours columns (same as Direct: columns 6-10)
            document.getElementById(rowId + '_otHours_0').value = parseFloat(row[6]) || 0;
            document.getElementById(rowId + '_otHours_1_5').value = parseFloat(row[7]) || 0;
            document.getElementById(rowId + '_otHours_1_75').value = parseFloat(row[8]) || 0;
            document.getElementById(rowId + '_otHours_2').value = parseFloat(row[9]) || 0;
            document.getElementById(rowId + '_otHours_2_5').value = parseFloat(row[10]) || 0;
            
            calcManpowerTotals('indirectMP');
            successCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Error processing row ${index + 2}:`, error);
        }
      });
      
      // Show results
      if (successCount > 0) {
        showToast(`✓ Imported ${successCount} row(s) from ${file.name}`, 'success');
      }
      
      if (errorCount > 0) {
        showToast(`⚠ Warning: ${errorCount} row(s) had errors`, 'error');
      }
      
      // Clear file input
      inputElement.value = '';
      
    } catch (error) {
      console.error('Error reading Excel file:', error);
      showToast('Error reading Excel file. Please check the file format.', 'error');
      inputElement.value = '';
    }
  };
  
  reader.onerror = function() {
    showToast('Error reading file', 'error');
    inputElement.value = '';
  };
  
  reader.readAsArrayBuffer(file);
}

// ========== RENDER MANPOWER BREAKDOWN IN DASHBOARD ==========
function renderManpowerBreakdown() {
  const container = document.getElementById('manpowerBreakdown');
  if (!container) return;
  
  // Get all accessible reports
  const accessibleReports = reports.filter(r => canAccessProject(r.projectName));
  
  if (accessibleReports.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Collect all Direct Manpower entries from all reports
  let allDirectMP = [];
  accessibleReports.forEach(report => {
    if (report.directMP && report.directMP.length > 0) {
      report.directMP.forEach(mp => {
        allDirectMP.push({
          ...mp,
          reportDate: report.reportDate,
          reportNo: report.reportNo,
          projectName: report.projectName
        });
      });
    }
  });
  
  // Collect all Indirect Manpower entries from all reports
  let allIndirectMP = [];
  accessibleReports.forEach(report => {
    if (report.indirectMP && report.indirectMP.length > 0) {
      report.indirectMP.forEach(mp => {
        allIndirectMP.push({
          ...mp,
          reportDate: report.reportDate,
          reportNo: report.reportNo,
          projectName: report.projectName
        });
      });
    }
  });
  
  // Collect all Safety data from all reports
  let allSafety = [];
  accessibleReports.forEach(report => {
    if (report.safety) {
      allSafety.push({
        ...report.safety,
        reportDate: report.reportDate,
        reportNo: report.reportNo,
        projectName: report.projectName
      });
    }
  });
  
  let html = `
    <div class="card">
      <h3 class="section-title">📊 Detailed Breakdown (All Reports)</h3>
      
      <!-- Tab Navigation -->
      <div class="breakdown-tabs">
        <button class="breakdown-tab active" onclick="showBreakdownTab('direct')">
          👷 Direct Manpower (${allDirectMP.length})
        </button>
        <button class="breakdown-tab" onclick="showBreakdownTab('indirect')">
          🧑‍💼 Indirect Manpower (${allIndirectMP.length})
        </button>
        <button class="breakdown-tab" onclick="showBreakdownTab('safety')">
          ⛑ Safety Issues (${allSafety.length})
        </button>
      </div>
      
      <!-- Tab Content -->
      <div id="breakdownContent">
  `;
  
  // Direct Manpower Content
  html += `<div id="breakdown-direct" class="breakdown-content active">`;
  if (allDirectMP.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Title</th>
            <th>Gross Salary</th>
            <th>Working Days</th>
            <th>Normal OT{1.5}</th>
            <th>Night OT{1.75}</th>
            <th>Sunday{2.00}</th>
            <th>Holiday{2.5}</th>
            <th>Normal Pay</th>
            <th>OT Pay</th>
            <th>Total Pay</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allDirectMP.forEach(mp => {
      const totalOTPay = (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
      html += `
        <tr>
          <td>${mp.order || '—'}</td>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.trade}</td>
          <td>ETB ${mp.rate.toFixed(2)}</td>
          <td>${mp.qty}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${mp.normalPay.toFixed(2)}</td>
          <td>ETB ${totalOTPay.toFixed(2)}</td>
          <td><strong>ETB ${mp.totalPay.toFixed(2)}</strong></td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No direct manpower data available</p>`;
  }
  html += `</div>`;
  
  // Indirect Manpower Content
  html += `<div id="breakdown-indirect" class="breakdown-content">`;
  if (allIndirectMP.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Gross Salary</th>
            <th>Working Days</th>
            <th>Normal OT{1.5}</th>
            <th>Night OT{1.75}</th>
            <th>Sunday{2.00}</th>
            <th>Holiday{2.5}</th>
            <th>Normal Pay</th>
            <th>OT Pay</th>
            <th>Total Pay</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allIndirectMP.forEach(mp => {
      const totalOTPay = (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
      html += `
        <tr>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.role}</td>
          <td>ETB ${mp.rate.toFixed(2)}</td>
          <td>${mp.qty}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${mp.normalPay.toFixed(2)}</td>
          <td>ETB ${totalOTPay.toFixed(2)}</td>
          <td><strong>ETB ${mp.totalPay.toFixed(2)}</strong></td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No indirect manpower data available</p>`;
  }
  html += `</div>`;
  
  // Safety Content
  html += `<div id="breakdown-safety" class="breakdown-content">`;
  if (allSafety.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Report No</th>
            <th>Project</th>
            <th>LTI</th>
            <th>Near Miss</th>
            <th>Safety Obs</th>
            <th>First Aid</th>
            <th>Toolbox Talks</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allSafety.forEach(safety => {
      const statusBadge = safety.status === 'Green' ? 'badge-green' : 
                         safety.status === 'Yellow' ? 'badge-yellow' : 'badge-red';
      html += `
        <tr>
          <td>${safety.reportDate}</td>
          <td>${safety.reportNo || '—'}</td>
          <td>${safety.projectName}</td>
          <td>${safety.lti}</td>
          <td>${safety.nearMiss}</td>
          <td>${safety.safetyObs}</td>
          <td>${safety.firstAid}</td>
          <td>${safety.toolbox}</td>
          <td><span class="badge ${statusBadge}">${safety.status}</span></td>
          <td>${safety.remarks || '—'}</td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No safety data available</p>`;
  }
  html += `</div>`;
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// Switch between breakdown tabs
function showBreakdownTab(tabName) {
  // Update tab buttons
  const tabs = document.querySelectorAll('.breakdown-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update content
  const contents = document.querySelectorAll('.breakdown-content');
  contents.forEach(content => content.classList.remove('active'));
  document.getElementById('breakdown-' + tabName).classList.add('active');
}


// ========== DIRECT MANPOWER DASHBOARD ==========
function renderDirectManpowerDashboard() {
  const container = document.getElementById('directManpowerContent');
  if (!container) return;
  
  // Get all accessible reports
  let accessibleReports = reports.filter(r => canAccessProject(r.projectName));
  
  // Filter by selected project if one is selected
  if (selectedDashboardProject) {
    accessibleReports = accessibleReports.filter(r => r.projectName === selectedDashboardProject);
  }
  
  // Collect all Direct Manpower entries
  let allDirectMP = [];
  accessibleReports.forEach(report => {
    if (report.directMP && report.directMP.length > 0) {
      report.directMP.forEach(mp => {
        allDirectMP.push({
          ...mp,
          reportDate: report.reportDate,
          reportNo: report.reportNo,
          projectName: report.projectName
        });
      });
    }
  });
  
  const projectTitle = selectedDashboardProject ? ` - ${selectedDashboardProject}` : '';
  
  let html = `
    <div class="card">
      <h3 class="section-title">All Direct Manpower Entries${projectTitle} (${allDirectMP.length} Total)</h3>
  `;
  
  if (allDirectMP.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Report No</th>
            <th>Project</th>
            <th>No.</th>
            <th>Name</th>
            <th>Title</th>
            <th>Gross Salary</th>
            <th>Working Days</th>
            <th>Normal OT{1.5}</th>
            <th>Night OT{1.75}</th>
            <th>Sunday{2.00}</th>
            <th>Holiday{2.5}</th>
            <th>Normal Pay</th>
            <th>OT Pay</th>
            <th>Total Pay</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allDirectMP.forEach(mp => {
      const totalOTPay = (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
      html += `
        <tr>
          <td>${mp.reportDate}</td>
          <td>${mp.reportNo || '—'}</td>
          <td>${mp.projectName}</td>
          <td>${mp.order || '—'}</td>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.trade || '—'}</td>
          <td>ETB ${(mp.rate || 0).toFixed(2)}</td>
          <td>${mp.qty || 0}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${(mp.normalPay || 0).toFixed(2)}</td>
          <td>ETB ${totalOTPay.toFixed(2)}</td>
          <td><strong>ETB ${(mp.totalPay || 0).toFixed(2)}</strong></td>
        </tr>
      `;
    });
    
    // Calculate totals
    const totalWorkers = allDirectMP.reduce((sum, mp) => sum + (mp.qty || 0), 0);
    const totalNormalPay = allDirectMP.reduce((sum, mp) => sum + (mp.normalPay || 0), 0);
    const totalOTPay = allDirectMP.reduce((sum, mp) => {
      return sum + (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
    }, 0);
    const grandTotal = allDirectMP.reduce((sum, mp) => sum + (mp.totalPay || 0), 0);
    
    html += `
          <tr style="background:#f7fafc; font-weight:bold;">
            <td colspan="7">TOTALS</td>
            <td>${totalWorkers}</td>
            <td colspan="4">—</td>
            <td>ETB ${totalNormalPay.toFixed(2)}</td>
            <td>ETB ${totalOTPay.toFixed(2)}</td>
            <td><strong>ETB ${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No direct manpower data available</p>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
}

// ========== INDIRECT MANPOWER DASHBOARD ==========
function renderIndirectManpowerDashboard() {
  const container = document.getElementById('indirectManpowerContent');
  if (!container) return;
  
  // Get all accessible reports
  let accessibleReports = reports.filter(r => canAccessProject(r.projectName));
  
  // Filter by selected project if one is selected
  if (selectedDashboardProject) {
    accessibleReports = accessibleReports.filter(r => r.projectName === selectedDashboardProject);
  }
  
  // Collect all Indirect Manpower entries
  let allIndirectMP = [];
  accessibleReports.forEach(report => {
    if (report.indirectMP && report.indirectMP.length > 0) {
      report.indirectMP.forEach(mp => {
        allIndirectMP.push({
          ...mp,
          reportDate: report.reportDate,
          reportNo: report.reportNo,
          projectName: report.projectName
        });
      });
    }
  });
  
  const projectTitle = selectedDashboardProject ? ` - ${selectedDashboardProject}` : '';
  
  let html = `
    <div class="card">
      <h3 class="section-title">All Indirect Manpower Entries${projectTitle} (${allIndirectMP.length} Total)</h3>
  `;
  
  if (allIndirectMP.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Report No</th>
            <th>Project</th>
            <th>Name</th>
            <th>Title</th>
            <th>Gross Salary</th>
            <th>Working Days</th>
            <th>Normal OT{1.5}</th>
            <th>Night OT{1.75}</th>
            <th>Sunday{2.00}</th>
            <th>Holiday{2.5}</th>
            <th>Normal Pay</th>
            <th>OT Pay</th>
            <th>Total Pay</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allIndirectMP.forEach(mp => {
      const totalOTPay = (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
      html += `
        <tr>
          <td>${mp.reportDate}</td>
          <td>${mp.reportNo || '—'}</td>
          <td>${mp.projectName}</td>
          <td>${mp.traderName || '—'}</td>
          <td>${mp.role || '—'}</td>
          <td>ETB ${(mp.rate || 0).toFixed(2)}</td>
          <td>${mp.qty || 0}</td>
          <td>${mp.otHours_1_5 || 0}</td>
          <td>${mp.otHours_1_75 || 0}</td>
          <td>${mp.otHours_2 || 0}</td>
          <td>${mp.otHours_2_5 || 0}</td>
          <td>ETB ${(mp.normalPay || 0).toFixed(2)}</td>
          <td>ETB ${totalOTPay.toFixed(2)}</td>
          <td><strong>ETB ${(mp.totalPay || 0).toFixed(2)}</strong></td>
        </tr>
      `;
    });
    
    // Calculate totals
    const totalWorkers = allIndirectMP.reduce((sum, mp) => sum + (mp.qty || 0), 0);
    const totalNormalPay = allIndirectMP.reduce((sum, mp) => sum + (mp.normalPay || 0), 0);
    const totalOTPay = allIndirectMP.reduce((sum, mp) => {
      return sum + (mp.otPay_0 || 0) + (mp.otPay_1_5 || 0) + (mp.otPay_1_75 || 0) + (mp.otPay_2 || 0) + (mp.otPay_2_5 || 0);
    }, 0);
    const grandTotal = allIndirectMP.reduce((sum, mp) => sum + (mp.totalPay || 0), 0);
    
    html += `
          <tr style="background:#f7fafc; font-weight:bold;">
            <td colspan="6">TOTALS</td>
            <td>${totalWorkers}</td>
            <td colspan="4">—</td>
            <td>ETB ${totalNormalPay.toFixed(2)}</td>
            <td>ETB ${totalOTPay.toFixed(2)}</td>
            <td><strong>ETB ${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No indirect manpower data available</p>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
}

// ========== SAFETY DASHBOARD ==========
function renderSafetyDashboard() {
  const container = document.getElementById('safetyContent');
  if (!container) return;
  
  // Get all accessible reports
  let accessibleReports = reports.filter(r => canAccessProject(r.projectName));
  
  // Filter by selected project if one is selected
  if (selectedDashboardProject) {
    accessibleReports = accessibleReports.filter(r => r.projectName === selectedDashboardProject);
  }
  
  // Collect all Safety data
  let allSafety = [];
  accessibleReports.forEach(report => {
    if (report.safety) {
      allSafety.push({
        ...report.safety,
        reportDate: report.reportDate,
        reportNo: report.reportNo,
        projectName: report.projectName
      });
    }
  });
  
  const projectTitle = selectedDashboardProject ? ` - ${selectedDashboardProject}` : '';
  
  let html = `
    <div class="card">
      <h3 class="section-title">All Safety Reports${projectTitle} (${allSafety.length} Total)</h3>
  `;
  
  if (allSafety.length > 0) {
    html += `
      <table class="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Report No</th>
            <th>Project</th>
            <th>LTI</th>
            <th>Near Miss</th>
            <th>Safety Obs</th>
            <th>First Aid</th>
            <th>Toolbox Talks</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    allSafety.forEach(safety => {
      const statusBadge = safety.status === 'Green' ? 'badge-green' : 
                         safety.status === 'Yellow' ? 'badge-yellow' : 'badge-red';
      html += `
        <tr>
          <td>${safety.reportDate}</td>
          <td>${safety.reportNo || '—'}</td>
          <td>${safety.projectName}</td>
          <td>${safety.lti || 0}</td>
          <td>${safety.nearMiss || 0}</td>
          <td>${safety.safetyObs || 0}</td>
          <td>${safety.firstAid || 0}</td>
          <td>${safety.toolbox || 0}</td>
          <td><span class="badge ${statusBadge}">${safety.status || 'Green'}</span></td>
          <td>${safety.remarks || '—'}</td>
        </tr>
      `;
    });
    
    // Calculate totals
    const totalLTI = allSafety.reduce((sum, s) => sum + (s.lti || 0), 0);
    const totalNearMiss = allSafety.reduce((sum, s) => sum + (s.nearMiss || 0), 0);
    const totalSafetyObs = allSafety.reduce((sum, s) => sum + (s.safetyObs || 0), 0);
    const totalFirstAid = allSafety.reduce((sum, s) => sum + (s.firstAid || 0), 0);
    const totalToolbox = allSafety.reduce((sum, s) => sum + (s.toolbox || 0), 0);
    
    html += `
          <tr style="background:#f7fafc; font-weight:bold;">
            <td colspan="3">TOTALS</td>
            <td>${totalLTI}</td>
            <td>${totalNearMiss}</td>
            <td>${totalSafetyObs}</td>
            <td>${totalFirstAid}</td>
            <td>${totalToolbox}</td>
            <td colspan="2">—</td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    html += `<p style="text-align:center; padding:40px; color:#718096;">No safety data available</p>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
}
