import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SmoothScrollContext = createContext({
  lenis: null,
  isReducedMotion: false,
  scrollTo: () => {}
})

export function SmoothScrollProvider({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const lenisRef = useRef(null)
  const location = useLocation()

  // Detect accessibility preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Initialize Lenis and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    if (isReducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoRaf: false
    })

    lenisRef.current = lenis
    setLenisInstance(lenis)

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCb = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCb)
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [isReducedMotion])

  // Handle route and hash navigation transitions
  useEffect(() => {
    const { hash, search } = location

    const handleNavigationScroll = () => {
      if (hash) {
        const targetId = hash.replace('#', '')
        const targetEl = document.getElementById(targetId)
        if (targetEl) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetEl, { offset: -90, duration: 1.2 })
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' })
          }
          return
        }
      }

      // Check for theme query param on themes page
      const params = new URLSearchParams(search)
      const themeParam = params.get('theme')
      if (themeParam) {
        const themeEl = document.getElementById(themeParam)
        if (themeEl) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(themeEl, { offset: -90, duration: 1.2 })
          } else {
            themeEl.scrollIntoView({ behavior: 'smooth' })
          }
          return
        }
      }

      // Default: Reset scroll to top on route change
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }

      ScrollTrigger.refresh()
    }

    // Brief timeout to ensure DOM nodes have updated
    const timer = setTimeout(handleNavigationScroll, 120)
    return () => clearTimeout(timer)
  }, [location.pathname, location.hash, location.search])

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -90, ...options })
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (typeof target === 'string') {
        const el = document.querySelector(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisInstance,
        isReducedMotion,
        scrollTo
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
