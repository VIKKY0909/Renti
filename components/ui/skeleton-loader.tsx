import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonLoaderProps {
  type?: "card" | "list" | "grid" | "text"
  count?: number
  className?: string
}

export function SkeletonLoader({ type = "card", count = 1, className = "" }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className={`bg-card rounded-2xl border border-border overflow-hidden ${className}`}>
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            </div>
          </div>
        )
      
      case "list":
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case "grid":
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case "text":
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        )
      
      default:
        return <Skeleton className={className} />
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}
