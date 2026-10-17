import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from '../scroll/SmoothScrollProvider'

gsap.registerPlugin(ScrollTrigger)

export default function ItineraryPath3D({ itinerary = [] }) {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const markerRef = useRef(null)
  const [activeDay, setActiveDay] = useState(0)
  const [progress, setProgress] = useState(0)
  const { isReducedMotion } = useSmoothScroll()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const items = container.querySelectorAll('.itinerary-day-card')

    const ctx = gsap.context(() => {
      // Scrub progress along the entire itinerary timeline
      ScrollTrigger.create({
        trigger: container,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress
          setProgress(p)

          // Determine current active day index
          const index = Math.min(
            itinerary.length - 1,
            Math.floor(p * itinerary.length)
          )
          setActiveDay(index)

          // Position glowing waypoint marker along vertical path
          if (markerRef.current) {
            const containerHeight = container.offsetHeight
            const yPos = p * (containerHeight - 50)
            markerRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`
          }
        }
      })

      // Staggered 3D entrance for each day item
      if (!isReducedMotion) {
        items.forEach((item, idx) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              x: 40,
              rotateY: 10,
              transformPerspective: 800
            },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          )
        })
      }
    }, container)

    return () => ctx.revert()
  }, [itinerary, isReducedMotion])

  return (
    <div ref={containerRef} className="itinerary-3d-timeline position-relative ps-4 ps-md-5 my-4">
      {/* Scroll-Scrubbed 3D Flight Track / Guide Line */}
      <div
        className="timeline-track-rail"
        style={{
          position: 'absolute',
          left: '18px',
          top: '15px',
          bottom: '25px',
          width: '3px',
          background: 'linear-gradient(180deg, #2fb5a4 0%, #075985 60%, #082f49 100%)',
          borderRadius: '4px',
          zIndex: 1
        }}
      >
        {/* Animated Progress Fill */}
        <div
          className="timeline-track-fill"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${progress * 100}%`,
            background: '#72e4d4',
            boxShadow: '0 0 12px #2fb5a4',
            borderRadius: 'inherit',
            transition: 'height 0.1s linear'
          }}
        />

        {/* Glowing 3D Waypoint Flight Marker */}
        <div
          ref={markerRef}
          className="timeline-flight-marker"
          style={{
            position: 'absolute',
            left: '-9px',
            top: '0',
            width: '21px',
            height: '21px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 30%, #2fb5a4 80%)',
            boxShadow: '0 0 18px 4px rgba(47, 181, 164, 0.75)',
            border: '2px solid #ffffff',
            willChange: 'transform',
            zIndex: 3
          }}
        />
      </div>

      {/* Itinerary Day Cards */}
      <div className="d-flex flex-column gap-3">
        {itinerary.map((desc, idx) => {
          const isActive = activeDay === idx
          return (
            <div
              key={idx}
              className={`itinerary-day-card p-3 rounded-4 border transition-all ${
                isActive ? 'active-day shadow-lg' : 'bg-white opacity-85'
              }`}
              style={{
                background: isActive ? '#ffffff' : '#fcfdfd',
                borderColor: isActive ? 'var(--teal)' : 'var(--line)',
                transform: isActive ? 'translateZ(24px) translateX(6px)' : 'none',
                boxShadow: isActive
                  ? '0 16px 36px rgba(47, 181, 164, 0.2)'
                  : '0 4px 12px rgba(8, 47, 73, 0.04)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                perspective: '1000px',
                position: 'relative',
                zIndex: isActive ? 2 : 1
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="badge rounded-pill px-3 py-1 fw-bold"
                  style={{
                    backgroundColor: isActive ? 'var(--teal)' : 'var(--ocean)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    letterSpacing: '0.04em'
                  }}
                >
                  DAY {idx + 1}
                </span>
                {isActive && (
                  <span className="small text-teal fw-semibold animate-pulse" style={{ color: 'var(--teal-dark)' }}>
                    ● Active Waypoint
                  </span>
                )}
              </div>
              <p className="mb-0 fw-medium" style={{ color: 'var(--ink)', fontSize: '0.98rem' }}>
                {desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
