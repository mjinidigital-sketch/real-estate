import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardContent } from '@/components/ui/card'

export const PropertyCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="relative w-full overflow-hidden aspect-[4/3]">
        <div className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-semibold text-white bg-gray-500 animate-pulse w-16 h-6 rounded" />
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
      <CardContent className="p-5">
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-20" />
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 w-3/4" />
        <div className="h-8 bg-gray-200 animate-pulse rounded mb-3 w-1/2" />
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
        </div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mt-1" />
      </CardContent>
    </Card>
  )
}
