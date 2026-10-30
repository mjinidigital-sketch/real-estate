import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Property } from '../../../payload-types'

export const revalidateProperty: CollectionAfterChangeHook<Property> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    try {
      if (doc._status === 'published') {
        const path = `/properties/${doc.slug}`

        payload.logger.info(`Revalidating property at path: ${path}`)

        revalidatePath(path)
        revalidatePath('/properties')
        revalidateTag('properties-sitemap', 'max')
      }

      if (previousDoc?._status === 'published' && doc._status !== 'published') {
        const oldPath = `/properties/${previousDoc.slug}`

        payload.logger.info(`Revalidating old property at path: ${oldPath}`)

        revalidatePath(oldPath)
        revalidatePath('/properties')
        revalidateTag('properties-sitemap', 'max')
      }
    } catch (err) {
      payload.logger.warn(`Could not revalidate property: ${err}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Property> = ({ doc, req: { context } }) => {
  if (!context?.disableRevalidate) {
    try {
      const path = `/properties/${doc?.slug}`

      revalidatePath(path)
      revalidatePath('/properties')
      revalidateTag('properties-sitemap', 'max')
    } catch (err) {
      // Ignore outside of Next context
    }
  }

  return doc
}
