import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar, ArrowRight } from 'lucide-react'
import { educationData } from '../../utils/mockData'
import { ConstellationBackground } from './ConstellationBackground'

// Alternates cyan/emerald per node, matching the reference timeline's coloring
const NODE_COLORS = ['#22d3ee', '#34d399']

// Builds a real achievement sentence out of the existing result field
// (e.g. "CGPA: 7.18" -> "Maintained a CGPA of 7.18/10 throughout the program.")
function toAchievementLine(edu: (typeof educationData)[number]) {
  if (edu.result.toLowerCase().startsWith('cgpa')) {
    const value = edu.result.split(':')[1]?.trim() ?? edu.result
    return `Maintained a CGPA of ${value}/10 throughout the program at ${edu.institution}.`
  }
  return `Scored ${edu.result} in ${edu.level} board examinations at ${edu.institution}.`
}

export const EducationTimeline: React.FC = () => {
  return (
    <section
      id="education"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      <ConstellationBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            02 &bull; Academic Path
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Education Timeline
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Mobile / narrow: single left-aligned spine */}
        <div className="relative border-l border-white/10 pl-6 ml-4 flex flex-col gap-10 md:hidden">
          {educationData.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              <span
                className="absolute -left-[31px] top-6 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2"
                style={{ borderColor: NODE_COLORS[idx % 2], boxShadow: `0 0 12px ${NODE_COLORS[idx % 2]}` }}
              >
                <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: NODE_COLORS[idx % 2] }} />
              </span>

              <EducationCard edu={edu} color={NODE_COLORS[idx % 2]} />
            </motion.div>
          ))}
        </div>

        {/* Desktop: horizontal gradient spine, cards zigzagging above/below it left-to-right */}
        <div className="hidden md:block relative py-44">
          {/* Horizontal spine */}
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-gradient-to-r from-cyan-500/60 via-emerald-500/60 to-fuchsia-500/60" />

          <div className="relative grid gap-8" style={{ gridTemplateColumns: `repeat(${educationData.length}, minmax(0, 1fr))` }}>
            {educationData.map((edu, idx) => {
              const color = NODE_COLORS[idx % 2]
              const isBelow = idx % 2 === 0
              return (
                <div key={edu.id} className="relative h-0">
                  {/* Node on the spine, centered in its column */}
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border-2"
                    style={{ borderColor: color, boxShadow: `0 0 12px ${color}` }}
                  >
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                  </span>

                  {/* Connector from node to card */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`absolute left-1/2 -translate-x-1/2 w-px h-8 ${isBelow ? 'top-0 origin-top' : 'bottom-0 origin-bottom'}`}
                    style={{
                      background: isBelow
                        ? `linear-gradient(to bottom, ${color}80, transparent)`
                        : `linear-gradient(to top, ${color}80, transparent)`
                    }}
                  />

                  {/* Card, placed above or below the spine */}
                  <motion.div
                    initial={{ opacity: 0, y: isBelow ? 20 : -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`absolute left-0 right-0 ${isBelow ? 'top-8' : 'bottom-8'}`}
                  >
                    <EducationCard edu={edu} color={color} />
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const EducationCard: React.FC<{ edu: (typeof educationData)[number]; color: string }> = ({ edu, color }) => {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 text-left transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      style={{ borderColor: `${color}25` }}
    >
      {/* Title row + date pill */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <GraduationCap size={16} style={{ color }} />
          <h3 className="text-base font-bold font-display" style={{ color }}>
            {edu.level}
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
          <Calendar size={11} />
          {edu.period}
        </span>
      </div>

      {/* Institution */}
      <p className="mt-2 text-sm font-semibold text-slate-100">{edu.institution}</p>
      <p className="mt-0.5 text-xs text-slate-500">{edu.location}</p>

      {/* Key Achievements */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          Key Achievements
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
            <ArrowRight size={12} className="mt-0.5 shrink-0" style={{ color }} />
            {toAchievementLine(edu)}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EducationTimeline
