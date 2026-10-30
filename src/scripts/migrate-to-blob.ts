import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { put } from '@vercel/blob'
import payload from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const migrateToBlob = async () => {
  console.log('Starting migration to Vercel Blob...')

  // Get all media from the database
  const media = await payload.find({
    collection: 'media',
    where: {
      url: {
        exists: true,
      },
    },
    limit: 1000,
  })

  console.log(`Found ${media.totalDocs} media items to migrate`)

  let successCount = 0
  let errorCount = 0

  for (const item of media.docs) {
    try {
      // Check if already migrated (has Vercel Blob URL)
      if (item.url?.startsWith('https://')) {
        console.log(`Skipping ${item.filename} - already has external URL`)
        continue
      }

      // Get the local file path
      const localPath = path.resolve(dirname, '../../public/media', item.filename || '')

      if (!fs.existsSync(localPath)) {
        console.log(`File not found: ${localPath}`)
        errorCount++
        continue
      }

      // Read the file
      const fileBuffer = fs.readFileSync(localPath)
      const file = new File([fileBuffer], item.filename || 'file', {
        type: item.mimeType || 'image/jpeg',
      })

      // Upload to Vercel Blob
      const blob = await put(item.filename || 'file', file, {
        access: 'public',
        contentType: item.mimeType || 'image/jpeg',
      })

      // Update the media record
      await payload.update({
        collection: 'media',
        id: item.id,
        data: {
          url: blob.url,
          filename: blob.pathname,
        },
      })

      console.log(`✓ Migrated ${item.filename} to ${blob.url}`)
      successCount++
    } catch (error) {
      console.error(`✗ Failed to migrate ${item.filename}:`, error)
      errorCount++
    }
  }

  console.log(`\nMigration complete:`)
  console.log(`  Success: ${successCount}`)
  console.log(`  Errors: ${errorCount}`)
}
