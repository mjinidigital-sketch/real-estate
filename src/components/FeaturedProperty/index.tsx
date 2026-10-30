import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Property } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const FeaturedProperty: React.FC<{ property: Property }> = ({ property }) => {
  const {
    category,
    heroImage,
    meta,
    slug,
    title,
    price,
    bedrooms,
    bathrooms,
    squareFootage,
    status,
  } = property
  const featuredImage =
    heroImage && typeof heroImage === 'object'
      ? heroImage
      : meta?.image && typeof meta.image === 'object'
        ? meta.image
        : null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'for_sale':
        return 'bg-green-500'
      case 'for_rent':
        return 'bg-blue-500'
      case 'sold':
        return 'bg-gray-500'
      case 'rented':
        return 'bg-gray-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'off_market':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const statusLabel = status?.replace('_', ' ').toUpperCase() || 'AVAILABLE'

  if (!slug) return null

  return (
    <section
      aria-labelledby="featured-property-title"
      className="featured-property container mb-16"
    >
      <article className="featured-property__card relative overflow-hidden">
        <Link className="featured-property__link block" href={`/properties/${slug}`}>
          {featuredImage ? (
            <Media
              fill
              imgClassName="featured-property__image object-cover"
              pictureClassName="featured-property__picture"
              priority
              resource={featuredImage}
              size="(max-width: 768px) 100vw, 1200px"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="featured-property__overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />
          <div className="featured-property__content absolute bottom-0 left-0 right-0 p-8 text-white">
            <span className="featured-property__eyebrow inline-block px-3 py-1 bg-primary text-white text-sm font-semibold mb-4">
              Featured Property
            </span>

            {category && typeof category === 'object' && (
              <div className="featured-property__category uppercase text-sm font-medium mb-2 opacity-90">
                {category.title}
              </div>
            )}

            <h2
              id="featured-property-title"
              className="featured-property__title text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              {title}
            </h2>

            {price && (
              <div className="featured-property__price text-2xl md:text-3xl font-bold mb-4">
                {formatPrice(price)}
              </div>
            )}

            <div className="featured-property__details flex flex-wrap gap-6 text-sm md:text-base mb-4">
              {bedrooms !== null && bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{bedrooms}</span>
                  <span className="opacity-90">Bedrooms</span>
                </div>
              )}
              {bathrooms !== null && bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{bathrooms}</span>
                  <span className="opacity-90">Bathrooms</span>
                </div>
              )}
              {squareFootage !== null && squareFootage !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{squareFootage.toLocaleString()}</span>
                  <span className="opacity-90">Sq Ft</span>
                </div>
              )}
            </div>

            {status && (
              <div
                className={cn(
                  'inline-block px-3 py-1 text-xs font-semibold',
                  getStatusColor(status),
                )}
              >
                {statusLabel}
              </div>
            )}

            <div className="featured-property__cta mt-6 flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all">
              View Property Details
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </article>
    </section>
  )
}
