"use client"

import { useEffect, useRef, useState } from "react"

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FloatingElement({ children, delay = 0, duration = 3, className = "" }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const animate = () => {
      element.style.animation = `float ${duration}s ease-in-out infinite`
      element.style.animationDelay = `${delay}s`
    }

    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [delay, duration])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

interface ShimmerTextProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerText({ children, className = "" }: ShimmerTextProps) {
  return (
    <span className={`relative overflow-hidden ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </span>
  )
}

interface PulseGlowProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export function PulseGlow({ children, className = "", color = "primary" }: PulseGlowProps) {
  return (
    <div className={`animate-pulse-glow ${className}`}>
      {children}
    </div>
  )
}

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  gradient?: string
}

export function GradientBorder({ children, className = "", gradient = "primary" }: GradientBorderProps) {
  const gradientClass = gradient === "primary" 
    ? "bg-gradient-to-r from-primary via-secondary to-accent"
    : gradient === "luxury"
    ? "bg-gradient-to-r from-primary via-accent to-primary"
    : "bg-gradient-to-r from-primary to-secondary"

  return (
    <div className={`relative p-[1px] rounded-lg ${gradientClass}`}>
      <div className={`bg-background rounded-lg ${className}`}>
        {children}
      </div>
    </div>
  )
}

// Performance-optimized parallax component
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let ticking = false

    const updateTransform = () => {
      if (!element) return

      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      element.style.transform = `translate3d(0, ${rate}px, 0)`
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateTransform)
        ticking = true
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

// Intersection Observer hook for animations
export function useIntersectionObserver(options = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [elementRef, isIntersecting]
}

// Animated counter component
interface AnimatedCounterProps {
  end: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ end, duration = 2000, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [elementRef, isIntersecting] = useIntersectionObserver()

  useEffect(() => {
    if (!isIntersecting) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isIntersecting])

  return (
    <span ref={elementRef} className={className}>
      {count}
    </span>
  )
}
