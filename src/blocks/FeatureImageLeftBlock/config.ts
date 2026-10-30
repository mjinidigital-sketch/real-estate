import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '../../fields/linkGroup'

export const FeatureImageLeft: Block = {
  slug: 'feature-image-left',
  interfaceName: 'FeatureImageLeftBlock',
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'About Home Unik',
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'featuresList',
      type: 'array',
      label: 'Key Features Grid',
      maxRows: 4,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Large Image',
    },
    {
      name: 'secondaryVideoImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Overlay Video Preview Image (Optional)',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Features Image Left Blocks',
    singular: 'Feature Image Left Block',
  },
}
