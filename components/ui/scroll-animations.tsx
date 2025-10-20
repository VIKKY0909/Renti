"use client"

import { useEffect, useRef, useState } from "react"

// Intersection Observer hook for scroll animations
export function useScrollAnimation(options = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Optional: stop observing after first animation
          // observer.unobserve(element)
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px',
        ...options 
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [elementRef, isVisible] as const
}

// Scroll-triggered animation component
interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: string
  delay?: number
  className?: string
  threshold?: number
}

export function ScrollAnimation({ 
  children, 
  animation = "fade-in-up", 
  delay = 0,
  className = "",
  threshold = 0.1 
}: ScrollAnimationProps) {
  const [elementRef, isVisible] = useScrollAnimation({ threshold })

  return (
    <div
      ref={elementRef}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: isVisible ? animation : 'none'
      }}
    >
      {children}
    </div>
  )
}

// Staggered scroll animation for lists
interface StaggeredScrollAnimationProps {
  children: React.ReactNode[]
  animation?: string
  staggerDelay?: number
  className?: string
}

export function StaggeredScrollAnimation({ 
  children, 
  animation = "fade-in-up", 
  staggerDelay = 100,
  className = ""
}: StaggeredScrollAnimationProps) {
  const [elementRef, isVisible] = useScrollAnimation()

  return (
    <div ref={elementRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ 
            animationDelay: `${index * staggerDelay}ms`,
            animation: isVisible ? animation : 'none'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Parallax scroll component
interface ParallaxScrollProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxScroll({ children, speed = 0.5, className = "" }: ParallaxScrollProps) {
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

// Reveal animation for text
interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const [elementRef, isVisible] = useScrollAnimation()

  return (
    <div
      ref={elementRef}
      className={`overflow-hidden ${className}`}
    >
      <div
        className={`transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-full opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  )
}

// Counter animation on scroll
interface AnimatedCounterProps {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  className = "",
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [elementRef, isVisible] = useScrollAnimation()

  useEffect(() => {
    if (!isVisible) return

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
  }, [end, duration, isVisible])

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}




