import { img, banner, P, type RestaurantInput } from './helpers'

export const puneRestaurants: RestaurantInput[] = [
  {
    name: 'Vaishali Restaurant',
    slug: 'vaishali-restaurant-fc-road',
    description: 'Pune\'s most iconic South Indian vegetarian restaurant on F.C. Road since 1976 — a college culture institution.',
    imageUrl: img(P.dosa),
    bannerUrl: banner(P.dosa),
    cuisines: ['South Indian', 'Vegetarian', 'Tiffin'],
    rating: 4.6, ratingCount: 19400, avgDeliveryTime: 30, deliveryFee: 20, minOrderAmount: 99,
    isOpen: true, isPureVeg: true,
    city: 'Pune', area: 'F.C. Road', address: '1038, Fergusson College Road, Shivaji Nagar, Pune',
    menu: [
      { name: 'Dosa & Tiffin', items: [
        { name: 'Masala Dosa', price: 99, isVeg: true, description: 'Crispy dosa with spiced potato filling and coconut chutney', isBestSeller: true, imageId: P.dosa },
        { name: 'Vada Sambar (2 pcs)', price: 79, isVeg: true, description: 'Crispy medu vada dipped in sambar', isBestSeller: true, imageId: P.idli },
        { name: 'Idli Sambar (3 pcs)', price: 69, isVeg: true, imageId: P.idli },
        { name: 'Uttapam', price: 89, isVeg: true, description: 'Thick savoury pancake with toppings', imageId: P.dosa },
        { name: 'Rava Dosa', price: 109, isVeg: true, imageId: P.dosa },
      ]},
      { name: 'Meals & Snacks', items: [
        { name: 'South Indian Thali', price: 149, isVeg: true, description: 'Rice, sambar, rasam, 3 curries, papad, pickle', isBestSeller: true, imageId: P.thali },
        { name: 'Batata Vada', price: 39, isVeg: true, description: 'Deep-fried spiced potato ball', imageId: P.streetFood },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Sugarcane Juice', price: 49, isVeg: true, imageId: P.drinks },
        { name: 'Masala Lemonade', price: 45, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Wadeshwar',
    slug: 'wadeshwar-deccan',
    description: 'Deccan\'s beloved vegetarian eatery — South Indian tiffin meets Maharashtrian snacks.',
    imageUrl: img(P.idli),
    cuisines: ['South Indian', 'Maharashtrian', 'Snacks'],
    rating: 4.4, ratingCount: 14100, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Pune', area: 'Deccan', address: 'Apte Road, Deccan Gymkhana, Pune',
    menu: [
      { name: 'South Indian', items: [
        { name: 'Masala Dosa', price: 89, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Idli Sambar (2 pcs)', price: 59, isVeg: true, imageId: P.idli },
        { name: 'Rava Idli (3 pcs)', price: 79, isVeg: true, imageId: P.idli },
      ]},
      { name: 'Maharashtrian Snacks', items: [
        { name: 'Misal Pav', price: 79, isVeg: true, description: 'Spicy sprouted moth beans with farsan and pav', isBestSeller: true, imageId: P.streetFood },
        { name: 'Poha', price: 59, isVeg: true, description: 'Fluffy flattened rice with peanuts and sev', isBestSeller: true, imageId: P.veg },
        { name: 'Sabudana Khichdi', price: 69, isVeg: true, description: 'Sago pearls with peanuts and green chillies', imageId: P.veg },
        { name: 'Vada Pav', price: 25, isVeg: true, imageId: P.streetFood },
      ]},
      { name: 'Beverages', items: [
        { name: 'Filter Coffee', price: 35, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Taak (Spiced Buttermilk)', price: 35, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Café Peter',
    slug: 'cafe-peter-camp',
    description: 'Pune\'s oldest European-style café in Camp — mutton cutlets and cold coffee since 1942.',
    imageUrl: img(P.coffee),
    cuisines: ['Continental', 'Café', 'Breakfast'],
    rating: 4.3, ratingCount: 7600, avgDeliveryTime: 35, deliveryFee: 30, minOrderAmount: 149,
    isOpen: true, isPureVeg: false,
    city: 'Pune', area: 'Camp', address: 'East Street, Camp, Pune',
    menu: [
      { name: 'Classics', items: [
        { name: 'Mutton Cutlets (2 pcs)', price: 219, isVeg: false, description: 'Old-school breadcrumbed mutton cutlets with mustard sauce', isBestSeller: true, imageId: P.kebab },
        { name: 'Chicken Steak with Sauce', price: 299, isVeg: false, description: 'Grilled chicken breast with mushroom sauce and mashed potato', isBestSeller: true, imageId: P.chicken },
        { name: 'Chicken in Garlic Sauce', price: 279, isVeg: false, imageId: P.chicken },
        { name: 'Omelette (2 eggs)', price: 129, isVeg: false, description: 'Fluffy omelette with cheese and herbs', imageId: P.egg },
      ]},
      { name: 'Sandwiches & Snacks', items: [
        { name: 'Club Sandwich', price: 179, isVeg: false, description: 'Triple-decker chicken club on toasted brown bread', isBestSeller: true, imageId: P.sandwich },
        { name: 'Veg Grilled Sandwich', price: 129, isVeg: true, imageId: P.sandwich },
        { name: 'Bread Pudding', price: 99, isVeg: true, description: 'Baked custard bread pudding with caramel sauce', imageId: P.dessert },
      ]},
      { name: 'Beverages', items: [
        { name: 'Cold Coffee', price: 89, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Hot Chocolate', price: 99, isVeg: true, imageId: P.coffee },
        { name: 'Masala Chai', price: 39, isVeg: true, imageId: P.chai },
      ]},
    ],
  },
  {
    name: 'Good Luck Café',
    slug: 'good-luck-cafe-deccan',
    description: 'Pune\'s legendary Irani-style café — bun maska and kheema since the 1930s.',
    imageUrl: img(P.coffee),
    cuisines: ['Irani Café', 'Breakfast', 'Snacks'],
    rating: 4.4, ratingCount: 12100, avgDeliveryTime: 30, deliveryFee: 20, minOrderAmount: 79,
    isOpen: true, isPureVeg: false,
    city: 'Pune', area: 'Deccan', address: 'Next to Deccan Bus Stop, Pune',
    menu: [
      { name: 'Irani Café Specials', items: [
        { name: 'Brun Maska', price: 45, isVeg: true, description: 'Crispy brun bread toasted with layers of white butter', isBestSeller: true, imageId: P.bread },
        { name: 'Keema Pav', price: 149, isVeg: false, description: 'Spiced minced mutton with toasted pav — the Pune breakfast', isBestSeller: true, imageId: P.curry },
        { name: 'Kheema Naan', price: 169, isVeg: false, description: 'Baked naan stuffed with spiced minced mutton', imageId: P.bread },
        { name: 'Mawa Cake', price: 69, isVeg: true, description: 'Soft milk-solid cake — an Irani café signature', isBestSeller: true, imageId: P.dessert },
      ]},
      { name: 'Beverages', items: [
        { name: 'Irani Chai', price: 35, isVeg: true, description: 'Slow-brewed condensed milk tea', isBestSeller: true, imageId: P.chai },
        { name: 'Cold Coffee', price: 69, isVeg: true, isBestSeller: true, imageId: P.coffee },
        { name: 'Milkshake', price: 89, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
  {
    name: 'Hotel Shreyas',
    slug: 'hotel-shreyas-deccan',
    description: 'A Pune vegetarian institution since 1958 — Maharashtrian and South Indian specialties.',
    imageUrl: img(P.veg),
    cuisines: ['South Indian', 'Maharashtrian', 'Tiffin'],
    rating: 4.3, ratingCount: 9100, avgDeliveryTime: 25, deliveryFee: 15, minOrderAmount: 79,
    isOpen: true, isPureVeg: true,
    city: 'Pune', area: 'Deccan', address: '87, Tilak Road, Deccan, Pune',
    menu: [
      { name: 'Maharashtrian', items: [
        { name: 'Misal Pav', price: 79, isVeg: true, description: 'Fiery Kolhapuri-style usal with farsan and pav', isBestSeller: true, imageId: P.streetFood },
        { name: 'Sabudana Vada (2 pcs)', price: 69, isVeg: true, description: 'Crispy sago and peanut fritters', isBestSeller: true, imageId: P.streetFood },
        { name: 'Poha', price: 59, isVeg: true, imageId: P.veg },
        { name: 'Kande Pohe', price: 65, isVeg: true, description: 'Poha with onion, peanuts, coriander and lemon', imageId: P.veg },
      ]},
      { name: 'South Indian', items: [
        { name: 'Masala Dosa', price: 89, isVeg: true, isBestSeller: true, imageId: P.dosa },
        { name: 'Idli Sambar (2 pcs)', price: 59, isVeg: true, imageId: P.idli },
      ]},
      { name: 'Festive Specials', items: [
        { name: 'Aamti (Maharashtrian Dal)', price: 89, isVeg: true, description: 'Tangy kokum-based lentil soup', imageId: P.curry },
        { name: 'Puran Poli', price: 79, isVeg: true, description: 'Sweet lentil-stuffed flatbread — festival favourite', isBestSeller: true, imageId: P.bread },
      ]},
    ],
  },
  {
    name: 'Savya Rasa',
    slug: 'savya-rasa-koregaon-park',
    description: 'Coastal South Indian and Kerala cuisine in an upscale Koregaon Park setting.',
    imageUrl: img(P.thali),
    cuisines: ['South Indian', 'Kerala', 'Coastal'],
    rating: 4.4, ratingCount: 6100, avgDeliveryTime: 40, deliveryFee: 40, minOrderAmount: 249,
    isOpen: true, isPureVeg: false,
    city: 'Pune', area: 'Koregaon Park', address: 'North Main Road, Koregaon Park, Pune',
    menu: [
      { name: 'Kerala Specialties', items: [
        { name: 'Kerala Sadya (Full Meals)', price: 299, isVeg: true, description: 'Traditional Kerala banana leaf feast with 20+ dishes', isBestSeller: true, imageId: P.thali },
        { name: 'Fish Curry with Rice', price: 299, isVeg: false, description: 'Kerala-style red fish curry with steamed red rice', isBestSeller: true, imageId: P.seafood },
        { name: 'Appam with Chicken Stew', price: 249, isVeg: false, description: 'Lacy rice pancakes with mildly spiced coconut chicken stew', imageId: P.dosa },
        { name: 'Prawn Moilee', price: 319, isVeg: false, description: 'Prawns in delicate coconut milk curry', imageId: P.seafood },
      ]},
      { name: 'Breads & Mains', items: [
        { name: 'Kerala Parotta (2 pcs)', price: 79, isVeg: true, description: 'Flaky layered flatbread — best with a curry', isBestSeller: true, imageId: P.bread },
        { name: 'Puttu with Kadala Curry', price: 149, isVeg: true, description: 'Steamed rice flour cylinders with black chickpea curry', imageId: P.idli },
      ]},
      { name: 'Desserts & Drinks', items: [
        { name: 'Banana Halwa', price: 99, isVeg: true, description: 'Nendran banana fudge with ghee and cardamom', isBestSeller: true, imageId: P.sweets },
        { name: 'Tender Coconut Water', price: 79, isVeg: true, imageId: P.drinks },
      ]},
    ],
  },
]
