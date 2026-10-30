import type { Block } from 'payload'

export const FeatureCards: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCardsBlock',
  labels: {
    singular: 'Featured Cards',
    plural: 'Featured Card Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'WHY CHOOSE US',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Everything You Need, All in One Place',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Discover the features and services that make us the right choice for your real estate needs.',
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'enable3D',
      type: 'checkbox',
      label: 'Enable 3D Hover Effect',
      defaultValue: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Featured Cards',
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: 'Add, edit and reorder your featured cards.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'shield',
              admin: {
                width: '50%',
              },
              options: [
                { label: 'Fingerprint', value: 'fingerprint' },
                { label: 'Shield', value: 'shield' },
                { label: 'Globe', value: 'globe' },
                { label: 'Layers', value: 'layers' },
                { label: 'Refresh', value: 'refresh' },
                { label: 'Gauge', value: 'gauge' },
                { label: 'Lock', value: 'lock' },
                { label: 'Laptop', value: 'laptop' },
                { label: 'Home', value: 'home' },
                { label: 'Building', value: 'building' },
                { label: 'Key', value: 'key' },
                { label: 'Map Pin', value: 'map-pin' },
                { label: 'Users', value: 'users' },
                { label: 'Star', value: 'star' },
                { label: 'Check Circle', value: 'check-circle' },
                { label: 'Award', value: 'award' },
                { label: 'Briefcase', value: 'briefcase' },
                { label: 'Chart', value: 'chart' },
              ],
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'color',
          type: 'select',
          label: 'Card Gradient',
          defaultValue: 'blue',
          options: [
            { label: 'Blue / Purple', value: 'blue' },
            { label: 'Purple / Pink', value: 'purple' },
            { label: 'Green / Emerald', value: 'green' },
            { label: 'Orange / Red', value: 'orange' },
            { label: 'Pink / Rose', value: 'pink' },
            { label: 'Cyan / Blue', value: 'cyan' },
            { label: 'Amber / Orange', value: 'amber' },
            { label: 'Navy / Blue', value: 'navy' },
          ],
        },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Default', value: 'default' },
        { label: 'Spacious', value: 'spacious' },
      ],
    },
  ],
}
