import type { Metadata } from 'next/types'

import { AllPropertiesBlock } from '@/blocks/AllPropertiesBlock/Component'
import { FeaturedProperty } from '@/components/FeaturedProperty'
import { getFeaturedProperty } from '@/collections/Properties/getFeaturedProperty'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const featuredProperty = await getFeaturedProperty(payload)

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'properties' } },
    depth: 2,
    limit: 1,
  })

  const pageDoc = page.docs[0] as any
  const block = pageDoc?.layout?.find((b: any) => b.blockType === 'allPropertiesBlock')

  return (
    <div className="pt-12 pb-24">
      <PageClient />

      {featuredProperty ? <FeaturedProperty property={featuredProperty} /> : null}

      <AllPropertiesBlock
        blockType="allPropertiesBlock"
        id={block?.id || 'all-properties'}
        mainTitle={block?.mainTitle ?? 'All Properties'}

        itemsPerPage={block?.itemsPerPage || 12}
        enableFilters={block?.enableFilters ?? true}
        enableSorting={block?.enableSorting ?? true}
      />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Properties`,
  }
}
