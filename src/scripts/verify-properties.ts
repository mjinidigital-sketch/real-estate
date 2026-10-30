import config from '@payload-config'
import { createPayloadRequest, getPayload } from 'payload'

const payload = await getPayload({ config })
const req = await createPayloadRequest({ payload })

try {
  const categories = await payload.find({
    collection: 'property-categories',
    req,
    limit: 100,
  })

  console.log(`Property Categories: ${categories.totalDocs}`)
  categories.docs.forEach((cat: any) => {
    console.log(`  - ${cat.title} (${cat.slug})`)
  })

  const properties = await payload.find({
    collection: 'properties',
    req,
    limit: 1,
  })

  console.log(`\nTotal Properties: ${properties.totalDocs}`)

  if (properties.totalDocs > 0) {
    const sample = await payload.find({
      collection: 'properties',
      req,
      limit: 1,
      depth: 1,
    })

    const prop = sample.docs[0] as any
    console.log(`\nSample Property:`)
    console.log(`  Title: ${prop.title}`)
    console.log(`  Price: $${prop.price}`)
    console.log(`  Gallery images: ${prop.gallery?.length || 0}`)
  }
} finally {
  await payload.destroy()
}
