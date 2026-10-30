import type { Block } from 'payload'

export const FeaturedProperties: Block = {
  slug: 'featuredPropertiesBlock',
  interfaceName: 'FeaturedPropertiesBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'mainTitle',
          type: 'text',
          required: true,
          label: 'Main Title',
          admin: {
            placeholder: 'e.g., Featured Properties',
          },
        },
        {
          name: 'subTitle',
          type: 'text',
          label: 'Subtitle / Kicker',
          admin: {
            placeholder: 'e.g., Hand-picked Selection',
          },
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Description Text',
      admin: {
        placeholder: 'Discover our exclusive collection of premium featured properties...',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'carousel',
      label: 'Layout Style',
      options: [
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Masonry',
          value: 'masonry',
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      label: 'Number of Properties',
      admin: {
        description: 'How many featured properties to display',
        step: 1,
      },
      min: 1,
      max: 12,
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      defaultValue: true,
      label: 'Auto-play Carousel',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'carousel',
      },
    },
  ],
  labels: {
    plural: 'Featured Properties Blocks',
    singular: 'Featured Properties Block',
  },
}
