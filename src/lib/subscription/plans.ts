export type SubscriptionPlan = 'free' | 'artist' | 'gallery'

export interface PlanLimits {
  // Gallery/Organization limits
  organizationsPerUser: number
  artworksPerGallery: number
  usersPerGallery: number

  // Artist-specific limits
  isArtistPlan: boolean // If true, all artworks must be by the same artist

  // Feature access
  features: {
    // Core features (available to all)
    basicInventory: boolean
    basicReporting: boolean
    emailSupport: boolean

    // Artist plan features
    artistProfile: boolean
    portfolioView: boolean

    // Gallery plan features
    multipleArtists: boolean
    clientManagement: boolean
    salesTracking: boolean
    advancedReporting: boolean
    staffManagement: boolean
    exhibitionManagement: boolean
    apiAccess: boolean
    prioritySupport: boolean
    customBranding: boolean
    exportData: boolean
    bulkImport: boolean
  }

  // Storage and data limits
  imageStorageGB: number
  monthlyEmailLimit: number
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    organizationsPerUser: 1,
    artworksPerGallery: 5,
    usersPerGallery: 1,
    isArtistPlan: false,
    features: {
      basicInventory: true,
      basicReporting: false,
      emailSupport: true,
      artistProfile: false,
      portfolioView: false,
      multipleArtists: false,
      clientManagement: false,
      salesTracking: false,
      advancedReporting: false,
      staffManagement: false,
      exhibitionManagement: false,
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      exportData: false,
      bulkImport: false,
    },
    imageStorageGB: 0.5,
    monthlyEmailLimit: 50,
  },

  artist: {
    organizationsPerUser: 1,
    artworksPerGallery: 100,
    usersPerGallery: 2,
    isArtistPlan: true, // All artworks must be by the same artist
    features: {
      basicInventory: true,
      basicReporting: true,
      emailSupport: true,
      artistProfile: true,
      portfolioView: true,
      multipleArtists: false, // Single artist only
      clientManagement: true,
      salesTracking: true,
      advancedReporting: false,
      staffManagement: false,
      exhibitionManagement: false,
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      exportData: true,
      bulkImport: true,
    },
    imageStorageGB: 5,
    monthlyEmailLimit: 500,
  },

  gallery: {
    organizationsPerUser: -1, // Unlimited galleries (each adds cost)
    artworksPerGallery: 500,
    usersPerGallery: -1, // Unlimited users per gallery
    isArtistPlan: false,
    features: {
      basicInventory: true,
      basicReporting: true,
      emailSupport: true,
      artistProfile: true,
      portfolioView: true,
      multipleArtists: true,
      clientManagement: true,
      salesTracking: true,
      advancedReporting: true,
      staffManagement: true,
      exhibitionManagement: true,
      apiAccess: true,
      prioritySupport: true,
      customBranding: true,
      exportData: true,
      bulkImport: true,
    },
    imageStorageGB: 50, // Per gallery
    monthlyEmailLimit: -1, // Unlimited
  },
}

export const PLAN_PRICING = {
  free: { monthly: 0, yearly: 0 },
  artist: { monthly: 19, yearly: 190 }, // ~17% discount yearly
  gallery: {
    monthly: 49, // Base price for first gallery
    yearly: 490,
    additionalGalleryMonthly: 39, // Each additional gallery
    additionalGalleryYearly: 390,
  },
}

/**
 * Get plan configuration for a subscription plan
 */
export function getPlanConfig(plan: SubscriptionPlan): PlanLimits {
  return PLAN_CONFIGS[plan]
}

/**
 * Check if a feature is available for a plan
 */
export function hasFeature(
  plan: SubscriptionPlan,
  feature: keyof PlanLimits['features']
): boolean {
  return PLAN_CONFIGS[plan].features[feature]
}

/**
 * Check if user can create more organizations
 */
export function canCreateOrganization(
  plan: SubscriptionPlan,
  currentCount: number
): boolean {
  const limit = PLAN_CONFIGS[plan].organizationsPerUser
  return limit === -1 || currentCount < limit
}

/**
 * Check if gallery can add more artworks
 */
export function canAddArtwork(
  plan: SubscriptionPlan,
  currentCount: number
): boolean {
  const limit = PLAN_CONFIGS[plan].artworksPerGallery
  return limit === -1 || currentCount < limit
}

/**
 * Check if gallery can add more users
 */
export function canAddUser(
  plan: SubscriptionPlan,
  currentCount: number
): boolean {
  const limit = PLAN_CONFIGS[plan].usersPerGallery
  return limit === -1 || currentCount < limit
}

/**
 * Calculate total monthly cost for gallery plan based on number of galleries
 */
export function calculateGalleryPlanCost(
  numberOfGalleries: number,
  isYearly: boolean = false
): number {
  if (numberOfGalleries === 0) return 0

  const pricing = PLAN_PRICING.gallery
  const baseCost = isYearly ? pricing.yearly : pricing.monthly
  const additionalCost = isYearly
    ? pricing.additionalGalleryYearly
    : pricing.additionalGalleryMonthly

  if (numberOfGalleries === 1) {
    return baseCost
  }

  return baseCost + additionalCost * (numberOfGalleries - 1)
}

/**
 * Get plan display information
 */
export function getPlanDisplayInfo(plan: SubscriptionPlan) {
  const config = getPlanConfig(plan)

  switch (plan) {
    case 'free':
      return {
        name: 'Free',
        description: 'Perfect for testing and small collections',
        highlight: 'Test the platform',
        artworkLimit: '5 artworks',
        userLimit: '1 user',
        galleries: '1 gallery',
      }
    case 'artist':
      return {
        name: 'Artist',
        description: 'Ideal for individual artists managing their portfolio',
        highlight: 'Single artist focus',
        artworkLimit: '100 artworks',
        userLimit: '2 users',
        galleries: '1 gallery',
      }
    case 'gallery':
      return {
        name: 'Gallery',
        description: 'Full-featured plan for galleries and art dealers',
        highlight: 'Multiple artists & galleries',
        artworkLimit: '500 artworks per gallery',
        userLimit: 'Unlimited users',
        galleries: 'Unlimited galleries',
      }
    default:
      return null
  }
}
