import clsx from 'clsx'
import React from 'react'
import type { Property } from '@/payload-types'

import { PropertyCard } from '../../components/PropertyCard'
import Title from '@/components/Title'

export type RelatedPropertiesProps = {
  className?: string
  docs?: Property[]
}

export const RelatedProperties: React.FC<RelatedPropertiesProps> = (props) => {
  const { className, docs } = props

  return (
    <div className={clsx('lg:container', className)}>
      <Title mainTitle="Explore Similar Properties" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <PropertyCard key={index} doc={doc} relationTo="properties" showCategory />
        })}
      </div>
    </div>
  )
}
