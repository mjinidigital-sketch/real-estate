import config from '@payload-config'
import { createPayloadRequest, getPayload } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { getFileByPath } from 'payload'

const payload = await getPayload({ config })
const req = await createPayloadRequest({ payload })

const propertyCategories = [
  { title: 'Apartment', description: 'Modern apartments in urban areas' },
  { title: 'House', description: 'Single-family homes with yards' },
  { title: 'Condo', description: 'Condominiums with shared amenities' },
  { title: 'Villa', description: 'Luxury villas with premium features' },
  { title: 'Townhouse', description: 'Multi-story townhomes' },
  { title: 'Penthouse', description: 'Luxury top-floor apartments' },
  { title: 'Studio', description: 'Compact studio apartments' },
  { title: 'Duplex', description: 'Two-unit residential buildings' },
  { title: 'Cottage', description: 'Cozy countryside cottages' },
  { title: 'Mansion', description: 'Large luxury estates' },
]

const cities = [
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'San Antonio', state: 'TX' },
  { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'San Jose', state: 'CA' },
]

const neighborhoods = [
  'Downtown',
  'Midtown',
  'Uptown',
  'Suburbs',
  'Waterfront',
  'Historic District',
  'Arts District',
  'Business District',
  'Garden District',
  'Old Town',
]

const statuses = ['for_sale', 'for_rent', 'sold', 'rented', 'pending', 'off_market']

const featuresList = [
  'Central Air Conditioning',
  'Hardwood Floors',
  'Fireplace',
  'Swimming Pool',
  'Garden',
  'Parking Garage',
  'Security System',
  'Balcony/Terrace',
  'Washer/Dryer',
  'Dishwasher',
  'Refrigerator',
  'Microwave',
  'Oven',
  'Stove',
  'Walk-in Closets',
  'Storage Space',
  'Gym/Fitness Center',
  'Concierge Service',
  'Elevator',
  'Rooftop Access',
  'Pet Friendly',
  'High Ceilings',
  'Natural Light',
  'Updated Kitchen',
  'Modern Bathroom',
  'Smart Home Features',
  'Solar Panels',
  'Energy Efficient',
  'Soundproof Windows',
]

const nearbyPlacesTypes = ['school', 'park', 'hospital', 'shopping', 'restaurant', 'transit', 'other']

const nearbyPlacesNames = [
  'Central Elementary School',
  'Oakwood High School',
  'Riverside Park',
  'Memorial Hospital',
  'City Mall',
  'Downtown Shopping Center',
  'Gourmet Kitchen',
  'Bistro 52',
  'Metro Station',
  'Bus Terminal',
  'Community Center',
  'Public Library',
  'Fitness First Gym',
  'Whole Foods Market',
  'Starbucks Coffee',
]

// Free real estate image URLs from Unsplash
const realEstateImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6c563aaecb?w=800&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80',
  'https://images.unsplash.com/photo-1600563438938-a8a0ef75a9f8?w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6c563aaecb?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
]

const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

const getRandomItems = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const generatePropertyData = (index: number, categoryDoc: any, heroImageDoc: any, galleryImageDocs: any[]) => {
  const cityData = getRandomItem(cities)
  const status = getRandomItem(statuses)
  const bedrooms = getRandomNumber(1, 6)
  const bathrooms = getRandomNumber(1, 5)
  const squareFootage = getRandomNumber(500, 5000)
  const yearBuilt = getRandomNumber(1950, 2024)
  const lotSize = getRandomNumber(1000, 20000)
  const garage = getRandomNumber(0, 4)
  const streetNumber = getRandomNumber(100, 9999)
  const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm Blvd', 'Washington Ave', 'Lincoln St', 'Jefferson Dr', 'Madison Rd']
  const streetName = getRandomItem(streetNames)

  const price = squareFootage * getRandomNumber(200, 600)

  return {
    title: `${categoryDoc.title} at ${streetNumber} ${streetName}`,
    heroImage: heroImageDoc.id,
    gallery: galleryImageDocs.map((img, i) => ({
      image: img.id,
      alt: `${categoryDoc.title} gallery image ${i + 1}`,
    })),
    description: [
      {
        type: 'p',
        children: [
          {
            text: `This stunning ${categoryDoc.title.toLowerCase()} offers ${bedrooms} bedrooms and ${bathrooms} bathrooms across ${squareFootage.toLocaleString()} square feet of living space. Built in ${yearBuilt}, this property has been meticulously maintained and features modern amenities throughout.`,
          },
        ],
      },
    ] as any,
    price,
    status,
    category: categoryDoc.id,
    bedrooms,
    bathrooms,
    squareFootage,
    yearBuilt,
    lotSize,
    garage,
    address: `${streetNumber} ${streetName}`,
    city: cityData.city,
    state: cityData.state,
    zipCode: String(getRandomNumber(10000, 99999)),
    country: 'USA',
    neighborhood: getRandomItem(neighborhoods),
    latitude: String(getRandomNumber(4000, 4200) / 100),
    longitude: String(getRandomNumber(-7400, -7300) / 100),
    features: getRandomItems(featuresList, getRandomNumber(5, 10)).map((feature) => ({ feature })),
    nearbyPlaces: getRandomItems(nearbyPlacesNames, getRandomNumber(3, 6)).map((name) => ({
      name,
      type: getRandomItem(nearbyPlacesTypes),
      distance: `${getRandomNumber(1, 50) / 10} miles`,
    })),
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@realestate.com',
    contactPhone: '(555) 123-4567',
    publishedAt: new Date(Date.now() - getRandomNumber(0, 365 * 24 * 60 * 60 * 1000)).toISOString(),
    slug: `property-${index}-${streetNumber}-${streetName.toLowerCase().replace(' ', '-')}`,
    featured: index < 5, // First 5 properties are featured
    meta: {
      title: `${categoryDoc.title} for ${status.replace('_', ' ')} in ${cityData.city} - ${formatPrice(price)}`,
      description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom ${categoryDoc.title.toLowerCase()} in ${cityData.city}, ${cityData.state}. ${squareFootage.toLocaleString()} sqft. Listed for ${formatPrice(price)}.`,
      image: heroImageDoc.id,
    },
  }
}

const seedProperties = async () => {
  try {
    console.log('Seeding property categories...')

    // Clear existing property categories
    await payload.db.deleteMany({ collection: 'property-categories', req, where: {} })
    console.log('  Cleared existing property categories')

    // Create property categories
    const categoryDocs = []
    for (const category of propertyCategories) {
      try {
        const categoryDoc = await payload.create({
          collection: 'property-categories',
          overrideAccess: true,
          req,
          data: {
            title: category.title,
            description: category.description,
            slug: category.title.toLowerCase().replace(' ', '-'),
          },
        })
        categoryDocs.push(categoryDoc)
      } catch (error) {
        console.error(`  Failed to create category ${category.title}:`, error)
      }
    }
    console.log(`Created ${categoryDocs.length} property categories`)

    console.log(`Successfully created ${categoryDocs.length} property categories`)

    console.log('Seeding properties...')

    // Clear existing properties
    await payload.db.deleteMany({ collection: 'properties', req, where: {} })

    // Download images to temp directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'payload-properties-seed-'))
    const tempFilePaths: string[] = []

    // Download all images
    console.log('Downloading property images...')
    const imageDocs = []
    for (let i = 0; i < realEstateImages.length; i++) {
      const url = realEstateImages[i]
      try {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to fetch image from ${url}`)
        }
        const buffer = Buffer.from(await res.arrayBuffer())
        const filename = `property-image-${i}.jpg`
        const tempFilePath = path.join(tempDir, filename)
        await fs.writeFile(tempFilePath, buffer)
        tempFilePaths.push(tempFilePath)

        const imageDoc = await payload.create({
          collection: 'media',
          overrideAccess: true,
          req,
          data: {
            alt: `Real estate property image ${i + 1}`,
          },
          filePath: tempFilePath,
          overwriteExistingFiles: true,
        })
        imageDocs.push(imageDoc)
      } catch (error) {
        console.error(`Failed to download image ${i}:`, error)
      }
    }

    console.log(`Downloaded ${imageDocs.length} images`)

    // Create 100 properties
    const propertyCount = 100
    for (let i = 0; i < propertyCount; i++) {
      const categoryDoc = getRandomItem(categoryDocs)
      const heroImageDoc = getRandomItem(imageDocs)
      const galleryImageDocs = getRandomItems(imageDocs, 4)

      const propertyData = generatePropertyData(i + 1, categoryDoc, heroImageDoc, galleryImageDocs)

      await payload.create({
        collection: 'properties',
        overrideAccess: true,
        req,
        depth: 0,
        data: propertyData,
      })

      if ((i + 1) % 10 === 0) {
        console.log(`  Created ${i + 1}/${propertyCount} properties`)
      }
      // Small delay to prevent overwhelming the database
      if (i < propertyCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`Seeded ${propertyCount} properties successfully!`)

    // Cleanup temp files
    await fs.rm(tempDir, { recursive: true, force: true })
  } finally {
    await payload.destroy()
  }
}

seedProperties().catch((error) => {
  console.error('Error seeding properties:', error)
  process.exit(1)
})

seedProperties().catch((error) => {
  console.error('Error seeding properties:', error)
  process.exit(1)
})
