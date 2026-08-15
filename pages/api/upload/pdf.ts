import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { errors as formidableErrors } from 'formidable';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/serverAuth';

export const config = { api: { bodyParser: false } };

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BUCKET = 'outreach-media';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseAdmin) return res.status(503).json({ error: 'Storage is not configured' });

  const temporaryPaths = new Set<string>();
  try {
    let rejectedMimeType = false;
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      maxTotalFileSize: MAX_FILE_SIZE,
      maxFiles: 1,
      filter: part => {
        if (part.mimetype === 'application/pdf') return true;
        rejectedMimeType = true;
        return false;
      }
    });
    form.on('fileBegin', (_formName, file) => temporaryPaths.add(file.filepath));
    form.on('file', (_formName, file) => temporaryPaths.add(file.filepath));
    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: rejectedMimeType ? 'Only PDF files are allowed' : 'A PDF file is required' });
    temporaryPaths.add(file.filepath);
    if (file.mimetype !== 'application/pdf') return res.status(400).json({ error: 'Only PDF files are allowed' });

    const buffer = await fs.readFile(file.filepath);
    if (buffer.length > MAX_FILE_SIZE) return res.status(413).json({ error: 'PDF files must be 10 MB or smaller' });
    if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some(bucket => bucket.name === BUCKET)) {
      const { error: bucketError } = await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      });
      if (bucketError && !bucketError.message.toLowerCase().includes('already exists')) throw bucketError;
    }

    const safeStem = path.basename(file.originalFilename || 'outreach-report.pdf', path.extname(file.originalFilename || ''))
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || 'outreach-report';
    const objectPath = `reports/${Date.now()}-${randomUUID()}-${safeStem}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, buffer, {
      contentType: 'application/pdf',
      cacheControl: '31536000',
      upsert: false
    });
    if (uploadError) throw uploadError;

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);
    return res.status(201).json({ success: true, url: data.publicUrl, filename: `${safeStem}.pdf` });
  } catch (error) {
    console.error('PDF upload failed:', error);
    const uploadError = error as { code?: number | string; httpCode?: number; message?: string };
    if (
      uploadError.httpCode === 413
      || uploadError.code === (formidableErrors as Record<string, number>).biggerThanTotalMaxFileSize
      || uploadError.code === formidableErrors.biggerThanMaxFileSize
      || /maxFileSize|larger than/i.test(uploadError.message || '')
    ) {
      return res.status(413).json({ error: 'PDF files must be 10 MB or smaller' });
    }
    return res.status(500).json({ error: 'Failed to upload PDF' });
  } finally {
    await Promise.all(Array.from(temporaryPaths, temporaryPath => fs.unlink(temporaryPath).catch(() => undefined)));
  }
}

export default withAdminAuth(handler);
