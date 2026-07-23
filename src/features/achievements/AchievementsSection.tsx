import React from 'react'
import { motion } from 'framer-motion'
import { Award, Code2, Users, Trophy } from 'lucide-react'
import { achievementsData, Achievement } from '../../utils/mockData'

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
  index: number
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const config = categoryConfig[achievement.category] || { color: '#6366f1', icon: <Award size={14} /> }
  const color = config.color
  
  // Interactive mouse tracking spotlight reflection on card elements
  const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--spotlight-x', `${x}px`)
    card.style.setProperty('--spotlight-y', `${y}px`)
  }

  return (
    <motion.div
      onMouseMove={handleSpotlightMove}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-slate-950/20 glassmorphism p-7 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[220px] relative overflow-hidden group cursor-pointer"
      style={{
        '--spotlight-glow': `${color}12`
      } as React.CSSProperties}
    >
      {/* Mouse tracking radial spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 100px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-glow), transparent 80%)`
        }}
      />

      <div>
        {/* Header: Category Badge & Date */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300"
            style={{
              color: color,
              borderColor: `${color}25`,
              backgroundColor: `${color}0c`
            }}
          >
            <span>{config.icon}</span>
            <span className="text-[10px] font-bold font-display uppercase tracking-wider">{achievement.category}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-matrix tracking-wider">{achievement.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 font-display mb-3 group-hover:text-white transition-colors relative z-10 leading-snug">
          {achievement.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-6 relative z-10 group-hover:text-slate-300 transition-colors">
          {achievement.description}
        </p>
      </div>

      {/* Issuer footer */}
      <div className="border-t border-white/5 pt-4 flex items-center justify-between relative z-10">
        <span className="text-[9px] font-bold font-sans uppercase text-slate-500 tracking-wider">
          Issued By
        </span>
        <span 
          className="text-xs font-semibold transition-colors duration-300"
          style={{ color: color }}
        >
          {achievement.issuer}
        </span>
      </div>
    </motion.div>
  )
}

export const AchievementsSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 22, stiffness: 100 }
    }
  }

  return (
    <section
      id="achievements"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      {/* Subtle ambient lighting spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-accent-500/5 filter blur-[100px] opacity-40" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 filter blur-[120px] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 text-center md:text-left"
        >
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            04 &bull; ACHIEVEMENTS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display mt-3 leading-tight">
            Milestones of
            <br />
            Excellence.
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        {/* Masonry-style/Flexible Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievementsData.map((ach, idx) => (
            <motion.div key={ach.id} variants={cardVariants}>
              <AchievementCard achievement={ach} index={idx} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AchievementsSection

