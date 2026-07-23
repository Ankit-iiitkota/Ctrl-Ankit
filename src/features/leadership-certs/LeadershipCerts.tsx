import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Film, GraduationCap, Briefcase, CalendarDays } from 'lucide-react'

interface PORItem {
  title: string
  organization: string
  period: string
  bullets: string[]
  icon: React.ReactNode
}

export const LeadershipCerts: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [lineScale, setLineScale] = useState(0)

  const leadershipRoles: PORItem[] = [
    {
      title: 'Club Co-Coordinator',
      organization: 'Team Green Campus Chapter — IIIT Kota',
      period: 'August 2026 – Present',
      bullets: [
        'Organized 10+ campus events (Plantation Drive, Botanical Bid, Scavenger Hunt) and led 50+ tree plantations to drive sustainability awareness.',
        'Planned nature trips to Garadia Mahadev, Bundi, and Rawatmata, handling logistics and volunteer coordination.'
      ],
      icon: <Users size={18} />
    },
    {
      title: 'Club Coordinator',
      organization: 'Q’N’S (Quills N Stills) — IIIT Kota',
      period: 'September 2026 – Present',
      bullets: [
        'Led design and publishing of 5+ magazine editions, including Kota Diaries and the Annual College Magazine, via Canva.',
        'Ran Canva design workshops and coordinated creative events like The Last Quill end-to-end.'
      ],
      icon: <Film size={18} />
    },
    {
      title: 'Graphics & Video Editor Lead',
      organization: 'Fit India Club - IIIT Kota',
      period: 'September 2026 – Present',
      bullets: [
        'Produced 10+ promotional videos and social creatives, boosting the club’s online engagement and outreach.',
        'Organized wellness events (International Yoga Day, Balloon Brawl, Childhood Eve) with posters and branding for each.'
      ],
      icon: <GraduationCap size={18} />
    }
  ]

  // Grows the accent progress line down the timeline as the section scrolls through view
  useEffect(() => {
    const element = timelineRef.current
    if (!element) return

    let frameId: number | null = null
    let isTracking = false

    const updateProgress = () => {
      const rect = element.getBoundingClientRect()
      const viewportThreshold = window.innerHeight * 0.8
      const total = Math.max(rect.height, 1)
      const rawProgress = (viewportThreshold - rect.top) / total
      setLineScale(Math.max(0, Math.min(1, rawProgress)))
      frameId = null
    }

    const requestUpdate = () => {
      if (!isTracking || frameId !== null) return
      frameId = window.requestAnimationFrame(updateProgress)
    }

    const startTracking = () => {
      if (isTracking) return
      isTracking = true
      window.addEventListener('scroll', requestUpdate, { passive: true })
      window.addEventListener('resize', requestUpdate)
      requestUpdate()
    }

    const stopTracking = () => {
      if (!isTracking) return
      isTracking = false
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startTracking()
        else stopTracking()
      },
      { rootMargin: '20% 0px 20% 0px' }
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      stopTracking()
    }
  }, [])

  return (
    <section
      id="leadership-certs"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden text-left"
    >
      {/* Background spotlights */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-accent-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-dots opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
          {/* Sticky intro panel */}
          <div className="w-full shrink-0 lg:sticky lg:top-32 lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.92, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 glassmorphism p-6 shadow-[0_0_40px_hsl(var(--accent-hue)_85%_55%/0.08)]"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center rounded-full border border-accent-500/20 bg-accent-500/5 px-3 py-1.5 text-2xs font-bold font-display uppercase tracking-widest text-accent-400 mb-6">
                  06 &bull; Leadership
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mb-5 leading-tight">
                  Positions of
                  <br />
                  <span className="text-accent-gradient">Responsibility</span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                  Beyond code, I lead campus initiatives spanning sustainability drives,
                  editorial publishing, and creative media — building teams and shipping
                  outcomes outside the classroom.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Vertical timeline */}
          <div className="relative w-full lg:w-2/3" ref={timelineRef}>
            <div className="absolute bottom-0 left-[24px] top-0 w-[2px] rounded-full bg-white/10 sm:left-[36px]" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute bottom-0 left-[24px] top-0 w-[2px] origin-top rounded-full bg-accent-500 shadow-[0_0_12px_hsl(var(--accent-hue)_85%_55%/0.4)] sm:left-[36px]"
            />

            <ul className="relative w-full py-4 flex flex-col gap-10">
              {leadershipRoles.map((role, index) => (
                <motion.li
                  key={role.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative pl-[52px] sm:pl-[70px]"
                >
                  {/* Node */}
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.15, ease: 'backOut' }}
                    className="absolute left-[24px] top-2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2 border-accent-500 shadow-[0_0_12px_hsl(var(--accent-hue)_85%_55%/0.5)] sm:left-[36px]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse" />
                  </motion.span>

                  <div className="bg-slate-950/20 glassmorphism p-6 md:p-7 rounded-2xl border border-white/5 hover:border-accent-500/30 transition-all duration-300 group">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-accent-400 group-hover:scale-105 transition-transform duration-300">
                          {role.icon}
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-100 group-hover:text-white transition-colors font-display">
                            {role.title}
                          </h3>
                          <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                            {role.organization}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end shrink-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-2xs font-mono font-medium uppercase tracking-wide text-slate-400">
                          <Briefcase size={12} />
                          Leadership
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/10 bg-accent-500/5 px-3 py-1 text-2xs font-mono font-medium text-accent-400">
                          <CalendarDays size={12} />
                          {role.period}
                        </span>
                      </div>
                    </div>

                    <ul className="flex flex-col gap-1.5 pl-1">
                      {role.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs md:text-sm text-slate-400 leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500/70" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
export default LeadershipCerts
