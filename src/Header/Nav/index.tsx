'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/ui'

const defaultNavLinks = [
  { label: 'Home', url: '/' },
  { label: 'Services', url: '/services' },
  { label: 'About', url: '/about' },
  { label: 'Testimonial', url: '/testimonial' },
  { label: 'Blog', url: '/posts' },
]

export const HeaderNav: React.FC<{
  data?: HeaderType
  isMobile?: boolean
  onItemClick?: () => void
}> = ({ data, isMobile = false, onItemClick }) => {
  const pathname = usePathname()
  const navItems = data?.navItems && data.navItems.length > 0 ? data.navItems : null

  if (isMobile) {
    return (
      <nav className="flex flex-col gap-4 py-4 px-2 text-base font-semibold text-primary">
        {navItems
          ? navItems.map(({ link }, i) => {
              const href =
                link.type === 'reference' &&
                typeof link.reference?.value === 'object' &&
                link.reference.value.slug
                  ? `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`
                  : link.url || '/'
              const isActive = pathname === href

              return (
                <div key={i} onClick={onItemClick}>
                  <CMSLink
                    {...link}
                    appearance="inline"
                    className={cn(
                      'transition-colors hover:text-accent pb-1 inline-block',
                      isActive ? 'text-accent font-bold' : 'text-primary',
                    )}
                  />
                </div>
              )
            })
          : defaultNavLinks.map((item, i) => {
              const isActive = pathname === item.url
              return (
                <Link
                  key={i}
                  href={item.url}
                  onClick={onItemClick}
                  className={cn(
                    'transition-colors hover:text-accent pb-1 inline-block',
                    isActive ? 'text-accent font-bold' : 'text-primary',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
      </nav>
    )
  }

  return (
    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-primary">
      {navItems
        ? navItems.map(({ link }, i) => {
            const href =
              link.type === 'reference' &&
              typeof link.reference?.value === 'object' &&
              link.reference.value.slug
                ? `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`
                : link.url || '/'
            const isActive = pathname === href

            return (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={cn(
                  'transition-colors hover:text-accent pb-1',
                  isActive ? 'border-b-2 border-accent text-accent' : 'text-primary',
                )}
              />
            )
          })
        : defaultNavLinks.map((item, i) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={i}
                href={item.url}
                className={cn(
                  'transition-colors hover:text-accent pb-1',
                  isActive ? 'border-b-2 border-accent text-accent' : 'text-primary',
                )}
              >
                {item.label}
              </Link>
            )
          })}
    </nav>
  )
}
