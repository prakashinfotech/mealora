import { img, banner, P, type RestaurantInput } from './helpers'

export const hyderabadRestaurants: RestaurantInput[] = [
  {
    name: 'Hotel Shadab',
    slug: 'hotel-shadab-old-city',
    description: 'The most iconic biryani and haleem house in Hyderabad\'s Old City since 1953.',
    imageUrl: img(P.biryani),
    bannerUrl: banner(P.biryani),
    cuisines: ['Hyderabadi', 'Biryani', 'Haleem'],
    rating: 4.6, ratingCount: 26200, avgDeliveryTime: 35, deliveryFee: 30, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'Old City', address: 'High Court Road, Old City, Hyderabad',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Dum Biryani', price: 249, isVeg: false, description: 'Slow-cooked dum chicken biryani with saffron and fried onions', isBestSeller: true, imageId: P.biryani },
        { name: 'Mutton Dum Biryani', price: 319, isVeg: false, description: 'Tender mutton pieces in fragrant dum basmati rice', isBestSeller: true, imageId: P.biryani2 },
        { name: 'Veg Dum Biryani', price: 179, isVeg: true, imageId: P.biryani },
      ]},
      { name: 'Shadab Specials', items: [
        { name: 'Special Haleem', price: 179, isVeg: false, description: 'Slow-cooked wheat and mutton porridge — the Hyderabadi winter staple', isBestSeller: true, imageId: P.curry },
        { name: 'Kheema (Half)', price: 199, isVeg: false, description: 'Spiced minced mutton with peas', imageId: P.curry },
        { name: 'Patthar ka Gosht', price: 349, isVeg: false, description: 'Mutton slow-cooked on a hot stone slab with spices', isBestSeller: true, imageId: P.kebab },
      ]},
      { name: 'Desserts & Drinks', items: [
        { name: 'Double ka Meetha', price: 89, isVeg: true, description: 'Hyderabadi bread pudding with dry fruits and saffron', isBestSeller: true, imageId: P.sweets },
        { name: 'Irani Chai', price: 39, isVeg: true, description: 'Slow-brewed tea with milk — the Old City staple', imageId: P.chai },
      ]},
    ],
  },
  {
    name: 'Pista House',
    slug: 'pista-house-nampally',
    description: 'Hyderabad\'s most beloved biryani brand — the go-to for Ramzan haleem and dum biryanis.',
    imageUrl: img(P.biryani2),
    bannerUrl: banner(P.biryani2),
    cuisines: ['Biryani', 'Haleem', 'Hyderabadi'],
    rating: 4.5, ratingCount: 21400, avgDeliveryTime: 35, deliveryFee: 25, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'Nampally', address: '1-8-112, Nampally Station Road, Hyderabad',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Biryani', price: 229, isVeg: false, description: 'Aromatic dum chicken biryani with Pista House\'s signature spice blend', isBestSeller: true, imageId: P.biryani },
        { name: 'Mutton Biryani', price: 299, isVeg: false, isBestSeller: true, imageId: P.biryani2 },
        { name: 'Prawn Biryani', price: 349, isVeg: false, imageId: P.seafood },
      ]},
      { name: 'Haleem & Specials', items: [
        { name: 'Special Haleem', price: 189, isVeg: false, description: 'The award-winning GI-tagged Hyderabadi haleem', isBestSeller: true, imageId: P.curry },
        { name: 'Chicken 65', price: 189, isVeg: false, imageId: P.chicken },
        { name: 'Mirchi Ka Salan', price: 79, isVeg: true, description: 'Green chilli in tangy peanut gravy — the biryani accompaniment', imageId: P.curry },
      ]},
      { name: 'Desserts', items: [
        { name: 'Sheer Khurma', price: 89, isVeg: true, description: 'Vermicelli pudding with dry fruits in thickened milk', isBestSeller: true, imageId: P.sweets },
        { name: 'Qubani ka Meetha', price: 99, isVeg: true, description: 'Apricot dessert with cream', imageId: P.sweets },
      ]},
    ],
  },
  {
    name: 'Shah Ghouse',
    slug: 'shah-ghouse-tolichowki',
    description: 'Tolichowki\'s famous biryani destination known for perfectly dum-sealed pots and fresh saffron rice.',
    imageUrl: img(P.biryani3),
    cuisines: ['Biryani', 'Mughlai', 'Hyderabadi'],
    rating: 4.5, ratingCount: 18000, avgDeliveryTime: 35, deliveryFee: 25, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'Tolichowki', address: '4-1-70, Near Tolichowki Petrol Pump, Hyderabad',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Dum Biryani (Half)', price: 219, isVeg: false, isBestSeller: true, imageId: P.biryani },
        { name: 'Chicken Dum Biryani (Full)', price: 389, isVeg: false, imageId: P.biryani2 },
        { name: 'Mutton Dum Biryani (Half)', price: 279, isVeg: false, isBestSeller: true, imageId: P.biryani2 },
        { name: 'Prawn Biryani (Half)', price: 299, isVeg: false, imageId: P.seafood },
      ]},
      { name: 'Starters & Sides', items: [
        { name: 'Chicken 65', price: 199, isVeg: false, isBestSeller: true, imageId: P.chicken },
        { name: 'Seekh Kebab (4 pcs)', price: 229, isVeg: false, imageId: P.kebab },
        { name: 'Bagara Baingan', price: 99, isVeg: true, description: 'Baby brinjal in peanut and tamarind gravy', imageId: P.curry },
        { name: 'Raita', price: 49, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Beverages', items: [
        { name: 'Irani Chai', price: 39, isVeg: true, isBestSeller: true, imageId: P.chai },
        { name: 'Mango Lassi', price: 79, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Café Bahar',
    slug: 'cafe-bahar-bashirbagh',
    description: 'A Hyderabadi institution since 1978 — crowd-favourite biryani with Andhra-style curries.',
    imageUrl: img(P.biryani),
    cuisines: ['Andhra', 'Biryani', 'South Indian'],
    rating: 4.3, ratingCount: 14200, avgDeliveryTime: 30, deliveryFee: 25, minOrderAmount: 129,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'Bashirbagh', address: 'Near Assembly, Bashirbagh, Hyderabad',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Biryani', price: 209, isVeg: false, isBestSeller: true, imageId: P.biryani },
        { name: 'Veg Biryani', price: 149, isVeg: true, imageId: P.biryani },
        { name: 'Egg Biryani', price: 169, isVeg: false, imageId: P.biryani2 },
      ]},
      { name: 'Andhra Curries', items: [
        { name: 'Gongura Mutton', price: 299, isVeg: false, description: 'Mutton cooked with sorrel leaves — Andhra signature', isBestSeller: true, imageId: P.curry },
        { name: 'Chicken Fry', price: 219, isVeg: false, description: 'Andhra-style dry chicken fry with curry leaves', isBestSeller: true, imageId: P.chicken },
        { name: 'Dal Tadka', price: 99, isVeg: true, imageId: P.northIndian },
      ]},
      { name: 'Tiffin & Drinks', items: [
        { name: 'Pesarattu', price: 69, isVeg: true, description: 'Green moong dal dosa with ginger chutney', imageId: P.dosa },
        { name: 'Lassi', price: 59, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Chutneys',
    slug: 'chutneys-banjara-hills',
    description: 'The finest South Indian tiffin experience in Hyderabad — beloved for its vast chutney selection.',
    imageUrl: img(P.dosa),
    bannerUrl: banner(P.dosa),
    cuisines: ['South Indian', 'Vegetarian', 'Tiffin'],
    rating: 4.5, ratingCount: 17400, avgDeliveryTime: 30, deliveryFee: 20, minOrderAmount: 99,
    isOpen: true, isPureVeg: true,
    city: 'Hyderabad', area: 'Banjara Hills', address: '1-10-80, Road No 3, Banjara Hills, Hyderabad',
    menu: [
      { name: 'Tiffin', items: [
        { name: 'Masala Dosa', price: 99, isVeg: true, description: 'Crispy dosa with spiced potato masala and 8 chutneys', isBestSeller: true, imageId: P.dosa },
        { name: 'Pesarattu with Upma', price: 89, isVeg: true, description: 'Green moong dal dosa stuffed with spiced semolina', isBestSeller: true, imageId: P.dosa },
        { name: 'Set Dosa (3 pcs)', price: 89, isVeg: true, imageId: P.dosa },
        { name: 'Idli Sambar (4 pcs)', price: 79, isVeg: true, imageId: P.idli },
        { name: 'Punugulu', price: 79, isVeg: true, description: 'Crispy fried rice batter balls with chutney', isBestSeller: true, imageId: P.streetFood },
      ]},
      { name: 'Meals & Sweets', items: [
        { name: 'Veg Thali', price: 149, isVeg: true, description: 'Rice, sambar, rasam, 2 curries and dessert', imageId: P.thali },
        { name: 'Pongal with Ghee', price: 89, isVeg: true, imageId: P.idli },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 39, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Lassi', price: 59, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Rayalaseema Ruchulu',
    slug: 'rayalaseema-ruchulu-banjara-hills',
    description: 'Authentic Rayalaseema-style Andhra cooking — fiery, bold and unapologetically flavourful.',
    imageUrl: img(P.curry),
    cuisines: ['Andhra', 'South Indian', 'Spicy'],
    rating: 4.4, ratingCount: 11200, avgDeliveryTime: 35, deliveryFee: 30, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'Banjara Hills', address: 'Road No 12, Banjara Hills, Hyderabad',
    menu: [
      { name: 'Andhra Curries', items: [
        { name: 'Gongura Chicken Curry', price: 279, isVeg: false, description: 'Chicken cooked in tangy sorrel leaf gravy', isBestSeller: true, imageId: P.curry },
        { name: 'Natu Kodi Pulusu', price: 299, isVeg: false, description: 'Country chicken stewed in tamarind-onion gravy', isBestSeller: true, imageId: P.curry },
        { name: 'Prawn Iguru', price: 319, isVeg: false, description: 'Dry masala prawns with chilli and curry leaves', imageId: P.seafood },
        { name: 'Dal Tadka (Rayalaseema)', price: 99, isVeg: true, description: 'Dal with horse gram and chilli tempering', imageId: P.northIndian },
      ]},
      { name: 'Rice & Tiffin', items: [
        { name: 'Pesarattu', price: 69, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Pulihora', price: 89, isVeg: true, description: 'Tamarind rice with peanuts — a South Indian classic', imageId: P.friedRice },
        { name: 'Curd Rice', price: 79, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Beverages', items: [
        { name: 'Chaas', price: 39, isVeg: true, imageId: P.drinks },
        { name: 'Filter Coffee', price: 39, isVeg: true, imageId: P.coffee },
      ]},
    ],
  },
  {
    name: 'Bawarchi',
    slug: 'bawarchi-rp-road',
    description: 'RP Road\'s most popular biryani restaurant — affordable, crowd-pleasing, always fresh.',
    imageUrl: img(P.biryani2),
    cuisines: ['Biryani', 'Andhra', 'Mughlai'],
    rating: 4.4, ratingCount: 19200, avgDeliveryTime: 30, deliveryFee: 20, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Hyderabad', area: 'R.P. Road', address: 'RP Road, Secunderabad, Hyderabad',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Biryani', price: 199, isVeg: false, isBestSeller: true, imageId: P.biryani },
        { name: 'Mutton Biryani', price: 269, isVeg: false, isBestSeller: true, imageId: P.biryani2 },
        { name: 'Veg Biryani', price: 149, isVeg: true, imageId: P.biryani },
        { name: 'Egg Biryani', price: 149, isVeg: false, imageId: P.biryani },
      ]},
      { name: 'Starters', items: [
        { name: 'Mirchi Bajji (4 pcs)', price: 89, isVeg: true, description: 'Stuffed green chilli fritters — Hyderabad street staple', isBestSeller: true, imageId: P.streetFood },
        { name: 'Chicken 65', price: 179, isVeg: false, isBestSeller: true, imageId: P.chicken },
        { name: 'Fish Fry', price: 229, isVeg: false, imageId: P.seafood },
      ]},
      { name: 'Beverages', items: [
        { name: 'Raita', price: 49, isVeg: true, imageId: P.veg },
        { name: 'Lassi', price: 59, isVeg: true, isBestSeller: true, imageId: P.drinks },
        { name: 'Irani Chai', price: 29, isVeg: true, imageId: P.chai },
      ]},
    ],
  },
  {
    name: 'Govind Dham',
    slug: 'govind-dham-secunderabad',
    description: 'Pure vegetarian North Indian restaurant in Secunderabad with a legendary mango lassi.',
    imageUrl: img(P.northIndian),
    cuisines: ['North Indian', 'Vegetarian', 'Punjabi'],
    rating: 4.2, ratingCount: 7600, avgDeliveryTime: 30, deliveryFee: 20, minOrderAmount: 129,
    isOpen: true, isPureVeg: true,
    city: 'Hyderabad', area: 'Secunderabad', address: 'MG Road, Secunderabad, Hyderabad',
    menu: [
      { name: 'Curries', items: [
        { name: 'Dal Makhani', price: 149, isVeg: true, isBestSeller: true, imageId: P.curry },
        { name: 'Paneer Butter Masala', price: 179, isVeg: true, isBestSeller: true, imageId: P.northIndian },
        { name: 'Mix Veg', price: 139, isVeg: true, imageId: P.curry },
        { name: 'Kadhai Paneer', price: 189, isVeg: true, imageId: P.northIndian },
      ]},
      { name: 'Breads & Rice', items: [
        { name: 'Butter Naan', price: 39, isVeg: true, isBestSeller: true, imageId: P.bread },
        { name: 'Jeera Rice', price: 99, isVeg: true, imageId: P.veg },
        { name: 'Laccha Paratha', price: 49, isVeg: true, imageId: P.bread },
      ]},
      { name: 'Desserts & Drinks', items: [
        { name: 'Mango Lassi', price: 89, isVeg: true, isBestSeller: true, imageId: P.drinks },
        { name: 'Gulab Jamun (2 pcs)', price: 69, isVeg: true, imageId: P.sweets },
        { name: 'Kheer', price: 79, isVeg: true, imageId: P.sweets },
      ]},
    ],
  },
]
