import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from '../scroll/SmoothScrollProvider'

gsap.registerPlugin(ScrollTrigger)

export default function TiltCard3D({
  children,
  className = '',
  maxTilt = 10,
  glare = true,
  staggerIndex = 0
}) {
  const cardRef = useRef(null)
  const innerRef = useRef(null)
  const glareRef = useRef(null)
  const { isReducedMotion } = useSmoothScroll()
  const [isHovered, setIsHovered] = useState(false)

  // GSAP ScrollTrigger 3D Entrance Animation
  useEffect(() => {
    if (isReducedMotion || !cardRef.current) return

    const card = cardRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 70,
          rotateX: 12,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          delay: (staggerIndex % 4) * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      )
    }, card)

    return () => ctx.revert()
  }, [isReducedMotion, staggerIndex])

  // Mouse Move 3D Tilt & Specular Glare Calculation
  const handleMouseMove = (e) => {
    if (isReducedMotion || !innerRef.current) return

    const rect = innerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotX = ((y - centerY) / centerY) * -maxTilt
    const rotY = ((x - centerX) / centerX) * maxTilt

    gsap.to(innerRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.25,
      ease: 'power1.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    })

    if (glare && glareRef.current) {
      const glareX = (x / rect.width) * 100
      const glareY = (y / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`
      glareRef.current.style.opacity = '1'
    }
  }

  const handleMouseEnter = () => {
    if (isReducedMotion) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (isReducedMotion || !innerRef.current) return
    setIsHovered(false)

    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    })

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      style={{
        perspective: '1200px',
        height: '100%'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="tilt-card-inner"
        style={{
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
          transition: isHovered ? 'none' : 'transform 0.5s ease',
          borderRadius: '18px'
        }}
      >
        {children}

        {/* Specular Radial Glare Layer */}
        {glare && !isReducedMotion && (
          <div
            ref={glareRef}
            className="tilt-glare"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: 3
            }}
          />
        )}
      </div>
    </div>
  )
}
