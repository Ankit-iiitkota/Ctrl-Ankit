import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, FileText } from 'lucide-react'

const titles = [
  'Full Stack Developer.',
  'AI-Powered Innovator.',
  'Problem Solver.',
  'Product Builder.',
  'Tech Enthusiast.',
]

export const HeroSection: React.FC = () => {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing effect loop
  useEffect(() => {
    let timer: any
    const activeTitle = titles[titleIndex]
    
    const tick = () => {
      if (!isDeleting) {
        setDisplayText((prev) => activeTitle.substring(0, prev.length + 1))
        
        if (displayText === activeTitle) {
          timer = setTimeout(() => setIsDeleting(true), 2000) // Pause at full text
        } else {
          timer = setTimeout(tick, 70) // Writing speed
        }
      } else {
        setDisplayText((prev) => activeTitle.substring(0, prev.length - 1))
        
        if (displayText === '') {
          setIsDeleting(false)
          setTitleIndex((prev) => (prev + 1) % titles.length)
          timer = setTimeout(tick, 200) // Small break
        } else {
          timer = setTimeout(tick, 45) // Deleting speed
        }
      }
    }

    timer = setTimeout(tick, isDeleting ? 45 : 70)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, titleIndex])

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/Resume_Ankit_Chaurasiya.pdf'
    link.download = 'Ankit_Chaurasiya_Resume.pdf'
    link.click()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  }

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 px-6 border-b border-white/5"
    >
      {/* Floating 3D Geometric Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Neon prism shape 1 */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-[20%] left-[10%] w-16 h-16 rounded-xl border border-accent-500/20 bg-accent-500/5 backdrop-blur-[2px] opacity-40 hidden md:block"
        />
        {/* Neon prism shape 2 */}
        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-[25%] right-[12%] w-24 h-24 rounded-3xl border border-accent-400/10 bg-accent-400/5 backdrop-blur-[1px] opacity-30 hidden md:block"
        />
        {/* Glow dots */}
        <div className="glow-spot top-[15%] left-[20%]" />
        <div className="glow-spot bottom-[10%] right-[15%]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Availability Badge */}
          {/* <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glassmorphism text-slate-300 text-2xs font-bold tracking-widest uppercase border border-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Core Contracts & Hire
          </motion.div> */}

          {/* Greet Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-100 font-display hero-title leading-[1.05] select-none"
          >
            Hello.
            <br />
            <span className="text-accent-gradient">I'm Ankit Chaurasiya</span>
          </motion.h1>

          {/* Static Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-2xs sm:text-xs md:text-sm font-light tracking-[0.3em] uppercase text-slate-400 font-sans mt-3 leading-relaxed max-w-xl text-center"
          >
            Building Tomorrow's          
            Digital <br /> Experiences.
          </motion.p>

          {/* Typing Sub-Text */}
          <motion.div
            variants={itemVariants}
            className="min-h-[28px] md:min-h-[36px] flex items-center justify-center"
>
            <p className="text-sm sm:text-lg md:text-xl text-slate-400 font-matrix tracking-wide">
              I am a <span className="text-slate-100 font-bold border-r border-accent-400 animate-pulse px-1">{displayText}</span>
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
          >
            <button
              onClick={handleScrollToProjects}
              className="w-full sm:w-auto btn-primary btn-tactile"
              data-cursor="PORTFOLIO"
            >
              Explore Solutions
            </button>
            <button
              onClick={handleDownloadResume}
              className="w-full sm:w-auto flex items-center justify-center gap-2 btn-ghost btn-tactile"
              data-cursor="RESUME"
            >
              <FileText size={15} />
              Download Resume
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating social dock (Desktop) */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:flex flex-col gap-4 bg-slate-900/40 border border-white/5 px-2.5 py-4 rounded-full glassmorphism">
        {[
          { icon: <Github size={18} />, href: 'https://github.com/Ankit-iiitkota', label: 'GitHub' },
          { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/ankitchaurasiya29/', label: 'LinkedIn' },
          { icon: <Mail size={18} />, href: 'mailto:ankitiiitkota@gmail.com', label: 'Email' }
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent-400 transition-colors p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer"
            title={item.label}
            data-cursor="LINK"
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Scroll Down Mouse Indicator */}
      <div 
        onClick={handleScrollToProjects}
        className="absolute bottom-8 z-20 flex flex-col items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-[9px] font-bold font-display uppercase text-slate-500 tracking-widest animate-pulse">
          Scroll Down
        </span>
        <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1 h-1 bg-accent-400 rounded-full"
          />
        </div>
      </div>
    </section>
  )
}
export default HeroSection
