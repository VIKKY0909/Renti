"use client"

import { useState, useEffect } from "react"
import { Tag, ChevronLeft, ChevronRight } from "lucide-react"

interface DiscountBanner {
  id: string
  title: string
  description: string
  discount_code?: string
  discount_percentage?: number
  is_active: boolean
  display_order: number
}

export function DiscountBanner() {
  const [banners, setBanners] = useState<DiscountBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch discount banners
  useEffect(() => {
    const fetchDiscountBanners = async () => {
      try {
        const response = await fetch('/api/banners?category=Discount Banner')
        const data = await response.json()
        if (response.ok && data.banners) {
          setBanners(data.banners.filter((banner: DiscountBanner) => banner.is_active))
        } else {
          // Fallback to default banner
          setBanners([{
            id: '1',
            title: 'Special Offer',
            description: 'Use code FIRSTTIME2025 for 20% off your first rental',
            discount_code: 'FIRSTTIME2025',
            discount_percentage: 20,
            is_active: true,
            display_order: 1
          }])
        }
      } catch (error) {
        console.error('Error fetching discount banners:', error)
        // Fallback banner
        setBanners([{
          id: '1',
          title: 'Special Offer',
          description: 'Use code FIRSTTIME2025 for 20% off your first rental',
          discount_code: 'FIRSTTIME2025',
          discount_percentage: 20,
          is_active: true,
          display_order: 1
        }])
      } finally {
        setLoading(false)
      }
    }

    fetchDiscountBanners()
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-secondary via-primary to-accent py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-white">
            <Tag className="h-5 w-5 animate-pulse" />
            <p className="text-sm md:text-base font-medium animate-pulse">
              Loading special offers...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  return (
    <section className="bg-gradient-to-r from-secondary via-primary to-accent py-4 overflow-hidden relative">
      {/* Infinite scroll animation */}
      <div className="absolute inset-0 flex items-center">
        <div className="animate-scroll whitespace-nowrap text-white/20">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="inline-block mr-8">
              🎉 SPECIAL OFFERS 🎉 UP TO 50% OFF 🎉 LIMITED TIME 🎉
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-3 text-white">
          <Tag className="h-5 w-5 flex-shrink-0" />
          
          {/* Banner content */}
          <div className="flex-1 text-center">
            <div 
              key={currentBanner.id}
              className="animate-fade-in"
            >
              <p className="text-sm md:text-base font-medium">
                {currentBanner.title}: {currentBanner.description}
                {currentBanner.discount_code && (
                  <span className="font-bold ml-2 bg-white/20 px-2 py-1 rounded">
                    {currentBanner.discount_code}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Navigation arrows (only show if multiple banners) */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Next banner"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {banners.length > 1 && (
          <div className="flex justify-center mt-2 gap-1">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
