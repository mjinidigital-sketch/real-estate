'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { PropertyCollectionArchive } from '@/components/PropertyCollectionArchive'
import { HeroSearchFilter, FilterState } from '@/components/HeroSearchFilter'
import { type PropertyCardData } from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'

const AllPropertiesBlockContent: React.FC<{
  properties: PropertyCardData[]
  itemsPerPage: number
  enableFilters: boolean
  enableSorting: boolean
}> = ({ properties: initialProperties, itemsPerPage, enableFilters, enableSorting }) => {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    dealType: '',
    propertyType: '',
    location: '',
    amenity: '',
  })
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Initialize filters from URL search params
  useEffect(() => {
    const initialFilters: FilterState = {
      keyword: searchParams.get('keyword') || '',
      dealType: searchParams.get('dealType') || '',
      propertyType: searchParams.get('propertyType') || '',
      location: searchParams.get('location') || '',
      amenity: searchParams.get('amenity') || '',
    }
    setFilters(initialFilters)
  }, [searchParams])

  // Filter properties
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((property) => {
      const matchKeyword =
        !filters.keyword ||
        property.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        property.meta?.description?.toLowerCase().includes(filters.keyword.toLowerCase())

      const matchDealType =
        !filters.dealType ||
        (filters.dealType === 'sell' && (property.status === 'for_sale' || property.status === 'sell')) ||
        (filters.dealType === 'rent' && (property.status === 'for_rent' || property.status === 'rent'))

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
        property.features?.some((feature) => {
          const featureText = typeof feature === 'string' ? feature : (feature as any).feature
          return featureText && featureText.toLowerCase().includes(filters.amenity.toLowerCase())
        })

      return matchKeyword && matchDealType && matchPropertyType && matchLocation && matchAmenity
    })
  }, [initialProperties, filters])

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties]

    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'title-asc':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'title-desc':
        sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'newest':
      default:
        // Sort by publishedAt or createdAt
        sorted.sort((a, b) => {
          const dateA = new Date((a as any).publishedAt || (a as any).createdAt || 0).getTime()
          const dateB = new Date((b as any).publishedAt || (b as any).createdAt || 0).getTime()
          return dateB - dateA
        })
        break
    }

    return sorted
  }, [filteredProperties, sortOption])

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProperties = sortedProperties.slice(startIndex, endIndex)

  // Reset page when filters or sort changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortOption])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({
      keyword: '',
      dealType: '',
      propertyType: '',
      location: '',
      amenity: '',
    })
    setSortOption('newest')
  }

  return (
    <div className="all-properties-block">
      {/* Filters Section */}
      {enableFilters && (
        <div className="container py-8 mb-8 bg-primary">
          <HeroSearchFilter onFilterChange={handleFilterChange} />
        </div>
      )}

      {/* Sort and Results Info */}
      <div className="container mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedProperties.length} of {sortedProperties.length} properties
          </p>

          {enableSorting && (
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-medium text-foreground">
                Sort by:
              </label>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-[180px] rounded-none border-slate-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-300">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="title-asc">Title: A to Z</SelectItem>
                  <SelectItem value="title-desc">Title: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {(filters.keyword || filters.dealType || filters.propertyType || filters.location || filters.amenity) && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="mt-2 rounded-none border-slate-300 hover:bg-slate-50"
          >
            Reset All Filters
          </Button>
        )}
      </div>

      {/* Properties Grid */}
      <PropertyCollectionArchive properties={paginatedProperties} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container mt-12 mb-8">
          <div className="flex justify-center items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="rounded-none border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={`rounded-none ${
                      currentPage === page
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </Button>
                )
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page} className="px-2 text-muted-foreground">...</span>
              }
              return null
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="rounded-none border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* No Results */}
      {sortedProperties.length === 0 && (
        <div className="container py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No properties found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms to see more results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export const AllPropertiesBlockClient: React.FC<{
  properties: PropertyCardData[]
  itemsPerPage: number
  enableFilters: boolean
  enableSorting: boolean
}> = ({ properties, itemsPerPage, enableFilters, enableSorting }) => {
  return (
    <Suspense fallback={<div className="container py-8">Loading properties...</div>}>
      <AllPropertiesBlockContent
        properties={properties}
        itemsPerPage={itemsPerPage}
        enableFilters={enableFilters}
        enableSorting={enableSorting}
      />
    </Suspense>
  )
}
