import React from 'react'

interface TitleProps {
  mainTitle: string
  subTitle?: string
  text?: string
  className?: string
  isPageTitle?: boolean
  showDivider?: boolean
  compact?: boolean
}

export default function Title({
  mainTitle,
  subTitle,
  text,
  className = '',
  isPageTitle = false,
  showDivider = true,
  compact = false,
}: TitleProps) {
  const HeadingTag = isPageTitle ? 'h1' : 'h2'

  return (
    <div
      className={`flex flex-col items-center text-center px-4 max-w-3xl mx-auto ${compact ? 'my-4 space-y-1' : 'my-8 space-y-3'} ${className}`}
    >
      {/* Subtitle / Kicker */}
      {subTitle && (
        <span className="text-xs sm:text-sm font-bold tracking-widest text-accent uppercase bg-accent/10 dark:bg-accent/20 px-3 py-1 rounded-full mb-1">
          {subTitle}
        </span>
      )}

      {/* Main Heading */}
      <HeadingTag className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl lg:leading-tight">
        {mainTitle}
      </HeadingTag>

      {/* Divider Accent line */}
      {showDivider && <div className="h-1 w-12 bg-accent rounded-full my-2 animate-fade-in" />}

      {/* Description Text */}
      {text && (
        <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl pt-1">
          {text}
        </p>
      )}
    </div>
  )
}
