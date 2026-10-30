'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Property } from '@/payload-types'
import RichText from '@/components/RichText'
import { RelatedProperties } from '@/blocks/RelatedProperties/Component'
import {
  ArrowLeft,
  MapPin,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
  Building2,
  ShieldCheck,
  Calendar,
  Eye,
  Trees,
  Car,
  Clock,
  Phone,
  Check,
  Home,
} from 'lucide-react'

interface PropertyViewProps {
  property: Property
}

// Fallback high-res real-estate pictures matching the reference screenshot design
const FALLBACK_GALLERY = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
]

function getImageUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media.url) {
    const url = media.url as string
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`
  }
  return null
}

export const PropertyView: React.FC<PropertyViewProps> = ({ property }) => {
  const {
    title,
    price,
    bedrooms,
    bathrooms,
    squareFootage,
    yearBuilt,
    lotSize,
    garage,
    address,
    city,
    state,
    zipCode,
    country,
    neighborhood,
    features,
    nearbyPlaces,
    contactName,
    contactPhone,
    gallery,
    heroImage,
    category,
    status,
    description,
    latitude,
    longitude,
    relatedProperties,
  } = property

  // Build complete list of images
  const allImages: string[] = []

  const heroUrl = getImageUrl(heroImage)
  if (heroUrl) allImages.push(heroUrl)

  if (gallery && gallery.length > 0) {
    gallery.forEach((item) => {
      const gUrl = getImageUrl(item.image)
      if (gUrl && !allImages.includes(gUrl)) {
        allImages.push(gUrl)
      }
    })
  }

  // Ensure 5 distinct photos are available
  if (allImages.length === 0) {
    allImages.push(...FALLBACK_GALLERY)
  } else {
    let fallbackIdx = 0
    while (allImages.length < 5 && fallbackIdx < FALLBACK_GALLERY.length) {
      if (!allImages.includes(FALLBACK_GALLERY[fallbackIdx])) {
        allImages.push(FALLBACK_GALLERY[fallbackIdx])
      }
      fallbackIdx++
    }
  }

  // Interactive gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Interactive states
  const [isSaved, setIsSaved] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'school' | 'shop' | 'commute'>('map')
  const [selectedDate, setSelectedDate] = useState('24 Jul, 2024')
  const [selectedTime, setSelectedTime] = useState('12:30 pm')
  const [tourScheduled, setTourScheduled] = useState(false)
  const [infoRequested, setInfoRequested] = useState(false)

  // Carousel controls
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  // Share action
  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title || 'Property Listing',
            url: window.location.href,
          })
          return
        } catch {
          // ignore or fallback
        }
      }
      await navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(p)
  }

  const displayPrice = price ? formatPrice(price) : '$1,13,200'
  const estimatedDownPayment = price ? formatPrice(Math.round(price * 0.18)) : '$20,216'

  const categoryTitle =
    category && typeof category === 'object' && 'title' in category ? category.title : 'Townhomes'

  const formattedStatus =
    status === 'for_rent'
      ? 'For Rent'
      : status === 'sold'
        ? 'Sold'
        : status === 'pending'
          ? 'Pending'
          : status === 'rented'
            ? 'Rented'
            : 'For sale'

  const fullAddress = [
    address || '1901 Hermitage Dr',
    city || 'Shiloh',
    state || 'Hawaii',
    zipCode || '81053',
    country && country !== 'USA' ? country : null,
  ]
    .filter(Boolean)
    .join(', ')

  const sideThumbnails = allImages.slice(1, 5)

  return (
    <div className="bg-background min-h-screen text-foreground pb-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* ================= PROPERTY BREADCRUMB ================= */}
        <nav aria-label="Breadcrumb" className="mb-5 min-w-0 border-b border-border pb-4 sm:mb-6">
          <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm">
            {/* Home */}
            <li className="flex shrink-0 items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </li>

            <li aria-hidden="true" className="shrink-0 text-muted-foreground/60">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>

            {/* Properties */}
            <li className="flex shrink-0 items-center">
              <Link
                href="/properties"
                className="font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                Properties
              </Link>
            </li>

            <li aria-hidden="true" className="shrink-0 text-muted-foreground/60">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>

            {/* Current property */}
            <li aria-current="page" className="flex min-w-0 flex-1 items-center">
              <span className="truncate font-semibold text-primary">
                {title || 'Property Details'}
              </span>
            </li>

            {/* Back to search */}
            <li className="ml-auto flex shrink-0 items-center">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-semibold text-primary transition-colors hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Search</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </li>
          </ol>
        </nav>

        {/* Header: Title, Address, Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:5xl font-bold tracking-tight text-foreground">
                {title || 'Minimal looking apartment, London, Uk'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-bold bg-primary text-primary-foreground">
                {formattedStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{fullAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-card border border-border rounded-none hover:bg-secondary shadow-2xs transition cursor-pointer"
              title="Share property"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-none shadow-2xs transition cursor-pointer ${
                isSaved
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-card border-border text-foreground hover:bg-secondary'
              }`}
              title="Save property"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                }`}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* ================= PROPERTY GALLERY ================= */}
        <section aria-label="Property photo gallery" className="mb-8 w-full min-w-0 sm:mb-10">
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-3 xl:gap-4">
            {/* Main image — matches the complete height of the thumbnail grid */}
            <div className="group relative isolate aspect-[4/3] min-w-0 overflow-hidden border border-border bg-secondary sm:aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:h-[500px] xl:h-[560px]">
              <Image
                src={allImages[activeImageIndex] || FALLBACK_GALLERY[0]}
                alt={`${title || 'Property'} — photo ${activeImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Gallery label */}
              <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 border border-white/20 bg-primary/85 px-3 py-2 text-xs font-semibold tracking-wide text-white shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
                <span className="h-2 w-2 bg-accent" />
                PROPERTY PHOTOS
              </div>

              {/* Previous */}
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="View previous property photo"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-primary/80 text-white shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-5 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="View next property photo"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-primary/80 text-white shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-5 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 z-10 border border-white/20 bg-primary/85 px-3 py-2 text-xs font-semibold tabular-nums text-white backdrop-blur-sm sm:bottom-5 sm:right-5">
                <span className="text-accent">{String(activeImageIndex + 1).padStart(2, '0')}</span>
                <span className="mx-2 text-white/50">/</span>
                {String(allImages.length).padStart(2, '0')}
              </div>
            </div>

            {/* Four equal-height thumbnails — shared height with the main image */}
            <div className="grid min-w-0 grid-cols-2 gap-3 lg:col-span-5 lg:h-[500px] lg:grid-rows-2 lg:gap-3 xl:h-[560px] xl:gap-4">
              {sideThumbnails.slice(0, 4).map((imgUrl, idx) => {
                const originalIndex = idx + 1
                const isActive = activeImageIndex === originalIndex
                const isLast = idx === 3 && allImages.length > 5
                const remainingCount = allImages.length - 5

                return (
                  <button
                    key={`${imgUrl}-${originalIndex}`}
                    type="button"
                    onClick={() => setActiveImageIndex(originalIndex)}
                    aria-label={`View property photo ${originalIndex + 1}`}
                    aria-pressed={isActive}
                    className={`group relative block h-full min-h-0 min-w-0 overflow-hidden border bg-secondary text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      isActive
                        ? 'border-accent ring-2 ring-accent ring-inset'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${title || 'Property'} — photo ${originalIndex + 1}`}
                      fill
                      sizes="(max-width: 1023px) 50vw, 21vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Active image indicator */}
                    {isActive && (
                      <span className="absolute left-3 top-3 z-10 flex items-center gap-2 bg-accent px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <span className="h-1.5 w-1.5 bg-white" />
                        Selected
                      </span>
                    )}

                    {/* Remaining photos overlay */}
                    {isLast && remainingCount > 0 && (
                      <span className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-primary/80 text-center text-white transition-colors group-hover:bg-primary/90">
                        <span className="text-3xl font-semibold tracking-tight sm:text-4xl">
                          +{remainingCount}
                        </span>
                        <span className="text-xs font-medium tracking-wide">MORE PHOTOS</span>
                      </span>
                    )}
                  </button>
                )
              })}

              {/* Fill missing slots to preserve the balanced grid */}
              {Array.from({
                length: Math.max(0, 4 - sideThumbnails.slice(0, 4).length),
              }).map((_, idx) => (
                <div
                  key={`gallery-empty-${idx}`}
                  aria-hidden="true"
                  className="relative hidden h-full min-h-0 min-w-0 overflow-hidden border border-dashed border-border bg-secondary/50 lg:block"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs leading-relaxed text-muted-foreground">
                    More property photos coming soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTENT & SIDEBAR SECTION (BELOW GALLERY) ================= */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* LEFT COLUMN: Property Details & Community */}
          <div className="min-w-0 space-y-8 lg:col-span-8">
            {/* Price & Specs Header */}
            <div className="pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-1">
                <span className="w-1.5 h-1.5 rounded-none bg-accent" />
                <span>{formattedStatus}</span>
              </div>

              <div className="flex items-baseline gap-2 mb-0.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {displayPrice}
                </h2>
              </div>

              <p className="text-xs text-muted-foreground font-medium mb-3">
                Down payment{' '}
                <span className="font-semibold text-foreground">{estimatedDownPayment}</span>
              </p>

              {/* Specs Icons (Bed, Bath, Sqft, Garage) */}
              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{bedrooms ?? 2} Bed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{bathrooms ?? 2} Bath</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{squareFootage ? `${squareFootage.toLocaleString()}sqf` : '1420sqf'}</span>
                </div>
                {garage !== null && garage !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{garage} Garage</span>
                  </div>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Overview</h3>
              {description ? (
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <RichText data={description} enableGutter={false} />
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The undercroft comprises 4 self-contained units of varying size. The units have
                  separate secured access, from a central private access road at lower ground level.
                  The property benefits from easy access road routes through to a central
                  pedestrianised area, within which the IMAX Multiplex Cinema is situated. The
                  accommodation is unheated.{' '}
                  <span className="font-bold text-foreground cursor-pointer hover:underline">
                    Read More
                  </span>
                </p>
              )}
            </div>

            {/* Highlights Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Highlights</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. Type */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">Type</div>
                    <div className="text-xs font-bold text-foreground">{categoryTitle}</div>
                  </div>
                </div>

                {/* 2. HOA */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">HOA</div>
                    <div className="text-xs font-bold text-foreground">No HOA Fee</div>
                  </div>
                </div>

                {/* 3. Building Year */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      Building Year
                    </div>
                    <div className="text-xs font-bold text-foreground">{yearBuilt || '2002'}</div>
                  </div>
                </div>

                {/* 4. Outside */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">Outside</div>
                    <div className="text-xs font-bold text-foreground">
                      {neighborhood ? `${neighborhood}` : 'City View'}
                    </div>
                  </div>
                </div>

                {/* 5. Garden */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">Garden</div>
                    <div className="text-xs font-bold text-foreground">
                      {lotSize ? `${lotSize.toLocaleString()} sqft` : 'Available'}
                    </div>
                  </div>
                </div>

                {/* 6. Parking */}
                <div className="p-3 rounded-none border border-border bg-secondary/60 flex items-center gap-3">
                  <div className="p-2 rounded-none bg-card shadow-2xs text-primary">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground">Parking</div>
                    <div className="text-xs font-bold text-foreground">
                      {garage ? `${garage} Spaces` : 'Available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Information Cards Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Local Information</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* School */}
                <div className="p-2.5 rounded-none border border-border bg-card hover:border-accent/40 hover:shadow-2xs transition group">
                  <div className="relative h-18 w-full rounded-none overflow-hidden mb-2 bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80"
                      alt="Local Schools"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground">School</div>
                  <div className="text-[10px] text-accent font-semibold mt-0.5">Top Rated 9/10</div>
                </div>

                {/* Crime */}
                <div className="p-2.5 rounded-none border border-border bg-card hover:border-accent/40 hover:shadow-2xs transition group">
                  <div className="relative h-18 w-full rounded-none overflow-hidden mb-2 bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80"
                      alt="Crime & Safety"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground">Crime</div>
                  <div className="text-[10px] text-primary font-semibold mt-0.5">Low Incident</div>
                </div>

                {/* Community */}
                <div className="p-2.5 rounded-none border border-border bg-card hover:border-accent/40 hover:shadow-2xs transition group">
                  <div className="relative h-18 w-full rounded-none overflow-hidden mb-2 bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"
                      alt="Healthcare and Community"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground">Community</div>
                  <div className="text-[10px] text-accent font-semibold mt-0.5">WalkScore 88</div>
                </div>

                {/* Environment */}
                <div className="p-2.5 rounded-none border border-border bg-card hover:border-accent/40 hover:shadow-2xs transition group">
                  <div className="relative h-18 w-full rounded-none overflow-hidden mb-2 bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80"
                      alt="Parks & Environment"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground">Environment</div>
                  <div className="text-[10px] text-primary font-semibold mt-0.5">
                    Clean Air & Parks
                  </div>
                </div>
              </div>

              {/* Nearby Places from Payload */}
              {nearbyPlaces && nearbyPlaces.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyPlaces.map((place, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-none bg-secondary/50 border border-border text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-none bg-accent" />
                          <span className="font-semibold text-foreground">{place.name}</span>
                          {place.type && (
                            <span className="text-[10px] text-muted-foreground capitalize">
                              ({place.type.replace('_', ' ')})
                            </span>
                          )}
                        </div>
                        {place.distance && (
                          <span className="font-bold text-accent text-[11px]">
                            {place.distance}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features & Amenities Checklist */}
            {features && features.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-border">
                <h3 className="text-base font-bold text-foreground">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-foreground"
                    >
                      <div className="w-3.5 h-3.5 rounded-none bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Location Information Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Location Information</h3>

              {/* Tabs */}
              <div className="flex min-w-0 flex-wrap gap-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-3 py-1 rounded-none transition cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setActiveTab('school')}
                  className={`px-3 py-1 rounded-none transition cursor-pointer ${
                    activeTab === 'school'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  School
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-3 py-1 rounded-none transition cursor-pointer ${
                    activeTab === 'shop'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  Shop & Restaurant
                </button>
                <button
                  onClick={() => setActiveTab('commute')}
                  className={`px-3 py-1 rounded-none transition cursor-pointer ${
                    activeTab === 'commute'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  Commute location
                </button>
              </div>

              {/* Map Card */}
              <div className="relative isolate h-[280px] w-full min-w-0 overflow-hidden rounded-none border border-border bg-secondary/30 shadow-sm sm:h-[340px] lg:h-[380px]">
                {latitude && longitude ? (
                  <iframe
                    title="Property Map Location"
                    width="100%"
                    height="100%"
                    className="absolute inset-0 block h-full w-full border-0"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      Number(longitude) - 0.012
                    }%2C${Number(latitude) - 0.008}%2C${Number(longitude) + 0.012}%2C${
                      Number(latitude) + 0.008
                    }&layer=mapnik&marker=${latitude}%2C${longitude}`}
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-secondary/40">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-none bg-accent/20 animate-ping" />
                        <div className="w-16 h-16 rounded-none bg-accent/20 flex items-center justify-center border border-accent/40">
                          <div className="w-7 h-7 rounded-none bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 bg-card/95 backdrop-blur-xs px-2.5 py-0.5 rounded-none text-[11px] font-semibold text-foreground shadow-xs border border-border">
                        {fullAddress}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Cards (Request a tour & Agent Information) */}
          <aside className="min-w-0 space-y-5 lg:col-span-4 lg:sticky lg:top-6">
            {/* Request a Tour — kept at the top of the right-hand column below the gallery */}
            <div className="min-w-0 border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    Interested?
                  </p>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Request a tour
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Choose a convenient date and time to arrange a property viewing.
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent/25 bg-accent/10 text-accent">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              {/* Date & Time Selectors */}
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <label className="min-w-0 border border-border bg-background p-3 transition-colors focus-within:border-accent">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Preferred date
                  </span>
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    aria-label="Preferred tour date"
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>

                <label className="min-w-0 border border-border bg-background p-3 transition-colors focus-within:border-accent">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Preferred time
                  </span>
                  <input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    aria-label="Preferred tour time"
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setTourScheduled(true)}
                  className="w-full border border-accent bg-accent px-4 py-3 text-sm font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-px cursor-pointer"
                >
                  {tourScheduled ? '✓ Tour Scheduled!' : 'Schedule a Tour'}
                </button>

                <button
                  onClick={() => setInfoRequested(true)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                >
                  {infoRequested ? '✓ Information Requested' : 'Request Info'}
                </button>
              </div>
            </div>

            {/* Card 2: Agent Information */}
            <div className="border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold tracking-tight text-foreground">
                Agent Information
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5 mb-4">
                Get an insight of the house from agent
              </p>

              {/* Agent Profile Row */}
              <div className="flex items-center gap-3 pb-3.5 border-b border-border">
                <div className="relative w-12 h-12 rounded-none overflow-hidden bg-secondary shrink-0 border border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
                    alt={contactName || 'Property agent'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    {contactName || 'Danial Doe'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Exquisite Properties, LLC | {state || 'London'}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="inline-block px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-primary text-primary-foreground">
                      Top Rated
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-accent text-accent-foreground">
                      Top Agent
                    </span>
                  </div>
                </div>
              </div>

              {/* Agent Details & Contact */}
              <div className="pt-3 space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium text-[11px]">License</span>
                  <div className="font-bold text-foreground">Number: #580073</div>
                </div>

                <div>
                  <span className="text-muted-foreground font-medium text-[11px]">Contact</span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{contactPhone || '+000 1234 123 123'}</span>
                  </div>
                </div>
              </div>

              {/* Contact CTA Button */}
              <a
                href={`tel:${contactPhone || '+0001234123123'}`}
                className="mt-4 w-full py-2 px-4 rounded-none font-bold text-xs bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Now</span>
              </a>
            </div>
          </aside>
        </div>

        {/* Similar Properties Section */}
        {relatedProperties && relatedProperties.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <RelatedProperties
              docs={relatedProperties.filter((p): p is Property => typeof p === 'object')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyView
