import Link from 'next/link'

interface Props {
  restaurantId: string
  restaurantName: string
  /** e.g. "Categories", "Items", "Add Item", "Edit Item" */
  section?: string
}

export function MenuBreadcrumb({ restaurantId, restaurantName, section }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-5 flex-wrap">
      <Link href="/admin/restaurants" className="hover:text-slate-700 transition-colors">
        Restaurants
      </Link>
      <span>/</span>
      <Link
        href={`/admin/restaurants/${restaurantId}/menu`}
        className="hover:text-slate-700 transition-colors truncate max-w-[180px]"
        title={restaurantName}
      >
        {restaurantName}
      </Link>
      <span>/</span>
      {section ? (
        <>
          <Link
            href={`/admin/restaurants/${restaurantId}/menu`}
            className="hover:text-slate-700 transition-colors"
          >
            Menu
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{section}</span>
        </>
      ) : (
        <span className="text-slate-700 font-medium">Menu</span>
      )}
    </nav>
  )
}
