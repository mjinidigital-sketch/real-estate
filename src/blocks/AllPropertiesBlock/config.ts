import type { Block } from 'payload'

export const AllProperties: Block = {
  slug: 'allPropertiesBlock',
  interfaceName: 'AllPropertiesBlock',
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
            placeholder: 'e.g., All Properties',
          },
        },
        {
          name: 'subTitle',
          type: 'text',
          label: 'Subtitle / Kicker',
          admin: {
            placeholder: 'e.g., Browse Our Collection',
          },
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Description Text',
      admin: {
        placeholder: 'Explore our complete collection of premium properties...',
      },
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      defaultValue: 12,
      label: 'Items Per Page',
      admin: {
        description: 'Number of properties to show per page',
        step: 1,
      },
      min: 1,
      max: 100,
    },
    {
      name: 'enableFilters',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Filters',
      admin: {
        description: 'Show search and filter options',
      },
    },
    {
      name: 'enableSorting',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Sorting',
      admin: {
        description: 'Show sorting options',
      },
    },
  ],
  labels: {
    plural: 'All Properties Blocks',
    singular: 'All Properties Block',
  },
}
