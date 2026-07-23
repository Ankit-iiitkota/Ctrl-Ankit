import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { testimonialsData, type Testimonial } from '../../utils/mockData'

const rowOne = testimonialsData.slice(0, 3)
const rowTwo = testimonialsData.slice(3, 6)

const PIXELS_PER_SECOND = 100

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="relative w-full py-24 border-b border-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 grid-dots opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            07 &bull; What Others Say
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display mt-3 leading-tight">
            The Voices <span className="italic text-accent-gradient">Behind</span>
          </h2>
        </motion.div>
      </div>

      <SyncedMarquee />
    </section>
  )
}

// Drives both rows off a single rAF clock so they stay perfectly phase-locked
// instead of drifting apart like two independent CSS animations would.
const SyncedMarquee: React.FC = () => {
  const trackOneRef = useRef<HTMLDivElement>(null)
  const trackTwoRef = useRef<HTMLDivElement>(null)
  const halfWidthOneRef = useRef(0)
  const halfWidthTwoRef = useRef(0)
  const isPausedRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      if (trackOneRef.current) halfWidthOneRef.current = trackOneRef.current.scrollWidth / 2
      if (trackTwoRef.current) halfWidthTwoRef.current = trackTwoRef.current.scrollWidth / 2
    }
    measure()

    const resizeObserver = new ResizeObserver(measure)
    if (trackOneRef.current) resizeObserver.observe(trackOneRef.current)
    if (trackTwoRef.current) resizeObserver.observe(trackTwoRef.current)

    let frameId: number
    let lastTime: number | null = null
    let elapsed = 0

    const tick = (time: number) => {
      if (lastTime === null) lastTime = time
      const delta = (time - lastTime) / 1000
      lastTime = time

      if (!isPausedRef.current) {
        elapsed += delta * PIXELS_PER_SECOND
      }

      const halfOne = halfWidthOneRef.current
      const halfTwo = halfWidthTwoRef.current

      if (trackOneRef.current && halfOne > 0) {
        const offset = elapsed % halfOne
        trackOneRef.current.style.transform = `translateX(${-offset}px)`
      }
      if (trackTwoRef.current && halfTwo > 0) {
        const offset = elapsed % halfTwo
        trackTwoRef.current.style.transform = `translateX(${offset - halfTwo}px)`
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [])

  const pause = () => {
    isPausedRef.current = true
  }
  const resume = () => {
    isPausedRef.current = false
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="marquee-row relative w-full overflow-hidden" onMouseEnter={pause} onMouseLeave={resume}>
        <div ref={trackOneRef} className="marquee-row-track flex w-max gap-6 px-3">
          {[...rowOne, ...rowOne].map((testimonial, idx) => (
            <TestimonialCard key={`r1-${testimonial.id}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
      <div className="marquee-row relative w-full overflow-hidden" onMouseEnter={pause} onMouseLeave={resume}>
        <div ref={trackTwoRef} className="marquee-row-track flex w-max gap-6 px-3">
          {[...rowTwo, ...rowTwo].map((testimonial, idx) => (
            <TestimonialCard key={`r2-${testimonial.id}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="w-[320px] md:w-[380px] shrink-0 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500/10 border border-accent-500/20 text-sm font-bold text-accent-400 font-display">
            {testimonial.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-100">{testimonial.name}</p>
            <p className="text-[11px] text-slate-500">{testimonial.role}</p>
          </div>
        </div>
        <Quote size={20} className="text-accent-400/60 shrink-0" />
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
    </div>
  )
}

export default TestimonialsSection
