"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BannerSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  mobile_image_url?: string
  link_text?: string
  link_url?: string
  category_id?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function AutoSliderBanner() {
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?category=Homepage Hero')
        const data = await response.json()
        if (response.ok && data.banners) {
          setBannerSlides(data.banners)
        } else {
          // Fallback to default banners if API fails
          setBannerSlides([
            {
              id: '1',
              title: 'New Collection',
              subtitle: 'Designer Dresses',
              description: 'Discover our latest collection of stunning designer dresses for every occasion',
              image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=600&fit=crop',
              link_text: 'Shop Now',
              link_url: '/browse',
              is_active: true,
              display_order: 1,
              created_at: '',
              updated_at: ''
            },
            {
              id: '2',
              title: 'Summer Sale',
              subtitle: 'Up to 50% Off',
              description: 'Get ready for summer with our exclusive collection at unbeatable prices',
              image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop',
              link_text: 'View Sale',
              link_url: '/browse?sale=true',
              is_active: true,
              display_order: 2,
              created_at: '',
              updated_at: ''
            },
            {
              id: '3',
              title: 'Bridal Collection',
              subtitle: 'Dream Wedding',
              description: 'Make your special day unforgettable with our exquisite bridal collection',
              image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=600&fit=crop',
              link_text: 'Explore',
              link_url: '/browse?category=bridal',
              is_active: true,
              display_order: 3,
              created_at: '',
              updated_at: ''
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        // Fallback to default banners if API fails
        setBannerSlides([
          {
            id: '1',
            title: 'New Collection',
            subtitle: 'Designer Dresses',
            description: 'Discover our latest collection of stunning designer dresses for every occasion',
            image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=600&fit=crop',
            link_text: 'Shop Now',
            link_url: '/browse',
            is_active: true,
            display_order: 1,
            created_at: '',
            updated_at: ''
          },
          {
            id: '2',
            title: 'Summer Sale',
            subtitle: 'Up to 50% Off',
            description: 'Get ready for summer with our exclusive collection at unbeatable prices',
            image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop',
            link_text: 'View Sale',
            link_url: '/browse?sale=true',
            is_active: true,
            display_order: 2,
            created_at: '',
            updated_at: ''
          },
          {
            id: '3',
            title: 'Bridal Collection',
            subtitle: 'Dream Wedding',
            description: 'Make your special day unforgettable with our exquisite bridal collection',
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=600&fit=crop',
            link_text: 'Explore',
            link_url: '/browse?category=bridal',
            is_active: true,
            display_order: 3,
            created_at: '',
            updated_at: ''
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || bannerSlides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, bannerSlides.length])

  const nextSlide = () => {
    if (bannerSlides.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    if (bannerSlides.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  // Don't render if loading or no banners
  if (loading) {
    return (
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    )
  }

  if (bannerSlides.length === 0) {
    return null
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-background to-muted/20">
      {/* Slides Container */}
      <div className="relative h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 
              index < currentSlide ? 'opacity-0 -translate-x-full' : 
              'opacity-0 translate-x-full'
            }`}
          >
            {/* Background Image - Responsive */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${slide.mobile_image_url || slide.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Enhanced gradient overlay for better text readability */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/20"
            />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="animate-fade-in-up">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)' }}>
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 sm:mb-6 gradient-text leading-tight drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.4)' }}>
                        {slide.subtitle}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-lg leading-relaxed drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.3)' }}>
                        {slide.description}
                      </p>
                    )}
                    {slide.link_url && (
                      <Link href={slide.link_url}>
                        <Button 
                          size="lg" 
                          className="btn-luxury text-sm sm:text-base md:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-7 animate-scale-in-spring hover-glow shadow-2xl font-semibold w-full sm:w-auto border-2 border-white/20 backdrop-blur-sm"
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                        >
                          {slide.link_text || 'Shop Now'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows Removed */}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
