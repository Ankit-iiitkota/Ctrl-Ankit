import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import {
  Code2,
  Layers,
  Wrench,
  Sparkles,
  GraduationCap,
  Gauge,
  Palette,
  Bot,
  Braces,
  Binary,
  Database,
  Cpu,
  Network,
  Blend
} from 'lucide-react'
import {
  SiPython,
  SiJavascript,
  SiMysql,
  SiCplusplus,
  SiGraphql,
  SiOpenjdk,
  SiHtml5,
  SiReact,
  SiTailwindcss,
  SiPandas,
  SiNumpy,
  SiNodedotjs,
  SiExpress,
  SiBootstrap,
  SiTensorflow,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiPostman,
  SiDocker,
  SiFigma,
  SiClaude
} from 'react-icons/si'

interface SkillItem {
  name: string
  level: string
  percentage: number
  desc: string
  color: string
  skillIcon: React.ReactNode
}

interface SkillCategory {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  average: number
  accentColor: string
  skills: SkillItem[]
}

// Deterministic pseudo-random generator seeded by string, so each skill's scatter position stays stable across re-renders
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return (offset: number) => {
    const x = Math.sin(hash + offset) * 10000
    return x - Math.floor(x)
  }
}

// Draggable, physically-scattered icon card for a single skill (fling-around deck, matches reference layout)
function DraggableSkillCard({
  skill,
  accentColor,
  index,
  constraintsRef
}: {
  skill: SkillItem
  accentColor: string
  index: number
  constraintsRef: React.RefObject<HTMLDivElement | null>
}) {
  const rand = seededRandom(skill.name)

  // Scatter within the deck bounds, avoiding hard edges
  const top = 6 + rand(1) * 62
  const left = 4 + rand(2) * 68
  const rotate = (rand(3) - 0.5) * 24

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={true}
      dragElastic={0.15}
      whileDrag={{ scale: 1.08, zIndex: 50, boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}
      whileHover={{ scale: 1.05, zIndex: 40 }}
      initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: 'spring', damping: 16, stiffness: 140, delay: index * 0.05 }}
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        zIndex: index
      }}
      className="w-[132px] h-[132px] sm:w-[148px] sm:h-[148px] rounded-2xl border bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 cursor-grab active:cursor-grabbing select-none shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
      title={`${skill.name} — ${skill.level}`}
      data-cursor="DRAG"
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `1px solid ${accentColor}30` }}
      />
      <div className="text-3xl" style={{ color: accentColor }}>
        {skill.skillIcon}
      </div>
      <span className="text-2xs font-extrabold text-slate-200 font-display tracking-wide uppercase text-center px-2 leading-tight">
        {skill.name}
      </span>
      <span
        className="text-[8px] font-bold font-matrix uppercase tracking-widest px-1.5 py-0.5 rounded border leading-none"
        style={{
          color: accentColor,
          borderColor: `${accentColor}25`,
          backgroundColor: `${accentColor}0a`
        }}
      >
        {skill.level}
      </span>
    </motion.div>
  )
}

function CircularProgress({ percentage, color, size = 32 }: { percentage: number; color: string; size?: number }) {
  const radius = 12
  const strokeWidth = 2.5
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="transform -rotate-90">
      <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle 
        cx="18" 
        cy="18" 
        r={radius} 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeDasharray={circumference} 
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
        style={{
          filter: `drop-shadow(0 0 3px ${color})`
        }}
      />
    </svg>
  )
}

export const GalaxyOrbitSkills: React.FC = () => {
  const { resolvedTheme: _resolvedTheme } = useTheme()
  const [activeCategory, setActiveCategory] = useState<string>('languages')
  const deckRef = useRef<HTMLDivElement>(null)


  const skillCategories: SkillCategory[] = [
    {
      id: 'languages',
      name: 'Programming Languages',
      icon: <Code2 size={20} />,
      description: 'Foundational syntax engines, scripting dialects, and query protocols.',
      average: 79,
      accentColor: '#38bdf8', // Cyan accent
      skills: [
        { name: 'Python', level: 'Expert', percentage: 83, desc: 'Exploratory data pipelines, numerical computation (NumPy/Pandas), and deep learning modeling (TensorFlow).', color: '#3776AB', skillIcon: <SiPython /> },
        { name: 'JavaScript', level: 'Expert', percentage: 92, desc: 'Interactive DOM behaviors, asynchronous event flows, React hooks ecosystem, and modern ES6 scripting.', color: '#F7DF1E', skillIcon: <SiJavascript /> },
        { name: 'SQL', level: 'Expert', percentage: 95, desc: 'Structuring complex queries, schema design, relational algebra, and database indexing strategies.', color: '#0064a5', skillIcon: <SiMysql /> },
        { name: 'C/C++', level: 'Advanced', percentage: 80, desc: 'Object-oriented software building, complex algorithms, memory constraints, and high-performance compilation.', color: '#00599C', skillIcon: <SiCplusplus /> },
        { name: 'GraphQL', level: 'Advanced', percentage: 82, desc: 'Creating custom type definitions, writing queries, and optimizing nested API payloads.', color: '#E10098', skillIcon: <SiGraphql /> },
        { name: 'Java', level: 'Advanced', percentage: 60, desc: 'Robust backend system architecture, design patterns, OOP principles, and server runtime environments.', color: '#007396', skillIcon: <SiOpenjdk /> },
        { name: 'HTML/CSS', level: 'Expert', percentage: 90, desc: 'Crafting semantic markup structures, modern flexbox/grid alignments, responsive layouts, and animations.', color: '#E34F26', skillIcon: <SiHtml5 /> }
      ]
    },
    {
      id: 'frameworks',
      name: 'Frameworks & Libraries',
      icon: <Layers size={20} />,
      description: 'Modern application builders, UI frameworks, and data processing engines.',
      average: 88,
      accentColor: '#a855f7', // Purple accent
      skills: [
        { name: 'React.js', level: 'Expert', percentage: 94, desc: 'Building reusable component trees, state stores (Zustand), virtual DOM optimizations, and page routers.', color: '#61DAFB', skillIcon: <SiReact /> },
        { name: 'Tailwind CSS', level: 'Expert', percentage: 95, desc: 'CSS-first page design, utility custom class compilation, responsive modifiers, and layout frameworks.', color: '#38BDF8', skillIcon: <SiTailwindcss /> },
        { name: 'Pandas', level: 'Expert', percentage: 90, desc: 'Aggregating large datasets, cleaning null records, merging tables, and compiling analytics.', color: '#150458', skillIcon: <SiPandas /> },
        { name: 'NumPy', level: 'Expert', percentage: 90, desc: 'Multi-dimensional array mathematics, matrix transformations, and vectorized numeric routines.', color: '#013243', skillIcon: <SiNumpy /> },
        { name: 'Node.js', level: 'Expert', percentage: 90, desc: 'Server-side environment configuration, event loops, clustering processes, and filesystem queries.', color: '#68A063', skillIcon: <SiNodedotjs /> },
        { name: 'Express', level: 'Expert', percentage: 80, desc: 'Designing high-performance HTTP REST APIs, routing pipelines, and custom security middlewares.', color: '#7986cb', skillIcon: <SiExpress /> },
        { name: 'Bootstrap', level: 'Advanced', percentage: 95, desc: 'Structuring responsive grid rows, standard visual templates, and styling rapid prototypes.', color: '#7952B3', skillIcon: <SiBootstrap /> },
        { name: 'TensorFlow', level: 'Advanced', percentage: 70, desc: 'Training deep learning classifiers, compiling neural networks, and deploying models to staging.', color: '#FF6F00', skillIcon: <SiTensorflow /> }
      ]
    },
    {
      id: 'tools',
      name: 'Development Tools & DBs',
      icon: <Wrench size={20} />,
      description: 'Container runtimes, testing platforms, databases, and editor sandboxes.',
      average: 89,
      accentColor: '#ec4899', // Pink accent
      skills: [
        { name: 'PostgreSQL', level: 'Expert', percentage: 80, desc: 'Enterprise relational database design, query optimization, joins, constraints, and data integrity.', color: '#336791', skillIcon: <SiPostgresql /> },
        { name: 'MySQL', level: 'Expert', percentage: 95, desc: 'Configuring relational schemas, transaction queries, and maintaining data tables.', color: '#00758F', skillIcon: <SiMysql /> },
        { name: 'MongoDB', level: 'Expert', percentage: 80, desc: 'Non-relational document data structures, collection queries, indexes, and aggregation loops.', color: '#47A248', skillIcon: <SiMongodb /> },
        { name: 'Git & GitHub', level: 'Expert', percentage: 92, desc: 'Managing branches, handling merge conflicts, collaborative issues tracking, and version histories.', color: '#F05032', skillIcon: <SiGit /> },
        { name: 'VS Code', level: 'Expert', percentage: 95, desc: 'Highly optimized development editor setup with debuggers, extensions, and syntax triggers.', color: '#007ACC', skillIcon: <Code2 /> },
        { name: 'Postman', level: 'Expert', percentage: 88, desc: 'Simulating HTTP calls, testing API headers, building testing suites, and documenting endpoints.', color: '#FF6C37', skillIcon: <SiPostman /> },
        { name: 'PowerBI', level: 'Advanced', percentage: 90, desc: 'Formulating interactive dashboards, DAX queries, data modeling, and custom reports.', color: '#F2C811', skillIcon: <Gauge /> },
        { name: 'Docker', level: 'Advanced', percentage: 20, desc: 'Containerizing services, drafting multi-stage Dockerfiles, network configs, and volumes.', color: '#2496ED', skillIcon: <SiDocker /> }
      ]
    },
    {
      id: 'design',
      name: 'Design & AI Systems',
      icon: <Sparkles size={20} />,
      description: 'Generative AI prompt workflows, visual interface layouts, and asset builders.',
      average: 87,
      accentColor: '#10b981', // Green accent
      skills: [
        { name: 'Claude', level: 'Expert', percentage: 90, desc: 'Leveraging model context windows to debug modules, synthesize logic, and write reviews.', color: '#D97706', skillIcon: <SiClaude /> },
        { name: 'Prompt Eng.', level: 'Expert', percentage: 95, desc: 'Creating custom system roles, multi-shot instructions, and parsing raw outputs.', color: '#10A37F', skillIcon: <Sparkles /> },
        { name: 'Figma', level: 'Expert', percentage: 95, desc: 'Creating vector prototypes, visual wireframes, component design systems, and developer handoffs.', color: '#F24E1E', skillIcon: <SiFigma /> },
        { name: 'Canva', level: 'Expert', percentage: 99, desc: 'Formulating quick layouts, social graphic visual assets, presentation slides, and visuals.', color: '#00C4CC', skillIcon: <Palette /> },
        { name: 'Agentic AI', level: 'Advanced', percentage: 70, desc: 'Building automated tools loop systems, autonomous action cycles, and agent frameworks.', color: '#8B5CF6', skillIcon: <Bot /> },
        { name: 'Photoshop', level: 'Advanced', percentage: 85, desc: 'Visual Graphics raster manipulation, photo color-grading, asset exporting, and layouts.', color: '#31A8FF', skillIcon: <Palette /> },
        { name: 'Google Stitch', level: 'Advanced', percentage: 89, desc: 'Orchestrating workflows, visual pipelines, and cloud platform integrations.', color: '#4285F4', skillIcon: <Layers /> }
      ]
    },
    {
      id: 'coursework',
      name: 'Academic Coursework',
      icon: <GraduationCap size={20} />,
      description: 'Computer Science theories, computing architecture, and software principles.',
      average: 89,
      accentColor: '#f59e0b', // Amber accent
      skills: [
        { name: 'DSA', level: 'Expert', percentage: 80, desc: 'Designing memory-efficient data wrappers: graphs, trees, hashes, lists, and queues.', color: '#EC4899', skillIcon: <Binary /> },
        { name: 'OOPs', level: 'Expert', percentage: 75, desc: 'Structuring systems around encapsulation, inheritance, polymorphism, and abstraction.', color: '#10B981', skillIcon: <Braces /> },
        { name: 'Algorithms', level: 'Expert', percentage: 75, desc: 'Formulating sorting, searching, traversing, and dynamic programming logics.', color: '#F59E0B', skillIcon: <Network /> },
        { name: 'DBMS', level: 'Expert', percentage: 95, desc: 'Relational database theories, transactions, ACID parameters, and normalizations.', color: '#3B82F6', skillIcon: <Database /> },
        { name: 'Software Eng.', level: 'Expert', percentage: 90, desc: 'Agile sprints, code compliance, documentation reviews, testing coverage, and staging deployments.', color: '#6366F1', skillIcon: <Blend /> },
        { name: 'Operating Sys.', level: 'Advanced', percentage: 85, desc: 'Managing thread states, CPU scheduling routines, virtual memories, and lock concurrency.', color: '#14B8A6', skillIcon: <Cpu /> },
        { name: 'System Design', level: 'Advanced', percentage: 70, desc: 'Architecting scaling microservices, load balancing, caching nodes, and sharding databases.', color: '#8B5CF6', skillIcon: <Network /> }
      ]
    }
  ]

  const activeCategoryData = skillCategories.find((cat) => cat.id === activeCategory) || skillCategories[0]

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId)
  }


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
    <section
      id="skills"
      className="relative w-full py-28 px-6 border-b border-white/5 overflow-hidden"
    >
      {/* Background neon elements */}
      <div className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-accent-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[140px] pointer-events-none" />

      {/* Cyberpunk dot background grid */}
      <div className="absolute inset-0 grid-dots opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16 pb-8 border-b border-white/5">
          <div className="text-left">
            <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
              03 &bull; StrongHold
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
              Technical Core Stack
            </h2>
            <div className="h-0.5 w-12 bg-accent-500 mt-4 rounded-full" />
          </div>
        </div>

        {/* Split Split Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* LEFT COLUMN: Holographic Vertical Deck (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-4.5">
            <span className="text-[9px] font-bold font-display uppercase tracking-widest text-slate-500 pl-2 text-left">
              Select Core Module
            </span>

            {/* Desktop vertical stack, Mobile horizontal swipe deck */}
            <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-none pb-4 lg:pb-0 select-none">
              {skillCategories.map((category) => {
                const isActive = category.id === activeCategory
                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    onMouseMove={handleSpotlightMove}
                    className={`flex-shrink-0 w-[240px] lg:w-full p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between relative overflow-hidden group ${
                      isActive 
                        ? 'bg-slate-950/40 border-accent-500/50 shadow-[0_8px_30px_rgba(168,85,247,0.12)] translate-x-0 lg:translate-x-3' 
                        : 'bg-slate-950/15 border-white/5 hover:border-white/12 hover:bg-slate-950/25 hover:translate-x-0 lg:hover:translate-x-1.5'
                    }`}
                    style={{
                      '--glow-color': `${category.accentColor}22`
                    } as React.CSSProperties}
                  >
                    {/* Custom mouse spotlight highlight behind card */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 80px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--glow-color), transparent 80%)`
                      }}
                    />

                    <div className="flex items-center gap-3.5 relative z-10">
                      <div className={`p-2.5 rounded-xl border transition-colors ${
                        isActive ? 'bg-accent-600/10 border-accent-500/20 text-accent-400' : 'bg-slate-950/60 border-white/5 text-slate-400'
                      }`}>
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <h3 className={`text-xs md:text-sm font-extrabold font-display transition-colors ${
                          isActive ? 'text-slate-100' : 'text-slate-400'
                        }`}>
                          {category.name}
                        </h3>
                        <span className="text-[8px] font-bold text-slate-500 font-matrix uppercase tracking-wider block mt-0.5">
                          {category.skills.length} parameters
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                      <CircularProgress percentage={category.average} color={category.accentColor} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Expansive Diagnostic Dashboard (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* The main active category metrics dashboard card */}
            <div className="flex-1 bg-slate-950/20 glassmorphism rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-6 flex items-center gap-1.5 text-[8.5px] font-bold text-slate-500 font-matrix uppercase tracking-wider">
                <Gauge size={10} className="text-accent-400" />
              </div>

              {/* Category Info */}
              <div className="text-left mb-8">
                <h3 className="text-lg md:text-xl font-extrabold text-slate-100 font-display mt-0.5 uppercase tracking-wide">
                  {activeCategoryData.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                  {activeCategoryData.description}
                </p>
              </div>

              {/* Draggable Skill Card Deck: scattered icon cards you can fling around */}
              {/* Every time activeCategory changes, the key resets so cards re-scatter to fresh positions */}
              <div
                key={activeCategory}
                ref={deckRef}
                className="relative w-full flex-1 min-h-[420px] md:min-h-[460px] overflow-hidden"
              >
                {activeCategoryData.skills.map((skill, idx) => (
                  <DraggableSkillCard
                    key={skill.name}
                    skill={skill}
                    accentColor={activeCategoryData.accentColor}
                    index={idx}
                    constraintsRef={deckRef}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
export default GalaxyOrbitSkills
