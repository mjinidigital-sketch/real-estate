import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true, // Show all pages regardless of status
  })

  return NextResponse.json({
    total: pages.totalDocs,
    pages: pages.docs.map((page: any) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      _status: page._status,
      publishedAt: page.publishedAt,
    })),
  })
}
