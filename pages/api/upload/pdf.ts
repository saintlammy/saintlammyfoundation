import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'reports');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if upload directory exists and is writable
    try {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      // Test write permissions
      const testFile = path.join(UPLOAD_DIR, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    } catch (dirError) {
      console.error('Upload directory error:', dirError);
      return res.status(500).json({
        error: 'Server configuration error: Upload directory not accessible',
        details: dirError instanceof Error ? dirError.message : 'Unknown error'
      });
    }

    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      filter: (part) => {
        return part.mimetype === 'application/pdf';
      },
    });

    let fields, files;
    try {
      [fields, files] = await form.parse(req);
    } catch (parseError) {
      console.error('Form parse error:', parseError);
      return res.status(400).json({
        error: 'Failed to parse upload',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype || '')) {
      // Delete uploaded file
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Generate safe filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'report.pdf';
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${timestamp}-${safeName}`;
    const newPath = path.join(UPLOAD_DIR, filename);

    // Move file to final location
    fs.renameSync(file.filepath, newPath);

    // Return public URL
    const publicUrl = `/uploads/reports/${filename}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      originalName: file.originalFilename,
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    if (error instanceof Error) {
      if (error.message.includes('maxFileSize')) {
        return res.status(400).json({ error: 'File size exceeds 10MB limit' });
      }
    }

    return res.status(500).json({
      error: 'Failed to upload PDF',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : undefined,
      note: 'If running on Vercel, file uploads may not work due to read-only filesystem. Consider using cloud storage (Cloudinary, AWS S3, etc.)'
    });
  }
}

/**
 * IMPORTANT: File uploads to /public directory won't work on Vercel or similar platforms
 * because the filesystem is read-only. For production, consider:
 *
 * 1. Cloudinary (recommended for PDFs and images)
 * 2. AWS S3
 * 3. Google Cloud Storage
 * 4. Vercel Blob Storage
 *
 * This implementation works for local development only.
 */
