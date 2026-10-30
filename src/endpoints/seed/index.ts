import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import { getFileByPath } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { dashboardFormSubmissions, dashboardPages, dashboardPosts } from './dashboard-demo'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const navigationGlobals = ['header', 'footer'] as const satisfies GlobalSlug[]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  const systemOperation = { overrideAccess: true as const, req }

  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // Clear media directory and all subdirectories recursively
  const mediaDir = path.resolve(dirname, '../../../public/media')
  try {
    await fs.rm(mediaDir, { recursive: true, force: true })
  } catch (err) {
    // Directory might not exist, that's ok
  }

  // clear the database
  await Promise.all(
    navigationGlobals.map((global) =>
      payload.updateGlobal({
        ...systemOperation,
        slug: global,
        data: {},
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    ...systemOperation,
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  // Download images to temp directory first
  const imageUrls = [
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
  ]

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'payload-seed-'))
  const tempFilePaths: string[] = []

  const imageFiles = await Promise.all(
    imageUrls.map(async (url, index) => {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch image from ${url}`)
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      const filename = url.split('/').pop() || `file-${Date.now()}.webp`
      const uniqueFilename = `${Date.now()}-${index}-${filename}`
      const tempFilePath = path.join(tempDir, uniqueFilename)
      await fs.writeFile(tempFilePath, buffer)
      tempFilePaths.push(tempFilePath)
      return await getFileByPath(tempFilePath)
    }),
  )

  const demoAuthor = await payload.create({
    ...systemOperation,
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@example.com',
      password: 'password',
      role: 'content-editor',
    },
  })

  const image1Doc = await payload.create({
    ...systemOperation,
    collection: 'media',
    data: image1,
    filePath: tempFilePaths[0],
    overwriteExistingFiles: true,
  })

  const image2Doc = await payload.create({
    ...systemOperation,
    collection: 'media',
    data: image2,
    filePath: tempFilePaths[1],
    overwriteExistingFiles: true,
  })

  const image3Doc = await payload.create({
    ...systemOperation,
    collection: 'media',
    data: image2,
    filePath: tempFilePaths[2],
    overwriteExistingFiles: true,
  })

  const imageHomeDoc = await payload.create({
    ...systemOperation,
    collection: 'media',
    data: imageHero1,
    filePath: tempFilePaths[3],
    overwriteExistingFiles: true,
  })

  await Promise.all(
    categories.map((category) =>
      payload.create({
        ...systemOperation,
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  )

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    ...systemOperation,
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    ...systemOperation,
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    ...systemOperation,
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  for (const post of dashboardPosts({
    author: demoAuthor,
    images: [image1Doc, image2Doc, image3Doc],
  })) {
    await payload.create({
      ...systemOperation,
      collection: 'posts',
      context: { disableRevalidate: true },
      data: post,
      depth: 0,
      draft: post._status === 'draft',
    })
  }

  // update each post with related posts
  await payload.update({
    ...systemOperation,
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    ...systemOperation,
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    ...systemOperation,
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    ...systemOperation,
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [, contactPage] = await Promise.all([
    payload.create({
      ...systemOperation,
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      ...systemOperation,
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  const demoPages = []

  for (const page of dashboardPages({ images: [image1Doc, image2Doc, image3Doc] })) {
    const demoPage = await payload.create({
      ...systemOperation,
      collection: 'pages',
      context: { disableRevalidate: true },
      data: page,
      depth: 0,
      draft: page._status === 'draft',
    })

    demoPages.push(demoPage)
  }

  payload.logger.info(`— Seeding form submissions...`)

  for (const submission of dashboardFormSubmissions) {
    await payload.create({
      ...systemOperation,
      collection: 'form-submissions',
      data: {
        createdAt: submission.createdAt,
        form: contactForm.id,
        submissionData: [
          { field: 'full-name', value: submission.name },
          { field: 'email', value: submission.email },
          { field: 'message', value: submission.message },
        ],
      },
      depth: 0,
    })
  }

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      ...systemOperation,
      slug: 'header',
      data: {
        navItems: demoPages.map((page) => ({
          link: {
            type: 'reference' as const,
            label: page.title,
            reference: {
              relationTo: 'pages' as const,
              value: page.id,
            },
          },
        })),
      },
    }),
    payload.updateGlobal({
      ...systemOperation,
      slug: 'footer',
      data: {},
    }),
  ])

  payload.logger.info('Seeded database successfully!')

  // Cleanup temp files
  await fs.rm(tempDir, { recursive: true, force: true })
}
