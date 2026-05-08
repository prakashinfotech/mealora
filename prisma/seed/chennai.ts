import { img, banner, P, type RestaurantInput } from './helpers'

export const chennaiRestaurants: RestaurantInput[] = [
  {
    name: 'Murugan Idli Shop',
    slug: 'murugan-idli-t-nagar',
    description: 'Chennai\'s most celebrated idli shop — impossibly soft idlis and fiery chutneys since 1969.',
    imageUrl: img(P.idli),
    bannerUrl: banner(P.idli),
    cuisines: ['South Indian', 'Tiffin', 'Breakfast'],
    rating: 4.6, ratingCount: 24600, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Chennai', area: 'T. Nagar', address: '77, Usman Road, T. Nagar, Chennai',
    menu: [
      { name: 'Tiffin', items: [
        { name: 'Idli Sambar (2 pcs)', price: 55, isVeg: true, description: 'Murugan\'s famously soft idlis with hotel-style sambar', isBestSeller: true, imageId: P.idli },
        { name: 'Mini Tiffin Set', price: 99, isVeg: true, description: '2 idli, 1 vada, 1 pongal with sambar and 3 chutneys', isBestSeller: true, imageId: P.thali },
        { name: 'Ghee Pongal', price: 79, isVeg: true, description: 'Soft rice and lentil preparation with generous ghee', imageId: P.idli },
        { name: 'Medu Vada (2 pcs)', price: 55, isVeg: true, description: 'Crispy lentil doughnuts with coconut chutney', imageId: P.idli },
        { name: 'Idiyappam with Curry', price: 79, isVeg: true, description: 'Steamed rice flour strings with coconut milk curry', imageId: P.idli },
      ]},
      { name: 'Chutneys & Extras', items: [
        { name: 'Tomato Chutney (Extra)', price: 15, isVeg: true, imageId: P.veg },
        { name: 'Coconut Chutney (Extra)', price: 15, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, description: 'Strong South Indian decoction served in a tumbler', isBestSeller: true, imageId: P.coffee },
        { name: 'Masala Chai', price: 29, isVeg: true, imageId: P.chai },
      ]},
    ],
  },
  {
    name: 'Sangeetha Veg Restaurant',
    slug: 'sangeetha-veg-anna-nagar',
    description: 'Chennai\'s go-to vegetarian restaurant chain — South Indian meals, dosas, and more.',
    imageUrl: img(P.dosa),
    cuisines: ['South Indian', 'Vegetarian', 'Tiffin'],
    rating: 4.4, ratingCount: 13200, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Chennai', area: 'Anna Nagar', address: '2nd Avenue, Anna Nagar, Chennai',
    menu: [
      { name: 'Tiffin', items: [
        { name: 'Masala Dosa', price: 89, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Rava Dosa', price: 99, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Pongal', price: 69, isVeg: true, imageId: P.idli },
        { name: 'Sambar Vada (2 pcs)', price: 59, isVeg: true, imageId: P.idli },
        { name: 'Poori Masala (2 pcs)', price: 79, isVeg: true, imageId: P.bread },
      ]},
      { name: 'Meals', items: [
        { name: 'Mini Meals', price: 99, isVeg: true, description: 'Rice, sambar, rasam and 2 curries', isBestSeller: true, imageId: P.thali },
        { name: 'Full Meals', price: 139, isVeg: true, description: 'Rice, sambar, rasam, 3 curries, papad, pickle, dessert', imageId: P.thali },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Badam Milk', price: 69, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Thalappakatti',
    slug: 'thalappakatti-anna-nagar',
    description: 'The original Dindigul biryani house — short-grain seeraga samba rice with bold Chettinad spices.',
    imageUrl: img(P.biryani),
    bannerUrl: banner(P.biryani),
    cuisines: ['Biryani', 'Chettinad', 'South Indian'],
    rating: 4.5, ratingCount: 16400, avgDeliveryTime: 35, deliveryFee: 25, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Chennai', area: 'Anna Nagar', address: 'Anna Nagar Main Road, Chennai',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Dindigul Chicken Biryani', price: 229, isVeg: false, description: 'Seeraga samba rice with bold Dindigul spice blend and raita', isBestSeller: true, imageId: P.biryani },
        { name: 'Dindigul Mutton Biryani', price: 299, isVeg: false, isBestSeller: true, imageId: P.biryani2 },
        { name: 'Veg Biryani', price: 159, isVeg: true, imageId: P.biryani },
      ]},
      { name: 'Curries & Sides', items: [
        { name: 'Mutton Chops Fry', price: 249, isVeg: false, description: 'Bone-in mutton chops with Chettinad spice rub', isBestSeller: true, imageId: P.kebab },
        { name: 'Chicken Curry', price: 199, isVeg: false, imageId: P.curry },
        { name: 'Raita', price: 49, isVeg: true, imageId: P.veg },
        { name: 'Papad', price: 29, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Desserts', items: [
        { name: 'Semiya Payasam', price: 69, isVeg: true, description: 'Vermicelli kheer with cardamom and saffron', imageId: P.sweets },
      ]},
    ],
  },
  {
    name: 'Junior Kuppanna',
    slug: 'junior-kuppanna-egmore',
    description: 'Celebrated Chettinad restaurant known for its authentic village-style spice-forward cooking.',
    imageUrl: img(P.curry),
    cuisines: ['Chettinad', 'South Indian', 'Non-Vegetarian'],
    rating: 4.4, ratingCount: 9600, avgDeliveryTime: 35, deliveryFee: 30, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Chennai', area: 'Egmore', address: 'Egmore High Road, Chennai',
    menu: [
      { name: 'Chettinad Curries', items: [
        { name: 'Chettinad Chicken Curry', price: 249, isVeg: false, description: 'Country chicken in stone-ground kalpasi and marathi mokku spice gravy', isBestSeller: true, imageId: P.curry },
        { name: 'Mutton Kola Urundai', price: 269, isVeg: false, description: 'Minced mutton and lentil balls deep-fried', isBestSeller: true, imageId: P.kebab },
        { name: 'Prawn Masala', price: 319, isVeg: false, imageId: P.seafood },
        { name: 'Nandu Rasam', price: 149, isVeg: false, description: 'Crab-based soup — a Chettinad delicacy', imageId: P.soup },
      ]},
      { name: 'Rice & Bread', items: [
        { name: 'Curd Rice', price: 89, isVeg: true, isBestSeller: true, imageId: P.veg },
        { name: 'Parotta (2 pcs)', price: 49, isVeg: true, description: 'Layered flatbread flaky on the outside', imageId: P.bread },
        { name: 'Rasam', price: 59, isVeg: true, imageId: P.soup },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Chaas', price: 35, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Buhari Hotel',
    slug: 'buhari-hotel-mount-road',
    description: 'Chennai\'s landmark for Mughlai and biryani on Mount Road since 1951.',
    imageUrl: img(P.biryani2),
    cuisines: ['Mughlai', 'North Indian', 'Biryani'],
    rating: 4.3, ratingCount: 11100, avgDeliveryTime: 35, deliveryFee: 25, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Chennai', area: 'Mount Road', address: 'Anna Salai, Mount Road, Chennai',
    menu: [
      { name: 'Biryani', items: [
        { name: 'Chicken Biryani', price: 219, isVeg: false, isBestSeller: true, imageId: P.biryani },
        { name: 'Mutton Biryani', price: 289, isVeg: false, isBestSeller: true, imageId: P.biryani2 },
        { name: 'Egg Biryani', price: 149, isVeg: false, imageId: P.biryani },
      ]},
      { name: 'Mughlai Specials', items: [
        { name: 'Chicken Tikka (6 pcs)', price: 249, isVeg: false, imageId: P.kebab },
        { name: 'Haleem', price: 179, isVeg: false, description: 'Slow-cooked wheat and mutton porridge', isBestSeller: true, imageId: P.curry },
        { name: 'Butter Naan', price: 49, isVeg: true, imageId: P.bread },
      ]},
      { name: 'Desserts', items: [
        { name: 'Phirni', price: 79, isVeg: true, description: 'Chilled rice pudding with rose water', isBestSeller: true, imageId: P.sweets },
        { name: 'Gulab Jamun (2 pcs)', price: 79, isVeg: true, imageId: P.sweets },
      ]},
    ],
  },
  {
    name: 'Anjappar Chettinad Restaurant',
    slug: 'anjappar-chettinad-egmore',
    description: 'Authentic Chettinad cuisine — complex spice blends, open-fire cooking, and fiery curries.',
    imageUrl: img(P.curry),
    cuisines: ['Chettinad', 'South Indian', 'Non-Vegetarian'],
    rating: 4.4, ratingCount: 12200, avgDeliveryTime: 35, deliveryFee: 30, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Chennai', area: 'Egmore', address: 'Halls Road, Egmore, Chennai',
    menu: [
      { name: 'Chettinad Specialties', items: [
        { name: 'Chicken Chettinad Masala', price: 259, isVeg: false, description: 'Bone-in chicken with aromatic kalpasi and star anise gravy', isBestSeller: true, imageId: P.curry },
        { name: 'Mutton Varuval', price: 299, isVeg: false, description: 'Dry mutton preparation with Chettinad spice rub', isBestSeller: true, imageId: P.curry },
        { name: 'Prawn Fry', price: 319, isVeg: false, imageId: P.seafood },
        { name: 'Keerai Masiyal', price: 99, isVeg: true, description: 'Mashed spinach with garlic tempering', imageId: P.veg },
      ]},
      { name: 'Breads & Rice', items: [
        { name: 'Kari Dosai', price: 119, isVeg: false, description: 'Crispy dosa topped with spiced minced meat', isBestSeller: true, imageId: P.dosa },
        { name: 'Parotta (2 pcs)', price: 49, isVeg: true, imageId: P.bread },
        { name: 'Appam (2 pcs)', price: 69, isVeg: true, description: 'Lacy rice flour pancakes with coconut milk', imageId: P.dosa },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Nannari Sharbat', price: 49, isVeg: true, description: 'Chilled Indian sarsaparilla drink', imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Saravana Bhavan',
    slug: 'saravana-bhavan-t-nagar',
    description: 'The global South Indian vegetarian chain that started in T. Nagar in 1981.',
    imageUrl: img(P.dosa),
    cuisines: ['South Indian', 'Tiffin', 'Vegetarian'],
    rating: 4.5, ratingCount: 29400, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Chennai', area: 'T. Nagar', address: '293, Usman Road, T. Nagar, Chennai',
    menu: [
      { name: 'Tiffin', items: [
        { name: 'Masala Dosa', price: 89, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Idli Sambar (3 pcs)', price: 75, isVeg: true, isBestSeller: true, imageId: P.idli },
        { name: 'Rava Dosa', price: 109, isVeg: true, imageId: P.dosa },
        { name: 'Pongal with Sambar', price: 85, isVeg: true, imageId: P.idli },
        { name: 'Kanchipuram Idli', price: 89, isVeg: true, description: 'Temple-style idli with peppercorns and cumin', imageId: P.idli },
      ]},
      { name: 'Meals', items: [
        { name: 'Full Meals', price: 149, isVeg: true, description: 'Rice, sambar, rasam, 3 curries, papad, pickle, dessert', isBestSeller: true, imageId: P.thali },
        { name: 'Mini Meals', price: 109, isVeg: true, imageId: P.thali },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 39, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Badam Kheer', price: 69, isVeg: true, imageId: P.sweets },
      ]},
    ],
  },
  {
    name: 'Kaaraikudi Restaurant',
    slug: 'kaaraikudi-nungambakkam',
    description: 'Fine Chettinad dining in a heritage-styled setting — the real taste of Karaikudi.',
    imageUrl: img(P.curry),
    cuisines: ['Chettinad', 'South Indian', 'Non-Vegetarian'],
    rating: 4.3, ratingCount: 8300, avgDeliveryTime: 40, deliveryFee: 35, minOrderAmount: 199,
    isOpen: true, isPureVeg: false,
    city: 'Chennai', area: 'Nungambakkam', address: 'Nungambakkam High Road, Chennai',
    menu: [
      { name: 'Signature Dishes', items: [
        { name: 'Chicken Sukka', price: 279, isVeg: false, description: 'Dry-roasted chicken with coconut and Chettinad spices', isBestSeller: true, imageId: P.curry },
        { name: 'Mutton Masala', price: 319, isVeg: false, description: 'Slow-cooked mutton with ground spice paste', isBestSeller: true, imageId: P.curry },
        { name: 'Crab Curry', price: 399, isVeg: false, description: 'Whole crab in a tangy coconut-based gravy', imageId: P.seafood },
        { name: 'Banana Flower Kootu', price: 119, isVeg: true, description: 'Banana blossom stir-fried with lentils and coconut', imageId: P.veg },
      ]},
      { name: 'Breads & Rice', items: [
        { name: 'Appam (2 pcs)', price: 69, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Idiyappam (3 pcs)', price: 59, isVeg: true, imageId: P.idli },
        { name: 'Curd Rice', price: 89, isVeg: true, imageId: P.veg },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 39, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Nannari Sharbat', price: 59, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
]
