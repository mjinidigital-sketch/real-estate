'use client'

import React, { useRef, useState } from 'react'
import {
  Fingerprint,
  Gauge,
  Globe,
  Laptop,
  Layers,
  Lock,
  RefreshCcw,
  Shield,
  Home,
  Building2,
  KeyRound,
  MapPin,
  Users,
  Star,
  CircleCheck,
  Award,
  Briefcase,
  ChartNoAxesCombined,
  type LucideIcon,
} from 'lucide-react'

import type { FeatureCardsBlock as FeatureCardsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

const iconMap: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  shield: Shield,
  globe: Globe,
  layers: Layers,
  refresh: RefreshCcw,
  gauge: Gauge,
  lock: Lock,
  laptop: Laptop,
  home: Home,
  building: Building2,
  key: KeyRound,
  'map-pin': MapPin,
  users: Users,
  star: Star,
  'check-circle': CircleCheck,
  award: Award,
  briefcase: Briefcase,
  chart: ChartNoAxesCombined,
}

const colorStyles: Record<string, string> = {
  blue: 'from-blue-500/15 to-purple-500/20 border-blue-500/20',
  purple: 'from-purple-500/15 to-pink-500/20 border-purple-500/20',
  green: 'from-green-500/15 to-emerald-500/20 border-emerald-500/20',
  orange: 'from-orange-500/15 to-red-500/20 border-orange-500/20',
  pink: 'from-pink-500/15 to-rose-500/20 border-pink-500/20',
  cyan: 'from-cyan-500/15 to-blue-500/20 border-cyan-500/20',
  amber: 'from-amber-500/15 to-orange-500/20 border-amber-500/20',
  navy: 'from-primary/10 to-primary/20 border-primary/20',
}

const iconColors: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  orange: 'text-orange-600 dark:text-orange-400',
  pink: 'text-rose-600 dark:text-rose-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  amber: 'text-amber-600 dark:text-amber-400',
  navy: 'text-primary',
}

type FeatureCardProps = {
  title: string
  description: string
  icon?: string | null
  color?: string | null
}

function FeatureCard({ feature, enable3D }: { feature: FeatureCardProps; enable3D: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const color = feature.color || 'blue'
  const Icon = iconMap[feature.icon || 'shield'] || Shield

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRotation({
      x: (y - rect.height / 2) / 18,
      y: (rect.width / 2 - x) / 18,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden',
        'border bg-gradient-to-br p-7 md:p-8',
        'rounded-none transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-xl',
        'motion-reduce:transform-none motion-reduce:transition-none',
        colorStyles[color] || colorStyles.blue,
      )}
      style={{
        transform: enable3D
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : undefined,
      }}
    >
      {/* Decorative Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/40 blur-3xl transition-transform duration-500 group-hover:scale-150"
      />

      {/* Icon */}
      <div className="relative mb-7 flex size-14 items-center justify-center border border-white/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
        <Icon className={cn('size-7', iconColors[color] || iconColors.blue)} strokeWidth={1.7} />
      </div>

      {/* Content */}
      <div className="relative mt-auto space-y-3">
        <h3 className="text-lg font-bold tracking-tight text-primary md:text-xl">
          {feature.title}
        </h3>

        <p className="text-sm leading-7 text-muted-foreground">{feature.description}</p>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
    </div>
  )
}

export const FeatureCardsBlock: React.FC<
  FeatureCardsBlockProps & {
    id?: string
  }
> = ({
  id,
  eyebrow,
  heading,
  description,
  alignment = 'center',
  columns = '4',
  enable3D = true,
  features,
  spacing = 'default',
}) => {
  const hasFeatures = features && features.length > 0

  if (!hasFeatures) return null

  const columnStyles: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  const spacingStyles: Record<string, string> = {
    compact: 'py-12 md:py-16',
    default: 'py-16 md:py-24',
    spacious: 'py-20 md:py-32',
  }

  return (
    <section
      id={id ? `block-${id}` : undefined}
      className={cn('w-full', spacingStyles[spacing || 'default'] || spacingStyles.default)}
    >
      <div className="container mx-auto max-w-7xl space-y-12 md:space-y-16">
        {/* Section Header */}
        <div
          className={cn(
            'space-y-5',
            alignment === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left',
          )}
        >
          {eyebrow && (
            <div
              className={cn('flex items-center gap-3', alignment === 'center' && 'justify-center')}
            >
              <span className="h-px w-8 bg-accent" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </span>

              <span className="h-px w-8 bg-accent" />
            </div>
          )}

          <h2 className="text-3xl font-black leading-tight tracking-tight text-primary md:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>

        {/* Feature Cards */}
        <div
          className={cn(
            'grid grid-cols-1 gap-5 md:gap-6',
            columnStyles[columns || '4'] || columnStyles['4'],
          )}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id || `${feature.title}-${index}`}
              feature={feature}
              enable3D={Boolean(enable3D)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
