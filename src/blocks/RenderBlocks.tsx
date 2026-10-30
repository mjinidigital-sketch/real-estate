import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PropertiesCardBlock } from '@/blocks/PropertiesCardBlock/Component'
import { AllPropertiesBlock } from '@/blocks/AllPropertiesBlock/Component'
import { FeaturedPropertiesBlock } from '@/blocks/FeaturedPropertiesBlock/Component'
import { FeatureCardsBlock } from '@/blocks/FeatureCards/Component'
import { FeatureImageLeftBlock } from '@/blocks/FeatureImageLeftBlock/Component'

const blockComponents = {
  allPropertiesBlock: AllPropertiesBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featureCards: FeatureCardsBlock,
  featuredPropertiesBlock: FeaturedPropertiesBlock,
  'feature-image-left': FeatureImageLeftBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  propertiesCardBlock: PropertiesCardBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={`site-block site-block--${blockType} my-16`} key={index}>
                  {/* @ts-expect-error - block types vary, some accept disableInnerContainer */}
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
