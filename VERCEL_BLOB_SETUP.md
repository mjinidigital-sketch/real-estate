# Vercel Blob Storage Setup Guide

## Current Status

**All 90 media files have been successfully uploaded to Vercel Blob!**

- Blob Store ID: `store_MqpPC7vuj2sG96Oz`
- Files uploaded: 90/90 (100% success)
- Base URL: `https://mqppc7vuj2sg96oz.public.blob.vercel-storage.com/`

## Setup for Development and Production

### Step 1: Add Environment Variable

**For Local Development (.env file):**
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_MqpPC7vuj2sG96Oz_Ea1LBTpep26RCTyxmLBGgQZgR4Ykmj
```

**For Vercel Production:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `BLOB_READ_WRITE_TOKEN` = `vercel_blob_rw_MqpPC7vuj2sG96Oz_Ea1LBTpep26RCTyxmLBGgQZgR4Ykmj`

### Step 2: Update Existing Media URLs

Since your files are already uploaded, you need to update the database to use the Blob URLs:

**Manual Update (Recommended):**
1. Go to your Payload admin panel at `/admin`
2. Navigate to the Media collection
3. For each media item, update the URL field to the corresponding Blob URL
4. Example: Change `/media/hero-house-bg.webp` to `https://mqppc7vuj2sg96oz.public.blob.vercel-storage.com/hero-house-bg.webp`

### Step 3: Use the Upload API for New Media

For new media uploads, use the custom API endpoint:

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('filename', 'my-image.jpg')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const { url, filename } = await response.json()
```

## How It Works

### Upload Flow
1. User uploads file via `/api/upload`
2. File is uploaded to Vercel Blob
3. Public URL is returned
4. You save the URL in your database/content

### Delete Flow
- When media is deleted via Payload admin
- The `beforeDelete` hook automatically removes the file from Vercel Blob
- No manual cleanup needed

## File URL Mapping

Your files are available at:
```
https://mqppc7vuj2sg96oz.public.blob.vercel-storage.com/[filename]
```

## Migration Checklist

- [x] Create Vercel Blob store
- [x] Upload all 90 files to Blob
- [x] Configure delete hook
- [x] Create upload API endpoint
- [ ] Add BLOB_READ_WRITE_TOKEN to .env
- [ ] Add BLOB_READ_WRITE_TOKEN to Vercel environment
- [ ] Update database URLs to use Blob URLs
- [ ] Test new uploads via /api/upload
- [ ] Deploy to production

## Benefits

- ✅ Consistent storage across dev and prod
- ✅ CDN delivery via Vercel Edge Network
- ✅ No local file system dependencies
- ✅ Automatic HTTPS
- ✅ Scalable object storage
- ✅ Cost-effective (free tier: 500GB storage, 5000GB bandwidth)

## Cost

Vercel Blob pricing:
- Free tier: 500GB storage, 5000GB bandwidth per month
- Pay-as-you-go: $0.15/GB storage, $0.15/GB bandwidth

Your current usage: ~5MB (well within free tier)
