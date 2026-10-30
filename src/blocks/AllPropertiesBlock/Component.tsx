import type { AllPropertiesBlock as AllPropertiesBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { AllPropertiesBlockClient } from './Client'
import { type PropertyCardData } from '@/components/PropertyCard'
import Title from '@/components/Title'

export const AllPropertiesBlock: React.FC<
  AllPropertiesBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    mainTitle,
    subTitle,
    text,
    itemsPerPage: itemsPerPageFromProps,
    enableFilters,
    enableSorting,
  } = props

  const itemsPerPage = itemsPerPageFromProps || 12

  const payload = await getPayload({ config: configPromise })

  const fetchedProperties = await payload.find({
    collection: 'properties',
    depth: 1,
    limit: 0, // Get all properties (client-side will handle pagination)
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-createdAt',
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
      createdAt: true,
      publishedAt: true,
    },
  })

  const properties = fetchedProperties.docs as unknown as PropertyCardData[]

  return (
    <section className="site-all-properties-block mb-16 px-4" id={`block-${id}`}>
      <Title mainTitle={mainTitle || ''} subTitle={subTitle || undefined} text={text || undefined} isPageTitle showDivider={false} compact className="-mt-12" />

      <div className="mt-2">
        <AllPropertiesBlockClient
          properties={properties}
          itemsPerPage={itemsPerPage}
          enableFilters={enableFilters ?? true}
          enableSorting={enableSorting ?? true}
        />
      </div>
    </section>
  )
}
