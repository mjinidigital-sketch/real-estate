import type { PropertiesCardBlock as PropertiesCardBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PropertiesCardBlockClient } from './Client'
import { type PropertyCardData } from '@/components/PropertyCard'
import Title from '@/components/Title'

export const PropertiesCardBlock: React.FC<
  PropertiesCardBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    mainTitle,
    subTitle,
    text,
    categories,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props

  const limit = limitFromProps || 12
  let properties: PropertyCardData[] = []
  const resolvedPopulateBy = populateBy || 'collection'

  if (resolvedPopulateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    }) as unknown as string[]

    const fetchedProperties = await payload.find({
      collection: 'properties',
      depth: 1,
      limit,
      overrideAccess: false,
      where: {
        _status: { equals: 'published' },
        ...(flattenedCategories && flattenedCategories.length > 0
          ? { category: { in: flattenedCategories } }
          : {}),
      },
      select: {
        title: true,
        slug: true,
        price: true,
        status: true,
        bedrooms: true,
        bathrooms: true,
        squareFootage: true,
        category: true,
        meta: true,
        description: true,
        city: true,
        state: true,
        features: true,
      },
    })

    properties = fetchedProperties.docs as unknown as PropertyCardData[]
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedProperties = selectedDocs
        .map((property) => {
          if (typeof property === 'object' && property !== null) {
            return 'value' in property && typeof property.value === 'object'
              ? property.value
              : property
          }
          return null
        })
        .filter(Boolean) as PropertyCardData[]

      properties = filteredSelectedProperties
    }
  }

  return (
    <section className="site-properties-card-block my-16 md:my-24 px-4" id={`block-${id}`}>
      {/* Renders the dynamic layout precisely via configured database inputs */}
      <Title mainTitle={mainTitle} subTitle={subTitle ?? undefined} text={text ?? undefined} />

      <div className="mt-12">
        <PropertiesCardBlockClient properties={properties} />
      </div>
    </section>
  )
}
