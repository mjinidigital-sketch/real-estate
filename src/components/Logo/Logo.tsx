'use client'

import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx(
        'relative inline-flex items-center pt-3 pb-1 px-2 cursor-pointer select-none',
        className,
      )}
    >
      {/* --- REAL ESTATE ROOF LINE (COMPACT OVERLAY CLOSER TO TEXT) --- */}
      <div className="absolute inset-x-0 top-0 w-full pointer-events-none z-10 text-primary">
        <svg
          xmlns="http://w3.org"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="w-full h-4.5 stroke-current"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Main Primary Roof Peak Line - brought down much closer horizontally */}
          <path d="M 1 17 L 22 2 L 99 2" />

          {/* Accent Secondary Horizon line closely mirroring the top layer */}
          <path d="M 6 18 L 22 5 L 94 5" className="text-accent opacity-95" strokeWidth="2" />

          {/* Tiny structural Chimney stack integrated tight into the left pitch */}
          <path d="M 9 11 V 4 H 13 V 7" strokeWidth="2" />
        </svg>
      </div>

      {/* --- BRAND TYPOGRAPHY & INTEGRATED INNER HOUSE ICON --- */}
      <div className="relative z-0 flex items-center gap-1.5 mt-0.5">
        {/* Compact Foundation House Icon */}
        <div className="relative h-6 w-6 text-primary shrink-0 flex items-center justify-center">
          <svg
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full"
          >
            {/* Lower structural support beams matching the tight roof fit */}
            <path d="M 4 5 V 21 H 20 V 5" />
            <path d="M 9 21 V 12 H 15 V 21" />
          </svg>
        </div>

        {/* Brand Main Typography Block */}
        <span className="text-2xl font-black tracking-tighter text-primary whitespace-nowrap leading-none">
          Home<span className="text-accent ml-0.5">Unik</span>
        </span>
      </div>
    </div>
  )
}
