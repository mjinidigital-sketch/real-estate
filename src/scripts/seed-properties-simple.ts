import config from '@payload-config'
import { createPayloadRequest, getPayload, getFileByPath } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const payload = await getPayload({ config })
const req = await createPayloadRequest({ payload })
const systemOperation = {
  overrideAccess: true as const,
  req,
  context: {
    disableRevalidate: true,
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal Lexical paragraph node */
function lexicalParagraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [
      {
        type: 'text' as const,
        detail: 0,
        format: 0,
        mode: 'normal' as const,
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    textStyle: '',
    version: 1,
  }
}

/** Build a minimal Lexical heading node */
function lexicalHeading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    type: 'heading' as const,
    children: [
      {
        type: 'text' as const,
        detail: 0,
        format: 0,
        mode: 'normal' as const,
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: 1,
  }
}

function richText(...children: ReturnType<typeof lexicalParagraph | typeof lexicalHeading>[]) {
  return {
    root: {
      type: 'root' as const,
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// Property data templates
// ---------------------------------------------------------------------------

const propertyCategories = [
  { title: 'Apartment', description: 'Modern apartments in urban areas', slug: 'apartment' },
  { title: 'House', description: 'Single-family homes with yards', slug: 'house' },
  { title: 'Condo', description: 'Condominiums with shared amenities', slug: 'condo' },
  { title: 'Villa', description: 'Luxury villas with premium features', slug: 'villa' },
  { title: 'Townhouse', description: 'Multi-story townhomes', slug: 'townhouse' },
  { title: 'Penthouse', description: 'Luxury top-floor apartments', slug: 'penthouse' },
  { title: 'Studio', description: 'Compact studio apartments', slug: 'studio' },
  { title: 'Duplex', description: 'Two-unit residential buildings', slug: 'duplex' },
  { title: 'Cottage', description: 'Cozy countryside cottages', slug: 'cottage' },
  { title: 'Mansion', description: 'Large luxury estates', slug: 'mansion' },
]

const statuses = ['for_sale', 'for_rent', 'sold', 'for_rent', 'for_sale', 'pending'] as const

const cities = [
  { city: 'New York', state: 'NY', zipCode: '10001', neighborhood: 'Manhattan' },
  { city: 'Los Angeles', state: 'CA', zipCode: '90001', neighborhood: 'Beverly Hills' },
  { city: 'Chicago', state: 'IL', zipCode: '60601', neighborhood: 'Lincoln Park' },
  { city: 'Houston', state: 'TX', zipCode: '77001', neighborhood: 'Midtown' },
  { city: 'Miami', state: 'FL', zipCode: '33101', neighborhood: 'South Beach' },
  { city: 'Seattle', state: 'WA', zipCode: '98101', neighborhood: 'Capitol Hill' },
  { city: 'Austin', state: 'TX', zipCode: '78701', neighborhood: 'East Austin' },
  { city: 'Boston', state: 'MA', zipCode: '02101', neighborhood: 'Beacon Hill' },
  { city: 'Denver', state: 'CO', zipCode: '80201', neighborhood: 'Cherry Creek' },
  { city: 'Nashville', state: 'TN', zipCode: '37201', neighborhood: 'Gulch' },
]

const featureSets = [
  ['Swimming Pool', 'Home Theater', 'Smart Home System', 'Wine Cellar', 'Rooftop Terrace'],
  ['Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'In-unit Laundry'],
  ['Central Air Conditioning', 'Fireplace', 'Walk-in Closet', 'Double Garage', 'Garden'],
  ['Open Plan Living', 'Floor-to-ceiling Windows', 'City Views', 'Concierge Service', 'Gym'],
  ['Exposed Brick', 'Loft Ceiling', 'Chef Kitchen', 'Private Balcony', 'Storage Unit'],
  ['Solar Panels', 'EV Charger', 'Rainwater Tank', 'Veggie Garden', 'Compost System'],
]

const nearbyPlaceSets = [
  [
    { name: 'Central Park', type: 'park', distance: '0.3 miles' },
    { name: 'Whole Foods Market', type: 'shopping', distance: '0.5 miles' },
    { name: 'Columbia University', type: 'school', distance: '1.2 miles' },
  ],
  [
    { name: 'Riverside Elementary', type: 'school', distance: '0.4 miles' },
    { name: 'City Medical Center', type: 'hospital', distance: '0.8 miles' },
    { name: 'Metro Station', type: 'transit', distance: '0.2 miles' },
  ],
  [
    { name: 'Lakefront Trail', type: 'park', distance: '0.1 miles' },
    { name: 'Trader Joe\'s', type: 'shopping', distance: '0.3 miles' },
    { name: "Tony's Bistro", type: 'restaurant', distance: '0.5 miles' },
  ],
]

const agents = [
  { name: 'Sarah Johnson', email: 'sarah.johnson@realty.com', phone: '+1 (212) 555-0101' },
  { name: 'Marcus Williams', email: 'marcus.w@premiumhomes.com', phone: '+1 (310) 555-0202' },
  { name: 'Emily Chen', email: 'emily.chen@urbanestates.com', phone: '+1 (312) 555-0303' },
  { name: 'David Rodriguez', email: 'd.rodriguez@southernhomes.com', phone: '+1 (713) 555-0404' },
  { name: 'Jessica Park', email: 'j.park@coastalrealty.com', phone: '+1 (305) 555-0505' },
]

// Unsplash property photo URLs (no API key required, direct image URLs)
const propertyImageUrls = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80',
]

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

const NUM_PROPERTIES = 30

try {
  // -- Clear existing data
  console.log('🧹 Clearing existing properties and categories...')
  await payload.db.deleteMany({ collection: 'properties', req, where: {} })
  await payload.db.deleteVersions({ collection: 'properties', req, where: {} })
  await payload.db.deleteMany({ collection: 'property-categories', req, where: {} })

  // -- Seed categories
  console.log('📁 Seeding property categories...')
  const categoryDocs: Array<{ id: number; title: string }> = []
  for (const cat of propertyCategories) {
    const doc = await payload.create({
      ...systemOperation,
      collection: 'property-categories',
      data: { title: cat.title, description: cat.description, slug: cat.slug },
    })
    categoryDocs.push(doc)
    console.log(`  ✓ ${cat.title}`)
  }

  // -- Download and upload property images
  console.log('\n📸 Downloading property images...')
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'payload-props-seed-'))
  const mediaDocs: Array<{ id: number }> = []

  for (let i = 0; i < propertyImageUrls.length; i++) {
    const url = propertyImageUrls[i]
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const filename = `property-${i + 1}-${Date.now()}.webp`
      const tempPath = path.join(tempDir, filename)
      await fs.writeFile(tempPath, buffer)
      const file = await getFileByPath(tempPath)

      const mediaDoc = await payload.create({
        ...systemOperation,
        collection: 'media',
        data: { alt: `Property photo ${i + 1}` },
        file,
        overwriteExistingFiles: true,
      })
      mediaDocs.push(mediaDoc)
      console.log(`  ✓ Image ${i + 1}/${propertyImageUrls.length}`)
    } catch (err) {
      console.warn(`  ⚠ Could not download image ${i + 1}: ${err}`)
    }
  }

  if (mediaDocs.length === 0) {
    throw new Error('No images downloaded — cannot seed properties with pictures.')
  }

  // -- Seed properties
  console.log(`\n🏠 Seeding ${NUM_PROPERTIES} properties...`)

  const prices = {
    for_sale: [299000, 450000, 625000, 850000, 1200000, 1750000, 2500000, 4200000],
    for_rent: [1800, 2400, 3200, 4500, 6500, 9500],
    sold: [320000, 540000, 780000],
    pending: [410000, 695000],
    off_market: [1100000],
    rented: [2200, 3800],
  }

  const propertyDocs: number[] = []

  for (let i = 0; i < NUM_PROPERTIES; i++) {
    const category = categoryDocs[i % categoryDocs.length]
    const location = cities[i % cities.length]
    const statusKey = statuses[i % statuses.length]
    const priceList = prices[statusKey]
    const price = priceList[i % priceList.length]
    const agent = agents[i % agents.length]
    const features = featureSets[i % featureSets.length]
    const nearby = nearbyPlaceSets[i % nearbyPlaceSets.length]

    // Pick hero image and a couple of gallery images, cycling through available
    const heroImage = mediaDocs[i % mediaDocs.length]
    const galleryImage1 = mediaDocs[(i + 1) % mediaDocs.length]
    const galleryImage2 = mediaDocs[(i + 2) % mediaDocs.length]
    const galleryImage3 = mediaDocs[(i + 3) % mediaDocs.length]

    const bedroomCount = (i % 5) + 1          // 1–5
    const bathroomCount = Math.max(1, bedroomCount - 1 + (i % 2)) // realistic ratio
    const sqft = 500 + (i % 20) * 150          // 500–3350 sqft
    const yearBuilt = 1970 + (i % 55)          // 1970–2024
    const lotSize = sqft + Math.round(sqft * 0.3 * (i % 5))
    const garageSpaces = i % 4                  // 0–3

    const isForRent = statusKey === 'for_rent'
    const titleParts = [
      ['Charming', 'Stunning', 'Elegant', 'Modern', 'Cozy', 'Spacious', 'Luxury', 'Contemporary'],
      [category.title],
      ['in', 'near', 'at'],
      [location.neighborhood || location.city],
    ]
    const title = `${titleParts[0][i % 8]} ${category.title} ${titleParts[2][i % 3]} ${location.neighborhood || location.city}`

    const description = richText(
      lexicalHeading(`${title} — Overview`),
      lexicalParagraph(
        `Welcome to this exceptional ${category.title.toLowerCase()} located in the heart of ${location.neighborhood ? `${location.neighborhood}, ` : ''}${location.city}. ` +
          `This ${bedroomCount}-bedroom, ${bathroomCount}-bathroom property offers ${sqft.toLocaleString()} sq ft of thoughtfully designed living space.`,
      ),
      lexicalHeading('Property Highlights', 'h3'),
      lexicalParagraph(
        `Built in ${yearBuilt}, this ${category.title.toLowerCase()} blends timeless architecture with modern comforts. ` +
          `Features include ${features.slice(0, 3).join(', ')}, and much more. ` +
          `${isForRent ? `Available for rent at $${price.toLocaleString()}/month.` : `Priced at $${price.toLocaleString()}.`}`,
      ),
      lexicalHeading('Location', 'h3'),
      lexicalParagraph(
        `Situated at ${100 + i} ${['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'][i % 5]} ${['Street', 'Avenue', 'Boulevard', 'Lane', 'Drive'][i % 5]}, ` +
          `${location.city}, ${location.state} ${location.zipCode}. ` +
          `You'll love the vibrant neighbourhood with easy access to parks, restaurants, and public transit.`,
      ),
    )

    const slug = `${category.title.toLowerCase()}-${location.city.toLowerCase().replace(/ /g, '-')}-${i + 1}`

    const doc = await payload.create({
      ...systemOperation,
      collection: 'properties',
      draft: false,
      data: {
        _status: 'published' as const,
        title,
        slug,

        // Media
        heroImage: heroImage.id,
        gallery: [
          { image: galleryImage1.id, alt: `${title} – living area` },
          { image: galleryImage2.id, alt: `${title} – kitchen` },
          { image: galleryImage3.id, alt: `${title} – bedroom` },
        ],

        // Description (proper Lexical format)
        description,

        // Property details
        price,
        status: statusKey,
        category: category.id,
        bedrooms: bedroomCount,
        bathrooms: bathroomCount,
        squareFootage: sqft,
        yearBuilt,
        lotSize,
        garage: garageSpaces,

        // Location
        address: `${100 + i} ${['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'][i % 5]} ${['Street', 'Avenue', 'Boulevard', 'Lane', 'Drive'][i % 5]}`,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        country: 'USA',
        neighborhood: location.neighborhood ?? null,
        latitude: `${(40 + i * 0.03).toFixed(6)}`,
        longitude: `${(-74 + i * 0.04).toFixed(6)}`,

        // Features
        features: features.map((f) => ({ feature: f })),
        nearbyPlaces: nearby,

        // Contact
        contactName: agent.name,
        contactEmail: agent.email,
        contactPhone: agent.phone,
        virtualTourUrl: `https://tour.example.com/property-${i + 1}`,

        // SEO
        meta: {
          title: `${title} | Real Estate`,
          description: `${bedroomCount} bed, ${bathroomCount} bath ${category.title.toLowerCase()} in ${location.city}. ${sqft.toLocaleString()} sqft. ${isForRent ? `For rent: $${price.toLocaleString()}/mo` : `For sale: $${price.toLocaleString()}`}.`,
          image: heroImage.id,
        },

        // Sidebar
        featured: i < 3,
        publishedAt: new Date().toISOString(),
      },
    })

    propertyDocs.push(doc.id)

    if ((i + 1) % 5 === 0 || i === 0) {
      console.log(`  ✓ ${i + 1}/${NUM_PROPERTIES}: ${title}`)
    }
  }

  // -- Link related properties (3 per property, cycling forward)
  console.log('\n🔗 Linking related properties...')
  for (let i = 0; i < propertyDocs.length; i++) {
    const related = [
      propertyDocs[(i + 1) % propertyDocs.length],
      propertyDocs[(i + 2) % propertyDocs.length],
      propertyDocs[(i + 3) % propertyDocs.length],
    ]
    await payload.update({
      ...systemOperation,
      collection: 'properties',
      id: propertyDocs[i],
      data: { relatedProperties: related },
    })
  }

  // -- Cleanup
  await fs.rm(tempDir, { recursive: true, force: true })

  console.log(`\n✅ Seed complete!`)
  console.log(`   ${categoryDocs.length} categories`)
  console.log(`   ${mediaDocs.length} media images`)
  console.log(`   ${propertyDocs.length} published properties`)
} catch (error) {
  console.error('❌ Seed failed:', error)
  process.exit(1)
} finally {
  await payload.destroy()
}
