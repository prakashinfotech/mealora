import Link from 'next/link'

const CARDS = [
  {
    title: 'FOOD DELIVERY',
    subtitle: 'FROM RESTAURANTS',
    badge: 'UPTO 60% OFF',
    emoji: '🍱',
    href: '/restaurants',
    bg: 'bg-orange-50',
  },
  {
    title: 'GREAT OFFERS',
    subtitle: 'BEST DEALS TODAY',
    badge: 'UPTO 40% OFF',
    emoji: '🎉',
    href: '/restaurants?sortBy=rating',
    bg: 'bg-green-50',
  },
  {
    title: 'TOP RATED',
    subtitle: 'BEST IN BANGALORE',
    badge: '4.5+ STARS',
    emoji: '⭐',
    href: '/restaurants?rating=4',
    bg: 'bg-amber-50',
  },
]

export function PromoCards() {
  return (
    <div className="bg-brand-orange pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`${card.bg} rounded-2xl p-6 flex flex-col gap-3 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            >
              <div>
                <h3 className="text-xl font-black text-swiggy-black tracking-tight leading-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] font-semibold text-swiggy-gray mt-0.5 tracking-widest uppercase">
                  {card.subtitle}
                </p>
              </div>

              <span className="self-start bg-brand-orange/10 text-brand-orange text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                {card.badge}
              </span>

              <div className="flex items-end justify-between mt-2">
                <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-200 text-lg leading-none">
                  →
                </div>
                <span className="text-5xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 select-none">
                  {card.emoji}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
