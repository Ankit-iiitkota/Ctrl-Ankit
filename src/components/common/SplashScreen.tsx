import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { ArrowRight } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

const FONT_URL = 'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json'
const PARTICLE_SPRITE_URL = 'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png'
const TEXT = '   WELCOME TO\nANKIT\'S PORTFOLIO'

const VERTEX_SHADER = /* glsl */ `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
  }
`

// Ports the reference site's Three.js particle-text scatter interaction
// (font -> shape geometry -> point cloud, drag-to-repel with a color shift)
// into an R3F component driven by useFrame instead of a manual render loop.
function ParticleText({ expandRef }: { expandRef: React.RefObject<number> }) {
  const font = useLoader(FontLoader, FONT_URL)
  const particleTexture = useLoader(THREE.TextureLoader, PARTICLE_SPRITE_URL)
  const { camera, gl } = useThree()

  const pointsRef = useRef<THREE.Points>(null)
  const planeRef = useRef<THREE.Mesh>(null)

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useRef(new THREE.Vector2(-200, 200))
  const isDown = useRef(false)
  const ease = useRef(0.05)
  const colorChange = useMemo(() => new THREE.Color(), [])

  const { geometry, copyPositions } = useMemo(() => {
    const data = { text: TEXT, amount: 1500, textSize: 5 }
    const shapes = font.generateShapes(data.text, data.textSize)
    const shapeGeometry = new THREE.ShapeGeometry(shapes)
    shapeGeometry.computeBoundingBox()

    const xMid = -0.5 * (shapeGeometry.boundingBox!.max.x - shapeGeometry.boundingBox!.min.x)
    const yMid = (shapeGeometry.boundingBox!.max.y - shapeGeometry.boundingBox!.min.y) / 2.85
    shapeGeometry.center()

    const holeShapes: THREE.Path[] = []
    shapes.forEach((shape: any) => {
      if (shape.holes && shape.holes.length > 0) {
        shape.holes.forEach((hole: THREE.Path) => holeShapes.push(hole))
      }
    })
    shapes.push(...(holeShapes as any))

    const thePoints: THREE.Vector3[] = []
    const colors: number[] = []
    const sizes: number[] = []

    shapes.forEach((shape: any) => {
      const amountPoints = shape.type === 'Path' ? data.amount / 2 : data.amount
      const points = shape.getSpacedPoints(amountPoints)
      points.forEach((p: THREE.Vector2) => {
        thePoints.push(new THREE.Vector3(p.x, p.y, 0))
        colors.push(1, 1, 1)
        sizes.push(1)
      })
    })

    const geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints)
    geoParticles.translate(xMid, yMid, 0)
    geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3))
    geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    const copy = geoParticles.attributes.position.array.slice()

    return { geometry: geoParticles, copyPositions: copy }
  }, [font])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xffffff) },
          pointTexture: { value: particleTexture }
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      }),
    [particleTexture]
  )

  useEffect(() => {
    const dom = gl.domElement

    const toNdc = (clientX: number, clientY: number) => {
      const rect = dom.getBoundingClientRect()
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleDown = (e: MouseEvent) => {
      toNdc(e.clientX, e.clientY)
      isDown.current = true
      ease.current = 0.01
    }
    const handleUp = () => {
      isDown.current = false
      ease.current = 0.05
    }
    const handleMove = (e: MouseEvent) => toNdc(e.clientX, e.clientY)

    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      toNdc(t.clientX, t.clientY)
      isDown.current = true
      ease.current = 0.01
    }
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      toNdc(t.clientX, t.clientY)
    }
    const handleTouchEnd = () => {
      isDown.current = false
      ease.current = 0.05
    }

    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    dom.addEventListener('touchstart', handleTouchStart, { passive: true })
    dom.addEventListener('touchmove', handleTouchMove, { passive: true })
    dom.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      dom.removeEventListener('touchstart', handleTouchStart)
      dom.removeEventListener('touchmove', handleTouchMove)
      dom.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gl])

  useFrame(() => {
    if (!pointsRef.current || !planeRef.current) return

    raycaster.setFromCamera(mouse.current, camera)
    const intersects = raycaster.intersectObject(planeRef.current)
    if (intersects.length === 0) return

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const colorsAttr = pointsRef.current.geometry.attributes.customColor as THREE.BufferAttribute
    const sizeAttr = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute

    const { x: mx, y: my } = intersects[0].point
    const area = 320
    const easeVal = ease.current

    // Exit-sequence expansion: particles drift further apart as uExpand rises
    const burst = expandRef.current ?? 0

    for (let i = 0, l = pos.count; i < l; i++) {
      const initX = copyPositions[i * 3]
      const initY = copyPositions[i * 3 + 1]
      const initZ = copyPositions[i * 3 + 2]

      let px = pos.getX(i)
      let py = pos.getY(i)
      let pz = pos.getZ(i)

      colorChange.setHSL(0.5, 1, 1)
      colorsAttr.setXYZ(i, colorChange.r, colorChange.g, colorChange.b)

      sizeAttr.array[i] = 1

      const dx = mx - px
      const dy = my - py
      const mouseDistance = Math.sqrt(dx * dx + dy * dy)
      const d = dx * dx + dy * dy
      const f = -area / d

      if (isDown.current) {
        const t = Math.atan2(dy, dx)
        const kick = f * 1.8 // stronger, more immediate scatter on the initial push
        px -= kick * Math.cos(t)
        py -= kick * Math.sin(t)

        colorChange.setHSL(0.5 + ((1 + Math.sin(performance.now() * 0.0002)) / 6), 1.0, 0.5)
        colorsAttr.setXYZ(i, colorChange.r, colorChange.g, colorChange.b)

        if (px > initX + 70 || px < initX - 70 || py > initY + 70 || py < initY - 70) {
          colorChange.setHSL(0.15, 1.0, 0.5)
          colorsAttr.setXYZ(i, colorChange.r, colorChange.g, colorChange.b)
        }
      } else if (mouseDistance < area) {
        if (i % 5 === 0) {
          const t = Math.atan2(dy, dx)
          px -= 0.03 * Math.cos(t)
          py -= 0.03 * Math.sin(t)
          colorChange.setHSL(0.15, 1.0, 0.5)
          colorsAttr.setXYZ(i, colorChange.r, colorChange.g, colorChange.b)
          sizeAttr.array[i] = 1 / 1.2
        } else {
          const t = Math.atan2(dy, dx)
          px += f * Math.cos(t)
          py += f * Math.sin(t)
          sizeAttr.array[i] = 1.3
        }
      }

      // Burst outward from center on exit
      if (burst > 0) {
        const angle = Math.atan2(initY, initX)
        px += Math.cos(angle) * burst * 220
        py += Math.sin(angle) * burst * 220
      }

      px += (initX - px) * easeVal
      py += (initY - py) * easeVal
      pz += (initZ - pz) * easeVal

      pos.setXYZ(i, px, py, pz)
    }

    pos.needsUpdate = true
    colorsAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  return (
    <>
      <mesh ref={planeRef} visible={false}>
        <planeGeometry args={[400, 250]} />
        <meshBasicMaterial color={0x00ff00} transparent />
      </mesh>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </>
  )
}

function ParticleScene({ expandRef }: { expandRef: React.RefObject<number> }) {
  return (
    <React.Suspense fallback={null}>
      <ParticleText expandRef={expandRef} />
    </React.Suspense>
  )
}

const dismissedGlobal = { current: false }

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'in' | 'exiting'>('in')
  const expandRef = useRef(0)

  const handleEnter = () => {
    if (dismissedGlobal.current) return
    dismissedGlobal.current = true
    setPhase('exiting')

    const started = performance.now()
    const duration = 900
    const step = (now: number) => {
      const t = Math.min((now - started) / duration, 1)
      expandRef.current = 1 - Math.pow(1 - t, 3)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

    setTimeout(onComplete, 1000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      >
        <motion.div
          animate={{
            opacity: phase === 'exiting' ? 0 : 1,
            filter: phase === 'exiting' ? 'blur(16px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Canvas
            camera={{ position: [0, 0, 100], fov: 65, near: 1, far: 10000 }}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 1)
            }}
          >
            <ParticleScene expandRef={expandRef} />
          </Canvas>
        </motion.div>

        {/* Enter Portfolio CTA */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: phase === 'exiting' ? 0 : 1,
            y: phase === 'exiting' ? 16 : 0
          }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          className="group absolute bottom-16 sm:bottom-20 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-7 py-3.5 text-sm font-semibold text-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.25)] transition-colors hover:bg-white"
        >
          Launch Portfolio
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}

export default SplashScreen
