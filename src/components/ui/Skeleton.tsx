import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-swiggy-border rounded', className)} />
}

export function RestaurantCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-44 rounded-t-2xl rounded-b-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2 border-t border-swiggy-border mt-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function RestaurantsPageSkeleton() {
  return (
    <div className="min-h-screen bg-swiggy-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-6 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
