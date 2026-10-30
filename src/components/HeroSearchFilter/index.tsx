'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FilterState {
  keyword: string
  dealType: string
  propertyType: string
  location: string
  amenity: string
}

export const HeroSearchFilter: React.FC<{ onFilterChange?: (filters: FilterState) => void }> = ({
  onFilterChange,
}) => {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    dealType: '',
    propertyType: '',
    location: '',
    amenity: '',
  })
  const [hasSearched, setHasSearched] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    // Build query parameters
    const params = new URLSearchParams()
    if (filters.keyword) params.append('keyword', filters.keyword)
    if (filters.dealType) params.append('dealType', filters.dealType)
    if (filters.propertyType) params.append('propertyType', filters.propertyType)
    if (filters.location) params.append('location', filters.location)
    if (filters.amenity) params.append('amenity', filters.amenity)

    // Navigate to properties page with filters
    const queryString = params.toString()
    router.push(`/properties${queryString ? `?${queryString}` : ''}`)

    if (onFilterChange) {
      onFilterChange(filters)
    }
  }

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      dealType: '',
      propertyType: '',
      location: '',
      amenity: '',
    }
    setFilters(resetFilters)
    setHasSearched(false)
    if (onFilterChange) {
      onFilterChange(resetFilters)
    }
  }

  const handleSelectChange = (field: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value === 'all' ? '' : value,
    }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  return (
    <div className=" relative w-full bg-primary p">
      {/* Outer Card Wrapper - Kept clean and elegant with subtle light border */}
      <div className="container mx-auto max-w-7xl rounded-none border border-slate-300 bg-card p-4 shadow-xl md:p-5">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-5 lg:grid-cols-6 items-center"
        >
          {/* Field 1: Keywords */}
          <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1 px-1 group">
            <Input
              type="text"
              value={filters.keyword}
              onChange={(e) => {
                const newFilters = { ...filters, keyword: e.target.value }
                setFilters(newFilters)
                if (onFilterChange) {
                  onFilterChange(newFilters)
                }
              }}
              placeholder="Enter keywords"
              className="w-full bg-transparent border-b border-transparent hover:border-primary focus-visible:border-primary text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0 rounded-none shadow-none transition-colors duration-150"
            />
          </div>

          {/* Field 2: Deal Strategy Selector */}
          <div className="flex flex-col gap-1.5 border-l border-slate-300 px-2">
            <Select
              value={filters.dealType || 'all'}
              onValueChange={(val) => handleSelectChange('dealType', val)}
            >
              <SelectTrigger className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 focus:ring-offset-0 h-10 px-1 rounded-none shadow-none transition-colors duration-150">
                <SelectValue placeholder="Sell or Rent" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-slate-200">
                <SelectItem value="all" className="rounded-none font-semibold focus:bg-accent">
                  Sell or Rent
                </SelectItem>
                <SelectItem value="sell" className="rounded-none font-semibold focus:bg-accent">
                  For Sale
                </SelectItem>
                <SelectItem value="rent" className="rounded-none font-semibold focus:bg-accent">
                  To Rent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field 3: Structural Layout Selector */}
          <div className="flex flex-col gap-1.5 border-l border-slate-300 px-2">
            <Select
              value={filters.propertyType || 'all'}
              onValueChange={(val) => handleSelectChange('propertyType', val)}
            >
              <SelectTrigger className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 focus:ring-offset-0 h-10 px-1 rounded-none shadow-none transition-colors duration-150">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-slate-200">
                <SelectItem value="all" className="rounded-none font-semibold focus:bg-accent">
                  Property Type
                </SelectItem>
                <SelectItem
                  value="apartment"
                  className="rounded-none font-semibold focus:bg-accent"
                >
                  Apartment
                </SelectItem>
                <SelectItem value="townhome" className="rounded-none font-semibold focus:bg-accent">
                  Townhome
                </SelectItem>
                <SelectItem value="bungalow" className="rounded-none font-semibold focus:bg-accent">
                  Bungalow
                </SelectItem>
                <SelectItem value="villa" className="rounded-none font-semibold focus:bg-accent">
                  Luxury Villa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field 4: Location Matrix Selector */}
          <div className="flex flex-col gap-1.5 border-l border-slate-300 px-2">
            <Select
              value={filters.location || 'all'}
              onValueChange={(val) => handleSelectChange('location', val)}
            >
              <SelectTrigger className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 focus:ring-offset-0 h-10 px-1 rounded-none shadow-none transition-colors duration-150">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-slate-200">
                <SelectItem value="all" className="rounded-none font-semibold focus:bg-accent">
                  Location
                </SelectItem>
                <SelectItem value="nairobi" className="rounded-none font-semibold focus:bg-accent">
                  Nairobi
                </SelectItem>
                <SelectItem value="mombasa" className="rounded-none font-semibold focus:bg-accent">
                  Mombasa
                </SelectItem>
                <SelectItem value="kisumu" className="rounded-none font-semibold focus:bg-accent">
                  Kisumu
                </SelectItem>
                <SelectItem value="nakuru" className="rounded-none font-semibold focus:bg-accent">
                  Nakuru
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field 5: Internal Amenities Selector */}
          <div className="flex flex-col gap-1.5 border-l border-slate-300 px-2">
            <Select
              value={filters.amenity || 'all'}
              onValueChange={(val) => handleSelectChange('amenity', val)}
            >
              <SelectTrigger className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 focus:ring-offset-0 h-10 px-1 rounded-none shadow-none transition-colors duration-150">
                <SelectValue placeholder="Amenities" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-slate-200">
                <SelectItem value="all" className="rounded-none font-semibold focus:bg-accent">
                  Amenities
                </SelectItem>
                <SelectItem value="pool" className="rounded-none font-semibold focus:bg-accent">
                  Pool
                </SelectItem>
                <SelectItem value="garden" className="rounded-none font-semibold focus:bg-accent">
                  Garden
                </SelectItem>
                <SelectItem value="parking" className="rounded-none font-semibold focus:bg-accent">
                  Parking
                </SelectItem>
                <SelectItem value="gym" className="rounded-none font-semibold focus:bg-accent">
                  Gym
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Action Button */}
          <div className="col-span-2 md:col-span-5 lg:col-span-1 pt-2 lg:pt-0 flex gap-2">
            <Button
              type="submit"
              className="flex-1 h-12 flex items-center justify-center rounded-none bg-accent font-bold shadow-md transition-all hover:bg-accent/90 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-12 px-4 flex items-center justify-center rounded-none border-2 border-slate-300 font-bold shadow-sm transition-all cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
