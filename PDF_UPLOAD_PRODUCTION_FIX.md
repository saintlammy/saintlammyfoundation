# PDF Upload Production Issue & Fix

## Problem

PDF upload is failing in production (Vercel/similar platforms) with error:
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause

**Vercel and similar serverless platforms have read-only filesystems.** The `/public` directory cannot be written to at runtime.

The current implementation tries to:
1. Upload PDF to `/public/uploads/reports/`
2. Save file using Node.js `fs` module
3. Return public URL

This works locally but **fails in production** because:
- ❌ Vercel's filesystem is read-only
- ❌ Files written during runtime are lost after function execution
- ❌ `/public` folder is served statically, not writable

## Temporary Workaround (Current)

Users can **manually enter PDF URLs** instead of uploading:
1. Upload PDF to Google Drive, Dropbox, or any cloud storage
2. Get public URL
3. Paste URL into "Or enter URL manually" field

## Permanent Solutions

### Option 1: Cloudinary (Recommended) ✅

**Pros:**
- Free tier: 25GB storage, 25GB bandwidth/month
- Built for PDFs, images, videos
- Easy Next.js integration
- Automatic optimization

**Implementation:**
```bash
npm install cloudinary next-cloudinary
```

```typescript
// pages/api/upload/pdf-cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  const result = await cloudinary.uploader.upload(fileBuffer, {
    resource_type: 'raw', // For PDFs
    folder: 'outreach-reports',
  });

  return res.json({ url: result.secure_url });
}
```

**Cost:** Free for most use cases

---

### Option 2: Vercel Blob Storage

**Pros:**
- Native Vercel integration
- Simple API
- Fast performance

**Implementation:**
```bash
npm install @vercel/blob
```

```typescript
import { put } from '@vercel/blob';

const blob = await put('reports/report.pdf', file, {
  access: 'public',
});

return res.json({ url: blob.url });
```

**Cost:** $0.15/GB storage, $0.20/GB egress (after free tier)

---

### Option 3: AWS S3

**Pros:**
- Industry standard
- Highly scalable
- Pay per use

**Implementation:**
```bash
npm install @aws-sdk/client-s3
```

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });
await client.send(new PutObjectCommand({
  Bucket: 'saintlammy-reports',
  Key: `reports/${filename}`,
  Body: fileBuffer,
  ContentType: 'application/pdf',
}));
```

**Cost:** $0.023/GB storage, $0.09/GB transfer

---

### Option 4: Google Cloud Storage

**Pros:**
- $300 free credit for new accounts
- Good integration with Google Drive

**Implementation:**
```bash
npm install @google-cloud/storage
```

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket('saintlammy-reports');
await bucket.file(`reports/${filename}`).save(fileBuffer);
```

**Cost:** $0.020/GB storage, $0.12/GB transfer

---

## Recommended Implementation: Cloudinary

### Step 1: Sign up for Cloudinary
1. Go to https://cloudinary.com
2. Sign up (free)
3. Get your Cloud Name, API Key, API Secret

### Step 2: Add Environment Variables
```env
# .env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Install Package
```bash
npm install cloudinary
```

### Step 4: Create New Upload Endpoint
```typescript
// pages/api/upload/pdf-cloudinary.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: 'raw', // For PDFs
      folder: 'outreach-reports',
      public_id: `report-${Date.now()}`,
    });

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      filename: result.original_filename,
      size: result.bytes,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload PDF',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
```

### Step 5: Update Frontend
```typescript
// Change upload endpoint
const response = await fetch('/api/upload/pdf-cloudinary', {
  method: 'POST',
  body: formData,
});
```

---

## Current Status

✅ **Error handling improved** - Better error messages for users
✅ **Manual URL entry works** - Users can paste PDF URLs from external storage
⚠️ **Local upload disabled in production** - Requires cloud storage solution

## Action Required

To enable PDF uploads in production, implement one of the solutions above. **Cloudinary is recommended** for ease of use and generous free tier.

---

**Updated:** January 29, 2026
**Status:** Awaiting cloud storage implementation
