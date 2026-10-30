'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { type PropertyCardData } from '@/components/PropertyCard'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react'

export const FeaturedPropertiesBlockClient: React.FC<{
  properties: PropertyCardData[]
  layout: 'carousel' | 'grid' | 'masonry'
  limit: number
  autoPlay: boolean
}> = ({ properties, layout, limit, autoPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const featuredProperties = (properties || []).slice(0, limit)
  const totalSlides = featuredProperties.length
  const activeIndex = totalSlides > 0 ? ((currentIndex % totalSlides) + totalSlides) % totalSlides : 0

  // Auto-play for carousel
  useEffect(() => {
    if (layout === 'carousel' && autoPlay && !isPaused && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [layout, autoPlay, isPaused, totalSlides])

  const handlePrevious = () => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleNext = () => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const formatPrice = (price?: number | string | null) => {
    if (price === undefined || price === null || price === '') return 'Price on Request'
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return 'Price on Request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  // --- GRID & MASONRY CARD (Text placed cleanly UNDER picture, rounded-none) ---
  const GridCard = ({ property }: { property: PropertyCardData }) => {
    const { slug, title, price, meta, city, state, bedrooms, bathrooms, squareFootage, category, status } = property
    const cardImage = (meta?.image && typeof meta.image === 'object' && Object.keys(meta.image).length > 0) ? meta.image : null
    const categoryTitle = category && typeof category === 'object' && 'title' in category ? String(category.title) : null
    const formattedStatus = status ? status.replace(/_/g, ' ') : 'For Sale'

    return (
      <Link
        href={`/properties/${slug}`}
        className="group flex flex-col bg-card border border-border/70 hover:border-accent/60 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Image Container - Text is removed from picture */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted rounded-none">
          {cardImage && typeof cardImage !== 'string' ? (
            <Media
              fill
              imgClassName="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              resource={cardImage}
              size="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image available
            </div>
          )}

          {/* Clean Badges Only */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            {categoryTitle && (
              <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-sm">
                {categoryTitle}
              </span>
            )}
            <span className="px-2.5 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-sm ml-auto">
              {formattedStatus}
            </span>
          </div>
        </div>

        {/* Content placed below image - Pro real estate card styling */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
          <div>
            {/* Price Header */}
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className="text-2xl font-black text-primary tracking-tight">
                {formatPrice(price)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1 mb-2">
              {title}
            </h3>

            {/* Location */}
            {(city || state) && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground line-clamp-1">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>
                  {city}
                  {state ? `, ${state}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Specs Bar */}
          <div className="pt-3 border-t border-border/60">
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-accent shrink-0" />
                <span>{bedrooms ?? 0} Beds</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <Bath className="w-4 h-4 text-accent shrink-0" />
                <span>{bathrooms ?? 0} Baths</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Maximize className="w-4 h-4 text-accent shrink-0" />
                <span>{squareFootage ? `${squareFootage.toLocaleString()} sqft` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Action Button - Styled span avoids nested <button> inside <a> tag */}
          <span className="w-full mt-1 border border-border group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 font-semibold rounded-none py-2 px-4 flex items-center justify-center gap-2 text-sm text-foreground">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    )
  }

  // --- CAROUSEL SLIDE CARD (rounded-none) ---
  const CarouselCard = ({
    property,
    index,
    isActive,
  }: {
    property: PropertyCardData
    index: number
    isActive: boolean
  }) => {
    const { slug, title, price, meta, city, state, bedrooms, bathrooms, squareFootage, category } = property
    const cardImage = (meta?.image && typeof meta.image === 'object' && Object.keys(meta.image).length > 0) ? meta.image : null
    const categoryTitle = category && typeof category === 'object' && 'title' in category ? String(category.title) : null

    return (
      <div
        onClick={() => {
          if (!isActive) setCurrentIndex(index)
        }}
        className={`w-full transition-all duration-500 ease-out select-none ${
          isActive
            ? 'scale-100 opacity-100 z-10 shadow-2xl cursor-default'
            : 'scale-[0.88] opacity-50 hover:opacity-75 z-0 cursor-pointer'
        }`}
      >
        <div className="relative rounded-none overflow-hidden bg-card border border-border/80 shadow-lg group">
          {/* Main Visual */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-muted rounded-none">
            {cardImage && typeof cardImage !== 'string' ? (
              <Media
                fill
                imgClassName="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                resource={cardImage}
                size="(max-width: 768px) 90vw, 60vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}

            {/* Gradient Mask for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Top Bar Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              {categoryTitle && (
                <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-md">
                  {categoryTitle}
                </span>
              )}
              <span className="px-4 py-1.5 bg-accent text-white text-sm font-extrabold rounded-none shadow-md ml-auto">
                {formatPrice(price)}
              </span>
            </div>

            {/* Bottom Info Banner */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                {isActive ? (
                  <Link href={`/properties/${slug}`} className="hover:text-accent transition-colors block">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight line-clamp-1 drop-shadow-sm">
                      {title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight line-clamp-1 drop-shadow-sm">
                    {title}
                  </h3>
                )}

                {(city || state) && (
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span>
                      {city}
                      {state ? `, ${state}` : ''}
                    </span>
                  </div>
                )}

                {/* Specs */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-white/80 pt-1 font-medium">
                  {bedrooms !== null && bedrooms !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-accent" />
                      <span>{bedrooms} beds</span>
                    </div>
                  )}
                  {bathrooms !== null && bathrooms !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-accent" />
                      <span>{bathrooms} baths</span>
                    </div>
                  )}
                  {squareFootage !== null && squareFootage !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-4 h-4 text-accent" />
                      <span>{squareFootage.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>
              </div>

              {isActive && (
                <Link
                  href={`/properties/${slug}`}
                  className="shrink-0"
                >
                  <span className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-none px-6 py-2.5 shadow-lg transition-transform hover:scale-105 text-sm cursor-pointer">
                    <span>View Property</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (totalSlides === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-none">
        <p className="text-base font-medium">No featured properties available at this time.</p>
      </div>
    )
  }

  // --- CAROUSEL: 3 PICS VISIBLE, MIDDLE FULLY CENTERED ---
  if (layout === 'carousel') {
    return (
      <div
        className="featured-properties-carousel relative w-full overflow-hidden py-4 [--slide-width:82%] [--slide-gap:16px] md:[--slide-width:55%] md:[--slide-gap:24px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slider Track: centers the active slide while peeking previous & next on either side */}
        <div className="w-full overflow-hidden py-4">
          <div
            className="flex items-center"
            style={{
              gap: 'var(--slide-gap)',
              transform: `translateX(calc(50% - (var(--slide-width) / 2) - (${activeIndex} * (var(--slide-width) + var(--slide-gap)))))`,
              transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {featuredProperties.map((property, index) => (
              <div
                key={property.slug || index}
                className="shrink-0"
                style={{ width: 'var(--slide-width)' }}
              >
                <CarouselCard
                  property={property}
                  index={index}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrevious}
              aria-label="Previous Property"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-background/90 hover:bg-background text-foreground rounded-none shadow-2xl flex items-center justify-center transition-all hover:scale-110 border border-border/80 z-20 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Property"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-background/90 hover:bg-background text-foreground rounded-none shadow-2xl flex items-center justify-center transition-all hover:scale-110 border border-border/80 z-20 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {featuredProperties.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-none transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-accent'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // --- GRID VIEW: Clean Real Estate Cards with details under photo ---
  if (layout === 'grid') {
    return (
      <div className="featured-properties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {featuredProperties.map((property, index) => (
          <GridCard key={property.slug || index} property={property} />
        ))}
      </div>
    )
  }

  // --- MASONRY VIEW ---
  return (
    <div className="featured-properties-masonry columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
      {featuredProperties.map((property, index) => (
        <div key={property.slug || index} className="break-inside-avoid">
          <GridCard property={property} />
        </div>
      ))}
    </div>
  )
}
