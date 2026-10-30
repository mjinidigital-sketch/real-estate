import config from '@payload-config'
import { createPayloadRequest, getPayload } from 'payload'

const payload = await getPayload({ config })
const req = await createPayloadRequest({ payload })

try {
  console.log('Testing property-categories collection access...')

  // Try to find existing categories
  const existing = await payload.find({
    collection: 'property-categories',
    req,
    limit: 1,
  })
  console.log(`Existing categories: ${existing.totalDocs}`)

  // Try to create a simple category
  const testCategory = await payload.create({
    collection: 'property-categories',
    req,
    data: {
      title: 'Test Category',
      description: 'Test description',
      slug: 'test-category',
    },
  })
  console.log(`Created test category: ${testCategory.title} (ID: ${testCategory.id})`)

  // Delete it
  await payload.delete({
    collection: 'property-categories',
    req,
    id: testCategory.id,
  })
  console.log('Deleted test category')

  console.log('Test passed!')
} catch (error) {
  console.error('Test failed:', error)
} finally {
  await payload.destroy()
}
