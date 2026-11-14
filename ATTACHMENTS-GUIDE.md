# 📎 File Attachments Guide
## El-Hadar Projects - Daily Progress Report System

## Overview
You can now attach files (photos, PDFs, documents) to the following sections:
- ⚒ **Daily Execution** - Attach work progress photos, completion certificates
- 🚜 **Equipment** - Attach equipment photos, inspection reports, maintenance logs
- 👷 **Direct Manpower** - Attach timesheets, work records, attendance photos
- 🧑‍💼 **Indirect Manpower** - Attach staff records, OT approval forms

## How to Attach Files

### Step 1: Add a New Entry
Click the "+ Add" button for the section you want (e.g., "+ Add Work Item")

### Step 2: Fill in the Required Information
Enter all the relevant details (activity, quantity, etc.)

### Step 3: Attach a File
Look for the **"📎 Attachment (optional)"** button at the bottom of each entry and click it

### Step 4: Select Your File
- Choose an image (JPG, PNG, GIF)
- Or select a document (PDF, Word, Excel)
- Maximum file size: **5MB**

### Step 5: Confirm Attachment
You'll see a green confirmation showing:
```
🖼 filename.jpg  ✕
```

### Step 6: Remove File (Optional)
Click the **✕** button to remove an attached file

## Supported File Types

### Images
- **JPG/JPEG** - Photos from phones, cameras
- **PNG** - Screenshots, diagrams
- **GIF** - Animated images

### Documents
- **PDF** - Reports, scanned documents
- **DOC/DOCX** - Word documents, forms
- **XLS/XLSX** - Spreadsheets, timesheets

### Other
- **ZIP/RAR** - Compressed archives

## File Size Limit
- Maximum: **5MB per file**
- If your file is too large, you'll see an error message
- **Tip**: Compress large images using online tools or your phone's settings

## Viewing Attached Files

### In Report View
1. Open any saved report from the dashboard
2. Look at the **"Attachment"** column in the tables
3. You'll see file links like: **🖼 progress-photo.jpg**
4. Click the filename to **download** the file

### While Editing
- Attached files are preserved when you edit a report
- The file indicator shows at the bottom of each entry
- You can remove and replace files while editing

## Best Practices

### Naming Files
✅ **Good**: `excavation-progress-nov11-2024.jpg`
✅ **Good**: `mason-timesheet-week45.pdf`
❌ **Bad**: `IMG_20241111_123456.jpg`
❌ **Bad**: `untitled.pdf`

### When to Attach Files

#### Daily Execution
- Before/after photos of work completed
- Completion certificates
- Material delivery receipts
- Quality inspection photos

#### Equipment
- Equipment condition photos
- Maintenance logs (PDF)
- Inspection certificates
- Breakdown incident photos
- Fuel/usage logs

#### Direct Manpower
- Daily attendance photos
- Signed timesheets (scanned PDF)
- Work completion photos with crew
- OT authorization forms

#### Indirect Manpower
- Staff attendance records
- OT approval documents
- Meeting minutes (if relevant)
- Staff certifications

## Storage & Backup

### Where Files Are Stored
- Files are converted to Base64 and stored in your browser's localStorage
- They're saved together with the report data
- No files are uploaded to any server

### File Safety
⚠️ **Important**: Files are stored locally in your browser
- If you clear browser data, files are deleted
- Backup your reports regularly (see README.md)
- Consider keeping original files in a separate folder

### Storage Limits
- Browser localStorage typically allows 5-10MB total
- Multiple large attachments may exceed this limit
- If you see storage errors, reduce file sizes or attach fewer files

## Troubleshooting

### "File too large" Error
**Solution**: 
- Compress the image (use free online tools)
- Reduce image quality on your phone before uploading
- Split large PDFs into smaller sections

### File Not Showing After Upload
**Solution**:
- Make sure you clicked the 📎 button and selected a file
- Check that you saved the report after attaching
- Refresh the page and try again

### Can't Download File from Report
**Solution**:
- Make sure you're viewing a saved report (not editing)
- Click directly on the filename link
- Your browser should automatically download it

### Lost All Attachments
**Solution**:
- Check if you accidentally cleared browser data
- Look for the backup you created (see README.md)
- Restore from backup if available

## Tips for Mobile Users

### Taking Photos
1. Use your phone camera to take progress photos
2. Keep photos under 2-3MB if possible
3. Use landscape orientation for site photos
4. Take clear, well-lit photos

### Uploading from Phone
1. Open the web app in mobile browser
2. Tap the 📎 Attachment button
3. Choose "Camera" to take a new photo OR "Gallery" to select existing
4. The photo uploads and displays immediately

### Viewing on Phone
- Tap the filename in the report view
- Phone will download and open with default viewer
- You can share the file from there

## Examples

### Example 1: Excavation Work
**Section**: Daily Execution
**Activity**: Excavation for foundation
**Qty**: 150 m³
**Attachment**: `foundation-excavation-completed.jpg`
- Photo showing completed excavation work

### Example 2: Equipment Breakdown
**Section**: Equipment
**Equipment**: Excavator CAT 320
**Status**: 🔴 Down
**Attachment**: `excavator-hydraulic-leak.jpg`
- Photo of the hydraulic system issue

### Example 3: Overtime Approval
**Section**: Direct Manpower
**Trade**: Steel Fixers
**Qty**: 8 workers
**OT Hours**: 3 hours
**Attachment**: `steelfixers-ot-approval-nov11.pdf`
- Scanned OT approval form

### Example 4: Safety Inspection
**Section**: Equipment
**Equipment**: Tower Crane TC-01
**Status**: ✅ Operational
**Attachment**: `crane-weekly-inspection-report.pdf`
- Weekly safety inspection certificate

---

**Need Help?** Check the main README.md file for general application help.
