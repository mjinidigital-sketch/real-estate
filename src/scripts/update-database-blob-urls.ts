import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import payload from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const updateDatabaseBlobUrls = async () => {
  console.log('Starting database update with Blob URLs...')

  // Read the upload results
  const resultsPath = path.resolve(dirname, '../../blob-upload-results.json')

  if (!fs.existsSync(resultsPath)) {
    console.error(`Upload results file not found: ${resultsPath}`)
    console.error('Please run the upload script first: node upload-to-blob.js')
    process.exit(1)
  }

  const uploadResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))

  // Create a map of filename -> Blob URL
  const urlMap = new Map<string, string>()
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

  console.log(`\nDatabase update complete:`)
  console.log(`  Updated: ${updateCount}`)
  console.log(`  Skipped: ${skipCount}`)
  console.log(`  Errors: ${errorCount}`)
}
