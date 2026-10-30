import type { FeaturedPropertiesBlock as FeaturedPropertiesBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { FeaturedPropertiesBlockClient } from './Client'
import { type PropertyCardData } from '@/components/PropertyCard'
import Title from '@/components/Title'

export const FeaturedPropertiesBlock: React.FC<
  FeaturedPropertiesBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, mainTitle, subTitle, text, layout, limit: limitFromProps, autoPlay } = props

  const limit = limitFromProps || 6
  const resolvedLayout = layout || 'carousel'

  const payload = await getPayload({ config: configPromise })

  const propertySelect = {
    title: true,
    slug: true,
    price: true,
    status: true,
    bedrooms: true,
    bathrooms: true,
    squareFootage: true,
    category: true,
    heroImage: true,
    meta: true,
    description: true,
    city: true,
    state: true,
    features: true,
    createdAt: true,
    publishedAt: true,
  } as const

  let fetchedProperties = await payload.find({
    collection: 'properties',
    depth: 1,
    limit,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      featured: { equals: true },
    },
    sort: '-createdAt',
    select: propertySelect,
  })

  // Fallback: If no properties are specifically marked as featured,
  // load published properties so the block still renders content
  if (!fetchedProperties.docs || fetchedProperties.docs.length === 0) {
    fetchedProperties = await payload.find({
      collection: 'properties',
      depth: 1,
      limit,
      overrideAccess: false,
      where: {
        _status: { equals: 'published' },
      },
      sort: '-createdAt',
      select: propertySelect,
    })
  }

  const properties = (fetchedProperties.docs || []) as unknown as PropertyCardData[]

  return (
    <section
      className="site-featured-properties-block pt-12 pb-16 px-4 max-w-7xl mx-auto overflow-hidden border-b border-border"
      id={`block-${id}`}
    >
      <Title
        mainTitle={mainTitle || 'Featured Properties'}
        subTitle={subTitle || undefined}
        text={text || undefined}
        isPageTitle={false}
      />

      <div className="container my-12 md:my-16">
        <FeaturedPropertiesBlockClient
          properties={properties}
          layout={resolvedLayout as 'carousel' | 'grid' | 'masonry'}
          limit={limit}
          autoPlay={autoPlay ?? true}
        />
      </div>
    </section>
  )
}
