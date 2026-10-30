import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { put } from '@vercel/blob'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const uploadAllToBlob = async () => {
  const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

  if (!BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set')
    console.error('Please set it in your .env file or pass it as an environment variable')
    process.exit(1)
  }

  const mediaDir = path.resolve(dirname, '../../public/media')

  if (!fs.existsSync(mediaDir)) {
    console.error(`Media directory not found: ${mediaDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(mediaDir)
  console.log(`Found ${files.length} files in ${mediaDir}`)

  let successCount = 0
  let errorCount = 0
  const results: Array<{ filename: string; url: string; error?: string }> = []

  for (const file of files) {
    const filePath = path.join(mediaDir, file)
    const stats = fs.statSync(filePath)

    if (!stats.isFile()) {
      console.log(`Skipping ${file} (not a file)`)
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(filePath)
      const mimeType = getMimeType(file)

      const blob = await put(file, fileBuffer, {
        access: 'public',
        contentType: mimeType,
      })

      console.log(`✓ Uploaded ${file} -> ${blob.url}`)
      results.push({ filename: file, url: blob.url })
      successCount++
    } catch (error) {
      console.error(`✗ Failed to upload ${file}:`, error)
      results.push({ filename: file, url: '', error: String(error) })
      errorCount++
    }
  }

  console.log(`\nUpload complete:`)
  console.log(`  Success: ${successCount}`)
  console.log(`  Errors: ${errorCount}`)

  // Save results to a file
  const resultsPath = path.resolve(dirname, '../../blob-upload-results.json')
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
  console.log(`\nResults saved to: ${resultsPath}`)
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}
