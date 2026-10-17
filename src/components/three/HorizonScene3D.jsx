import React, { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Float, Sparkles, AdaptiveDpr, useTexture } from '@react-three/drei'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from '../scroll/SmoothScrollProvider'

gsap.registerPlugin(ScrollTrigger)

// Geographic coordinates for worldwide destinations spanning both hemispheres
const WAYPOINTS = [
  // Eastern Hemisphere / Asia & Middle East
  { name: 'Kerala', lat: 10.85, lon: 76.27 },
  { name: 'Bali', lat: -8.40, lon: 115.18 },
  { name: 'Himachal', lat: 31.10, lon: 77.17 },
  { name: 'Vietnam', lat: 14.05, lon: 108.27 },
  { name: 'Rajasthan', lat: 27.02, lon: 74.21 },
  { name: 'Dubai', lat: 25.20, lon: 55.27 },
  { name: 'Goa', lat: 15.29, lon: 74.12 },
  { name: 'Sikkim', lat: 27.53, lon: 88.51 },
  { name: 'Tokyo', lat: 35.67, lon: 139.65 },
  { name: 'Sydney', lat: -33.86, lon: 151.20 },

  // Western Hemisphere / Europe, Americas, Atlantic & Pacific (The other side of the globe)
  { name: 'London', lat: 51.50, lon: -0.12 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
  { name: 'Rome', lat: 41.90, lon: 12.49 },
  { name: 'Cape Town', lat: -33.92, lon: 18.42 },
  { name: 'New York', lat: 40.71, lon: -74.00 },
  { name: 'San Francisco', lat: 37.77, lon: -122.42 },
  { name: 'Cancun', lat: 21.16, lon: -86.85 },
  { name: 'Rio de Janeiro', lat: -22.90, lon: -43.17 },
  { name: 'Buenos Aires', lat: -34.60, lon: -58.38 },
  { name: 'Honolulu', lat: 21.30, lon: -157.85 }
]

// Curated network of real-world airline flight routes spanning both sides of the Earth
const FLIGHT_ROUTES = [
  // Eastern Hemisphere / Indian Ocean & Asia routes
  { from: 'Dubai', to: 'Rajasthan', color: '#38bdf8', speed: 0.09, offset: 0.1 },
  { from: 'Dubai', to: 'Kerala', color: '#2dd4bf', speed: 0.08, offset: 0.45 },
  { from: 'Rajasthan', to: 'Himachal', color: '#72e4d4', speed: 0.11, offset: 0.2 },
  { from: 'Rajasthan', to: 'Goa', color: '#38bdf8', speed: 0.10, offset: 0.6 },
  { from: 'Goa', to: 'Kerala', color: '#2dd4bf', speed: 0.12, offset: 0.35 },
  { from: 'Himachal', to: 'Sikkim', color: '#72e4d4', speed: 0.10, offset: 0.75 },
  { from: 'Kerala', to: 'Bali', color: '#38bdf8', speed: 0.07, offset: 0.0 },
  { from: 'Bali', to: 'Vietnam', color: '#2dd4bf', speed: 0.08, offset: 0.55 },
  { from: 'Vietnam', to: 'Tokyo', color: '#72e4d4', speed: 0.08, offset: 0.8 },
  { from: 'Bali', to: 'Sydney', color: '#38bdf8', speed: 0.07, offset: 0.3 },

  // Western Hemisphere & Intercontinental Routes (The other side of the globe)
  { from: 'London', to: 'Paris', color: '#38bdf8', speed: 0.12, offset: 0.15 },
  { from: 'London', to: 'Dubai', color: '#72e4d4', speed: 0.07, offset: 0.4 },
  { from: 'Paris', to: 'Rome', color: '#2dd4bf', speed: 0.11, offset: 0.65 },
  { from: 'Rome', to: 'Cape Town', color: '#38bdf8', speed: 0.07, offset: 0.25 },
  { from: 'London', to: 'New York', color: '#38bdf8', speed: 0.07, offset: 0.05 },
  { from: 'New York', to: 'San Francisco', color: '#72e4d4', speed: 0.08, offset: 0.5 },
  { from: 'New York', to: 'Cancun', color: '#2dd4bf', speed: 0.09, offset: 0.3 },
  { from: 'Cancun', to: 'Rio de Janeiro', color: '#38bdf8', speed: 0.07, offset: 0.7 },
  { from: 'Rio de Janeiro', to: 'Buenos Aires', color: '#72e4d4', speed: 0.10, offset: 0.2 },
  { from: 'San Francisco', to: 'Honolulu', color: '#38bdf8', speed: 0.07, offset: 0.4 },
  { from: 'Honolulu', to: 'Tokyo', color: '#2dd4bf', speed: 0.07, offset: 0.85 },
  { from: 'Tokyo', to: 'Sydney', color: '#38bdf8', speed: 0.07, offset: 0.6 }
]

// Convert real-world Latitude & Longitude to 3D Sphere Vector3 aligned with standard Earth texture UVs
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

// Generates an aerodynamic Great-Circle flight trajectory arching into the atmosphere
function createFlightArc(posA, posB, radius, maxAlt) {
  const points = []
  const segments = 44
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    // Spherical linear interpolation between points
    const p = new THREE.Vector3().copy(posA).lerp(posB, t).normalize()
    // Parabolic altitude arc peaking in the middle of the flight
    const alt = Math.sin(t * Math.PI) * maxAlt
    p.multiplyScalar(radius + alt)
    points.push(p)
  }
  return new THREE.CatmullRomCurve3(points)
}

// 3D Location Map Pin planted directly into Earth's continents
function LocationPin3D({ position, name }) {
  const pinGroupRef = useRef()
  const rippleRef = useRef()

  // Calculate surface normal and orient pin perpendicular to Earth's curvature
  const { quaternion } = useMemo(() => {
    const norm = position.clone().normalize()
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm)
    return { quaternion: q }
  }, [position])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Subtle breathing pulse / hover
    if (pinGroupRef.current) {
      pinGroupRef.current.position.y = 0.005 + Math.sin(t * 3.5) * 0.006
    }
    // Sonar radar pulse ring on ground
    if (rippleRef.current) {
      const pulse = (t * 1.4) % 1
      const scale = 0.7 + pulse * 1.8
      rippleRef.current.scale.set(scale, scale, scale)
      rippleRef.current.material.opacity = Math.max(0, (1 - pulse) * 0.8)
    }
  })

  return (
    <group position={position} quaternion={quaternion}>
      {/* 1. Radar Pulse Ping Ring on Earth Surface */}
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.035, 0.075, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Pin Needle & Bulb Assembly */}
      <group ref={pinGroupRef}>
        {/* Needle Stem (Inverted Cone: apex at surface y=0, tapering out to bulb base) */}
        <mesh position={[0, 0.065, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.042, 0.13, 16]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={1.3}
            roughness={0.25}
            metalness={0.4}
          />
        </mesh>

        {/* Pin Teardrop Head (Spherical Bulb) */}
        <mesh position={[0, 0.142, 0]}>
          <sphereGeometry args={[0.052, 20, 20]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        {/* Glowing Center Window / Core Dot */}
        <mesh position={[0, 0.142, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.8}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

// Animated Flight Route with sleek glowing arc and traveling commercial passenger jet
function FlightRoute3D({ curve, color = '#38bdf8', speed = 0.1, offset = 0, isReducedMotion }) {
  const planeRef = useRef()
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 44, 0.0075, 8, false)
  }, [curve])

  useFrame((state) => {
    if (!planeRef.current || isReducedMotion) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    const pos = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    planeRef.current.position.copy(pos)

    // Orient aircraft forward along tangent and right-side-up relative to Earth's radius
    const normal = pos.clone().normalize()
    const matrix = new THREE.Matrix4()
    const right = new THREE.Vector3().crossVectors(tangent, normal).normalize()
    const up = new THREE.Vector3().crossVectors(right, tangent).normalize()
    matrix.makeBasis(right, up, tangent)
    planeRef.current.quaternion.setFromRotationMatrix(matrix)
  })

  return (
    <group>
      {/* 1. Luminous Geodesic Flight Route Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>

      {/* 2. Traveling Passenger Aircraft */}
      <group ref={planeRef}>
        {/* Fuselage */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.008, 0.065, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
        </mesh>
        {/* Swept Wings */}
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[0.075, 0.003, 0.018]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
        {/* Tail Fin */}
        <mesh position={[0, 0.012, -0.022]}>
          <boxGeometry args={[0.003, 0.018, 0.012]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1.5} />
        </mesh>
        {/* Jet Beacon Glow */}
        <pointLight intensity={0.9} distance={0.5} color={color} />
      </group>
    </group>
  )
}

// Keyframe trajectory that keeps the 3D globe visible in the wings/margins across all sections
function getGlobeTransform(p) {
  const kf = [
    { p: 0.0, x: 2.45, y: 0.1, z: -0.2, rotX: 0.15, rotZ: 0.05, scale: 1.0 },
    { p: 0.25, x: 2.65, y: 0.45, z: 0.25, rotX: 0.45, rotZ: -0.15, scale: 1.1 },
    { p: 0.50, x: -2.55, y: 0.2, z: 0.3, rotX: 0.75, rotZ: 0.2, scale: 1.15 },
    { p: 0.75, x: 2.5, y: -0.3, z: 0.35, rotX: 1.1, rotZ: -0.1, scale: 1.1 },
    { p: 1.0, x: 0.0, y: -1.4, z: 0.9, rotX: 1.4, rotZ: 0.0, scale: 1.25 }
  ]

  let i = 0
  while (i < kf.length - 1 && p > kf[i + 1].p) {
    i++
  }
  const a = kf[i]
  const b = kf[Math.min(i + 1, kf.length - 1)]
  const range = (b.p - a.p) || 1
  const t = Math.min(1, Math.max(0, (p - a.p) / range))
  const ease = t * t * (3 - 2 * t)

  return {
    x: a.x + (b.x - a.x) * ease,
    y: a.y + (b.y - a.y) * ease,
    z: a.z + (b.z - a.z) * ease,
    rotX: a.rotX + (b.rotX - a.rotX) * ease,
    rotZ: a.rotZ + (b.rotZ - a.rotZ) * ease,
    scale: a.scale + (b.scale - a.scale) * ease
  }
}

function RealEarthGlobe({ scrollProgress, isReducedMotion }) {
  const globeGroupRef = useRef()
  const earthRef = useRef()
  const cloudsRef = useRef()
  const prevP = useRef(0)

  const radius = 2.2

  // Load Photorealistic NASA Earth Textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/assets/earth/earth_day_2048.jpg',
    '/assets/earth/earth_normal_2048.jpg',
    '/assets/earth/earth_specular_2048.jpg',
    '/assets/earth/earth_clouds_1024.png'
  ])

  useEffect(() => {
    if (colorMap) colorMap.colorSpace = THREE.SRGBColorSpace
    if (cloudsMap) cloudsMap.colorSpace = THREE.SRGBColorSpace
  }, [colorMap, cloudsMap])

  // Pre-calculate destination pin positions on Earth surface across both hemispheres
  const waypointsData = useMemo(() => {
    return WAYPOINTS.map((wp) => ({
      ...wp,
      pos: latLonToVector3(wp.lat, wp.lon, radius + 0.02)
    }))
  }, [radius])

  const waypointsMap = useMemo(() => {
    const map = {}
    waypointsData.forEach((wp) => {
      map[wp.name] = wp.pos
    })
    return map
  }, [waypointsData])

  // Calculate aesthetic parabolic great-circle flight routes spanning the globe
  const flightRoutesData = useMemo(() => {
    return FLIGHT_ROUTES.map((route) => {
      const posA = waypointsMap[route.from]
      const posB = waypointsMap[route.to]
      if (!posA || !posB) return null
      const dist = posA.distanceTo(posB)
      const maxAlt = Math.min(0.42, 0.09 + dist * 0.12)
      const curve = createFlightArc(posA, posB, radius, maxAlt)
      return { ...route, curve }
    }).filter(Boolean)
  }, [waypointsMap, radius])

  useFrame((state, delta) => {
    if (!globeGroupRef.current) return

    const p = scrollProgress.current
    const scrollDelta = p - prevP.current
    prevP.current = p

    // Continuous Earth rotation + dynamic scroll acceleration
    if (!isReducedMotion) {
      globeGroupRef.current.rotation.y += delta * 0.12 + scrollDelta * 2.8
    }

    // Dynamic atmospheric cloud drift (independent rotation for realism)
    if (cloudsRef.current && !isReducedMotion) {
      cloudsRef.current.rotation.y += delta * 0.04
    }

    const target = getGlobeTransform(p)

    // Smoothly lerp position towards target
    globeGroupRef.current.position.x = THREE.MathUtils.lerp(
      globeGroupRef.current.position.x,
      target.x,
      0.08
    )
    globeGroupRef.current.position.y = THREE.MathUtils.lerp(
      globeGroupRef.current.position.y,
      target.y,
      0.08
    )
    globeGroupRef.current.position.z = THREE.MathUtils.lerp(
      globeGroupRef.current.position.z,
      target.z,
      0.08
    )

    // Smoothly lerp tilt angles
    globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      globeGroupRef.current.rotation.x,
      target.rotX,
      0.08
    )
    globeGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      globeGroupRef.current.rotation.z,
      target.rotZ,
      0.08
    )

    // Smoothly lerp scale
    const currentScale = globeGroupRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, target.scale, 0.08)
    globeGroupRef.current.scale.set(newScale, newScale, newScale)
  })

  return (
    <group ref={globeGroupRef} position={[2.45, 0.1, -0.2]}>
      {/* 1. Photorealistic Real Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specularMap}
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Realistic Dynamic Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[radius + 0.024, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Arcing Airline Flight Routes spanning the Globe with Animated Commercial Aircraft */}
      {flightRoutesData.map((route) => (
        <FlightRoute3D
          key={`${route.from}-${route.to}`}
          curve={route.curve}
          color={route.color}
          speed={route.speed}
          offset={route.offset}
          isReducedMotion={isReducedMotion}
        />
      ))}

      {/* 5. 3D Map Location Pins planted at Destinations Worldwide */}
      {waypointsData.map((wp) => (
        <LocationPin3D key={wp.name} position={wp.pos} name={wp.name} />
      ))}
    </group>
  )
}

function SceneContent({ scrollProgress, isReducedMotion }) {
  const cameraRef = useRef()

  useFrame((state, delta) => {
    // 1. Calculate live, 100% accurate scroll progress directly from viewport DOM
    const totalHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    )
    const currentY =
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const rawProgress = Math.min(1, Math.max(0, currentY / totalHeight))

    // Smoothly lerp towards actual viewport scroll progress
    scrollProgress.current = THREE.MathUtils.lerp(
      scrollProgress.current,
      rawProgress,
      0.1
    )

    if (!cameraRef.current) return
    const p = scrollProgress.current

    // Subtle orbital camera pan
    const camX = Math.sin(p * Math.PI) * 0.4
    const camY = Math.cos(p * Math.PI * 0.5) * 0.3
    const camZ = 7.4 - p * 0.8

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, camX, 0.06)
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, camY, 0.06)
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, camZ, 0.06)
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 7.4]} fov={45} />

      {/* Photorealistic Solar & Ambient Lighting */}
      <ambientLight intensity={0.65} color="#e6f4ff" />
      <directionalLight position={[12, 7, 7]} intensity={2.4} color="#fffcf0" />
      <pointLight position={[-10, -5, -3]} intensity={1.2} color="#0284c7" />
      <pointLight position={[0, 8, 4]} intensity={1.1} color="#72e4d4" />

      {/* Multi-layered Ambient Particle Cosmos (spans full viewport depth) */}
      <Sparkles
        count={95}
        scale={[24, 18, 14]}
        size={3.2}
        speed={isReducedMotion ? 0 : 0.45}
        color="#72e4d4"
        opacity={0.7}
      />
      <Sparkles
        count={60}
        scale={[28, 22, 16]}
        size={2.4}
        speed={isReducedMotion ? 0 : 0.55}
        color="#38bdf8"
        opacity={0.55}
      />
      <Sparkles
        count={30}
        scale={[20, 16, 12]}
        size={2.2}
        speed={isReducedMotion ? 0 : 0.35}
        color="#fcd34d"
        opacity={0.5}
      />

      {/* Real-life Earth Sphere with Float physics */}
      <Float
        speed={isReducedMotion ? 0 : 1.2}
        rotationIntensity={isReducedMotion ? 0 : 0.25}
        floatIntensity={isReducedMotion ? 0 : 0.35}
      >
        <RealEarthGlobe scrollProgress={scrollProgress} isReducedMotion={isReducedMotion} />
      </Float>

      <AdaptiveDpr pixelated={false} />
    </>
  )
}

export default function HorizonScene3D() {
  const { isReducedMotion } = useSmoothScroll()
  const scrollProgress = useRef(0)
  const containerRef = useRef()
  const location = useLocation()

  // Keep ScrollTrigger and DOM scroll bounds synchronized across route changes
  useEffect(() => {
    const handleScroll = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const current = window.scrollY || window.pageYOffset || 0
      scrollProgress.current = Math.min(1, Math.max(0, current / total))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Force ScrollTrigger refresh on route transition
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
      handleScroll()
    }, 150)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [location.pathname, location.search])

  return (
    <div
      ref={containerRef}
      className="horizon-scene-3d"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.98
      }}
      aria-hidden="true"
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.75]}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} isReducedMotion={isReducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}


