import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProperty } from './hooks/revalidateProperty'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    status: true,
    featured: true,
    bedrooms: true,
    bathrooms: true,
    squareFootage: true,
    category: {
      id: true,
      title: true,
    },
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'status', 'price', 'category', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'properties' as any,
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'properties' as any,
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        components: {
          Field: '@/components/HeadlineWorkbench',
        },
        description: 'Property title or headline',
      },
      maxLength: 90,
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main featured image for the property',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'Gallery of property images',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  admin: {
                    description: 'Alt text for accessibility',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Property Description',
              required: false,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
              admin: {
                description: 'Property price in local currency',
              },
            },
            {
              name: 'status',
              type: 'text',
              defaultValue: 'for_sale',
              required: true,
              admin: {
                description: 'Property status (for_sale, for_rent, sold, rented, pending, off_market)',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'property-categories' as any,
              required: true,
              admin: {
                description: 'Property type (bungalow, apartment, etc.)',
              },
              filterOptions: () => {
                return {
                  // No filters needed
                }
              },
            },
            {
              name: 'bedrooms',
              type: 'number',
              admin: {
                description: 'Number of bedrooms',
              },
            },
            {
              name: 'bathrooms',
              type: 'number',
              admin: {
                description: 'Number of bathrooms',
              },
            },
            {
              name: 'squareFootage',
              type: 'number',
              admin: {
                description: 'Total square footage',
              },
            },
            {
              name: 'yearBuilt',
              type: 'number',
              admin: {
                description: 'Year the property was built',
              },
            },
            {
              name: 'lotSize',
              type: 'number',
              admin: {
                description: 'Lot size in square feet',
              },
            },
            {
              name: 'garage',
              type: 'number',
              admin: {
                description: 'Number of garage spaces',
              },
            },
          ],
          label: 'Property Details',
        },
        {
          fields: [
            {
              name: 'address',
              type: 'text',
              required: true,
              admin: {
                description: 'Street address',
              },
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'state',
              type: 'text',
              required: true,
            },
            {
              name: 'zipCode',
              type: 'text',
              required: true,
              admin: {
                description: 'Postal or ZIP code',
              },
            },
            {
              name: 'country',
              type: 'text',
              defaultValue: 'USA',
            },
            {
              name: 'neighborhood',
              type: 'text',
              admin: {
                description: 'Neighborhood or area name',
              },
            },
            {
              name: 'latitude',
              type: 'text',
              admin: {
                description: 'GPS latitude coordinate',
              },
            },
            {
              name: 'longitude',
              type: 'text',
              admin: {
                description: 'GPS longitude coordinate',
              },
            },
          ],
          label: 'Location',
        },
        {
          fields: [
            {
              name: 'features',
              type: 'array',
              admin: {
                description: 'Property features and amenities',
              },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'nearbyPlaces',
              type: 'array',
              admin: {
                description: 'Nearby amenities (schools, parks, etc.)',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'type',
                  type: 'text',
                  admin: {
                    description: 'Type of place (school, park, hospital, shopping, restaurant, transit, other)',
                  },
                },
                {
                  name: 'distance',
                  type: 'text',
                  admin: {
                    description: 'Distance (e.g., "0.5 miles")',
                  },
                },
              ],
            },
          ],
          label: 'Features & Amenities',
        },
        {
          fields: [
            {
              name: 'contactName',
              type: 'text',
              admin: {
                description: 'Contact person or agent name',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Contact email',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              admin: {
                description: 'Contact phone number',
              },
            },
            {
              name: 'virtualTourUrl',
              type: 'text',
              admin: {
                description: 'URL to virtual tour or video walkthrough',
              },
            },
            {
              name: 'floorPlan',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Floor plan image or document',
              },
            },
          ],
          label: 'Contact & Media',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Mark as featured property for highlighting on listings',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
      label: 'Mark as featured',
    },
    {
      name: 'relatedProperties',
      type: 'relationship',
      admin: {
        description: 'Select related properties to display',
        position: 'sidebar',
      },
      filterOptions: () => {
        return {
          // No filters needed
        }
      },
      hasMany: true,
      relationTo: 'properties' as any,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'slug',
      type: 'slug',
      useAsSlug: 'title',
    },
  ],
  hooks: {
    afterChange: [revalidateProperty],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
