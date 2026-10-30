import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Update this path to match your generated types path from payload
import type { FeatureImageLeftBlock as FeatureBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Home, ShieldCheck, Sparkles, Trees, Play } from 'lucide-react'

// Map features checklist layout to consistent index icons from design image
const defaultIcons = [
  <Home className="text-accent h-5 w-5" key="0" />,
  <Sparkles className="text-accent h-5 w-5" key="1" />,
  <ShieldCheck className="text-accent h-5 w-5" key="2" />,
  <Trees className="text-accent h-5 w-5" key="3" />,
]

export const FeatureImageLeftBlock: React.FC<
  FeatureBlockProps & {
    id?: string
  }
> = ({ id, links, richText, badgeText, featuresList, mainImage, secondaryVideoImage }) => {
  const hasLinks = links && Array.isArray(links) && links.length > 0

  // Extract URLs dynamically handling both object expanding relationships or absolute strings
  const mainImgUrl =
    typeof mainImage === 'object' && mainImage !== null
      ? mainImage.url
      : '/assets/placeholder-main.jpg'
  const mainImgAlt =
    typeof mainImage === 'object' && mainImage !== null ? mainImage.alt : 'Real Estate Property'

  const videoImgUrl =
    typeof secondaryVideoImage === 'object' && secondaryVideoImage !== null
      ? secondaryVideoImage.url
      : '/assets/placeholder-video.jpg'

  return (
    <div
      className="site-feature-left-block relative overflow-hidden py-16 md:py-24 bg-background dark:bg-slate-950 border-b border-border"
      id={id ? `block-${id}` : undefined}
    >
      {/* Faded SVG Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid-pattern)"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT SIDE: Visuals Stack with Grid Pattern */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Decoupled Orange Dot Pattern Decoration */}
            <div
              className="absolute -top-6 -left-6 w-24 h-24 opacity-30 pointer-events-none hidden sm:block"
              style={{
                backgroundImage: 'radial-gradient(#f97316 2px, transparent 2px)',
                backgroundSize: '12px 12px',
              }}
            />

            {/* Main Image Frame */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden shadow-xl border border-border/40">
              <Image
                src={mainImgUrl || ''}
                alt={mainImgAlt || 'Premium Property Architecture'}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlapping Video Accent Thumbnail */}
            <div className="absolute bottom-[-20px] left-[-10px] sm:left-[-30px] w-1/2 aspect-[4/3] overflow-hidden border-4 border-background shadow-2xl pointer-events-none">
              <Image
                src={videoImgUrl || mainImgUrl || ''}
                alt="Video Tour Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white text-accent p-3 shadow-lg">
                  <Play className="h-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Typography Content & Dynamic Perks list */}
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
            {/* Minimal Dash Badge Header Layout */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="flex gap-0.5 text-accent font-extrabold">//</span>
              <span>{badgeText || 'About Home Unik'}</span>
            </div>

            {/* Heading Content Structure */}
            {richText ? (
              <div className="space-y-4">
                <RichText
                  className="mb-0 text-left [&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:tracking-tight [&>h1]:sm:text-4xl [&>h1]:md:text-5xl [&>h1]:text-primary [&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:sm:text-4xl [&>h2]:md:text-5xl [&>h2]:text-primary [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:text-base [&>p]:md:text-lg"
                  data={richText}
                  enableGutter={false}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-primary leading-tight">
                  The Leading Real Estate About Marketplace.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit.
                </p>
              </div>
            )}

            {/* Feature Check Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-2">
              {featuresList && featuresList.length > 0 ? (
                featuresList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-accent/5 p-2">
                      {defaultIcons[index % defaultIcons.length]}
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-primary/90">
                      {item.text}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  {[
                    'Smart Home Design',
                    'Exceptional Lifestyle',
                    'Complete 24/7 Security',
                    'Beautiful Scene Around',
                  ].map((text, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-accent/5 p-2">
                        {defaultIcons[index]}
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-primary/90">
                        {text}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Actions Links Wrapper Section */}
            <div className="pt-2 flex flex-row items-center justify-start">
              {hasLinks ? (
                links.map(({ link }, i) => {
                  const isFirst = i === 0
                  return (
                    <CMSLink
                      key={i}
                      size="lg"
                      className={
                        isFirst
                          ? 'bg-accent text-white font-bold shadow-md px-10 py-3.5'
                          : 'bg-background text-primary border border-border shadow-sm font-semibold px-10 py-3.5'
                      }
                      {...link}
                    />
                  )
                })
              ) : (
                <Button
                  size="lg"
                  className="bg-accent text-white font-bold shadow-md px-10 py-3.5 text-base"
                  asChild
                >
                  <Link href="/about">Read More</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
