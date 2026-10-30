import React from 'react'
import Link from 'next/link'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string
  }
> = ({ id, links, richText }) => {
  const hasLinks = links && Array.isArray(links) && links.length > 0

  return (
    <div
      className="site-cta-block relative overflow-hidden py-16 md:py-24 border-y border-border/50"
      id={id ? `block-${id}` : undefined}
    >
      {/* Brand Gradient: Deep Navy primary to Vibrant Orange accent into background */}
      <div className="from-primary/15 via-accent/10 to-background dark:from-primary/25 dark:via-accent/15 dark:to-background absolute inset-0 bg-gradient-to-r pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col items-center justify-center space-y-5 text-center">
          {/* Badge */}
          <div className="bg-background/80 inline-block rounded-none border border-border px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <Building2 className="text-accent h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Premium Real Estate
              </span>
            </div>
          </div>

          {/* Heading and Paragraph */}
          {richText ? (
            <div className="max-w-3xl space-y-2">
              <RichText
                className="mb-0 text-center [&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:tracking-tighter [&>h1]:sm:text-4xl [&>h1]:md:text-5xl [&>h1]:lg:text-6xl [&>h1]:text-primary [&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:tracking-tighter [&>h2]:sm:text-4xl [&>h2]:md:text-5xl [&>h2]:lg:text-6xl [&>h2]:text-primary [&>p]:text-muted-foreground [&>p]:mx-auto [&>p]:max-w-[700px] [&>p]:md:text-xl"
                data={richText}
                enableGutter={false}
              />
            </div>
          ) : (
            <div className="max-w-3xl space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-primary">
                Looking to Buy, Sell or Rent Property in Kenya?
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                Connect with trusted local agents, browse verified listings, and secure your dream
                home or investment today.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row items-center justify-center">
            {hasLinks ? (
              links.map(({ link }, i) => {
                const isFirst = i === 0
                return (
                  <CMSLink
                    key={i}
                    size="lg"
                    className={
                      isFirst
                        ? 'bg-accent hover:bg-accent/90 text-white font-bold rounded-none shadow-md px-8 py-3'
                        : 'bg-background/80 hover:bg-background text-primary border border-border shadow-sm backdrop-blur-sm rounded-none font-semibold px-8 py-3'
                    }
                    {...link}
                  />
                )
              })
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-bold rounded-none shadow-md px-8 py-3"
                  asChild
                >
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/80 hover:bg-background text-primary border border-border shadow-sm backdrop-blur-sm rounded-none font-semibold px-8 py-3"
                  asChild
                >
                  <Link href="/contact">Contact an Agent</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
