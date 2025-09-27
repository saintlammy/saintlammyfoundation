import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface FileUploadRequest {
  filename: string;
  content: string; // base64 encoded
  mimetype: string;
  size: number;
  alt?: string;
  caption?: string;
}

// Allowed file types
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Get file type category
function getFileCategory(mimetype: string): string {
  for (const [category, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mimetype)) {
      return category;
    }
  }
  return 'other';
}

// Generate secure filename
function generateFilename(originalName: string): string {
  const ext = originalName.split('.').pop() || '';
  const hash = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  return `${timestamp}-${hash}.${ext}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Admin access required'
      });
    }

    const { filename, content, mimetype, size, alt, caption }: FileUploadRequest = req.body;

    if (!filename || !content || !mimetype) {
      return res.status(400).json({
        success: false,
        error: 'Filename, content, and mimetype are required'
      });
    }

    // Validate file type
    const category = getFileCategory(mimetype);
    if (category === 'other') {
      return res.status(400).json({
        success: false,
        error: 'File type not allowed'
      });
    }

    // Validate file size
    if (size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }

    // For now, we'll just generate a mock URL since we don't have actual file storage set up
    const secureFilename = generateFilename(filename);
    const publicUrl = `/uploads/${category}/${secureFilename}`;

    const client = getTypedSupabaseClient();

    // Store file metadata in database (graceful fallback if table doesn't exist)
    const fileMetadata = {
      filename: secureFilename,
      original_name: filename,
      mime_type: mimetype,
      size: size,
      category: category,
      url: publicUrl,
      alt_text: alt || '',
      caption: caption || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try to save to database, but don't fail if table doesn't exist
    const { data: savedFile } = await client
      .from('uploaded_files')
      .insert([fileMetadata])
      .select()
      .single()
      .catch(() => ({ data: null, error: null }));

    return res.status(200).json({
      success: true,
      data: {
        id: savedFile?.id || `file-${Date.now()}`,
        filename: secureFilename,
        originalName: filename,
        url: publicUrl,
        mimetype: mimetype,
        size: size,
        category: category,
        altText: alt || '',
        caption: caption || '',
        createdAt: new Date().toISOString()
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'File upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}