# Changelog

## Version 2.0 - Manpower Focus (Current)

### 🎯 Major Changes
Simplified the system to focus exclusively on manpower tracking and safety.

### ✅ What's Kept
- ✅ User authentication (Admin creates users)
- ✅ 7 roles with sequential approval workflow
- ✅ Project-based access control
- ✅ **Direct Manpower** section (full featured)
  - Name of trader
  - Qty, Job description
  - Normal Hours, OT Hours
  - OT Multiplier (1.5x, 2.0x, 2.5x)
  - Hourly Rate
  - Auto-calculated: Normal Pay, OT Pay, Total Pay
  - File attachments
- ✅ **Indirect Manpower** section (full featured)
  - Name of trader
  - Qty (availability)
  - Normal Hours, OT Hours
  - OT Multiplier (1.5x, 2.0x, 2.5x)
  - Hourly Rate
  - Auto-calculated: Normal Pay, OT Pay, Total Pay
  - File attachments
- ✅ **Safety Issues** section
  - LTI, Near Misses, Safety Observations
  - First Aid Cases, Toolbox Talks
  - Safety Status (Green/Yellow/Red)
  - Safety Remarks
- ✅ File attachments (Base64, 5MB limit)
- ✅ Approval workflow with notifications
- ✅ General Notes/Comments section
- ✅ Dashboard with filtering
- ✅ User management (Admin panel)

### ❌ What's Removed
- ❌ Daily Execution section (work items, qty, unit rate, amount)
- ❌ Equipment Status section (name, qty, operational/idle/down)
- ❌ Contract Information section (contract dates, amount, elapsed/remaining days)
- ❌ Payment Status section (payment numbers, amounts, retention, withhold, penalties)

### 📋 New Report Structure
1. **Report Header**
   - Project Name
   - Report Date
   - Report Number

2. **Section 1: Direct Manpower**
   - Trades and contractors
   - Full pay calculations

3. **Section 2: Indirect Manpower**
   - Staff and management
   - Full pay calculations

4. **Section 3: Safety**
   - Safety metrics and status

5. **General Notes**
   - Additional comments

### 🔄 Benefits of Simplification
- ⚡ Faster report creation
- 📱 Cleaner interface
- 🎯 Focused on core need (manpower tracking)
- 💰 Comprehensive pay calculations
- 📊 Clear totals and summaries
- 🔢 Automatic calculations reduce errors

---

## Version 1.0 - Full Featured (Previous)

### Features Included
- Contract & Project tracking
- Daily Execution tracking
- Equipment Status tracking
- Direct Manpower tracking
- Indirect Manpower tracking
- Safety tracking
- Payment Status tracking
- Multi-level approval workflow
- User management
- File attachments

### Why Changed?
User requested to focus only on manpower reporting with safety tracking, removing unnecessary complexity for their specific use case.

---

**Migration Note:** Version 1.0 and 2.0 use different data structures. Reports created in v1.0 will not display correctly in v2.0. Backup data before upgrading if needed.


---

## Version 2.1 - Direct Manpower Enhancements

### 🆕 New Features

#### Order Field in Direct Manpower
- ✅ Added "Order" number field at the beginning of each Direct Manpower entry
- ✅ Helps organize trades in sequence (1, 2, 3, etc.)
- ✅ Optional field - can be left empty
- ✅ Displays in report view table
- ✅ Saved with each entry

#### 1.75x OT Multiplier
- ✅ Added 1.75x option to OT Multiplier dropdown
- ✅ Available in both Direct and Indirect Manpower
- ✅ Provides more flexibility for overtime calculations
- ✅ Options now: 1.5x, 1.75x, 2.0x, 2.5x

### 📊 Updated Components
- Direct Manpower entry form (Order field added)
- Indirect Manpower OT options (1.75x added)
- Report view table (Order column added)
- Data collection (Order field saved)
- Edit functionality (Order field populated)

### 💡 Use Cases
**Order Field:**
- Organize by priority (critical trades first)
- Organize by contractor (main contractor, subcontractors)
- Organize by zone (foundation, structure, finishing)
- Keep consistent across daily reports

**1.75x Multiplier:**
- Extended weekend work
- Special project requirements
- Skilled trades premium
- Between standard (1.5x) and weekend (2.0x) rates


---

## Version 2.2 - Reporter Field & Access Control

### 🆕 New Features

#### Reporter Field
- ✅ Added "Reporter / Prepared By" dropdown field in report header
- ✅ Populated with all registered users (excluding Admin)
- ✅ Shows format: "Full Name (Role)"
- ✅ Required field - cannot save report without selecting reporter
- ✅ Displays reporter name in report view
- ✅ Included in downloaded HTML reports
- ✅ Auto-populates when form loads

#### Enhanced Access Control
- ✅ **Project Name** field now shown only for CDGM and Admin
- ✅ **Created By (User)** field now shown only for CDGM and Admin
- ✅ Other roles (Office Engineer, Project Engineer, etc.) see:
  - Report Date
  - Report Number
  - Reporter / Prepared By
  - All manpower and safety data
- ✅ Dashboard table hides "Project" column for non-CDGM/Admin users
- ✅ Maintains project-based access control for data security

### 🔒 Security Improvements
- Project information visibility restricted to management level (CDGM/Admin)
- Regular users focus on report content without project-level access concerns
- User who created report only visible to CDGM/Admin for tracking purposes

### 📊 Updated Components
- Report form (Reporter dropdown added)
- Report view (Conditional display of Project and User fields)
- Dashboard table (Conditional Project column)
- Data validation (Reporter required)
- Download HTML (Reporter included, Project visible to all in download)

### 💡 Benefits
**Reporter Field:**
- Clear accountability for each report
- Easy tracking of who prepared reports
- Meets documentation compliance requirements
- Simple dropdown selection (no manual typing)

**Access Control:**
- Cleaner interface for non-management users
- Focus on report content rather than project details
- Enhanced security for project information
- CDGM and Admin retain full visibility

### 🎯 User Experience
**For Office Engineer, Project Engineer, Follow-up Engineer, Project Coordinator, Project Manager:**
- See: Date, Report No, Reporter, Manpower, Safety
- Don't see: Project Name in report view, Created By field
- Dashboard shows: Date, Report No, Direct MP, Indirect MP, Safety, Status, Actions

**For CDGM and Admin:**
- See all fields including Project Name and Created By
- Full dashboard with Project column
- Complete visibility for management oversight



---

## Version 2.3 - No OT Option

### 🆕 New Features

#### No OT Option in Multiplier Dropdown
- ✅ Added "No OT" option (value: 0) to OT Multiplier dropdown
- ✅ Available in both Direct and Indirect Manpower sections
- ✅ Set as first option in the dropdown
- ✅ Default selection remains 1.5x for new rows
- ✅ When "No OT" is selected, OT Pay = 0 (regardless of OT hours entered)

### 📊 OT Multiplier Options (Updated)
- **No OT** (0x) - For workers with no overtime compensation
- 1.5x (Default) - Standard overtime rate
- 1.75x - Extended work rate
- 2.0x - Weekend/Holiday rate
- 2.5x - Special premium rate

### 💡 Use Cases
**No OT Option:**
- Fixed salary employees (no OT pay)
- Contract workers with flat daily rate
- Situations where OT hours are tracked but not paid
- Volunteers or unpaid positions
- Compliance tracking (hours worked) without payment

**Behavior:**
- Even if OT Hours field has a value, selecting "No OT" will calculate OT Pay as 0 ETB
- Total Pay = Normal Pay + 0 (OT Pay)
- OT hours still appear in reports for tracking purposes
- Useful for labor law compliance (tracking hours without payment)

### 📋 Updated Sections
- Direct Manpower - OT Multiplier dropdown
- Indirect Manpower - OT Multiplier dropdown
- Calculation logic (already handles 0 multiplier correctly)
- Report display (shows "0x" for No OT selection)



---

## Version 3.0 - Separate OT Hour Columns (Major Update)

### 🎯 Major Restructure

Complete redesign of the OT (Overtime) tracking system to separate OT hours by multiplier rate for better tracking and reporting.

### 🆕 New Structure

#### Input Form Changes:
**Before:** Single OT Hours field + OT Multiplier dropdown
**After:** Separate OT Hour fields for each rate:
- OT Hours (No OT) - 0x multiplier
- OT Hours (1.5x) - Normal overtime
- OT Hours (1.75x) - Night overtime
- OT Hours (2.0x) - Sunday/Weekend
- OT Hours (2.5x) - Holiday premium

#### Display Format Changes:
**Report View Table Columns:**
- No. (Order number)
- Name (Trader/Worker Name)
- Title (Trade/Position/Role)
- Gross Salary (Hourly Rate in ETB)
- Working Days (Quantity)
- Normal OT{1.5} (Hours at 1.5x rate)
- Night OT{1.75} (Hours at 1.75x rate)
- Sunday{2.00} (Hours at 2.0x rate)
- Holiday{2.5} (Hours at 2.5x rate)
- Normal Pay (ETB)
- OT Pay (Total OT compensation)
- Total Pay (ETB)
- Attachment

### 📊 Calculation Changes

**Before:**
- Total OT Pay = Qty × OT Hours × Rate × Single Multiplier

**After:**
- OT Pay (No OT) = Qty × OT Hours (No OT) × Rate × 0
- OT Pay (1.5x) = Qty × OT Hours (1.5x) × Rate × 1.5
- OT Pay (1.75x) = Qty × OT Hours (1.75x) × Rate × 1.75
- OT Pay (2.0x) = Qty × OT Hours (2.0x) × Rate × 2.0
- OT Pay (2.5x) = Qty × OT Hours (2.5x) × Rate × 2.5
- **Total OT Pay = Sum of all OT Pay amounts**
- **Total Pay = Normal Pay + Total OT Pay**

### 📋 Affected Sections

✅ **Direct Manpower**
- Separate OT hour inputs for each multiplier
- Separate OT pay calculations displayed
- New table format for viewing/downloading

✅ **Indirect Manpower**
- Same structure as Direct Manpower
- Consistent format across both sections

### 💾 Data Structure

**New fields saved with each manpower entry:**
```javascript
{
  // Basic info
  order, trade/role, traderName, qty, job, normalHours, rate,
  
  // OT Hours (separate for each rate)
  otHours_0,      // No OT
  otHours_1_5,    // 1.5x
  otHours_1_75,   // 1.75x
  otHours_2,      // 2.0x
  otHours_2_5,    // 2.5x
  
  // Pay calculations
  normalPay,
  otPay_0,        // No OT pay
  otPay_1_5,      // 1.5x pay
  otPay_1_75,     // 1.75x pay
  otPay_2,        // 2.0x pay
  otPay_2_5,      // 2.5x pay
  totalPay
}
```

### 🎯 Benefits

✅ **Better Tracking**: See exactly how many hours worked at each rate
✅ **Accurate Costing**: Separate tracking prevents confusion
✅ **Compliance Ready**: Clear breakdown for labor law requirements
✅ **Budget Analysis**: Understand premium hour distribution
✅ **Payroll Clarity**: Each rate category clearly defined
✅ **Report Accuracy**: No ambiguity in overtime calculations

### 📊 Totals Display

Updated totals section shows:
- Total Workers
- Total Normal Hours
- Total OT Hours (All) - sum of all OT categories
- OT Hours breakdown by each multiplier
- Normal Pay
- OT Pay (All) - sum of all OT pay
- Total Pay

### 💡 Use Cases

**No OT (0x):**
- Salaried staff with no OT compensation
- Contract workers on flat rates
- Compliance tracking without payment

**Normal OT (1.5x):**
- Standard weekday overtime
- Extended regular hours

**Night OT (1.75x):**
- Night shift premiums
- Late evening work

**Sunday (2.0x):**
- Weekend work
- Rest day assignments

**Holiday (2.5x):**
- Public holidays
- Special premium days

### ⚠️ Breaking Changes

**Old reports (v2.x) structure:**
- Single `otHours` field
- Single `otMultiplier` dropdown
- Single `otPay` value

**New reports (v3.0) structure:**
- Five separate `otHours_X` fields
- Five separate `otPay_X` calculated values
- No `otMultiplier` dropdown

**Migration Note:** Existing reports will need their data structure updated. Old reports may not display correctly until re-saved with new structure.

### 🔄 Updated Functions

- `addRow()` - New form fields with separate OT inputs
- `calcManpowerTotals()` - Calculates each OT rate separately
- `collectFormData()` - Saves all OT hour fields
- `editReport()` - Loads all OT hour fields
- `viewReport()` - New table format display
- `generateReportHTML()` - Download with new format



---

## Version 3.1 - UI Improvements

### 🎯 Action Buttons Moved to Top

#### New Report Page:
**Before:** Save and Clear buttons at bottom of long form
**After:** Save, Clear, and Back buttons at the TOP of the page

**Benefits:**
- ✅ No scrolling needed to save
- ✅ Always visible while filling form
- ✅ Faster workflow
- ✅ Better user experience

#### View Report Page:
**Before:** Approve button only in dashboard table
**After:** All action buttons at TOP of report view

**Buttons shown (context-aware):**
- ✏ Edit Report (if user can edit)
- ✓ Approve Report (if it's your turn, with pulse animation)
- ⬇ Download (if fully approved)
- 🖨 Print (always visible)
- ← Back (always visible)

**Benefits:**
- ✅ Immediate access to actions
- ✅ No scrolling through long reports
- ✅ Context-aware buttons (only show what's relevant)
- ✅ Professional layout

### 📊 Button Layout:

**New Report (Top Header):**
```
📝 New Daily Report    [🗑 Clear] [💾 Save Report] [← Back]
```

**View Report (Top Header):**
```
📄 Report Details    [✏ Edit Report] [✓ Approve Report] [⬇ Download] [🖨 Print] [← Back]
```

### 💡 Smart Button Display:

The system intelligently shows only relevant buttons:
- **Edit** - Only if user has permission to edit
- **Approve** - Only if it's your turn in workflow
- **Download** - Only if report is fully approved
- **Print** - Always available
- **Back** - Always available



---

## Version 3.2 - Dashboard Breakdown with Tabs

### 🎯 Major UI Improvement

**Changed:** Dashboard breakdown from stacked sections to tabbed interface

### 📋 Three Clickable Tabs:

1. **👷 Direct Manpower Tab**
   - Shows all Direct Manpower from all reports
   - Count badge shows total entries
   - Default active tab

2. **🧑‍💼 Indirect Manpower Tab**
   - Shows all Indirect Manpower from all reports
   - Count badge shows total entries
   - Click to view

3. **⛑ Safety Issues Tab**
   - Shows all Safety data from all reports
   - Count badge shows total reports
   - Safety status with color badges (Green/Yellow/Red)
   - Includes: LTI, Near Miss, Safety Obs, First Aid, Toolbox Talks

### ✨ Features:

- ✅ Tab navigation with active indicator
- ✅ Count badges on each tab
- ✅ Smooth fade-in animation
- ✅ One section visible at a time
- ✅ Clean, organized interface
- ✅ No long scrolling
- ✅ Professional design

### 💡 Benefits:

- Cleaner dashboard layout
- Faster navigation
- Better data organization
- Easy section switching
- Professional appearance

### 📊 Important Note:

The breakdown displays ACTUAL data from saved reports. If names/titles appear empty (—), it means:
- Reports were saved without filling those fields
- Test/demo data is empty
- Need to import proper data from Excel or fill manually

**Solution:** Create new reports with proper data or import from Excel file.



## [Unreleased] - 2024-XX-XX

### Changed
- **Dashboard Navigation**: Moved Direct Manpower, Indirect Manpower, and Safety dashboard buttons from header to inside Dashboard page
- Added project selector dropdown in Dashboard page - select a project first, then three dashboard buttons appear
- Each dedicated dashboard now filters data by the selected project
- Dashboard titles show the selected project name
- Improved user flow: Dashboard → Select Project → Choose Dashboard Type (Direct/Indirect/Safety)

### Technical
- Added `populateDashboardProjectSelector()` function to populate project dropdown
- Added `handleProjectDashboardSelection()` to show/hide dashboard buttons
- Added `showProjectDashboard(type)` to navigate to specific dashboards
- Added `selectedDashboardProject` variable to track selected project
- Updated `renderDirectManpowerDashboard()`, `renderIndirectManpowerDashboard()`, and `renderSafetyDashboard()` to filter by selected project
- Added CSS styling for project selection area


## [Unreleased] - Action Dropdown Feature

### Added
- **Action Dropdown Button**: After saving a report, the "Save Report" button changes to "Action" dropdown
- Two action options:
  - **✓ Approve**: Opens approval modal immediately after saving
  - **✕ Cancel**: Deletes the report with confirmation dialog
- Faster workflow for Office Engineers to approve their own reports
- Confirmation dialog when canceling/deleting a report

### Changed
- Save button behavior: Stays on form page after save instead of redirecting to Dashboard
- Action dropdown appears after save with Approve and Cancel options
- Clear button now also resets the Action dropdown back to Save button

### Technical
- Added `showActionDropdown()` function to toggle button visibility
- Added `hideActionDropdown()` function to reset button states
- Added `toggleActionDropdown()` function to open/close menu
- Added `approveFromAction()` to trigger approval from dropdown
- Added `cancelReport()` to delete report with confirmation
- Added CSS styling for dropdown menu with hover effects
- Added click-outside-to-close functionality for dropdown


## [Unreleased] - Project Selection Step Feature

### Added
- **Project Selection Step**: New Report form now requires selecting project first
- **"✓ Confirm & Continue" button**: Validates project selection before showing form
- **Selected Project Display**: Shows selected project with green success box
- **"Change Project" button**: Allows changing project after selection
- Project name field is now readonly (locked) after confirmation
- Progressive form disclosure - only shows fields after project selected

### Changed
- New Report page starts with only project selector visible
- Form fields appear only after project confirmation
- Project dropdown ID changed to `f_projectName_selector`
- Project name stored in readonly field `f_projectName`
- Clear button resets to project selection step
- Edit report pre-selects project and shows form immediately

### User Experience
- Step-by-step guided process (Step 1: Select Project → Step 2: Fill Form)
- Prevents submitting reports without project selection
- Less overwhelming initial view
- Clear visual feedback with animations
- Mobile-friendly progressive disclosure

### Technical
- Added `confirmProjectSelection()` function
- Added `changeProject()` function
- Updated `populateProjectDropdown()` to use new selector ID
- Updated `clearForm()` to reset project selection
- Updated `editReport()` to handle project selection state
- Added CSS animations for smooth transitions
- Added `#projectSelectionStep` and `#mainReportForm` containers


## [Unreleased] - Updated Approval Workflow

### Changed - Approval Workflow Roles (7 Steps)
1. **Project Admin** ← NEW ROLE
2. Office Engineer
3. **Project Follow up** ← RENAMED (was "Follow up Engineer")
4. Project Engineer
5. Project Manager
6. Project Coordinator
7. CDGM

### Removed
- **Password requirement for approvals** - No longer need to enter password when approving
- Password field removed from approval modal
- Password validation removed from approval process

### Changed - Approval Modal
- Now only requires name entry (no password)
- Updated warning message: "Once approved, this report **cannot be edited**"
- Success message includes "cannot be edited" reminder
- Clearer, more explicit warning about report locking

### Added
- Project Admin role in user management
- Project Follow up role (renamed from Follow up Engineer)
- Enhanced warning message in approval modal

### User Experience
- ✅ Faster approval process (no password typing)
- ✅ Clear "cannot edit" warnings before approval
- ✅ Explicit success message after approval
- ✅ Better role names (Project Follow up vs Follow up Engineer)

### Technical
- Updated `APPROVAL_WORKFLOW` array with new 7-role sequence
- Removed password validation in `submitApproval()` function
- Updated `closeApprovalModal()` to not clear password field
- Updated role options in user management form
- Changed success toast to include "cannot edit" note


## [Unreleased] - Corrected Approval Workflow Order

### Fixed - Approval Workflow Sequence
**Correct Order (7 Steps):**
1. Project Admin
2. Office Engineer
3. Project Engineer
4. Project Manager
5. **Project Follow up** ← Moved to position 5 (after Project Manager)
6. Project Coordinator
7. CDGM

**Previous (Incorrect):**
- Project Follow up was at position 3 (after Office Engineer)

**Now (Correct):**
- Project Follow up is at position 5 (after Project Manager)


## [Unreleased] - Visual Project Card Selector

### Changed - Dashboard Project Selection
- **Replaced dropdown with visual card grid**
- Projects now display as clickable gradient cards
- Each card shows: Icon (📁), Project Name, Location (📍)

### Added - Visual Features
- ✅ Beautiful gradient cards (purple/blue)
- ✅ Hover effects (card lifts up, shadow increases)
- ✅ Smooth animations (0.3s transitions)
- ✅ Responsive grid layout (auto-adjusts to screen size)
- ✅ Large touch-friendly click areas
- ✅ One-click project selection

### User Experience
- **Better Visual Clarity**: See all projects at once
- **Faster Selection**: Click card directly (no dropdown scroll)
- **Modern Design**: Gradient cards with icons
- **Mobile Friendly**: Large touch targets, responsive grid
- **Professional Look**: Clean, modern interface

### Technical
- Updated `populateDashboardProjectSelector()` to create card grid
- Added `selectProjectForDashboard()` function for card clicks
- Added `clearProjectSelection()` to show cards again
- Added CSS classes: `.project-grid-selector`, `.project-card`, `.project-card:hover`
- Removed `#dashboardProjectSelector` dropdown
- Added `#projectGridSelector` card container


## [Unreleased] - Daily Reports Filtered by Selected Project

### Changed - Report History Filtering
- **Daily Reports History table now filters by selected project**
- When a project is selected, only that project's reports are shown
- Table header updates to show: "📅 Daily Reports History - [Project Name]"
- When no project is selected, all accessible reports are shown

### User Experience
- ✅ Select project → See only that project's reports
- ✅ Clear visual indicator (project name in header)
- ✅ Empty state shows project-specific message
- ✅ "Change Project" resets to show all reports
- ✅ Better focus and clarity

### Technical
- Updated `renderDashboard()` to filter reports by `selectedDashboardProject`
- Updated table header to display selected project name
- Updated `selectProjectForDashboard()` to call `renderDashboard()`
- Updated `clearProjectSelection()` to refresh reports table
- Empty state messages now project-aware


## [Unreleased] - Updated Excel Import Mapping

### Changed - Excel Column Mapping
**Direct Manpower:**
- Column A: **No.** → Order
- Column B: **Name** → Trade Name
- Column C: **Title** → Trade Position
- Column D: **Gross Salary** → Auto-calculates Hourly Rate (÷ 30)
- Column E: Job Description → Job
- Column F: Working Days → Normal Hours
- Columns G-K: OT Hours (0x, 1.5x, 1.75x, 2.0x, 2.5x)

**Indirect Manpower:**
- Column A: **Name** → Trade Name
- Column B: **Title** → Trade Position
- Column C: **Gross Salary** → Auto-calculates Hourly Rate (÷ 30)
- Column D: Job Description → Job
- Column E: Working Days → Normal Hours
- Columns F-J: OT Hours (0x, 1.5x, 1.75x, 2.0x, 2.5x)

### Added - Automatic Calculations
- ✅ **Hourly Rate** now auto-calculated from Gross Salary (÷ 30)
- ✅ **Quantity** automatically set to 1 by default
- ✅ Formula: Hourly Rate = Gross Salary ÷ 30

### Fixed - Field Naming
- ✅ "Order" field now maps from "No." column
- ✅ "Trade Name" field now maps from "Name" column
- ✅ "Trade Position" field now maps from "Title" column

### User Experience
- No need to calculate hourly rate manually
- Enter monthly gross salary, system calculates daily rate
- Quantity always 1 (represents one person)
- Consistent with Ethiopian payroll standards (30-day month)

### Technical
- Updated `importExcelFile()` function
- Changed column index mappings
- Added automatic hourly rate calculation: `grossSalary / 30`
- Set default quantity to 1 for all imports
- Updated error handling and validation


## [Unreleased] - Updated Manpower Form Fields

### Changed - Field Labels and Structure
**Direct & Indirect Manpower Forms:**
- ✅ "Trade/Position" → "Title"
- ✅ "Trader Name" → "Name"
- ✅ Added "Gross Salary" field (auto-calculates hourly rate)
- ✅ "Normal Hours" → "Working Days"
- ✅ Added "No." field for both sections
- ✅ Simplified OT display: Shows individual OT hours, single "OT Pay" total
- ✅ Removed individual OT Pay fields from visible display (kept in backend)

### Added - Gross Salary Field
- New "Gross Salary" input field
- Automatically calculates "Hourly Rate" when changed
- Formula: Hourly Rate = Gross Salary ÷ 30
- Real-time calculation on input

### User Experience
- Matches Excel template headers exactly
- Cleaner interface with consolidated OT Pay display
- Gross Salary → Auto-calculates rate → Calculates all pays
- Default Quantity = 1 (one person)
- Working Days default = 8

### Technical
- Added `grossSalary` field to form HTML
- Added `calcHourlyRate(rowId, type)` function
- Added `otPay_total` display field (sum of all OT pays)
- Hidden individual OT pay fields (kept for calculations)
- Updated `collectFormData()` to include grossSalary
- Updated field ordering to match image specifications


## [Unreleased] - Date Filter in Dashboard

### Added - Date Filter Dropdown
**Filter Options:**
- All Dates (default)
- Today
- Yesterday
- This Week (last 7 days)
- This Month (last 30 days)

### Features
- ✅ Filter reports by date range
- ✅ Works with project card selection
- ✅ Works with project dropdown
- ✅ Works with search filter
- ✅ All filters work together

### User Experience
- **"Today" filter**: Shows only reports posted today across all projects
- **Combined filters**: Select project + today = today's reports for that project
- **Dynamic header**: Shows active filters (e.g., "Daily Reports History (Today)")
- **Smart empty states**: "No reports posted today"

### Use Cases
- Daily standup: See today's work across all projects
- Project review: This week's progress for one project
- Monthly reporting: Last 30 days across portfolio
- Quick catch-up: Yesterday's or this week's updates

### Technical
- Added date filter dropdown in dashboard header
- Added date filtering logic in `renderDashboard()`
- Filters by report date (reportDate field)
- Uses JavaScript Date comparison
- Updated header to show active date filter
- Updated empty state messages for date-specific feedback

### Filter Priority
1. User's project access
2. Selected project card
3. Date range (if selected)
4. Search term (if entered)
5. Project dropdown (if selected)
