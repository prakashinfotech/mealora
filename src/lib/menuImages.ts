const KEYWORD_MAP: { keywords: string[]; id: string }[] = [
  { keywords: ['biryani', 'dum biryani', 'dum rice'], id: 'photo-1589302168068-964664d93dc0' },
  { keywords: ['dosa', 'masala dosa', 'rava dosa', 'set dosa', 'uttapam', 'appam'], id: 'photo-1668236543090-82eba5ee5976' },
  { keywords: ['idli', 'rava idli', 'vada', 'medu'], id: 'photo-1589301760014-d929f3979dbc' },
  { keywords: ['thali', 'meals', 'full meals', 'mini meals', 'unlimited'], id: 'photo-1567337710282-00832b415979' },
  { keywords: ['burger', 'whopper', 'smash burger', 'patty', 'mcaloo', 'mcveggie', 'mcchicken', 'maharaja'], id: 'photo-1568901346375-23c9450c58cd' },
  { keywords: ['pizza', 'margherita', 'pepperoni', 'farmhouse', 'pan pizza', 'stuffed crust'], id: 'photo-1565299624946-b28f40a0ae38' },
  { keywords: ['pasta', 'spaghetti', 'fettuccine', 'penne', 'tagliatelle', 'linguine', 'aglio', 'arrabbiata', 'alfredo', 'bolognese', 'carbonara', 'primavera'], id: 'photo-1555949258-eb67b1ef0ceb' },
  { keywords: ['risotto', 'gnocchi', 'ravioli'], id: 'photo-1555949258-eb67b1ef0ceb' },
  { keywords: ['noodles', 'hakka', 'schezwan noodles', 'thukpa', 'singapore noodles', 'pad thai'], id: 'photo-1534482421-64566f976cfa' },
  { keywords: ['sushi', 'nigiri', 'sashimi', 'maki', 'california roll', 'dragon roll', 'spicy tuna', 'temaki', 'uramaki'], id: 'photo-1579871494447-9811cf80d66c' },
  { keywords: ['gyoza', 'edamame', 'miso', 'ramen', 'udon', 'tempura'], id: 'photo-1579871494447-9811cf80d66c' },
  { keywords: ['momo', 'dumpling', 'dimsum', 'dim sum', 'wonton', 'har gao', 'crystal dumpling'], id: 'photo-1563245372-f21724e3856d' },
  { keywords: ['ice cream', 'sundae', 'scoop', 'gelato', 'cone', 'soft serve', 'kulfi', 'banana split'], id: 'photo-1560008581-09826d1de69e' },
  { keywords: ['waffle', 'crepe', 'pancake', 'belgian'], id: 'photo-1562376552-0d160a2f238d' },
  { keywords: ['chocolate', 'brownie', 'lava cake', 'nutella', 'biscoff', 'lotus', 'death by', 'fudge', 'hot fudge'], id: 'photo-1562376552-0d160a2f238d' },
  { keywords: ['cake', 'cheesecake', 'red velvet', 'tiramisu', 'mousse', 'tart', 'pastry', 'eclair'], id: 'photo-1562376552-0d160a2f238d' },
  { keywords: ['gulab jamun', 'kheer', 'halwa', 'rasgulla', 'barfi', 'ladoo', 'jalebi', 'rabdi', 'shahi tukda'], id: 'photo-1548365328-8c6db3220e4c' },
  { keywords: ['coffee', 'latte', 'cappuccino', 'filter coffee', 'espresso', 'americano', 'cold coffee', 'cafe latte'], id: 'photo-1509042239860-f550ce710b93' },
  { keywords: ['shake', 'milkshake', 'smoothie', 'lassi', 'buttermilk', 'mojito'], id: 'photo-1567620905732-2d1ec7ab7445' },
  { keywords: ['juice', 'nimbu pani', 'lemonade', 'aam panna', 'rose milk', 'badam milk'], id: 'photo-1576092768241-dec231879fc3' },
  { keywords: ['chai', 'masala chai', 'cutting chai', 'tea'], id: 'photo-1542314831-068cd1dbfeeb' },
  { keywords: ['kebab', 'seekh', 'tikka', 'tandoori', 'shawarma', 'skewer', 'galouti', 'kakori', 'boti', 'chapli'], id: 'photo-1544025162-d76694265947' },
  { keywords: ['roll', 'kathi roll', 'frankie', 'wrap', 'paratha roll'], id: 'photo-1626700051175-6818013e1d4f' },
  { keywords: ['paneer', 'butter masala', 'palak paneer', 'malai paneer', 'shahi paneer', 'paneer tikka', 'paneer 65'], id: 'photo-1585937421612-70a008356fbe' },
  { keywords: ['dal', 'dal tadka', 'dal makhani', 'lentil', 'rajma', 'chhole', 'chole', 'pav bhaji', 'bhaji'], id: 'photo-1585937421612-70a008356fbe' },
  { keywords: ['curry', 'korma', 'rogan josh', 'vindaloo', 'masala', 'saag', 'kofta', 'chicken curry', 'mutton curry'], id: 'photo-1603360946369-dc9bb6258143' },
  { keywords: ['naan', 'roti', 'paratha', 'puri', 'poori', 'kulcha', 'laccha', 'missi', 'garlic bread', 'ciabatta', 'focaccia'], id: 'photo-1574894709920-11b28b6e8799' },
  { keywords: ['fries', 'french fries', 'chips', 'hash brown', 'onion ring', 'loaded fries'], id: 'photo-1585109649139-366815a0d713' },
  { keywords: ['soup', 'miso soup', 'tom yum', 'hot and sour', 'manchow', 'wonton soup'], id: 'photo-1547592166-23ac45744acd' },
  { keywords: ['salad', 'caprese', 'caesar', 'greek', 'coleslaw'], id: 'photo-1512621776951-a57141f2eefd' },
  { keywords: ['chicken 65', 'fried chicken', 'crispy chicken', 'popcorn chicken'], id: 'photo-1604908176997-125f25cc6f3d' },
  { keywords: ['fish fry', 'fish', 'prawn', 'seafood', 'crab', 'lobster', 'squid', 'calamari'], id: 'photo-1559339352-11d035aa65de' },
  { keywords: ['egg', 'omelette', 'bhurji', 'frittata', 'poached'], id: 'photo-1569050467447-ce54b3bbc37d' },
  { keywords: ['sandwich', 'club sandwich', 'blt', 'grilled sandwich', 'panini', 'sub', 'toast'], id: 'photo-1528735602780-2552fd46c7af' },
  { keywords: ['fried rice', 'nasi goreng', 'egg fried rice', 'chicken fried rice', 'veg fried rice', 'singapore rice'], id: 'photo-1603133872878-684f208fb84b' },
  { keywords: ['manchurian', 'kung pao', 'mapo tofu', 'chilli chicken', 'honey chilli', 'schezwan chicken', 'baby corn', 'tofu'], id: 'photo-1552611052-33e04de081de' },
  { keywords: ['biryani rice', 'jeera rice', 'pulao', 'steamed rice', 'curd rice', 'lemon rice'], id: 'photo-1567337710282-00832b415979' },
]

const VEG_FALLBACK = 'photo-1512621776951-a57141f2eefd'
const NON_VEG_FALLBACK = 'photo-1604908176997-125f25cc6f3d'

const GENERIC_IDS = new Set([
  'photo-1512621776951-a57141f2eefd',
  'photo-1544025162-d76694265947',
])

const BASE = 'https://images.unsplash.com'

export function getMenuItemImage(name: string, isVeg: boolean): string {
  const lower = name.toLowerCase()
  for (const { keywords, id } of KEYWORD_MAP) {
    if (keywords.some((k) => lower.includes(k))) {
      return `${BASE}/${id}?w=200&h=150&fit=crop`
    }
  }
  const fallback = isVeg ? VEG_FALLBACK : NON_VEG_FALLBACK
  return `${BASE}/${fallback}?w=200&h=150&fit=crop`
}

export function isGenericPlaceholder(url: string | null | undefined): boolean {
  if (!url) return true
  return Array.from(GENERIC_IDS).some((id) => url.includes(id))
}
