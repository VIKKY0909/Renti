import { Skeleton } from "@/components/ui/skeleton"

export function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Price Skeleton */}
          <div className="bg-muted/50 rounded-2xl p-6 space-y-2">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Actions Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Date Picker Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Size Chart Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
