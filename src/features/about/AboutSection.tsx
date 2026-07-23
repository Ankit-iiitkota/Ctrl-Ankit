import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'


// Emitters of counting state on intersection view
const AnimatedCounter: React.FC<{ value: number; suffix?: string; label: string; icon?: string }> = ({ value, suffix = '', label, icon }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let startTimestamp: number | null = null
    let animationFrameId: number
    let hasAnimated = false

    const runCountUp = () => {
      if (hasAnimated) return
      hasAnimated = true
      setCount(0)
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / 1500, 1) // 1.5s duration
        setCount(Math.floor(progress * value))
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step)
        }
      }
      animationFrameId = requestAnimationFrame(step)
    }

    const node = countRef.current
    if (!node) return

    // If the tile is already on-screen at mount (e.g. About sits above the fold
    // right after the splash screen closes), the observer's initial callback
    // fires before layout settles and can report isIntersecting on a stale
    // rect — so we also eagerly check getBoundingClientRect as a fallback.
    const rect = node.getBoundingClientRect()
    const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (isAlreadyVisible) {
      runCountUp()
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) runCountUp()
        },
        { threshold: 0.1 }
      )
      observer.observe(node)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(animationFrameId)
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [value])

  return (
    <div 
      ref={countRef} 
      className="bg-slate-950/20 glassmorphism p-7 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center h-full min-h-[132px] hover:border-accent-500/30 hover:shadow-lg dark:hover:shadow-accent-500/5 hover:-translate-y-1 transition-all duration-300 flex-shrink-0 min-w-[170px] sm:min-w-0"
    >
      <div className="text-4xl font-black font-display text-accent-400">
        {count}{suffix}
      </div>
      {icon && (
        <div className="text-sm mt-1 leading-none tracking-wider" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="text-[10px] font-bold font-sans uppercase text-slate-500 tracking-wider mt-1.5 leading-tight">
        {label}
      </div>
    </div>
  )
}


// 3D tilt photo card: mouse-driven rotation + glare sweep, mirrors the FooterTiltCard interaction
const TiltPhotoCard: React.FC = () => {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 200 })
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 200 })
  const springGlareX = useSpring(glareX, { damping: 20, stiffness: 200 })
  const springGlareY = useSpring(glareY, { damping: 20, stiffness: 200 })
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${springGlareX}% ${springGlareY}%, rgba(255,255,255,0.35), transparent 55%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2

    rotateX.set(-y / (box.height / 14))
    rotateY.set(x / (box.width / 14))
    glareX.set(((e.clientX - box.left) / box.width) * 100)
    glareY.set(((e.clientY - box.top) / box.height) * 100)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] aspect-[4/5] transition-shadow duration-300 hover:shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
      data-cursor="VIEW"
    >
      <img
        src="/profile_photo.jpg"
        alt="Ankit Chaurasiya"
        className="w-full h-full object-cover pointer-events-none"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Bottom scrim for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Cursor-tracked glare sheen */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: glareBackground }}
      />

      {/* Accent-tinted rim light on hover */}
      <div className="absolute inset-0 rounded-[28px] border border-accent-400/0 hover:border-accent-400/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  )
}

export const AboutSection: React.FC = () => {
  // Stagger reveal animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 22, stiffness: 100 }
    }
  }

  return (
    <section
      id="about"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      {/* Morphing background nebula blobs for rich moving depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -35, 35, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute w-[450px] h-[450px] rounded-full bg-teal-950/8 filter blur-[120px] top-[10%] left-[5%] z-0"
        />
        <motion.div
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-950/10 filter blur-[120px] bottom-[20%] right-[5%] z-0"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 text-center md:text-left"
        >
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            01 &bull; ABOUT ME
          </span>
        </motion.div>

        {/* Layout Grid: narrative + stats (left) / portrait photo (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading, Narrative & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 font-display leading-tight"
            >
              About<span className="text-slate-100">-</span>
              <span className="italic font-medium text-slate-300">Me</span>
            </motion.h2>

            {/* Story Paragraph (from resume) */}
            <motion.p variants={itemVariants} className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl text-justify">
              I&apos;m a Full Stack Developer pursuing B.Tech in Computer Science &amp; Engineering at IIIT Kota, passionate about building scalable, production-ready applications across the frontend and backend. I enjoy solving real problems with React.js, Next.js, and FastAPI, integrating AI workflows to make products smarter, and sharpening my fundamentals through competitive programming. Whether it&apos;s shipping a full-stack platform or leading a campus initiative, I focus on building things that are reliable, efficient, and genuinely useful.
            </motion.p>

            {/* Impact Stats (2x2 grid, matching resume-verified numbers) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 max-w-md"
            >
              <AnimatedCounter value={400} suffix="+" label="DSA Solved" />
              <AnimatedCounter value={6} suffix="+" label="Projects" />
              <AnimatedCounter value={4} suffix="+" label="Hackathons" />
              <AnimatedCounter value={3} suffix="⭐" label="CodeChef" />
            </motion.div>
          </motion.div>

          {/* Right Column: Portrait Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 lg:justify-self-end lg:ml-6"
          >
            <TiltPhotoCard />
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default AboutSection
