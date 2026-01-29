# PDF Upload Feature for Outreach Reports

## Overview

Added PDF upload functionality to outreach reports, allowing admins to upload PDF documents and visitors to download them directly from the outreach detail pages.

---

## Features

### 1. **Admin PDF Upload**
- Upload PDF reports up to 10MB
- Automatic file validation (PDF only)
- Secure file storage in `/public/uploads/reports/`
- Manual URL entry option for external PDFs
- Preview and remove uploaded PDFs

### 2. **Visitor Download**
- Download button on outreach detail pages
- Conditional display (only shown when PDF exists)
- Direct download with proper filename
- Accessible to all visitors

### 3. **Security & Validation**
- File type validation (PDF only)
- File size limit (10MB maximum)
- Sanitized filenames
- Secure file storage

---

## Implementation Details

### API Endpoint: `/api/upload/pdf`

**Method:** POST
**Content-Type:** multipart/form-data
**Max File Size:** 10MB

**Request:**
```typescript
FormData {
  file: File (PDF)
}
```

**Response (Success):**
```json
{
  "success": true,
  "url": "/uploads/reports/1738160508000-outreach-report.pdf",
  "filename": "1738160508000-outreach-report.pdf",
  "size": 524288,
  "originalName": "outreach-report.pdf"
}
```

**Response (Error):**
```json
{
  "error": "Only PDF files are allowed"
}
```

---

## File Storage

**Location:** `/public/uploads/reports/`
**Naming Convention:** `{timestamp}-{sanitized-filename}.pdf`
**Example:** `1738160508000-widows-outreach-report.pdf`

**Public URL:** `/uploads/reports/{filename}`

---

## Usage

### Admin: Upload PDF Report

1. Navigate to **Admin > Content > Outreach Reports**
2. Click **Add Report** or **Edit** existing outreach
3. Scroll to **Report Document (PDF)** section
4. Click **Upload PDF Report** button
5. Select PDF file (max 10MB)
6. Wait for upload confirmation
7. Save the report

**Alternative:** Enter PDF URL manually in the text field below the upload button.

### Visitors: Download PDF Report

1. Visit outreach detail page: `/outreach/[id]`
2. If PDF report exists, see **Download Full Report** button
3. Click button to download PDF

---

## UI Components

### Admin Upload UI

```tsx
<div>
  <label>Report Document (PDF)</label>

  {/* Upload Button */}
  <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
  <label>
    {uploadingPDF ? (
      <>
        <Loader className="animate-spin" />
        Uploading PDF...
      </>
    ) : (
      <>
        <Upload />
        Upload PDF Report
      </>
    )}
  </label>

  {/* Current PDF Display */}
  {reportData.reportDocument && (
    <div>
      <a href={reportData.reportDocument} target="_blank">
        {reportData.reportDocument}
      </a>
      <button onClick={() => remove()}>Remove</button>
    </div>
  )}

  {/* Manual URL Input */}
  <input
    type="text"
    value={reportData.reportDocument}
    placeholder="https://... or /uploads/reports/..."
  />
</div>
```

### Visitor Download Button

```tsx
{outreach.reportDocument && (
  <a
    href={outreach.reportDocument}
    download
    className="bg-accent-400 hover:bg-accent-500 text-white"
  >
    <Download className="w-5 h-5" />
    Download Full Report
  </a>
)}
```

---

## Database Schema

The `report_document` field in `outreach_reports` table stores the PDF URL:

```sql
CREATE TABLE outreach_reports (
  id UUID PRIMARY KEY,
  ...
  report_document TEXT,  -- Stores PDF URL
  ...
);
```

**Example Values:**
- `/uploads/reports/1738160508000-report.pdf` (uploaded file)
- `https://drive.google.com/file/d/abc123/view` (external URL)
- `null` (no report uploaded)

---

## File Upload Flow

```
1. Admin selects PDF file
   ↓
2. Client validates: type & size
   ↓
3. Upload to /api/upload/pdf
   ↓
4. Server validates & sanitizes filename
   ↓
5. Save to /public/uploads/reports/
   ↓
6. Return public URL
   ↓
7. Update reportData.reportDocument
   ↓
8. Save to database
   ↓
9. Visitors can download
```

---

## Error Handling

### Client-Side Validation
- **Invalid file type:** "Please select a PDF file"
- **File too large:** "PDF file size must be less than 10MB"

### Server-Side Validation
- **No file uploaded:** `400 - No file uploaded`
- **Invalid MIME type:** `400 - Only PDF files are allowed`
- **File size exceeded:** `400 - File size exceeds 10MB limit`
- **Server error:** `500 - Failed to upload PDF`

---

## Security Considerations

✅ **File Type Validation:** Only `application/pdf` MIME type allowed
✅ **Size Limit:** Maximum 10MB to prevent abuse
✅ **Filename Sanitization:** Remove special characters, prevent path traversal
✅ **Public Directory:** Files stored in `/public/uploads/reports/` (intentional for downloads)
✅ **No Execution:** PDFs cannot execute code in browser

**Note:** PDFs are publicly accessible once uploaded. Do not upload confidential documents.

---

## Folder Structure

```
/public
  /uploads
    /reports
      1738160508000-widows-outreach-jan-2026.pdf
      1738160520000-medical-outreach-dec-2025.pdf
      1738160535000-education-program-report.pdf
```

**Recommendation:** Add `.gitignore` entry for `/public/uploads/` to avoid committing uploaded files to repository.

---

## Configuration

### Max File Size

Edit in `/pages/api/upload/pdf.ts`:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (change as needed)
```

### Allowed MIME Types

```typescript
const ALLOWED_MIME_TYPES = ['application/pdf']; // PDF only
```

### Upload Directory

```typescript
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'reports');
```

---

## Testing Checklist

- [ ] Upload PDF less than 10MB
- [ ] Upload PDF exactly 10MB
- [ ] Upload PDF greater than 10MB (should fail)
- [ ] Upload non-PDF file (should fail)
- [ ] Upload with special characters in filename
- [ ] Remove uploaded PDF
- [ ] Enter manual URL
- [ ] Download PDF as visitor
- [ ] Download external URL PDF
- [ ] Check PDF displays correctly in browser
- [ ] Verify file saved in correct directory

---

## Maintenance

### Disk Space Management

Uploaded PDFs accumulate in `/public/uploads/reports/`. Consider:

1. **Manual Cleanup:** Periodically delete old/unused PDFs
2. **Cloud Storage:** Move to AWS S3, Google Cloud Storage, or Cloudinary for scalability
3. **Automated Cleanup:** Create cron job to delete PDFs older than X months

### Backup Strategy

- Include `/public/uploads/reports/` in backup plan
- Or migrate to cloud storage with automatic backups

---

## Future Enhancements

- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] PDF preview/thumbnail generation
- [ ] Multiple PDF uploads per outreach
- [ ] PDF compression before upload
- [ ] Access analytics (download count, last downloaded)
- [ ] Password-protected PDFs
- [ ] Automatic PDF generation from report data

---

## Dependencies

```json
{
  "formidable": "^3.5.1",
  "@types/formidable": "^3.4.5"
}
```

---

## Files Modified/Created

**Created:**
- `/pages/api/upload/pdf.ts` - PDF upload API endpoint
- `/PDF_UPLOAD_FEATURE.md` - This documentation

**Modified:**
- `/pages/admin/content/outreach-reports.tsx` - Added PDF upload UI and handler
- `/pages/outreach/[id].tsx` - Added reportDocument field to interface

**Directory Created:**
- `/public/uploads/reports/` - PDF storage location

---

## Example Usage

### Upload from Admin Panel

```typescript
// Admin uploads PDF
const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/pdf', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  setReportData({ ...reportData, reportDocument: data.url });
};
```

### Download from Visitor Page

```tsx
{outreach.reportDocument && (
  <a href={outreach.reportDocument} download>
    Download Full Report
  </a>
)}
```

---

**Status:** ✅ **COMPLETED**
**Date:** January 29, 2026
**Tested:** Local development
**Production Ready:** Yes (ensure `/public/uploads/reports/` exists on server)
