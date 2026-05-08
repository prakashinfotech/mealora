import { PrismaClient } from '@prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItemData {
  name: string
  price: number
  isVeg: boolean
  description?: string
  isBestSeller?: boolean
  imageId?: string
}

export interface CategoryData {
  name: string
  items: ItemData[]
}

export interface RestaurantInput {
  name: string
  slug: string
  description: string
  imageUrl: string
  bannerUrl?: string
  cuisines: string[]
  rating: number
  ratingCount: number
  avgDeliveryTime: number
  deliveryFee: number
  minOrderAmount: number
  isOpen: boolean
  isPureVeg: boolean
  city: string
  area: string
  address: string
  menu: CategoryData[]
}

// ─── Image helpers ─────────────────────────────────────────────────────────────

export const img = (id: string) => `https://images.unsplash.com/${id}?w=400&h=300&fit=crop`
export const banner = (id: string) => `https://images.unsplash.com/${id}?w=1200&h=400&fit=crop`
export const mImg = (id: string) => `https://images.unsplash.com/${id}?w=200&h=150&fit=crop`

// Curated photo IDs — one per food category for reuse across cities
export const P = {
  biryani:     'photo-1589302168068-964664d93dc0',
  biryani2:    'photo-1631515243349-e0cb75fb8d3a',
  biryani3:    'photo-1599043513900-ed6fe01d3833',
  dosa:        'photo-1668236543090-82eba5ee5976',
  idli:        'photo-1589301760014-d929f3979dbc',
  thali:       'photo-1567337710282-00832b415979',
  kebab:       'photo-1544025162-d76694265947',
  curry:       'photo-1603360946369-dc9bb6258143',
  northIndian: 'photo-1585937421612-70a008356fbe',
  streetFood:  'photo-1606491956689-2ea866880c84',
  bread:       'photo-1574894709920-11b28b6e8799',
  coffee:      'photo-1509042239860-f550ce710b93',
  chai:        'photo-1542314831-068cd1dbfeeb',
  drinks:      'photo-1576092768241-dec231879fc3',
  dessert:     'photo-1562376552-0d160a2f238d',
  iceCream:    'photo-1560008581-09826d1de69e',
  sweets:      'photo-1548365328-8c6db3220e4c',
  pizza:       'photo-1565299624946-b28f40a0ae38',
  pizza2:      'photo-1574071318508-1cdbab80d002',
  burger:      'photo-1568901346375-23c9450c58cd',
  burger2:     'photo-1571091718767-18b5b1457add',
  pasta:       'photo-1555949258-eb67b1ef0ceb',
  chinese:     'photo-1552611052-33e04de081de',
  noodles:     'photo-1534482421-64566f976cfa',
  friedRice:   'photo-1603133872878-684f208fb84b',
  roll:        'photo-1626700051175-6818013e1d4f',
  sushi:       'photo-1579871494447-9811cf80d66c',
  momos:       'photo-1563245372-f21724e3856d',
  sandwich:    'photo-1528735602780-2552fd46c7af',
  seafood:     'photo-1559339352-11d035aa65de',
  chicken:     'photo-1604908176997-125f25cc6f3d',
  fries:       'photo-1585109649139-366815a0d713',
  soup:        'photo-1547592166-23ac45744acd',
  veg:         'photo-1512621776951-a57141f2eefd',
  egg:         'photo-1569050467447-ce54b3bbc37d',
  waffle:      'photo-1562376552-0d160a2f238d',
} as const

// ─── Seed runners ─────────────────────────────────────────────────────────────

export async function seedRestaurants(
  prisma: PrismaClient,
  data: RestaurantInput[],
): Promise<number> {
  let menuItemCount = 0
  for (const r of data) {
    const { menu, ...restaurantData } = r
    const restaurant = await prisma.restaurant.upsert({
      where: { slug: restaurantData.slug },
      update: {
        imageUrl: restaurantData.imageUrl,
        bannerUrl: restaurantData.bannerUrl ?? null,
        rating: restaurantData.rating,
        ratingCount: restaurantData.ratingCount,
        cuisines: restaurantData.cuisines,
        description: restaurantData.description,
        area: restaurantData.area,
        address: restaurantData.address,
      },
      create: restaurantData,
    })
    menuItemCount += await seedMenu(prisma, restaurant.id, menu)
    console.log(`  ✓ [${restaurant.city}] ${restaurant.name}`)
  }
  return menuItemCount
}

async function seedMenu(
  prisma: PrismaClient,
  restaurantId: string,
  menu: CategoryData[],
): Promise<number> {
  // Remove order items referencing this restaurant's menu items before deleting them
  const menuItemIds = await prisma.menuItem
    .findMany({ where: { category: { restaurantId } }, select: { id: true } })
    .then((rows) => rows.map((r) => r.id))

  if (menuItemIds.length > 0) {
    await prisma.orderItem.deleteMany({ where: { menuItemId: { in: menuItemIds } } })
  }

  await prisma.menuItem.deleteMany({ where: { category: { restaurantId } } })
  await prisma.menuCategory.deleteMany({ where: { restaurantId } })

  let count = 0
  for (let ci = 0; ci < menu.length; ci++) {
    const cat = menu[ci]
    const category = await prisma.menuCategory.create({
      data: { restaurantId, name: cat.name, sortOrder: ci },
    })
    for (let ii = 0; ii < cat.items.length; ii++) {
      const item = cat.items[ii]
      const fallbackId = item.isVeg ? P.veg : P.chicken
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          description: item.description,
          isBestSeller: item.isBestSeller ?? false,
          isAvailable: true,
          sortOrder: ii,
          imageUrl: mImg(item.imageId ?? fallbackId),
        },
      })
      count++
    }
  }
  return count
}
