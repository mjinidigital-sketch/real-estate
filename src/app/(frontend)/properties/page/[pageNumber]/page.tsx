import type { Metadata } from 'next/types'

import { PropertyCollectionArchive } from '@/components/PropertyCollectionArchive'
import { getFeaturedProperty } from '@/collections/Properties/getFeaturedProperty'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const featuredProperty = await getFeaturedProperty(payload)

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const properties = await payload.find({
    collection: 'properties',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      meta: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      squareFootage: true,
      status: true,
      city: true,
      state: true,
      createdAt: true,
    },
    ...(featuredProperty
      ? {
          where: {
            id: {
              not_equals: featuredProperty.id,
            },
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Properties</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="properties"
          currentPage={properties.page}
          limit={12}
          totalDocs={properties.totalDocs}
        />
      </div>

      <PropertyCollectionArchive properties={properties.docs} />

      <div className="container">
        {properties?.page && properties?.totalPages > 1 && (
          <Pagination page={properties.page} totalPages={properties.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Properties Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const featuredProperty = await getFeaturedProperty(payload)
  const { totalDocs } = await payload.count({
    collection: 'properties',
    overrideAccess: false,
    ...(featuredProperty
      ? {
          where: {
            id: {
              not_equals: featuredProperty.id,
            },
          },
        }
      : {}),
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
