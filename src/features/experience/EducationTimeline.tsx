import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar, ArrowRight } from 'lucide-react'
import { educationData } from '../../utils/mockData'
import { ConstellationBackground } from './ConstellationBackground'

// Outer entries render in purple/violet, the middle entry renders in cyan —
// matching the reference timeline's coloring (not a strict alternation).
const ACCENT_PURPLE = '#a78bfa'
const ACCENT_CYAN = '#22d3ee'

function getAccent(idx: number, total: number) {
  const isMiddle = total % 2 === 1 && idx === Math.floor(total / 2)
  return isMiddle ? ACCENT_CYAN : ACCENT_PURPLE
}

// Builds a real achievement sentence out of the existing result field
// (e.g. "CGPA: 7.18" -> "Maintained a CGPA of 7.18/10 throughout the program.")
function toAchievementLine(edu: (typeof educationData)[number]) {
  if (edu.result.toLowerCase().startsWith('cgpa')) {
    const value = edu.result.split(':')[1]?.trim() ?? edu.result
    return `Maintained a CGPA of ${value}/10 throughout the program.`
  }
  return `Scored ${edu.result} in ${edu.level} board examinations at ${edu.institution}.`
}

export const EducationTimeline: React.FC = () => {
  const total = educationData.length

  return (
    <section
      id="education"
      className="relative w-full py-24 px-6 border-b border-white/5"
    >
      <ConstellationBackground />

      <div className="relative z-10 max-w-6xl mx-auto">
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

        {/* Mobile: single left-aligned vertical spine, cards on one side only */}
        <div className="relative border-l border-white/10 pl-6 ml-4 flex flex-col gap-10 md:hidden">
          {educationData.map((edu, idx) => {
            const color = getAccent(idx, total)
            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20, scale: 0.9, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.35, delay: idx * 0.1 + 0.1, ease: 'backOut' }}
                  className="absolute -left-[31px] top-6 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border-2"
                  style={{ borderColor: color, boxShadow: `0 0 14px ${color}80, 0 0 0 3px ${color}1a` }}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </motion.span>

                <EducationCard edu={edu} color={color} />
              </motion.div>
            )
          })}
        </div>

        {/* Desktop / tablet: CSS Grid timeline. Three grid rows shared by every column —
            [card-above row (auto height, bottom-aligned)] / [node row (fixed height)] /
            [card-below row (auto height, top-aligned)] — so the node row's vertical
            position is identical across every column by construction (grid layout),
            not by guessing pixel offsets. The horizontal spine is an absolutely
            positioned line inside the node row only, so it is always exactly centered
            on every node regardless of card height, viewport width, or column count. */}
        <div
          className="hidden md:grid gap-x-6 lg:gap-x-10"
          style={{
            gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
            gridTemplateRows: 'auto auto auto',
            rowGap: 0
          }}
        >
          {educationData.map((edu, idx) => {
            const color = getAccent(idx, total)
            const isBelow = idx % 2 === 1
            return (
              <div
                key={`${edu.id}-above`}
                className="flex items-end justify-center pb-10"
                style={{ gridColumn: idx + 1, gridRow: 1 }}
              >
                {!isBelow && (
                  <motion.div
                    initial={{ opacity: 0, y: -32, scale: 0.9, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className="w-full max-w-sm"
                  >
                    <EducationCard edu={edu} color={color} />
                  </motion.div>
                )}
              </div>
            )
          })}

          {/* Node row: every column gets an identical-height cell, so the row itself
              (and the spine drawn inside it) is perfectly flat and centered. */}
          <div className="relative flex items-center" style={{ gridColumn: `1 / span ${total}`, gridRow: 2, height: '64px' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-violet-500/70 via-cyan-400/70 to-violet-500/70"
            />

            <div className="relative z-10 grid w-full" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
              {educationData.map((edu, idx) => {
                const color = getAccent(idx, total)
                const isBelow = idx % 2 === 1
                return (
                  <div key={`${edu.id}-node`} className="relative flex items-center justify-center">
                    {/* Short connector stub bridging the node to its card */}
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.35, delay: idx * 0.1 + 0.2, ease: 'easeOut' }}
                      className={`absolute left-1/2 -translate-x-1/2 w-px h-8 ${isBelow ? 'bottom-1/2 origin-bottom' : 'top-1/2 origin-top'}`}
                      style={{
                        background: isBelow
                          ? `linear-gradient(to bottom, ${color}, transparent)`
                          : `linear-gradient(to top, ${color}, transparent)`
                      }}
                    />

                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.4, delay: idx * 0.1, ease: 'backOut' }}
                      className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 border-2"
                      style={{ borderColor: color, boxShadow: `0 0 16px ${color}80, 0 0 0 4px ${color}1a` }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </motion.span>
                  </div>
                )
              })}
            </div>
          </div>

          {educationData.map((edu, idx) => {
            const color = getAccent(idx, total)
            const isBelow = idx % 2 === 1
            return (
              <div
                key={`${edu.id}-below`}
                className="flex items-start justify-center pt-10"
                style={{ gridColumn: idx + 1, gridRow: 3 }}
              >
                {isBelow && (
                  <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.9, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: 4 }}
                    className="w-full max-w-sm"
                  >
                    <EducationCard edu={edu} color={color} />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const EducationCard: React.FC<{ edu: (typeof educationData)[number]; color: string }> = ({ edu, color }) => {
  return (
    <div
      className="h-full min-h-[220px] rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      style={{ borderColor: `${color}30` }}
    >
      {/* Title row: circular icon badge + level/date */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          <GraduationCap size={20} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="text-base font-bold font-display" style={{ color }}>
              {edu.level}
            </h3>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[10px] font-semibold text-slate-300 shrink-0">
              <Calendar size={11} />
              {edu.period}
            </span>
          </div>

          {/* Institution */}
          <p className="mt-2 text-sm font-semibold text-slate-100">{edu.institution}</p>
          <p className="mt-0.5 text-xs text-slate-500">{edu.location}</p>
        </div>
      </div>

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
