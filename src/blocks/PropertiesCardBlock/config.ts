import type { Block } from 'payload'

export const PropertiesCard: Block = {
  slug: 'propertiesCardBlock',
  interfaceName: 'PropertiesCardBlock',
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
            placeholder: 'e.g., Our Listings',
          },
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Description Text',
      admin: {
        placeholder: 'Explore the latest hand-picked real estate opportunities...',
      },
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
      defaultValue: 'properties',
      label: 'Collections To Show',
      options: [
        {
          label: 'Properties',
          value: 'properties',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'property-categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 12,
      label: 'Limit',
      min: 1,
      max: 100,
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: 'properties',
    },
  ],
  labels: {
    plural: 'Properties Card Blocks',
    singular: 'Properties Card Block',
  },
}
