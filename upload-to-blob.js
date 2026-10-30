import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set')
  console.error('Please set it: export BLOB_READ_WRITE_TOKEN=your_token_here')
  process.exit(1)
}

const mediaDir = path.resolve(__dirname, 'public/media')

if (!fs.existsSync(mediaDir)) {
  console.error(`Media directory not found: ${mediaDir}`)
  process.exit(1)
}

const files = fs.readdirSync(mediaDir)
console.log(`Found ${files.length} files in ${mediaDir}`)

let successCount = 0
let errorCount = 0
const results = []

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
    results.push({ filename: file, url: blob.url })
    successCount++
  } catch (error) {
    console.error(`✗ Failed to upload ${file}:`, error.message)
    results.push({ filename: file, url: '', error: error.message })
    errorCount++
  }
}

console.log(`\nUpload complete:`)
console.log(`  Success: ${successCount}`)
console.log(`  Errors: ${errorCount}`)

const resultsPath = path.resolve(__dirname, 'blob-upload-results.json')
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
console.log(`\nResults saved to: ${resultsPath}`)
