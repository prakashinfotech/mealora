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
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop',
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
    {
      name: 'La Pino\'z Pizza',
      slug: 'la-pinoz-pizza-hsr',
      description: 'Hand-tossed, stone-baked pizzas with fresh toppings and rich sauces.',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=400&fit=crop',
      cuisines: ['Pizza', 'Italian', 'Fast Food'],
      rating: 4.3,
      ratingCount: 5400,
      avgDeliveryTime: 35,
      deliveryFee: 30,
      minOrderAmount: 199,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'HSR Layout',
      address: '27th Main, HSR Layout, Bangalore',
    },
    {
      name: 'Paradise Biryani',
      slug: 'paradise-biryani-marathahalli',
      description: 'Hyderabad\'s legendary dum biryani, now in Bangalore.',
      imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200&h=400&fit=crop',
      cuisines: ['Biryani', 'Hyderabadi', 'Mughlai'],
      rating: 4.5,
      ratingCount: 11200,
      avgDeliveryTime: 40,
      deliveryFee: 35,
      minOrderAmount: 199,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Marathahalli',
      address: 'Outer Ring Road, Marathahalli, Bangalore',
    },
    {
      name: 'The Burger Lab',
      slug: 'the-burger-lab-hsr',
      description: 'Gourmet smash burgers with premium patties and house-made sauces.',
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&h=400&fit=crop',
      cuisines: ['Burgers', 'American', 'Fast Food'],
      rating: 4.4,
      ratingCount: 3800,
      avgDeliveryTime: 28,
      deliveryFee: 40,
      minOrderAmount: 149,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'HSR Layout',
      address: 'Sector 2, HSR Layout, Bangalore',
    },
    {
      name: 'Mainland China',
      slug: 'mainland-china-ub-city',
      description: 'Fine-dining Chinese cuisine with authentic Cantonese and Sichuan flavours.',
      imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1200&h=400&fit=crop',
      cuisines: ['Chinese', 'Asian', 'Cantonese'],
      rating: 4.3,
      ratingCount: 6700,
      avgDeliveryTime: 45,
      deliveryFee: 50,
      minOrderAmount: 299,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'UB City',
      address: 'UB City Mall, Vittal Mallya Road, Bangalore',
    },
    {
      name: 'MTR 1924',
      slug: 'mtr-1924-lalbagh',
      description: 'Bangalore\'s oldest and most iconic pure vegetarian South Indian restaurant.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&h=400&fit=crop',
      cuisines: ['South Indian', 'Tiffin', 'Breakfast'],
      rating: 4.7,
      ratingCount: 19500,
      avgDeliveryTime: 30,
      deliveryFee: 0,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: true,
      city: 'Bangalore',
      area: 'Lalbagh',
      address: '11 Lalbagh Road, Mavalli, Bangalore',
    },
    {
      name: 'The Belgian Waffle Co.',
      slug: 'belgian-waffle-co-indiranagar',
      description: 'Freshly made Belgian waffles, crepes, and desserts with indulgent toppings.',
      imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=1200&h=400&fit=crop',
      cuisines: ['Desserts', 'Waffles', 'Bakery'],
      rating: 4.2,
      ratingCount: 7100,
      avgDeliveryTime: 25,
      deliveryFee: 30,
      minOrderAmount: 149,
      isOpen: true,
      isPureVeg: true,
      city: 'Bangalore',
      area: 'Indiranagar',
      address: '12th Main, Indiranagar, Bangalore',
    },
    {
      name: 'Kathi Junction',
      slug: 'kathi-junction-electronic-city',
      description: 'Rolled up goodness — Kolkata-style kathi rolls packed with flavour.',
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&h=400&fit=crop',
      cuisines: ['Rolls', 'Kathi Roll', 'Street Food'],
      rating: 3.9,
      ratingCount: 2900,
      avgDeliveryTime: 25,
      deliveryFee: 20,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Electronic City',
      address: 'Phase 1, Electronic City, Bangalore',
    },
    {
      name: 'Trattoria',
      slug: 'trattoria-whitefield',
      description: 'Rustic Italian trattoria serving hand-crafted pasta and risotto.',
      imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1200&h=400&fit=crop',
      cuisines: ['Pasta', 'Italian', 'Continental'],
      rating: 4.3,
      ratingCount: 4200,
      avgDeliveryTime: 40,
      deliveryFee: 45,
      minOrderAmount: 249,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Whitefield',
      address: 'ITPL Main Road, Whitefield, Bangalore',
    },
    {
      name: 'Edo Japanese',
      slug: 'edo-japanese-mg-road',
      description: 'Authentic Tokyo-style sushi, nigiri, and Japanese small plates.',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=400&fit=crop',
      cuisines: ['Sushi', 'Japanese', 'Asian'],
      rating: 4.5,
      ratingCount: 3100,
      avgDeliveryTime: 45,
      deliveryFee: 60,
      minOrderAmount: 399,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'MG Road',
      address: 'Church Street, MG Road, Bangalore',
    },
    {
      name: 'Momo Station',
      slug: 'momo-station-koramangala',
      description: 'Steamed, fried, and tandoori momos straight from the hills.',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&h=400&fit=crop',
      cuisines: ['Momos', 'Tibetan', 'Chinese'],
      rating: 4.1,
      ratingCount: 5800,
      avgDeliveryTime: 25,
      deliveryFee: 20,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: false,
      city: 'Bangalore',
      area: 'Koramangala',
      address: '5th Block, Koramangala, Bangalore',
    },
    {
      name: 'Rajdhani Thali',
      slug: 'rajdhani-thali-malleswaram',
      description: 'Unlimited Gujarati-Rajasthani thali with rotating seasonal curries.',
      imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200&h=400&fit=crop',
      cuisines: ['Thali', 'Gujarati', 'Rajasthani'],
      rating: 4.4,
      ratingCount: 8900,
      avgDeliveryTime: 35,
      deliveryFee: 0,
      minOrderAmount: 199,
      isOpen: true,
      isPureVeg: true,
      city: 'Bangalore',
      area: 'Malleswaram',
      address: '8th Cross, Malleswaram, Bangalore',
    },
    {
      name: 'Corner House Ice Cream',
      slug: 'corner-house-ice-cream-jayanagar',
      description: 'Bangalore\'s beloved ice cream parlour since 1973 — legendary Death by Chocolate.',
      imageUrl: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=300&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=1200&h=400&fit=crop',
      cuisines: ['Ice Cream', 'Desserts', 'Shakes'],
      rating: 4.6,
      ratingCount: 14300,
      avgDeliveryTime: 20,
      deliveryFee: 25,
      minOrderAmount: 99,
      isOpen: true,
      isPureVeg: true,
      city: 'Bangalore',
      area: 'Jayanagar',
      address: '298, 11th Main, Jayanagar 4th Block, Bangalore',
    },
  ]

  for (const r of restaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug: r.slug },
      update: { imageUrl: r.imageUrl, bannerUrl: r.bannerUrl },
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
    'La Pino\'z Pizza': {
      categories: [
        {
          name: 'Pizzas',
          items: [
            { name: 'Margherita (M)', price: 249, isVeg: true, description: 'Classic tomato base with fresh mozzarella', isBestSeller: true },
            { name: 'Four Cheese (M)', price: 349, isVeg: true, description: 'Mozzarella, cheddar, gouda and parmesan', isBestSeller: true },
            { name: 'Farmhouse (M)', price: 299, isVeg: true, description: 'Capsicum, onion, mushroom and sweet corn' },
            { name: 'BBQ Chicken (M)', price: 399, isVeg: false, description: 'Smoky BBQ sauce with tender chicken chunks', isBestSeller: true },
            { name: 'Peri Peri Chicken (L)', price: 549, isVeg: false, description: 'Fiery peri peri sauce with grilled chicken' },
          ],
        },
        {
          name: 'Sides & Dips',
          items: [
            { name: 'Garlic Bread with Cheese', price: 149, isVeg: true, description: 'Toasted bread loaded with garlic butter and cheese', isBestSeller: true },
            { name: 'Stuffed Garlic Breadsticks', price: 179, isVeg: true, description: 'Pull-apart breadsticks stuffed with cheese' },
            { name: 'Cheesy Dip', price: 49, isVeg: true },
          ],
        },
        {
          name: 'Drinks',
          items: [
            { name: 'Pepsi (L)', price: 69, isVeg: true },
            { name: 'Virgin Mojito', price: 99, isVeg: true, isBestSeller: true },
          ],
        },
      ],
    },
    'Paradise Biryani': {
      categories: [
        {
          name: 'Biryani',
          items: [
            { name: 'Chicken Dum Biryani (Half)', price: 219, isVeg: false, description: 'Aromatic dum-cooked chicken biryani', isBestSeller: true },
            { name: 'Chicken Dum Biryani (Full)', price: 389, isVeg: false, description: 'Full portion of our signature dum biryani', isBestSeller: true },
            { name: 'Mutton Dum Biryani (Half)', price: 279, isVeg: false, description: 'Slow-cooked mutton with fragrant basmati' },
            { name: 'Prawn Biryani', price: 319, isVeg: false, description: 'Juicy prawns in spiced basmati rice' },
            { name: 'Veg Dum Biryani', price: 179, isVeg: true, description: 'Seasonal vegetables in aromatic basmati' },
          ],
        },
        {
          name: 'Starters',
          items: [
            { name: 'Chicken 65', price: 199, isVeg: false, description: 'Crispy spiced fried chicken — a Hyderabadi staple', isBestSeller: true },
            { name: 'Seekh Kebab (4 pcs)', price: 249, isVeg: false, description: 'Minced lamb kebabs with chaat masala' },
            { name: 'Veg Shammi Kebab', price: 179, isVeg: true, description: 'Crispy lentil and vegetable patties' },
          ],
        },
        {
          name: 'Raita & Extras',
          items: [
            { name: 'Raita', price: 49, isVeg: true, description: 'Chilled yogurt with cucumber and mint' },
            { name: 'Mirchi Ka Salan', price: 59, isVeg: true, description: 'Spicy peanut-based gravy' },
          ],
        },
      ],
    },
    'The Burger Lab': {
      categories: [
        {
          name: 'Classic Burgers',
          items: [
            { name: 'Crispy Veg Burger', price: 99, isVeg: true, description: 'Crispy veggie patty with lettuce, tomato and mayo', isBestSeller: true },
            { name: 'Classic Chicken Burger', price: 149, isVeg: false, description: 'Juicy chicken patty with house sauce', isBestSeller: true },
            { name: 'Mushroom Swiss Burger', price: 179, isVeg: true, description: 'Sautéed mushrooms with Swiss cheese' },
            { name: 'Double Smash Burger', price: 219, isVeg: false, description: 'Two smash patties with caramelised onions' },
          ],
        },
        {
          name: 'Loaded Burgers',
          items: [
            { name: 'Bacon BBQ Tower', price: 299, isVeg: false, description: 'Double patty, bacon, BBQ sauce and cheddar', isBestSeller: true },
            { name: 'Truffle Mushroom Burger', price: 249, isVeg: true, description: 'Truffle aioli, portobello mushroom, arugula' },
            { name: 'Spicy Sriracha Chicken', price: 269, isVeg: false, description: 'Crispy chicken tossed in sriracha glaze' },
          ],
        },
        {
          name: 'Sides & Drinks',
          items: [
            { name: 'Loaded Cheese Fries', price: 149, isVeg: true, description: 'Crispy fries drenched in cheddar sauce', isBestSeller: true },
            { name: 'Onion Rings', price: 119, isVeg: true, description: 'Golden battered onion rings' },
            { name: 'Chocolate Milkshake', price: 149, isVeg: true },
          ],
        },
      ],
    },
    'Mainland China': {
      categories: [
        {
          name: 'Dimsums',
          items: [
            { name: 'Crystal Veg Dumpling (4 pcs)', price: 199, isVeg: true, description: 'Translucent skin filled with water chestnut and greens', isBestSeller: true },
            { name: 'Chicken Dimsum (4 pcs)', price: 229, isVeg: false, description: 'Steamed chicken and prawn dumplings', isBestSeller: true },
            { name: 'Prawn Har Gao (4 pcs)', price: 249, isVeg: false, description: 'Classic Cantonese prawn dumplings' },
          ],
        },
        {
          name: 'Mains',
          items: [
            { name: 'Kung Pao Chicken', price: 349, isVeg: false, description: 'Wok-tossed chicken with peanuts and dried chillies', isBestSeller: true },
            { name: 'Crispy Baby Corn', price: 279, isVeg: true, description: 'Battered baby corn in Sichuan sauce' },
            { name: 'Mapo Tofu', price: 269, isVeg: true, description: 'Silken tofu in spicy fermented bean sauce' },
            { name: 'Chilli Garlic Prawns', price: 399, isVeg: false, description: 'Stir-fried prawns in chilli garlic sauce' },
          ],
        },
        {
          name: 'Noodles & Rice',
          items: [
            { name: 'Wok-Tossed Hakka Noodles', price: 249, isVeg: true, isBestSeller: true },
            { name: 'Singapore Fried Rice', price: 279, isVeg: false, description: 'Egg fried rice with XO sauce' },
            { name: 'Schezwan Fried Noodles', price: 249, isVeg: true },
          ],
        },
      ],
    },
    'MTR 1924': {
      categories: [
        {
          name: 'Tiffin',
          items: [
            { name: 'Masala Dosa', price: 95, isVeg: true, description: 'Crispy dosa with spiced potato filling and chutney', isBestSeller: true },
            { name: 'Idli Sambar (2 pcs)', price: 65, isVeg: true, description: 'Fluffy steamed idlis with MTR sambar', isBestSeller: true },
            { name: 'Rava Idli (3 pcs)', price: 85, isVeg: true, description: 'Semolina idlis garnished with cashews' },
            { name: 'Set Dosa (3 pcs)', price: 89, isVeg: true, description: 'Soft spongy dosas with coconut chutney' },
          ],
        },
        {
          name: 'Meals',
          items: [
            { name: 'MTR Special Thali', price: 199, isVeg: true, description: 'Rice, sambar, rasam, 3 curries, papad and dessert', isBestSeller: true },
            { name: 'Mini Meals', price: 149, isVeg: true, description: 'Rice, sambar, rasam and 2 curries' },
            { name: 'Curd Rice', price: 79, isVeg: true, description: 'Cooling curd rice with pickle' },
          ],
        },
        {
          name: 'Beverages',
          items: [
            { name: 'MTR Filter Coffee', price: 45, isVeg: true, description: 'Strong South Indian decoction with hot milk', isBestSeller: true },
            { name: 'Badam Milk', price: 79, isVeg: true, description: 'Chilled almond-flavoured milk' },
            { name: 'Rose Milk', price: 55, isVeg: true },
          ],
        },
      ],
    },
    'The Belgian Waffle Co.': {
      categories: [
        {
          name: 'Waffles',
          items: [
            { name: 'Classic Belgian Waffle', price: 149, isVeg: true, description: 'Light and crispy waffle with maple syrup', isBestSeller: true },
            { name: 'Nutella Banana Waffle', price: 199, isVeg: true, description: 'Waffle piled with Nutella, banana slices and cream', isBestSeller: true },
            { name: 'Red Velvet Waffle', price: 219, isVeg: true, description: 'Red velvet waffle with cream cheese drizzle' },
            { name: 'Lotus Biscoff Waffle', price: 229, isVeg: true, description: 'Biscoff spread, caramelised biscuit crumble and ice cream' },
          ],
        },
        {
          name: 'Crepes & Pancakes',
          items: [
            { name: 'Nutella Crepe', price: 169, isVeg: true, description: 'Thin crepe filled with Nutella and strawberries', isBestSeller: true },
            { name: 'Mixed Berry Crepe', price: 179, isVeg: true, description: 'Seasonal berries with vanilla cream' },
            { name: 'Fluffy Pancake Stack (3)', price: 189, isVeg: true, description: 'Three thick pancakes with butter and honey' },
          ],
        },
        {
          name: 'Beverages',
          items: [
            { name: 'Hot Belgian Chocolate', price: 129, isVeg: true, description: 'Rich dark chocolate with steamed milk' },
            { name: 'Cold Coffee', price: 119, isVeg: true, isBestSeller: true },
            { name: 'Mango Smoothie', price: 139, isVeg: true },
          ],
        },
      ],
    },
    'Kathi Junction': {
      categories: [
        {
          name: 'Veg Rolls',
          items: [
            { name: 'Paneer Kathi Roll', price: 129, isVeg: true, description: 'Spiced paneer tikka wrapped in a paratha', isBestSeller: true },
            { name: 'Aloo Tikki Roll', price: 99, isVeg: true, description: 'Crispy potato tikki with mint chutney' },
            { name: 'Mixed Veg Roll', price: 109, isVeg: true, description: 'Grilled seasonal vegetables with tangy sauce' },
          ],
        },
        {
          name: 'Non-Veg Rolls',
          items: [
            { name: 'Chicken Kathi Roll', price: 149, isVeg: false, description: 'Juicy chicken tikka in a flaky paratha', isBestSeller: true },
            { name: 'Egg Roll', price: 99, isVeg: false, description: 'Classic Kolkata-style egg roll with onion and sauce' },
            { name: 'Chicken Seekh Roll', price: 159, isVeg: false, description: 'Minced chicken seekh kebab with green chutney', isBestSeller: true },
            { name: 'Mutton Roll', price: 179, isVeg: false, description: 'Tender mutton pieces in a toasted paratha' },
          ],
        },
        {
          name: 'Sides',
          items: [
            { name: 'Masala Fries', price: 79, isVeg: true, description: 'Crispy fries tossed in chaat masala', isBestSeller: true },
            { name: 'Mint Chutney', price: 29, isVeg: true },
            { name: 'Extra Paratha', price: 19, isVeg: true },
          ],
        },
      ],
    },
    'Trattoria': {
      categories: [
        {
          name: 'Pasta',
          items: [
            { name: 'Spaghetti Aglio e Olio', price: 229, isVeg: true, description: 'Spaghetti with garlic, olive oil and chilli flakes', isBestSeller: true },
            { name: 'Penne Arrabbiata', price: 219, isVeg: true, description: 'Penne in spicy tomato sauce' },
            { name: 'Fettuccine Alfredo', price: 249, isVeg: true, description: 'Creamy parmesan sauce with fettuccine', isBestSeller: true },
            { name: 'Chicken Bolognese', price: 299, isVeg: false, description: 'Slow-cooked chicken ragù over tagliatelle', isBestSeller: true },
            { name: 'Pasta Primavera', price: 239, isVeg: true, description: 'Seasonal vegetables in a light herb sauce' },
          ],
        },
        {
          name: 'Risotto & Mains',
          items: [
            { name: 'Porcini Mushroom Risotto', price: 299, isVeg: true, description: 'Creamy arborio rice with porcini and truffle oil', isBestSeller: true },
            { name: 'Chicken Risotto', price: 339, isVeg: false, description: 'Roasted chicken with saffron-infused risotto' },
            { name: 'Gnocchi Pomodoro', price: 279, isVeg: true, description: 'Pillowy gnocchi in tomato basil sauce' },
          ],
        },
        {
          name: 'Starters',
          items: [
            { name: 'Garlic Ciabatta', price: 149, isVeg: true, description: 'Toasted ciabatta with herb garlic butter', isBestSeller: true },
            { name: 'Caprese Salad', price: 199, isVeg: true, description: 'Fresh mozzarella, tomato and basil with balsamic' },
          ],
        },
      ],
    },
    'Edo Japanese': {
      categories: [
        {
          name: 'Nigiri & Sashimi',
          items: [
            { name: 'Salmon Nigiri (2 pcs)', price: 299, isVeg: false, description: 'Premium Atlantic salmon over seasoned rice', isBestSeller: true },
            { name: 'Tuna Sashimi (4 pcs)', price: 349, isVeg: false, description: 'Thinly sliced bluefin tuna sashimi' },
            { name: 'Prawn Nigiri (2 pcs)', price: 249, isVeg: false, description: 'Lightly seared tiger prawn on sushi rice' },
          ],
        },
        {
          name: 'Rolls',
          items: [
            { name: 'California Roll (8 pcs)', price: 349, isVeg: false, description: 'Crab, avocado and cucumber inside out roll', isBestSeller: true },
            { name: 'Spicy Tuna Roll (8 pcs)', price: 399, isVeg: false, description: 'Tuna with sriracha mayo and cucumber', isBestSeller: true },
            { name: 'Veggie Avocado Roll (8 pcs)', price: 299, isVeg: true, description: 'Creamy avocado with cucumber and pickled radish' },
            { name: 'Dragon Roll (8 pcs)', price: 449, isVeg: false, description: 'Prawn tempura topped with avocado and eel sauce' },
          ],
        },
        {
          name: 'Sides',
          items: [
            { name: 'Miso Soup', price: 99, isVeg: true, description: 'Classic dashi miso with tofu and wakame' },
            { name: 'Edamame', price: 149, isVeg: true, description: 'Steamed edamame with sea salt' },
            { name: 'Chicken Gyoza (4 pcs)', price: 199, isVeg: false, description: 'Pan-fried chicken dumplings with ponzu' },
          ],
        },
      ],
    },
    'Momo Station': {
      categories: [
        {
          name: 'Steamed Momos',
          items: [
            { name: 'Veg Steamed Momos (8 pcs)', price: 89, isVeg: true, description: 'Classic steamed momos with cabbage and spices', isBestSeller: true },
            { name: 'Chicken Steamed Momos (8 pcs)', price: 109, isVeg: false, description: 'Juicy chicken momos with ginger and garlic', isBestSeller: true },
            { name: 'Paneer Steamed Momos (8 pcs)', price: 99, isVeg: true, description: 'Soft momos filled with spiced paneer' },
          ],
        },
        {
          name: 'Fried & Tandoori Momos',
          items: [
            { name: 'Veg Fried Momos (8 pcs)', price: 99, isVeg: true },
            { name: 'Chicken Fried Momos (8 pcs)', price: 119, isVeg: false, isBestSeller: true },
            { name: 'Tandoori Chicken Momos (6 pcs)', price: 149, isVeg: false, description: 'Grilled in tandoor with smoky spice rub', isBestSeller: true },
            { name: 'Schezwan Fried Momos (8 pcs)', price: 119, isVeg: true, description: 'Crispy momos tossed in Schezwan sauce' },
          ],
        },
        {
          name: 'Soups & Extras',
          items: [
            { name: 'Thukpa Soup', price: 119, isVeg: true, description: 'Tibetan noodle soup with vegetables' },
            { name: 'Chilli Momo (8 pcs)', price: 129, isVeg: false, description: 'Crispy momos tossed in Indo-Chinese chilli sauce' },
            { name: 'Extra Dipping Sauce', price: 29, isVeg: true },
          ],
        },
      ],
    },
    'Rajdhani Thali': {
      categories: [
        {
          name: 'Thali',
          items: [
            { name: 'Rajdhani Special Thali', price: 299, isVeg: true, description: 'Dal, 3 sabzis, rice, roti, papad, pickle and dessert', isBestSeller: true },
            { name: 'Mini Thali', price: 199, isVeg: true, description: 'Dal, 2 sabzis, rice and 2 rotis' },
            { name: 'Premium Thali (Unlimited)', price: 399, isVeg: true, description: 'All items unlimited with seasonal specials', isBestSeller: true },
          ],
        },
        {
          name: 'À La Carte',
          items: [
            { name: 'Dal Makhani', price: 149, isVeg: true, description: 'Slow-cooked black lentils in buttery tomato gravy', isBestSeller: true },
            { name: 'Paneer Butter Masala', price: 179, isVeg: true, description: 'Cottage cheese in rich tomato-cashew gravy' },
            { name: 'Aloo Gobhi', price: 129, isVeg: true, description: 'Dry-spiced potato and cauliflower' },
            { name: 'Jeera Rice', price: 99, isVeg: true },
            { name: 'Butter Naan', price: 39, isVeg: true, isBestSeller: true },
          ],
        },
        {
          name: 'Desserts',
          items: [
            { name: 'Gulab Jamun (2 pcs)', price: 69, isVeg: true, description: 'Soft milk-solid dumplings in rose syrup', isBestSeller: true },
            { name: 'Kheer', price: 79, isVeg: true, description: 'Creamy rice pudding with cardamom and saffron' },
          ],
        },
      ],
    },
    'Corner House Ice Cream': {
      categories: [
        {
          name: 'Sundaes',
          items: [
            { name: 'Death by Chocolate', price: 199, isVeg: true, description: 'Chocolate ice cream, hot fudge, brownie and whipped cream', isBestSeller: true },
            { name: 'Hot Fudge Sundae', price: 169, isVeg: true, description: 'Vanilla ice cream with warm chocolate fudge', isBestSeller: true },
            { name: 'Strawberry Delight', price: 149, isVeg: true, description: 'Strawberry ice cream with fresh berries and cream' },
          ],
        },
        {
          name: 'Scoops & Cones',
          items: [
            { name: 'Single Scoop Cone', price: 79, isVeg: true, description: 'Choose from 20+ flavours' },
            { name: 'Double Scoop Cup', price: 129, isVeg: true, description: 'Two scoops of your choice', isBestSeller: true },
            { name: 'Belgian Chocolate Scoop', price: 99, isVeg: true, description: 'Rich Belgian chocolate ice cream' },
            { name: 'Waffle Cone (2 scoops)', price: 149, isVeg: true, description: 'Fresh-baked waffle cone with two scoops' },
          ],
        },
        {
          name: 'Shakes & More',
          items: [
            { name: 'Thick Chocolate Shake', price: 179, isVeg: true, description: 'Indulgent milkshake blended with chocolate ice cream', isBestSeller: true },
            { name: 'Banana Split', price: 199, isVeg: true, description: 'Three scoops with banana, fudge and nuts' },
            { name: 'Ice Cream Sandwich', price: 129, isVeg: true, description: 'Two chocolate cookies with vanilla ice cream' },
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
