'use client'

import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-none text-sm font-semibold',
    'transition-all duration-200 ease-in-out',
    'cursor-pointer select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg:not([class*="size-"])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        // BRAND BUTTONS
        default: 'bg-accent text-white hover:bg-accent/90',

        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',

        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        // SOLID BUTTONS
        navy: 'bg-[#1e3a6a] text-white hover:bg-[#162d52]',

        orange: 'bg-[#f07e38] text-white hover:bg-[#dc6928]',

        white: 'bg-white text-[#1e3a6a] hover:bg-slate-100',

        black: 'bg-slate-950 text-white hover:bg-slate-800',

        // OUTLINE BUTTONS
        outline:
          'border border-border bg-transparent text-foreground hover:border-accent hover:bg-accent hover:text-white',

        'outline-primary':
          'border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',

        'outline-accent':
          'border border-accent bg-transparent text-accent hover:bg-accent hover:text-white',

        'outline-white':
          'border border-white bg-transparent text-white hover:bg-white hover:text-primary',

        'outline-dark':
          'border border-slate-900 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-white',

        // SOFT BACKGROUNDS
        soft: 'bg-accent/10 text-accent hover:bg-accent hover:text-white',

        'soft-primary': 'bg-primary/10 text-primary hover:bg-primary hover:text-white',

        'soft-secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/70',

        'soft-success': 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white',

        'soft-danger': 'bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white',

        // INTERACTIVE BUTTONS
        ghost: 'bg-transparent text-foreground hover:bg-secondary hover:text-accent',

        'ghost-primary': 'bg-transparent text-primary hover:bg-primary/10',

        'ghost-accent': 'bg-transparent text-accent hover:bg-accent/10',

        // PROPERTY / REAL ESTATE
        property: 'bg-primary text-white border-b-2 border-accent hover:bg-primary/90',

        'property-accent': 'bg-accent text-white border-b-2 border-primary hover:bg-accent/90',

        'property-outline':
          'border border-white/70 bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-primary',

        'property-light': 'bg-white text-primary shadow-sm hover:bg-secondary',

        // NAVIGATION
        nav: 'bg-transparent text-primary hover:bg-secondary',

        'nav-active': 'bg-primary text-white',

        'nav-outline': 'border border-border bg-transparent text-primary hover:border-primary',

        // CALL TO ACTION
        cta: 'bg-accent text-white shadow-md hover:bg-accent/90 hover:shadow-lg',

        'cta-outline':
          'border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-white',

        'cta-dark': 'bg-slate-950 text-white shadow-md hover:bg-slate-800',

        // SPECIAL
        muted: 'bg-muted text-muted-foreground hover:bg-muted/70',

        link: 'h-auto p-0 text-primary underline-offset-4 hover:text-accent hover:underline',

        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',

        success: 'bg-emerald-600 text-white hover:bg-emerald-700',

        warning: 'bg-amber-500 text-white hover:bg-amber-600',

        // TRANSPARENT / IMAGE OVERLAY
        transparent: 'bg-transparent text-white hover:bg-white/10',

        glass: 'border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',

        // INVERTED
        inverted: 'bg-white text-primary hover:bg-accent hover:text-white',
      },

      size: {
        clear: 'h-auto p-0',

        xs: 'h-7 px-2.5 text-[11px]',

        sm: 'h-9 px-4 text-xs',

        default: 'h-11 px-6 text-sm',

        lg: 'h-12 px-8 text-sm',

        xl: 'h-14 px-10 text-base',

        '2xl': 'h-16 px-12 text-base',

        full: 'h-12 w-full px-6',

        'full-lg': 'h-14 w-full px-8',

        icon: 'size-10 p-0',

        'icon-sm': 'size-8 p-0',

        'icon-lg': 'size-12 p-0',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
