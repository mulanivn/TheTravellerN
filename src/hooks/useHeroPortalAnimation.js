import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from '../components/scroll/SmoothScrollProvider'

gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook to apply a 3D recessed portal transition with depth parallax
 * to hero sections on scroll.
 */
export function useHeroPortalAnimation() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const contentRef = useRef(null)
  const { isReducedMotion } = useSmoothScroll()

  useEffect(() => {
    if (isReducedMotion || !heroRef.current) return

    const hero = heroRef.current
    const video = videoRef.current
    const content = contentRef.current

    const ctx = gsap.context(() => {
      // 3D Recessed Portal Animation on Hero Section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom 40%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })

      if (video) {
        tl.to(
          video,
          {
            scale: 0.93,
            borderRadius: '24px',
            transformOrigin: 'center center',
            filter: 'brightness(0.7) contrast(1.1)',
            ease: 'power2.out'
          },
          0
        )
      }

      if (content) {
        tl.to(
          content,
          {
            y: -70,
            opacity: 0.35,
            scale: 0.96,
            ease: 'power1.out'
          },
          0
        )
      }
    }, hero)

    return () => ctx.revert()
  }, [isReducedMotion])

  return { heroRef, videoRef, contentRef }
}
