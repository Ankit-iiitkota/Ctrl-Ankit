import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, FileText, Sparkles, ArrowUpRight, Download, BrainCircuit } from 'lucide-react'
import { SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiCplusplus } from 'react-icons/si'

const titles = [
  'AI Builder.',
  'Problem Solver.',
  'Code Craftsman.',
  'Product Builder.',
]

const techStack = [
  { name: 'React.js', icon: <SiReact />, color: '#61DAFB' },
  { name: 'Python', icon: <SiPython />, color: '#3776AB' },
  { name: 'Next.js', icon: <SiNextdotjs />, color: '#ffffff' },
  { name: 'Node.js', icon: <SiNodedotjs />, color: '#68A063' },
  { name: 'AI/LLMs', icon: <BrainCircuit size={14} />, color: '#a78bfa' },
  { name: 'C++', icon: <SiCplusplus />, color: '#00599C' }
]

const codeSnippet = [
  { key: 'role', value: '"Developer"' },
  { key: 'passion', value: '"Problem Solving"' },
  { key: 'skills', value: '["MERN", "AI",' },
  { key: '', value: '"System Design"],', continuation: true },
  { key: 'ambition', value: '"Build impactful' },
  { key: '', value: 'products"',continuation: true },
  { key: 'code', value: '"Clean & Scalable"' }
]

const NAME = 'Ankit Chaurasiya'

export const HeroSection: React.FC = () => {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const [nameText, setNameText] = useState('')

  // One-shot typewriter for the name — same character-by-character mechanism
  // as the tagline below, just without the delete/loop behavior.
  useEffect(() => {
    let charIndex = 0
    let timer: ReturnType<typeof setTimeout>

    const typeNext = () => {
      charIndex += 1
      setNameText(NAME.slice(0, charIndex))
      if (charIndex < NAME.length) {
        timer = setTimeout(typeNext, 70) // Writing speed, matches the tagline's pace
      }
    }

    timer = setTimeout(typeNext, 400)
    return () => clearTimeout(timer)
  }, [])

  // Typing effect loop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 22, stiffness: 110 }
    }
  }

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden py-32 px-6 border-b border-white/5"
    >
      {/* Ambient glow accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="glow-spot top-[15%] left-[15%]" />
        <div className="glow-spot bottom-[10%] right-[10%]" />
      </div>

      <div className="relative z-10 max-w-[100rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center px-4 lg:px-12">
        {/* Left column: intro copy + CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-6 text-left"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full glassmorphism text-accent-300 text-2xs font-bold tracking-widest uppercase border border-accent-500/20"
          >
            <Sparkles size={12} />
            Software Developer &amp; AI Enthusiast
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 font-display hero-title leading-[1.05] select-none"
          >
            Hello, I&apos;m
            <br />
            <span className="text-accent-gradient font-bold border-r border-accent-400 animate-pulse pr-1">{nameText}</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="h-0.5 w-40 bg-gradient-to-r from-accent-500 to-transparent rounded-full" />

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg"
          >
            I build intelligent, scalable and user-centric digital solutions that create impact and deliver seamless experiences.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="min-h-[28px] flex items-center"
          >
            <p className="text-sm sm:text-lg md:text-xl text-slate-400 font-matrix tracking-wide">
              I am a <span className="text-slate-100 font-bold border-r border-accent-400 animate-pulse px-1">{displayText}</span>
            </p>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 mt-1">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-white/10 bg-slate-900/40 text-xs font-semibold text-slate-300 transition-colors hover:border-white/70"
              >
                <span style={{ color: tech.color }}>{tech.icon}</span>
                {tech.name}
              </span>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
          >
            <button
              onClick={handleScrollToProjects}
              className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary btn-tactile border-2 border-transparent hover:border-white/70 transition-colors"
              data-cursor="PORTFOLIO"
            >
              Explore My Work
              <ArrowUpRight size={16} />
            </button>
            <button
              onClick={handleDownloadResume}
              className="w-full sm:w-auto flex items-center justify-center gap-2 btn-ghost btn-tactile border-2 hover:!border-white/70 transition-colors"
              data-cursor="RESUME"
            >
              Download Resume
              <Download size={15} />
            </button>
          </motion.div>
        </motion.div>

        {/* Right column: portrait card + floating code window + availability card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative hidden lg:flex items-center justify-center h-[640px]"
        >
          {/* Portrait card with neon frame */}
          <div className="relative w-[400px] h-[560px] rounded-[2rem] border border-accent-400/30 overflow-hidden shadow-[0_0_60px_hsl(var(--accent-hue)_85%_55%/0.15)]">
            <img
              src="/landing-page-photo.png"
              alt="Ankit Chaurasiya"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Floating code window */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="absolute -right-6 top-10 w-[240px] rounded-xl border border-white/10 bg-[#0a0e18]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden hidden xl:block"
          >
            {/* Always-dark terminal aesthetic, like a code editor — deliberately does not
                follow the site's light/dark theme so the syntax-highlight colors stay legible. */}
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="p-3.5 font-matrix text-[10px] leading-relaxed">
              <p><span className="text-[#64748b]">1</span>&nbsp;&nbsp;<span className="text-[#c4b5fd]">const</span> <span className="text-[#e2e8f0]">ankit</span> = {'{'}</p>
              {codeSnippet.map((line, i) => (
                <p key={i} className={line.continuation ? 'pl-8' : 'pl-4'}>
                  <span className="text-[#64748b]">{i + 2}</span>&nbsp;&nbsp;
                  {line.key && <span className="text-[#67e8f9]">{line.key}</span>}
                  {line.key && <span className="text-[#64748b]">: </span>}
                  <span className="text-[#6ee7b7]">{line.value}</span>
                  {!line.continuation && <span className="text-[#64748b]">,</span>}
                </p>
              ))}
              <p><span className="text-[#64748b]">9</span>&nbsp;&nbsp;{'};'}</p>
            </div>
          </motion.div>

          {/* Floating availability card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
            className="absolute -bottom-6 -left-6 w-[260px] rounded-2xl border border-accent-400/25 bg-slate-950/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Available for
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-400/30 text-accent-300">
                <ArrowUpRight size={14} />
              </span>
            </div>
            <p className="text-lg font-bold text-accent-gradient font-display">Opportunities</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Open to work on exciting projects and full-time roles.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating social dock (Desktop) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4 bg-slate-900/40 border border-white/5 px-2.5 py-4 rounded-full glassmorphism">
        {[
          { icon: <Github size={18} />, href: 'https://github.com/Ankit-iiitkota', label: 'GitHub' },
          { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/ankitchaurasiya29/', label: 'LinkedIn' },
          { icon: <Mail size={18} />, href: 'mailto:ankitiiitkota@gmail.com', label: 'Email' },
          { icon: <FileText size={18} />, href: '/Resume_Ankit_Chaurasiya.pdf', label: 'Resume' }
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent-400 transition-all duration-200 p-1.5 rounded-full border-2 border-transparent hover:border-white/70 hover:bg-white/5 cursor-pointer"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-[9px] font-bold font-display uppercase text-slate-500 tracking-widest animate-pulse">
          Scroll Down
        </span>
        <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 bg-accent-400 rounded-full"
          />
        </div>
      </div>
    </section>
  )
}
export default HeroSection
