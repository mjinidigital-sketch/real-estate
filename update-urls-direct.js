import { Client } from 'pg'

console.log('=== Clean Database URLs (Remove Query Params) ===\n')

const DATABASE_URL = process.env.DATABASE_URL
const BLOB_BASE_URL = 'https://mqppc7vuj2sg96oz.public.blob.vercel-storage.com/'

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const client = new Client(DATABASE_URL)

async function updateUrls() {
  try {
    await client.connect()
    console.log('Connected to database\n')

    // Get all media records
    const result = await client.query(`
      SELECT id, filename, url
      FROM media
      WHERE filename IS NOT NULL
    `)

    console.log(`Found ${result.rows.length} media records\n`)

    let updateCount = 0
    let skipCount = 0

    for (const row of result.rows) {
      const { id, filename, url } = row

      if (!filename) {
        console.log(`Skipping record ${id} - no filename`)
        skipCount++
        continue
      }

      // Clean URL - remove any query parameters
      const cleanBlobUrl = `${BLOB_BASE_URL}${filename}`

      // Check if already has clean Blob URL
      if (url === cleanBlobUrl) {
        console.log(`Skipping ${filename} - already has clean Blob URL`)
        skipCount++
        continue
      }

      // Update the URL
      await client.query(
        'UPDATE media SET url = $1 WHERE id = $2',
        [cleanBlobUrl, id]
      )

      console.log(`✓ Updated ${filename}`)
      console.log(`  Old: ${url}`)
      console.log(`  New: ${cleanBlobUrl}`)
      updateCount++
    }

    console.log(`\n=== Summary ===`)
    console.log(`Updated: ${updateCount}`)
    console.log(`Skipped: ${skipCount}`)
    console.log('\nAll media URLs cleaned and pointing to Vercel Blob!')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

updateUrls()
