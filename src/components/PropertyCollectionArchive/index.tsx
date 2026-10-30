import { cn } from '@/utilities/ui'
import React from 'react'

import { PropertyCard, PropertyCardData } from '@/components/PropertyCard'
import { PropertyCardSkeleton } from '@/components/PropertyCard/PropertyCardSkeleton'

export type Props = {
  properties: PropertyCardData[]
  isLoading?: boolean
}

export const PropertyCollectionArchive: React.FC<Props> = (props) => {
  const { properties, isLoading } = props

  if (!isLoading && (!properties || properties.length === 0)) {
    return (
      <div className="property-collection-archive container py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No properties found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters to see more results.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('property-collection-archive container')}>
      <div>
        <div className="property-collection-archive__grid grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div className="col-span-4" key={`skeleton-${index}`}>
                  <PropertyCardSkeleton className="archive-card h-full" />
                </div>
              ))
            : properties?.map((result, index) => {
                if (typeof result === 'object' && result !== null) {
                  return (
                    <div className="col-span-4" key={result.slug || index}>
                      <PropertyCard
                        className="archive-card h-full"
                        doc={result}
                        relationTo="properties"
                        showCategory
                      />
                    </div>
                  )
                }

                return null
              })}
        </div>
      </div>
    </div>
  )
}
