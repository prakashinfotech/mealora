import { img, banner, P, type RestaurantInput } from './helpers'

export const ahmedabadRestaurants: RestaurantInput[] = [
  {
    name: 'Agashiye',
    slug: 'agashiye-old-city',
    description: 'Award-winning rooftop Gujarati thali restaurant in a 400-year-old heritage haveli in the Walled City.',
    imageUrl: img(P.thali),
    bannerUrl: banner(P.thali),
    cuisines: ['Gujarati', 'Thali', 'Heritage'],
    rating: 4.7, ratingCount: 8600, avgDeliveryTime: 40, deliveryFee: 50, minOrderAmount: 399,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Old City', address: 'The House of MG, Opposite Sidi Saiyed Mosque, Old City, Ahmedabad',
    menu: [
      { name: 'Thali', items: [
        { name: 'Unlimited Gujarati Thali', price: 599, isVeg: true, description: 'Over 15 dishes — dal, kadhi, 4 sabzis, rice, roti, farsan, meetha', isBestSeller: true, imageId: P.thali },
        { name: 'Seasonal Special Thali', price: 699, isVeg: true, description: 'Chef\'s choice seasonal ingredients — changes weekly', isBestSeller: true, imageId: P.thali },
      ]},
      { name: 'Gujarati Classics', items: [
        { name: 'Undhiyu', price: 249, isVeg: true, description: 'Slow-cooked seasonal vegetables — Surat style (winter)', imageId: P.curry },
        { name: 'Dal Dhokli', price: 149, isVeg: true, description: 'Wheat flour pasta in spiced lentil soup with ghee', isBestSeller: true, imageId: P.curry },
        { name: 'Shrikhand Puri', price: 149, isVeg: true, description: 'Strained yogurt sweetened with saffron served with puffed puri', imageId: P.sweets },
      ]},
      { name: 'Sweets & Drinks', items: [
        { name: 'Gulab Jamun (2 pcs)', price: 79, isVeg: true, imageId: P.sweets },
        { name: 'Aam Panna', price: 69, isVeg: true, description: 'Raw mango cooler with cumin — a Gujarat summer staple', isBestSeller: true, imageId: P.drinks },
        { name: 'Masala Chaas', price: 49, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Gordhandas & Co.',
    slug: 'gordhandas-law-garden',
    description: 'Law Garden\'s most beloved Gujarati snack shop — Khamang Kakdi, Dabeli, and the best sev usal in the city.',
    imageUrl: img(P.streetFood),
    cuisines: ['Street Food', 'Gujarati', 'Snacks'],
    rating: 4.4, ratingCount: 11200, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Law Garden', address: 'Law Garden Road, Ellisbridge, Ahmedabad',
    menu: [
      { name: 'Chaat & Snacks', items: [
        { name: 'Dabeli', price: 35, isVeg: true, description: 'Spiced potato in a ladi pav with peanuts, sev, and pomegranate', isBestSeller: true, imageId: P.streetFood },
        { name: 'Sev Usal', price: 69, isVeg: true, description: 'Moth bean curry with chutneys and crunchy sev', isBestSeller: true, imageId: P.curry },
        { name: 'Khamang Kakdi', price: 59, isVeg: true, description: 'Spiced cucumber salad with peanuts and coconut', imageId: P.veg },
        { name: 'Pani Puri (6 pcs)', price: 49, isVeg: true, isBestSeller: true, imageId: P.streetFood },
        { name: 'Bhel Puri', price: 69, isVeg: true, imageId: P.streetFood },
      ]},
      { name: 'Gujarati Snacks', items: [
        { name: 'Khaman Dhokla', price: 89, isVeg: true, description: 'Soft steamed chickpea cake with mustard tempering', isBestSeller: true, imageId: P.veg },
        { name: 'Fafda with Jalebi', price: 89, isVeg: true, description: 'Crispy chickpea flour snack with sweet syrupy jalebi — the Ahmedabad Sunday morning', isBestSeller: true, imageId: P.sweets },
        { name: 'Thepla (2 pcs)', price: 59, isVeg: true, description: 'Spiced fenugreek flatbread', imageId: P.bread },
      ]},
      { name: 'Drinks', items: [
        { name: 'Aam Panna', price: 45, isVeg: true, imageId: P.drinks },
        { name: 'Masala Chaas', price: 39, isVeg: true, isBestSeller: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Vishalla',
    slug: 'vishalla-vasna',
    description: 'An open-air Gujarati village restaurant experience in Vasna — traditional folk setting with unlimited thali.',
    imageUrl: img(P.thali),
    cuisines: ['Gujarati', 'Thali', 'Traditional'],
    rating: 4.6, ratingCount: 13200, avgDeliveryTime: 45, deliveryFee: 60, minOrderAmount: 299,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Vasna', address: 'Vasna Tekra, Off S.P. Ring Road, Ahmedabad',
    menu: [
      { name: 'Thali', items: [
        { name: 'Village Style Unlimited Thali', price: 449, isVeg: true, description: 'Served on patra — bajra rotla, kadhi, 4 sabzis, khichdi, chaas, meetha', isBestSeller: true, imageId: P.thali },
        { name: 'Child Thali', price: 199, isVeg: true, description: 'Smaller portions for children', imageId: P.thali },
      ]},
      { name: 'À La Carte', items: [
        { name: 'Bajra Khichdi with Kadhi', price: 149, isVeg: true, description: 'Pearl millet porridge with spiced yogurt soup', isBestSeller: true, imageId: P.curry },
        { name: 'Rotla with Ghee', price: 69, isVeg: true, description: 'Traditional millet flatbread with fresh butter', imageId: P.bread },
        { name: 'Shrikhand', price: 89, isVeg: true, description: 'Strained yogurt with saffron and pistachios', isBestSeller: true, imageId: P.sweets },
        { name: 'Aam Ras', price: 99, isVeg: true, description: 'Fresh Alphonso mango pulp — summer only', imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Honest Restaurant',
    slug: 'honest-drive-in',
    description: 'Ahmedabad\'s most-loved fast food chain — from grilled sandwiches to pav bhaji, always fresh and affordable.',
    imageUrl: img(P.sandwich),
    cuisines: ['Fast Food', 'Gujarati', 'Sandwiches'],
    rating: 4.4, ratingCount: 21400, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Drive-In', address: 'Drive-In Road, Thaltej, Ahmedabad',
    menu: [
      { name: 'Sandwiches', items: [
        { name: 'Grilled Veg Sandwich', price: 79, isVeg: true, description: 'Grilled with cheese, tomato, capsicum and mint chutney', isBestSeller: true, imageId: P.sandwich },
        { name: 'Cheese Corn Sandwich', price: 99, isVeg: true, description: 'Corn, cheese and herbs in toasted bread', isBestSeller: true, imageId: P.sandwich },
        { name: 'Club Sandwich', price: 129, isVeg: true, description: 'Triple-decker with paneer and veggies', imageId: P.sandwich },
      ]},
      { name: 'Fast Food', items: [
        { name: 'Pav Bhaji', price: 99, isVeg: true, isBestSeller: true, imageId: P.streetFood },
        { name: 'Veg Burger', price: 89, isVeg: true, imageId: P.burger },
        { name: 'Pizza (Personal)', price: 149, isVeg: true, description: 'Margherita or Corn & Capsicum', imageId: P.pizza },
      ]},
      { name: 'Beverages', items: [
        { name: 'Cold Coffee', price: 79, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Chocolate Milkshake', price: 99, isVeg: true, imageId: P.dessert },
        { name: 'Masala Chaas', price: 39, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Rajwadu',
    slug: 'rajwadu-chandkheda',
    description: 'Rajasthani and Gujarati village-themed dining in Ahmedabad — folk music, clay pots, and unlimited thali.',
    imageUrl: img(P.thali),
    cuisines: ['Gujarati', 'Rajasthani', 'Traditional'],
    rating: 4.5, ratingCount: 9300, avgDeliveryTime: 40, deliveryFee: 50, minOrderAmount: 249,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Chandkheda', address: 'Near Chandkheda Circle, Ahmedabad',
    menu: [
      { name: 'Thali', items: [
        { name: 'Rajwadu Special Thali', price: 449, isVeg: true, description: 'Rajasthani + Gujarati unlimited — dal baati churma, kadhi, 4 sabzis', isBestSeller: true, imageId: P.thali },
        { name: 'Gujarati Thali', price: 349, isVeg: true, description: 'Unlimited Gujarati thali with seasonal dishes', imageId: P.thali },
      ]},
      { name: 'Rajasthani Specials', items: [
        { name: 'Dal Baati Churma', price: 199, isVeg: true, description: 'Baked wheat balls with spiced lentils and sweet churma', isBestSeller: true, imageId: P.curry },
        { name: 'Gatte ki Sabzi', price: 129, isVeg: true, description: 'Chickpea flour dumplings in tangy yogurt gravy', isBestSeller: true, imageId: P.curry },
        { name: 'Bajra Roti with Lahsun Chutney', price: 69, isVeg: true, imageId: P.bread },
      ]},
      { name: 'Drinks', items: [
        { name: 'Chaas (Rajasthani Masala)', price: 49, isVeg: true, isBestSeller: true, imageId: P.drinks },
        { name: 'Rose Sharbat', price: 59, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Gopi Dining Hall',
    slug: 'gopi-dining-law-garden',
    description: 'Pocket-friendly South Indian vegetarian meals in Law Garden — Ahmedabad\'s favourite dosa spot.',
    imageUrl: img(P.dosa),
    cuisines: ['South Indian', 'Vegetarian', 'Snacks'],
    rating: 4.3, ratingCount: 8900, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Ahmedabad', area: 'Law Garden', address: 'Law Garden, Ellisbridge, Ahmedabad',
    menu: [
      { name: 'Tiffin', items: [
        { name: 'Masala Dosa', price: 79, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Idli Vada (2+2)', price: 79, isVeg: true, description: '2 idlis and 2 medu vadas with sambar and chutney', isBestSeller: true, imageId: P.idli },
        { name: 'Uttapam', price: 79, isVeg: true, imageId: P.dosa },
        { name: 'Rava Dosa', price: 89, isVeg: true, imageId: P.dosa },
      ]},
      { name: 'Meals', items: [
        { name: 'South Indian Meals', price: 119, isVeg: true, description: 'Rice, sambar, rasam, 2 curries, papad', isBestSeller: true, imageId: P.thali },
        { name: 'Sambar Rice', price: 79, isVeg: true, imageId: P.veg },
        { name: 'Curd Rice', price: 69, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 29, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Masala Chai', price: 25, isVeg: true, imageId: P.chai },
        { name: 'Coconut Water', price: 49, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
]
