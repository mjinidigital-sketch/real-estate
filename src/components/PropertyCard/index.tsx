'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Property } from '@/payload-types'

import { Media } from '@/components/Media'
import { Card, CardContent } from '@/components/ui/card'

export type PropertyCardData = Pick<
  Property,
  | 'slug'
  | 'category'
  | 'meta'
  | 'title'
  | 'price'
  | 'bedrooms'
  | 'bathrooms'
  | 'squareFootage'
  | 'status'
  | 'description'
  | 'city'
  | 'state'
  | 'features'
  | 'createdAt'
>

export const PropertyCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: PropertyCardData
  relationTo?: 'properties'
  showCategory?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({}) as { card: { ref: React.RefObject<HTMLDivElement> }, link: any }
  const { className, doc, relationTo = 'properties', showCategory, title: titleFromProps } = props

  const {
    slug,
    category,
    meta,
    title,
    price,
    bedrooms,
    bathrooms,
    squareFootage,
    status,
    description,
    city,
    state,
  } = doc || {}
  const { image: metaImage, description: metaDescription } = meta || {}

  const titleToUse = titleFromProps || title
  const descriptionText = metaDescription || (typeof description === 'string' ? description : '')
  const sanitizedDescription = descriptionText?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'for_sale':
      case 'sell':
        return { bg: 'bg-emerald-600', label: 'FOR SALE' }
      case 'for_rent':
      case 'rent':
        return { bg: 'bg-[#1e3a6a]', label: 'FOR RENT' }
      case 'sold':
        return { bg: 'bg-slate-500', label: 'SOLD' }
      case 'rented':
        return { bg: 'bg-slate-500', label: 'RENTED' }
      case 'pending':
        return { bg: 'bg-amber-500', label: 'PENDING' }
      default:
        return { bg: 'bg-slate-600', label: 'AVAILABLE' }
    }
  }

  const statusConfig = getStatusConfig(status || '')

  return (
    <Card
      className={cn(
        'group relative rounded-none border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#1e3a6a]',
        className,
      )}
      ref={card.ref}
    >
      {/* Top Banner Media Block */}
      <div className="relative w-full overflow-hidden h-52 bg-slate-100 shrink-0">
        {status && (
          <div
            className={cn(
              'absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black tracking-wider text-white rounded-none shadow-sm',
              statusConfig.bg,
            )}
          >
            {statusConfig.label}
          </div>
        )}

        {!metaImage && (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-400">
            No image available
          </div>
        )}

        {metaImage && typeof metaImage !== 'string' && (
          <Media
            fill
            imgClassName="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
            resource={metaImage}
            size="33vw"
          />
        )}
      </div>

      {/* Main Content Info Block */}
      <CardContent className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          {/* Header Metadata Flag Block */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {showCategory && category && typeof category === 'object' && (
              <span className="text-[11px] font-bold tracking-widest text-[#f07e38] uppercase">
                {category.title}
              </span>
            )}
            {(city || state) && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 ml-auto">
                <svg
                  xmlns="http://w3.org"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-3.5 h-3.5 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                {city}
                {state ? `, ${state}` : ''}
              </span>
            )}
          </div>

          {/* Headline Parameter Anchor */}
          {titleToUse && (
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-2">
              <Link
                className="hover:text-[#f07e38] transition-colors relative block focus:outline-none"
                href={href}
                ref={link.ref}
              >
                {titleToUse}
              </Link>
            </h3>
          )}

          {/* Explainer Summary Block */}
          {sanitizedDescription && (
            <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 ">
              {sanitizedDescription}
            </p>
          )}
        </div>

        {/* Bottom Utility Structure Panel */}
        <div className="flex flex-col gap-3">
          {/* Structural Specs Metric Toolbar */}
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-slate-700 border-t border-b border-slate-100 ">
            {bedrooms !== null && bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5h-1.5M3.75 8.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v1.875H3.75V8.125Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 10.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v1.875H9v-1.875Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 18v-6.75h16.5V18a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3.75 18Z"
                  />
                </svg>
                <span>
                  {bedrooms} <span className="text-slate-400 font-semibold">Beds</span>
                </span>
              </div>
            )}
            {bathrooms !== null && bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 15h9M3 18.75h18M4.5 15.75v-3a6.75 6.75 0 0 1 13.5 0v3m-12 0h10.5"
                  />
                </svg>
                <span>
                  {bathrooms} <span className="text-slate-400 font-semibold">Baths</span>
                </span>
              </div>
            )}
            {squareFootage !== null && squareFootage !== undefined && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0V16.5m16.5-12.75v16.5m0-16.5H12m8.25 16.5H3.75m16.5 0V12"
                  />
                </svg>
                <span>
                  {squareFootage.toLocaleString()}{' '}
                  <span className="text-slate-400 font-semibold">Sqft</span>
                </span>
              </div>
            )}
          </div>

          {/* --- INLINE BUTTON (LEFT) & PRICE (RIGHT) ROW --- */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Compact Action Button on the LEFT */}
            <div className="relative flex-shrink-0 overflow-hidden bg-[#f07e38]">
              {/* Overlay Layer: Applies brand blue at 70% opacity on card hover */}
              <div className="absolute inset-0 bg-[#1e3a6a]/0 group-hover:bg-primary transition-colors duration-300 pointer-events-none" />

              <Link
                className="not-prose relative z-10 inline-flex items-center justify-center text-white font-bold text-[11px] tracking-wider uppercase h-9 px-4 focus:outline-none rounded-none active:scale-[0.98] transition-transform duration-150"
                href={href}
                ref={link.ref}
              >
                View Details
              </Link>
            </div>

            {/* Typographic pricing on the RIGHT - Primary Brand Blue */}
            {price && (
              <div className="text-lg font-black tracking-tight text-[#1e3a6a] whitespace-nowrap">
                {formatPrice(price)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
