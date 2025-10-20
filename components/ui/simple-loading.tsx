"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function SimpleLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading immediately when pathname changes
    setIsLoading(true)
    
    // Hide loading after a short delay (enough for page to render)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 300ms - fast enough to feel instant

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    </div>
  )
}




