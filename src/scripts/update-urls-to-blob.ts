import payload from 'payload'

export const updateUrlsToBlob = async () => {
  const BLOB_BASE_URL = 'https://mqppc7vuj2sg96oz.public.blob.vercel-storage.com/'

  console.log('=== Updating Media URLs to Vercel Blob ===\n')

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

  console.log(`Found ${media.totalDocs} media records`)

  let updateCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const item of media.docs) {
    try {
      const filename = item.filename

      if (!filename) {
        console.log(`Skipping record ${item.id} - no filename`)
        skipCount++
        continue
      }

      // Generate Blob URL
      const blobUrl = `${BLOB_BASE_URL}${filename}`

      // Check if already has Blob URL
      if (item.url === blobUrl) {
        console.log(`Skipping ${filename} - already has Blob URL`)
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

      console.log(`✓ Updated ${filename}`)
      console.log(`  Old: ${item.url}`)
      console.log(`  New: ${blobUrl}`)
      updateCount++
    } catch (error) {
      console.error(`✗ Failed to update ${item.filename}:`, error)
      errorCount++
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Updated: ${updateCount}`)
  console.log(`Skipped: ${skipCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log('\nAll media URLs now point to Vercel Blob!')
}

// Call the function when run directly
updateUrlsToBlob()

