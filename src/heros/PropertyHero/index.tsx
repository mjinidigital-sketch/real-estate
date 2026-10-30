import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Property } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const PropertyHero: React.FC<{
  property: Property
}> = ({ property }) => {
  const {
    category,
    heroImage,
    publishedAt,
    title,
    price,
    bedrooms,
    bathrooms,
    squareFootage,
    status,
    address,
    city,
    state,
    zipCode,
  } = property

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {category && typeof category === 'object' && (
              <div className="uppercase text-sm font-semibold bg-primary/80 px-3 py-1">
                {category.title}
              </div>
            )}
            {status && (
              <div
                className={cn(
                  'uppercase text-sm font-semibold px-3 py-1',
                  getStatusColor(status),
                )}
              >
                {statusLabel}
              </div>
            )}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-bold">{title}</h1>
          </div>

          {price && (
            <div className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              {formatPrice(price)}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6">
            {bedrooms !== null && bedrooms !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-90">Bedrooms</p>
                <p className="text-xl font-semibold">{bedrooms}</p>
              </div>
            )}
            {bathrooms !== null && bathrooms !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-90">Bathrooms</p>
                <p className="text-xl font-semibold">{bathrooms}</p>
              </div>
            )}
            {squareFootage !== null && squareFootage !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-90">Square Footage</p>
                <p className="text-xl font-semibold">{squareFootage.toLocaleString()} sqft</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium">
              {address}
            </p>
            <p className="text-sm opacity-90">
              {city}, {state} {zipCode}
            </p>
          </div>

          {publishedAt && (
            <div className="mt-6 flex flex-col gap-1">
              <p className="text-sm opacity-90">Listed</p>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
