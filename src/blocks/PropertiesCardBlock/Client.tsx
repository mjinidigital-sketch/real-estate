'use client'

import React, { useState } from 'react'

import { PropertyCollectionArchive } from '@/components/PropertyCollectionArchive'
import { HeroSearchFilter, FilterState } from '@/components/HeroSearchFilter'
import { type PropertyCardData } from '@/components/PropertyCard'

export const PropertiesCardBlockClient: React.FC<{
  properties: PropertyCardData[]
}> = ({ properties: initialProperties }) => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    dealType: '',
    propertyType: '',
    location: '',
    amenity: '',
  })

  const filteredProperties = initialProperties.filter((property) => {
    const matchKeyword =
      !filters.keyword ||
      property.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      property.meta?.description?.toLowerCase().includes(filters.keyword.toLowerCase())

    const matchDealType =
      !filters.dealType ||
      (filters.dealType === 'sell' && property.status === 'for_sale') ||
      (filters.dealType === 'rent' && property.status === 'for_rent')

    const matchPropertyType =
      !filters.propertyType ||
      (typeof property.category === 'object' &&
        property.category.title?.toLowerCase().includes(filters.propertyType.toLowerCase()))

    const matchLocation =
      !filters.location ||
      property.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      property.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
      `${property.city}, ${property.state}`.toLowerCase().includes(filters.location.toLowerCase())

    const matchAmenity =
      !filters.amenity ||
      property.features?.some((feature) =>
        feature.feature?.toLowerCase().includes(filters.amenity.toLowerCase()),
      )

    return matchKeyword && matchDealType && matchPropertyType && matchLocation && matchAmenity
  })

  return (
    <>
      <div className="container py-8 mb-8 bg-primary">
        <HeroSearchFilter onFilterChange={setFilters} />
      </div>
      <PropertyCollectionArchive properties={filteredProperties} />
    </>
  )
}
