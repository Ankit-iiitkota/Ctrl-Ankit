import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, Code2, Users, Trophy } from 'lucide-react'
import { achievementsData, Achievement } from '../../utils/mockData'

gsap.registerPlugin(ScrollTrigger)

// Category layout configuration (colors and icons)
const categoryConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Hackathon: {
    color: '#a855f7', // Purple
    icon: <Trophy size={14} />
  },
  Award: {
    color: '#38bdf8', // Cyan
    icon: <Award size={14} />
  },
  Leadership: {
    color: '#f59e0b', // Amber
    icon: <Users size={14} />
  },
  'Open Source': {
    color: '#10b981', // Green
    icon: <Code2 size={14} />
  }
}

interface AchievementCardProps {
  achievement: Achievement
  isLeft: boolean
  cardRef: (el: HTMLDivElement | null) => void
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isLeft, cardRef }) => {
  const config = categoryConfig[achievement.category] || { color: '#6366f1', icon: <Award size={14} /> }
  const color = config.color

  const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--spotlight-x', `${x}px`)
    card.style.setProperty('--spotlight-y', `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      className={`spine-card relative w-full md:w-[calc(50%-40px)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
      style={{ opacity: 0 }}
    >
      {/* Connector line from card edge to center spine (desktop only) */}
      <div
        className={`spine-connector hidden md:block absolute top-1/2 h-px w-10 ${isLeft ? 'left-full' : 'right-full'}`}
        style={{
          background: isLeft
            ? `linear-gradient(90deg, ${color}80, transparent)`
            : `linear-gradient(270deg, ${color}80, transparent)`,
          transformOrigin: isLeft ? 'left center' : 'right center',
          transform: 'scaleX(0)'
        }}
      />
      {/* Glowing node on the spine (desktop only) */}
      <div
        className={`spine-node hidden md:block absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full ${isLeft ? '-right-[46px]' : '-left-[46px]'}`}
        style={{ backgroundColor: color, boxShadow: `0 0 14px ${color}, 0 0 4px ${color}`, transform: 'translateY(-50%) scale(0)' }}
      />

      <div
        onMouseMove={handleSpotlightMove}
        className="bg-slate-950/20 glassmorphism p-7 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[220px] relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
        style={{ '--spotlight-glow': `${color}12` } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 100px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-glow), transparent 80%)`
          }}
        />

        <div>
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300"
              style={{ color, borderColor: `${color}25`, backgroundColor: `${color}0c` }}
            >
              <span>{config.icon}</span>
              <span className="text-[10px] font-bold font-display uppercase tracking-wider">{achievement.category}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-matrix tracking-wider">{achievement.date}</span>
          </div>

          <h3 className="text-base font-bold text-slate-100 font-display mb-3 group-hover:text-white transition-colors relative z-10 leading-snug">
            {achievement.title}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 relative z-10 group-hover:text-slate-300 transition-colors">
            {achievement.description}
          </p>
        </div>

        <div className="border-t border-white/5 pt-4 flex items-center justify-between relative z-10">
          <span className="text-[9px] font-bold font-sans uppercase text-slate-500 tracking-wider">Issued By</span>
          <span className="text-xs font-semibold transition-colors duration-300" style={{ color }}>
            {achievement.issuer}
          </span>
        </div>
      </div>
    </div>
  )
}

export const AchievementsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const isLeft = i % 2 === 0
        const connector = card.querySelector<HTMLElement>('.spine-connector')
        const node = card.querySelector<HTMLElement>('.spine-node')

        const enterTl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 55%', scrub: 0.8 }
        })
        enterTl.fromTo(
          card,
          { x: isLeft ? -140 : 140, opacity: 0, rotateY: isLeft ? 12 : -12, scale: 0.9 },
          { x: 0, opacity: 1, rotateY: 0, scale: 1, ease: 'power2.out' }
        )
        if (connector) enterTl.fromTo(connector, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power2.out' }, 0.3)
        if (node) enterTl.fromTo(node, { scale: 0 }, { scale: 1, ease: 'back.out(2)' }, 0.2)

        const exitTl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 30%', end: 'top 0%', scrub: 0.8 }
        })
        exitTl.to(card, { x: isLeft ? -140 : 140, opacity: 0, rotateY: isLeft ? 12 : -12, scale: 0.9, ease: 'power2.in' })
        if (connector) exitTl.to(connector, { scaleX: 0, opacity: 0, ease: 'power2.in' }, 0)
        if (node) exitTl.to(node, { scale: 0, ease: 'power2.in' }, 0)

        gsap.to(card, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.8 }
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      {/* Subtle ambient lighting spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-accent-500/5 filter blur-[100px] opacity-40" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 filter blur-[120px] opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            04 &bull; ACHIEVEMENTS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display mt-3 leading-tight">
            Milestones of
            <br />
            Excellence.
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Vertical center spine (desktop only) */}
        <div className="relative">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-accent-500/25 to-transparent" />

          <div className="spine-track relative flex flex-col gap-10 md:gap-16">
            {achievementsData.map((ach, idx) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                isLeft={idx % 2 === 0}
                cardRef={(el) => {
                  cardsRef.current[idx] = el
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AchievementsSection
