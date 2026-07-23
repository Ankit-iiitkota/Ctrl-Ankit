import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [clickRipple, setClickRipple] = useState(false)

  // Magnetic cursor tracking
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setCoords({ x: x * 0.35, y: y * 0.35 }) // 35% pull for subtle magnetism
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCoords({ x: 0, y: 0 })
  }

  const handleToggle = () => {
    setClickRipple(true)
    setTimeout(() => setClickRipple(false), 800)
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="relative flex items-center justify-center">
      {/* Expanding Ambient Glow on Click */}
      <AnimatePresence>
        {clickRipple && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute w-12 h-12 rounded-full pointer-events-none z-0 ${
              isDark ? 'bg-cyan-500/20' : 'bg-amber-500/25'
            }`}
          />
        )}
      </AnimatePresence>

      {/* Floating Theme Button */}
      <motion.button
        onClick={handleToggle}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{ 
          x: coords.x, 
          y: coords.y,
          scale: isHovered ? 1.08 : 1
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border focus:outline-none cursor-pointer ${
          isDark 
            ? 'bg-slate-900/60 border-white/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:border-cyan-500/30' 
            : 'bg-white/80 border-slate-200 text-amber-500 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-amber-400/50'
        }`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        data-cursor="THEME"
      >
        {/* Soft atmospheric hover background glow */}
        {isHovered && (
          <motion.div
            layoutId="toggleGlow"
            className={`absolute inset-0 rounded-full blur-md opacity-40 -z-10 ${
              isDark ? 'bg-cyan-400' : 'bg-amber-400'
            }`}
          />
        )}

        {/* Morphing Sun/Moon SVG Vector */}
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isDark ? 40 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative pointer-events-none"
        >
          {/* Moon Mask Definition */}
          <mask id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.circle
              cx={isDark ? 18 : 30}
              cy={isDark ? 6 : 0}
              r="8"
              fill="black"
              transition={{ type: 'spring', stiffness: 180, damping: 15 }}
            />
          </mask>

          {/* Main Celestial Circle */}
          <motion.circle
            cx="12"
            cy="12"
            r={isDark ? 8 : 5}
            fill="currentColor"
            mask="url(#moon-mask)"
            transition={{ type: 'spring', stiffness: 180, damping: 15 }}
          />

          {/* Sun Rays (Rendered only in light mode, animated scale/opacity) */}
          <motion.g
            animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.3 : 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.g>
        </motion.svg>
      </motion.button>
    </div>
  )
}
export default ThemeToggle
