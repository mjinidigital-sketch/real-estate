import type { Property } from '../../payload-types'
import type { Payload } from 'payload'

export const getFeaturedProperty = async (payload?: Payload): Promise<Property | null> => {
  if (payload) {
    const result = await payload.find({
      collection: 'properties',
      where: {
        featured: {
          equals: true,
        },
      },
      limit: 1,
      depth: 1,
    })
    return result.docs[0] || null
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/properties?where=featured[equals]=true&limit=1&depth=1`,
    {
      cache: 'no-store',
    },
  )

  const data = await res.json()

  if (data.docs && data.docs.length > 0) {
    return data.docs[0]
  }

  return null
}
