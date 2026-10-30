import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import payload from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set')
  console.error('Please set it: export BLOB_READ_WRITE_TOKEN=your_token_here')
  process.exit(1)
}

console.log('=== Step 1: Uploading files to Vercel Blob ===\n')

const mediaDir = path.resolve(__dirname, 'public/media')

if (!fs.existsSync(mediaDir)) {
  console.error(`Media directory not found: ${mediaDir}`)
  process.exit(1)
}

const files = fs.readdirSync(mediaDir)
console.log(`Found ${files.length} files in ${mediaDir}`)

let uploadSuccessCount = 0
let uploadErrorCount = 0
const uploadResults = []

for (const file of files) {
  const filePath = path.join(mediaDir, file)
  const stats = fs.statSync(filePath)

  if (!stats.isFile()) {
    console.log(`Skipping ${file} (not a file)`)
    continue
  }

  try {
    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(file).toLowerCase()
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }
    const mimeType = mimeTypes[ext] || 'application/octet-stream'

    const blob = await put(file, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    })

    console.log(`✓ Uploaded ${file} -> ${blob.url}`)
    uploadResults.push({ filename: file, url: blob.url })
    uploadSuccessCount++
  } catch (error) {
    console.error(`✗ Failed to upload ${file}:`, error.message)
    uploadResults.push({ filename: file, url: '', error: error.message })
    uploadErrorCount++
  }
}

console.log(`\nUpload complete:`)
console.log(`  Success: ${uploadSuccessCount}`)
console.log(`  Errors: ${uploadErrorCount}`)

const resultsPath = path.resolve(__dirname, 'blob-upload-results.json')
fs.writeFileSync(resultsPath, JSON.stringify(uploadResults, null, 2))
console.log(`Results saved to: ${resultsPath}\n`)

console.log('=== Step 2: Updating database with Blob URLs ===\n')

// Create a map of filename -> Blob URL
const urlMap = new Map()
for (const result of uploadResults) {
  if (result.url && !result.error) {
    urlMap.set(result.filename, result.url)
  }
}

console.log(`Found ${urlMap.size} successfully uploaded files`)

// Get all media from the database
const media = await payload.find({
  collection: 'media',
  where: {
    filename: {
      exists: true,
    },
  },
  limit: 1000,
})

console.log(`Found ${media.totalDocs} media records in database`)

let updateCount = 0
let skipCount = 0
let errorCount = 0

for (const item of media.docs) {
  try {
    const blobUrl = urlMap.get(item.filename || '')

    if (!blobUrl) {
      console.log(`Skipping ${item.filename} - no Blob URL found`)
      skipCount++
      continue
    }

    // Check if already has the Blob URL
    if (item.url === blobUrl) {
      console.log(`Skipping ${item.filename} - already has Blob URL`)
      skipCount++
      continue
    }

    // Update the media record
    await payload.update({
      collection: 'media',
      id: item.id,
      data: {
        url: blobUrl,
      },
    })

    console.log(`✓ Updated ${item.filename} -> ${blobUrl}`)
    updateCount++
  } catch (error) {
    console.error(`✗ Failed to update ${item.filename}:`, error)
    errorCount++
  }
}

console.log(`\n=== Summary ===`)
console.log(`Upload Success: ${uploadSuccessCount}`)
console.log(`Upload Errors: ${uploadErrorCount}`)
console.log(`Database Updated: ${updateCount}`)
console.log(`Database Skipped: ${skipCount}`)
console.log(`Database Errors: ${errorCount}`)
console.log('\nAll done! Your media is now on Vercel Blob.')
