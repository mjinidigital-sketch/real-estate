import { HeaderClient } from '../Header/Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  let headerData: any = null
  try {
    headerData = await getCachedGlobal('header', 1)()
  } catch (error) {
    // Handle database schema errors gracefully during build
    console.warn('Failed to fetch header data:', error)
  }

  return <HeaderClient data={headerData} />
}
