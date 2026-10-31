import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { createFolderField } from 'payload'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Always use local storage - admin panel serves from here
    // In production, we'll sync to Vercel Blob via afterChange hook
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    filesRequiredOnCreate: false,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // In production with BLOB_READ_WRITE_TOKEN, sync to Vercel Blob
        if (process.env.BLOB_READ_WRITE_TOKEN && doc.url && !doc.url.startsWith('https://')) {
          try {
            const fs = await import('fs')
            const { put } = await import('@vercel/blob')

            // Get the local file path
            const localPath = path.resolve(dirname, '../../public', doc.url)

            // Check if file exists locally
            if (fs.existsSync(localPath)) {
              const fileBuffer = fs.readFileSync(localPath)

              // Upload to Vercel Blob
              const blob = await put(doc.filename || path.basename(doc.url), fileBuffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
              })

              // Update the document's URL to point to Vercel Blob
              await req.payload.update({
                collection: 'media',
                id: doc.id,
                data: {
                  url: blob.url,
                },
              })
            }
          } catch (error: unknown) {
            console.error('Error syncing to Vercel Blob:', error)
          }
        }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Delete from Vercel Blob when media is deleted
        try {
          const media = await req.payload.findByID({
            collection: 'media',
            id,
          })
          if (media && media.url && media.url.startsWith('https://')) {
            const { del } = await import('@vercel/blob')
            await del(media.url)
          }
        } catch (error: unknown) {
          console.error('Error deleting from Vercel Blob:', error)
        }
      },
    ],
  },
}

export const mediaSharpOptions = {
  focalPoint: true,
  variants: [
    {
      name: 'thumbnail',
      width: 300,
    },
    {
      name: 'square',
      width: 500,
      height: 500,
    },
    {
      name: 'small',
      width: 600,
    },
    {
      name: 'medium',
      width: 900,
    },
    {
      name: 'large',
      width: 1400,
    },
    {
      name: 'xlarge',
      width: 1920,
    },
    {
      name: 'og',
      width: 1200,
      height: 630,
      crop: 'center',
    },
  ],
}
