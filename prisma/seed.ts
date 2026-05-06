import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Demo User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@swiggy.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@swiggy.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
    },
  })
  console.log(`✅ User: ${user.email}`)

  // ─── Restaurants ───────────────────────────────────────────────────────────
  const restaurants = [
    {
      name: "McDonald's",
      slug: 'mcdonalds-koramangala',
      description: "America's favourite burgers, now hotter and faster than ever.",
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=400&fit=crop',
      cuisines: ['Burgers', 'Fast Food', 'American'],
      rating: 4.3,
      ratingCount: 12400,
      avgDeliveryTime: 25,
      deliveryFee: 0,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Koramangala',
      address: '100 Feet Road, Koramangala, Bangalore',
    },
    {
      name: 'Meghana Foods',
      slug: 'meghana-foods-koramangala',
      description: 'Authentic Andhra biryani cooked in dum style with aromatic spices.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
      cuisines: ['Biryani', 'Andhra', 'South Indian'],
      rating: 4.5,
      ratingCount: 8900,
      avgDeliveryTime: 35,
      deliveryFee: 30,
      minOrderAmount: 150,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Koramangala',
      address: '71/72, Koramangala 4th Block, Bangalore',
    },
    {
      name: 'Pizza Hut',
      slug: 'pizza-hut-indiranagar',
      description: 'Pan pizzas, stuffed crust, and more — made fresh to your order.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      cuisines: ['Pizza', 'Italian', 'Fast Food'],
      rating: 4.1,
      ratingCount: 6300,
      avgDeliveryTime: 40,
      deliveryFee: 40,
      minOrderAmount: 199,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Indiranagar',
      address: '100 Feet Road, Indiranagar, Bangalore',
    },
    {
      name: 'Saravanaa Bhavan',
      slug: 'saravanaa-bhavan-btm',
      description: 'South India\'s iconic pure vegetarian restaurant.',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      cuisines: ['South Indian', 'Tiffin', 'North Indian'],
      rating: 4.6,
      ratingCount: 15200,
      avgDeliveryTime: 30,
      deliveryFee: 0,
      minOrderAmount: 100,
      isOpen: true,
      isPureVeg: true,
      city: 'Bangalore',
      area: 'BTM Layout',
      address: '14th Cross, BTM 2nd Stage, Bangalore',
    },
    {
      name: 'Behrouz Biryani',
      slug: 'behrouz-biryani-whitefield',
      description: 'Royal dum biryanis inspired by Persian culinary traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop',
      cuisines: ['Biryani', 'Mughlai', 'Persian'],
      rating: 4.4,
      ratingCount: 9800,
      avgDeliveryTime: 45,
      deliveryFee: 50,
      minOrderAmount: 250,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Whitefield',
      address: 'Prestige Tech Park, Whitefield, Bangalore',
    },
    {
      name: 'Chinese Wok',
      slug: 'chinese-wok-jp-nagar',
      description: 'Fresh and flavourful Indo-Chinese food made to order.',
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop',
      cuisines: ['Chinese', 'Indo-Chinese', 'Asian'],
      rating: 3.9,
      ratingCount: 4100,
      avgDeliveryTime: 30,
      deliveryFee: 25,
      minOrderAmount: 149,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'JP Nagar',
      address: '5th Phase, JP Nagar, Bangalore',
    },
    {
      name: 'Domino\'s Pizza',
      slug: 'dominos-pizza-jayanagar',
      description: '30 minutes or free — India\'s #1 pizza delivery brand.',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      cuisines: ['Pizza', 'Pasta', 'Fast Food'],
      rating: 4.0,
      ratingCount: 22000,
      avgDeliveryTime: 30,
      deliveryFee: 0,
      minOrderAmount: 149,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Jayanagar',
      address: '4th Block, Jayanagar, Bangalore',
    },
    {
      name: 'Burger King',
      slug: 'burger-king-mg-road',
      description: 'Have it your way — flame-grilled burgers with real flavour.',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      cuisines: ['Burgers', 'Fast Food', 'American'],
      rating: 4.2,
      ratingCount: 7800,
      avgDeliveryTime: 28,
      deliveryFee: 30,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'MG Road',
      address: 'Brigade Road, MG Road, Bangalore',
    },
  ]

  for (const r of restaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug: r.slug },
      update: {},
      create: r,
    })
    console.log(`✅ Restaurant: ${restaurant.name}`)

    await seedMenu(restaurant.id, restaurant.name)
  }

  console.log('\n✨ Seeding complete!')
  console.log('   Demo login: demo@swiggy.com / password123')
}

async function seedMenu(restaurantId: string, restaurantName: string) {
  // Generic menu templates per cuisine type
  const menuTemplates: Record<string, { categories: { name: string; items: { name: string; price: number; isVeg: boolean; description?: string; isBestSeller?: boolean }[] }[] }> = {
    "McDonald's": {
      categories: [
        {
          name: 'Burgers',
          items: [
            { name: 'McAloo Tikki', price: 59, isVeg: true, description: 'Crispy potato and peas patty with tangy sauce', isBestSeller: true },
            { name: 'McVeggie', price: 79, isVeg: true, description: 'A delicious vegetable patty with special sauce' },
            { name: 'McChicken', price: 99, isVeg: false, description: 'Crispy chicken patty with mayo', isBestSeller: true },
            { name: 'McSpicy Chicken', price: 149, isVeg: false, description: 'Spicy chicken fillet burger with jalapeno' },
            { name: 'Maharaja Mac', price: 169, isVeg: false, description: 'Double chicken patty with special sauce', isBestSeller: true },
          ],
        },
        {
          name: 'Wraps & Sides',
          items: [
            { name: 'Spicy Paneer Wrap', price: 129, isVeg: true, description: 'Grilled paneer with veggies and chipotle sauce' },
            { name: 'McSaver Fries (M)', price: 69, isVeg: true, description: 'Golden crispy fries', isBestSeller: true },
            { name: 'McSaver Fries (L)', price: 89, isVeg: true },
            { name: 'Hash Brown', price: 49, isVeg: true, description: 'Crispy golden hash brown' },
          ],
        },
        {
          name: 'Beverages & Desserts',
          items: [
            { name: 'McCafé Latte', price: 99, isVeg: true },
            { name: 'Chocolate Shake', price: 89, isVeg: true, isBestSeller: true },
            { name: 'McFlurry Oreo', price: 79, isVeg: true },
            { name: 'Soft Serve Cone', price: 29, isVeg: true },
          ],
        },
      ],
    },
    'Meghana Foods': {
      categories: [
        {
          name: 'Biryani',
          items: [
            { name: 'Chicken Biryani (Half)', price: 199, isVeg: false, description: 'Aromatic dum chicken biryani — half portion', isBestSeller: true },
            { name: 'Chicken Biryani (Full)', price: 349, isVeg: false, description: 'Aromatic dum chicken biryani — full portion' },
            { name: 'Mutton Biryani (Half)', price: 249, isVeg: false, description: 'Slow-cooked dum mutton biryani', isBestSeller: true },
            { name: 'Veg Biryani (Half)', price: 149, isVeg: true, description: 'Mixed vegetables in aromatic basmati rice' },
          ],
        },
        {
          name: 'Starters',
          items: [
            { name: 'Chicken 65', price: 189, isVeg: false, description: 'Spicy deep-fried chicken', isBestSeller: true },
            { name: 'Gobi Manchurian', price: 149, isVeg: true },
            { name: 'Fish Fry', price: 229, isVeg: false },
            { name: 'Paneer 65', price: 169, isVeg: true },
          ],
        },
        {
          name: 'Curries & Dal',
          items: [
            { name: 'Dal Tadka', price: 129, isVeg: true },
            { name: 'Chicken Curry', price: 199, isVeg: false },
            { name: 'Paneer Butter Masala', price: 179, isVeg: true, isBestSeller: true },
          ],
        },
      ],
    },
    'Pizza Hut': {
      categories: [
        {
          name: 'Pan Pizzas',
          items: [
            { name: 'Margherita (M)', price: 249, isVeg: true, description: 'Classic tomato sauce and mozzarella', isBestSeller: true },
            { name: 'Veg Supreme (M)', price: 399, isVeg: true, description: 'Loaded with farm-fresh veggies' },
            { name: 'Chicken Supreme (M)', price: 449, isVeg: false, description: 'Grilled chicken with BBQ sauce', isBestSeller: true },
            { name: 'BBQ Chicken (L)', price: 649, isVeg: false, description: 'Large BBQ chicken pizza' },
          ],
        },
        {
          name: 'Pastas & Sides',
          items: [
            { name: 'Mac n Cheese Pasta', price: 199, isVeg: true, isBestSeller: true },
            { name: 'Chicken Fiesta Pasta', price: 229, isVeg: false },
            { name: 'Garlic Bread', price: 99, isVeg: true, description: 'Toasted garlic bread with herb butter' },
            { name: 'Stuffed Garlic Bread', price: 149, isVeg: true },
          ],
        },
        {
          name: 'Desserts & Drinks',
          items: [
            { name: 'Choco Lava Cake', price: 89, isVeg: true, isBestSeller: true },
            { name: 'Pepsi (M)', price: 49, isVeg: true },
          ],
        },
      ],
    },
    'Saravanaa Bhavan': {
      categories: [
        {
          name: 'Breakfast',
          items: [
            { name: 'Masala Dosa', price: 89, isVeg: true, description: 'Crispy dosa with spiced potato filling', isBestSeller: true },
            { name: 'Idli Sambar (3 pcs)', price: 69, isVeg: true },
            { name: 'Rava Dosa', price: 99, isVeg: true, isBestSeller: true },
            { name: 'Uttapam', price: 89, isVeg: true },
            { name: 'Poori Masala', price: 79, isVeg: true },
          ],
        },
        {
          name: 'Meals',
          items: [
            { name: 'Thali (Full Meals)', price: 149, isVeg: true, description: 'Rice, sambar, rasam, curries, and dessert', isBestSeller: true },
            { name: 'Mini Meals', price: 99, isVeg: true },
          ],
        },
        {
          name: 'Beverages',
          items: [
            { name: 'Filter Coffee', price: 49, isVeg: true, isBestSeller: true },
            { name: 'Lassi', price: 59, isVeg: true },
            { name: 'Buttermilk', price: 39, isVeg: true },
          ],
        },
      ],
    },
  }

  // Generic menus for restaurants without a template
  const genericMenus: Record<string, { categories: { name: string; items: { name: string; price: number; isVeg: boolean; isBestSeller?: boolean; description?: string }[] }[] }> = {
    biryani: {
      categories: [
        {
          name: 'Biryani',
          items: [
            { name: 'Chicken Dum Biryani', price: 299, isVeg: false, isBestSeller: true, description: 'Slow-cooked dum biryani with tender chicken' },
            { name: 'Mutton Dum Biryani', price: 399, isVeg: false, description: 'Rich and aromatic mutton biryani' },
            { name: 'Prawn Biryani', price: 349, isVeg: false },
            { name: 'Veg Biryani', price: 199, isVeg: true },
          ],
        },
        { name: 'Starters', items: [
            { name: 'Seekh Kebab', price: 249, isVeg: false, isBestSeller: true },
            { name: 'Paneer Tikka', price: 229, isVeg: true },
        ]},
      ],
    },
    chinese: {
      categories: [
        {
          name: 'Noodles & Rice',
          items: [
            { name: 'Veg Hakka Noodles', price: 149, isVeg: true, isBestSeller: true },
            { name: 'Chicken Fried Rice', price: 169, isVeg: false, isBestSeller: true },
            { name: 'Egg Fried Rice', price: 149, isVeg: false },
            { name: 'Schezwan Noodles', price: 169, isVeg: true },
          ],
        },
        {
          name: 'Starters',
          items: [
            { name: 'Veg Momos (6 pcs)', price: 99, isVeg: true, isBestSeller: true },
            { name: 'Chicken Momos (6 pcs)', price: 129, isVeg: false, isBestSeller: true },
            { name: 'Gobi Manchurian', price: 149, isVeg: true },
            { name: 'Chilli Chicken', price: 179, isVeg: false },
          ],
        },
      ],
    },
    pizza: {
      categories: [
        {
          name: 'Pizzas',
          items: [
            { name: 'Margherita (M)', price: 199, isVeg: true, isBestSeller: true },
            { name: 'Pepperoni (M)', price: 299, isVeg: false, isBestSeller: true },
            { name: 'BBQ Chicken (L)', price: 499, isVeg: false },
            { name: 'Veggie Delight (M)', price: 249, isVeg: true },
          ],
        },
        {
          name: 'Sides',
          items: [
            { name: 'Garlic Bread', price: 99, isVeg: true, isBestSeller: true },
            { name: 'Cheesy Dip', price: 29, isVeg: true },
          ],
        },
      ],
    },
    burgers: {
      categories: [
        {
          name: 'Burgers',
          items: [
            { name: 'Classic Veg Burger', price: 79, isVeg: true, isBestSeller: true },
            { name: 'Crispy Chicken Burger', price: 129, isVeg: false, isBestSeller: true },
            { name: 'Double Patty Burger', price: 179, isVeg: false },
            { name: 'Whopper', price: 199, isVeg: false },
          ],
        },
        {
          name: 'Combos',
          items: [
            { name: 'Burger + Fries + Drink', price: 199, isVeg: false, isBestSeller: true },
            { name: 'Veg Combo', price: 149, isVeg: true },
          ],
        },
      ],
    },
  }

  // Determine which menu to use
  let menuData = menuTemplates[restaurantName]

  if (!menuData) {
    const nameLower = restaurantName.toLowerCase()
    if (nameLower.includes('biryani') || nameLower.includes('behrouz')) menuData = genericMenus.biryani
    else if (nameLower.includes('chinese') || nameLower.includes('wok')) menuData = genericMenus.chinese
    else if (nameLower.includes('pizza') || nameLower.includes('domino')) menuData = genericMenus.pizza
    else if (nameLower.includes('burger') || nameLower.includes('king')) menuData = genericMenus.burgers
    else menuData = genericMenus.burgers // fallback
  }

  for (let catIdx = 0; catIdx < menuData.categories.length; catIdx++) {
    const cat = menuData.categories[catIdx]
    const category = await prisma.menuCategory.create({
      data: { restaurantId, name: cat.name, sortOrder: catIdx },
    })

    for (let itemIdx = 0; itemIdx < cat.items.length; itemIdx++) {
      const item = cat.items[itemIdx]
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          description: item.description,
          isBestSeller: item.isBestSeller ?? false,
          isAvailable: true,
          sortOrder: itemIdx,
          imageUrl: item.isVeg
            ? `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop`
            : `https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=150&fit=crop`,
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
