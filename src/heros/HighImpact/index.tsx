'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { HeroSearchFilter } from '@/components/HeroSearchFilter'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const hasLinks = Array.isArray(links) && links.length > 0
  const hasRichText =
    richText &&
    typeof richText === 'object' &&
    'root' in richText &&
    Array.isArray(richText.root?.children) &&
    richText.root.children.length > 0

  return (
    <section className="relative w-full overflow-visible bg-slate-900 shadow-xl min-h-[90vh] lg:min-h-screen flex flex-col justify-between">
      {/* Main Full-Bleed Media Background */}
      <div className="absolute inset-0 z-0">
        {media && typeof media === 'object' ? (
          <Media
            fill
            imgClassName="object-cover object-center opacity-85 brightness-[0.75] rounded-none"
            priority
            resource={media}
          />
        ) : (
          <Image
            src="/hero-house-bg.webp"
            alt="Modern luxury estate architectural rendering"
            fill
            priority
            className="object-cover object-center opacity-85 brightness-[0.75] rounded-none"
          />
        )}
        {/* Subtle Gradient Wash Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />
      </div>

      {/* Hero Content Overlay - pt-12 adds minimal breathing room on small screens, drops on large viewports */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 sm:px-6 pt-12 pb-36 text-center text-white md:px-12 md:pb-48 lg:pb-60">
        {/* Tagline Anchor */}
        <div className="mb-6 flex items-center gap-2 rounded-none bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <div className="flex gap-0.5">
            <span className="h-3 w-[2px] bg-white transform skew-x-12 inline-block"></span>
            <span className="h-3 w-[2px] bg-white transform skew-x-12 inline-block"></span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase">Welcome to Home Unik</span>
        </div>

        {/* Core Header Text Elements */}
        {hasRichText ? (
          <div className="max-w-4xl text-center [&_h1]:text-3xl [&_h1]:sm:text-5xl [&_h1]:md:text-6xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:leading-tight [&_h1]:sm:leading-none [&_p]:mt-4 [&_p]:sm:mt-6 [&_p]:max-w-xl [&_p]:mx-auto [&_p]:text-xs [&_p]:sm:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-slate-200/90">
            <RichText data={richText} enableGutter={false} />
          </div>
        ) : (
          <>
            <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight sm:leading-none">
              Invest Today in <br />
              <span className="text-white">Your Dream Home</span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-200/90">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </>
        )}

        {/* Interaction Action Blocks */}
        {hasLinks ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            {links.map(({ link }, i) => {
              const isFirst = i === 0
              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance={isFirst ? 'default' : 'secondary'}
                  className={cn(
                    'h-12 px-8 text-sm font-semibold rounded-none w-full sm:w-auto flex justify-center items-center',
                    isFirst
                      ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                      : 'border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
                  )}
                />
              )
            })}
          </div>
        ) : (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              asChild
              className="h-12 rounded-none bg-accent px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent/90 w-full sm:w-auto"
            >
              <Link href="/posts">View Property</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-none border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 w-full sm:w-auto"
            >
              <Link href="/contact">Contact Now</Link>
            </Button>
          </div>
        )}
      </div>

      {/* --- FLOATING SEARCH FILTER BAR --- */}
      {/* Absolute positioning cleanly adapts across mobile and multi-column monitor widths */}
      <div className="absolute bottom-30 left-0 right-0 z-20 translate-y-1/2 px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <HeroSearchFilter />
        </div>
      </div>
    </section>
  )
}
