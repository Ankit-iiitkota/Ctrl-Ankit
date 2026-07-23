import React, { useEffect, useState, useRef } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { useTheme } from '../../context/ThemeContext'

export const CustomCursor: React.FC = () => {
  const enabled = usePortfolioStore((state) => state.customCursorEnabled)
  const { resolvedTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  
  const mouse = useRef({ x: -100, y: -100 })
  const mainPos = useRef({ x: -100, y: -100 })
  const trailPos = useRef({ x: -100, y: -100 })
  const lastMouse = useRef({ x: 0, y: 0, time: Date.now() })
  const rotation = useRef(0)
  
  const mainElementRef = useRef<HTMLDivElement>(null)
  const trailElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect mobile/touch devices
    const checkDevice = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window)
      setIsMobile(mobile)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    if (!enabled || isMobile) {
      document.body.classList.remove('custom-cursor-active')
      return
    }

    document.body.classList.add('custom-cursor-active')

    const updatePosition = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, .interactive-cursor-node')
      
      if (interactiveEl) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeaveWindow = () => setIsVisible(false)
    const handleMouseEnterWindow = () => setIsVisible(true)

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('mouseenter', handleMouseEnterWindow)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [enabled, isMobile, isVisible])

  // Single Animation frame loop for hardware-accelerated movement
  useEffect(() => {
    if (!enabled || isMobile) return

    let animId: number
    
    const updateTrail = () => {
      // 1. Instant tracking for main cursor
      mainPos.current.x = mouse.current.x
      mainPos.current.y = mouse.current.y
      
      // Calculate rotation based on speed
      const now = Date.now()
      const dt = now - lastMouse.current.time
      if (dt > 12) {
        const dx = mouse.current.x - lastMouse.current.x
        const targetRotation = Math.max(Math.min(dx * 0.15, 25), -25)
        rotation.current += (targetRotation - rotation.current) * 0.15
        lastMouse.current = { x: mouse.current.x, y: mouse.current.y, time: now }
      }
      
      // 2. Lerp trailing for ghost trail
      trailPos.current.x += (mouse.current.x - trailPos.current.x) * 0.25
      trailPos.current.y += (mouse.current.y - trailPos.current.y) * 0.25
      
      // 3. Direct DOM styling (no React state trigger)
      if (mainElementRef.current) {
        const scale = isClicking ? 0.75 : 1
        mainElementRef.current.style.transform = `translate3d(${mainPos.current.x}px, ${mainPos.current.y}px, 0) scale(${scale}) rotate(${rotation.current}deg)`
      }
      
      if (trailElementRef.current) {
        const scale = isHovered ? 1.4 : 1.1
        trailElementRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) scale(${scale}) rotate(${rotation.current * 0.8}deg)`
      }
      
      animId = requestAnimationFrame(updateTrail)
    }
    
    animId = requestAnimationFrame(updateTrail)
    return () => cancelAnimationFrame(animId)
  }, [enabled, isMobile, isClicking, isHovered])

  if (!enabled || isMobile) return null

  const isDark = resolvedTheme === 'dark'

  const defaultArrowPath = "M0 0 L14 5 L8 7 L6 14 Z"
  const activePath = defaultArrowPath

  const mainFill = isHovered 
    ? 'var(--accent-500, #a855f7)' 
    : isDark ? '#22d3ee' : '#06b6d4'

  const strokeColor = isDark ? '#ffffff' : '#121314'
  
  const ghostFill = isDark 
    ? 'rgba(168, 85, 247, 0.18)' 
    : 'rgba(99, 102, 241, 0.15)'

  const ghostStroke = isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(18, 19, 20, 0.12)'

  return (
    <>
      {/* 1. Lagging Ghost Arrow Trail (GSAP Aesthetic) */}
      <div
        ref={trailElementRef}
        className="fixed top-0 left-0 pointer-events-none z-[100001] transition-opacity duration-300 ease-out"
        style={{
          width: '32px',
          height: '32px',
          opacity: isVisible ? 1 : 0,
          transformOrigin: '0 0',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="transition-all duration-300 ease-out"
          style={{
            opacity: isClicking ? 0.35 : 0.5,
          }}
        >
          <path
            d={activePath}
            fill={ghostFill}
            stroke={ghostStroke}
            strokeWidth="1"
            style={{
              filter: isDark 
                ? 'drop-shadow(0px 0px 6px rgba(168, 85, 247, 0.4))' 
                : 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
              transition: 'd 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </svg>
      </div>

      {/* 2. Main Pointer Custom Arrow */}
      <div
        ref={mainElementRef}
        className="fixed top-0 left-0 pointer-events-none z-[100002] transition-opacity duration-300 ease-out"
        style={{
          width: '32px',
          height: '32px',
          opacity: isVisible ? 1 : 0,
          transformOrigin: '0 0',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path
            d={activePath}
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth="1"
            style={{
              filter: isHovered 
                ? 'drop-shadow(0px 0px 8px rgba(168, 85, 247, 0.8))'
                : isDark 
                  ? 'drop-shadow(0px 0px 5px rgba(34, 211, 238, 0.8))' 
                  : 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))',
              transition: 'd 0.3s cubic-bezier(0.25, 1, 0.5, 1), fill 0.3s ease, stroke 0.3s ease'
            }}
          />
        </svg>
      </div>
    </>
  )
}
export default CustomCursor
