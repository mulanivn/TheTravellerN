import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useSmoothScroll } from '../scroll/SmoothScrollProvider'

export default function CelebrationSparkles3D() {
  const { isReducedMotion } = useSmoothScroll()

  if (isReducedMotion) return null

  return (
    <div
      className="celebration-sparkles-canvas"
      style={{
        position: 'absolute',
        inset: '-40px',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Sparkles
          count={85}
          scale={6}
          size={3.2}
          speed={0.6}
          color="#2fb5a4"
          opacity={0.7}
        />
        <Sparkles
          count={45}
          scale={4.5}
          size={2.5}
          speed={0.8}
          color="#facc15"
          opacity={0.6}
        />
      </Canvas>
    </div>
  )
}
