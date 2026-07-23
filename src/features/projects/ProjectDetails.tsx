import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Github, Globe, Calendar, Clock, BarChart2, ShieldAlert, Award, Puzzle, Code2 } from 'lucide-react'
import { projectsData } from '../../utils/mockData'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const getTagStyles = (tag: string) => {
  const t = tag.toLowerCase()

  // Graphics/UI
  if (t.includes('react') || t.includes('vite') || t.includes('tailwind') || t.includes('html') || t.includes('css') || t.includes('typescript')) {
    return {
      bg: 'bg-cyan-500/5 dark:bg-cyan-500/10 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20',
      border: 'border-cyan-500/25 hover:border-cyan-500/50 dark:border-cyan-500/15 dark:hover:border-cyan-500/30',
      text: 'text-cyan-600 dark:text-cyan-400',
      dot: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
    }
  }
  // Backend/Frameworks
  if (t.includes('node') || t.includes('express') || t.includes('fastapi') || t.includes('python')) {
    return {
      bg: 'bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20',
      border: 'border-emerald-500/25 hover:border-emerald-500/50 dark:border-emerald-500/15 dark:hover:border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    }
  }
  // Databases/Storage
  if (t.includes('mongo') || t.includes('sql') || t.includes('db')) {
    return {
      bg: 'bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/10 dark:hover:bg-amber-500/20',
      border: 'border-amber-500/25 hover:border-amber-500/50 dark:border-amber-500/15 dark:hover:border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    }
  }
  // Devops/Tools
  if (t.includes('git') || t.includes('github') || t.includes('netlify') || t.includes('render')) {
    return {
      bg: 'bg-indigo-500/5 dark:bg-indigo-500/10 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20',
      border: 'border-indigo-500/25 hover:border-indigo-500/50 dark:border-indigo-500/15 dark:hover:border-indigo-500/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
    }
  }
  // Security/Auth/APIs
  if (t.includes('stripe') || t.includes('jwt') || t.includes('bcrypt') || t.includes('auth') || t.includes('hashing')) {
    return {
      bg: 'bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/10 dark:hover:bg-rose-500/20',
      border: 'border-rose-500/25 hover:border-rose-500/50 dark:border-rose-500/15 dark:hover:border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400',
      dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
    }
  }
  // Maps/AI/ML
  if (t.includes('leaflet') || t.includes('map') || t.includes('ml') || t.includes('mobilenet') || t.includes('routing')) {
    return {
      bg: 'bg-purple-500/5 dark:bg-purple-500/10 hover:bg-purple-500/10 dark:hover:bg-purple-500/20',
      border: 'border-purple-500/25 hover:border-purple-500/50 dark:border-purple-500/15 dark:hover:border-purple-500/30',
      text: 'text-purple-600 dark:text-purple-400',
      dot: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
    }
  }

  // Default Generic
  return {
    bg: 'bg-slate-500/5 dark:bg-slate-500/10 hover:bg-slate-500/10 dark:hover:bg-slate-500/20',
    border: 'border-slate-500/25 hover:border-slate-500/50 dark:border-slate-500/15 dark:hover:border-slate-500/30',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]'
  }
}

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const trackProjectView = usePortfolioStore((state) => state.trackProjectView)

  const project = projectsData.find((p) => p.id === id)

  useEffect(() => {
    if (project) {
      trackProjectView(project.id)
      window.scrollTo(0, 0)
    }
  }, [project, trackProjectView])

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-center px-6">
        <h2 className="text-xl font-bold font-display text-slate-200 mb-4">Project Core Not Resolved</h2>
        <Link to="/home" className="text-xs text-accent-400 hover:underline">Return to Home Portal</Link>
      </div>
    )
  }

  const handleBack = () => {
    navigate('/home', { state: { fromProject: true } })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100">
      {/* Cinematic hero: full-bleed cover image with gradient scrim and floating title/actions */}
      <div className="relative w-full h-[52vh] md:h-[64vh] min-h-[380px] overflow-hidden border-b border-white/5">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
            <Code2 size={64} className="text-slate-700" strokeWidth={1.25} />
          </div>
        )}

        {/* Scrim gradients for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/50 to-[#0a0a0c]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/70 via-transparent to-transparent" />

        {/* Back navigation, floated over the hero */}
        <div className="absolute top-0 inset-x-0 pt-24 md:pt-28 px-6">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 cursor-pointer select-none group transition-colors"
              data-cursor="BACK"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
              Back to Portal
            </button>
          </div>
        </div>

        {/* Title block floating at the bottom of the hero */}
        <div className="absolute bottom-0 inset-x-0 px-6 pb-8 md:pb-12">
          <div className="max-w-5xl mx-auto">
            <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
              Case Study &bull; {project.category}
            </span>
            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-slate-100 font-display mt-3 mb-6 leading-[1.05]">
              {project.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => {
                  const styles = getTagStyles(tag)
                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-3xs font-medium backdrop-blur-md ${styles.bg} ${styles.border} ${styles.text} transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-default`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                      {tag}
                    </span>
                  )
                })}
              </div>

              <div className="flex gap-3 md:ml-auto shrink-0">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition-colors cursor-pointer"
                  data-cursor="CODE"
                >
                  <Github size={14} /> Repository
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-400 hover:from-accent-500 hover:to-accent-300 shadow-lg shadow-accent-600/20 transition-colors cursor-pointer"
                    data-cursor="LIVE"
                  >
                    <Globe size={14} /> Live Demo
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-violet-300 bg-violet-900/30 backdrop-blur-md border border-violet-500/30">
                    <Puzzle size={14} /> Browser Extension
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Grid specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Story (Left column) */}
          <div className="lg:col-span-7 flex flex-col gap-10">

            {/* Context & Description */}
            <div className="bg-slate-950/40 glassmorphism p-7 rounded-2xl border border-white/5">
              <h2 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider mb-3">Project Summary</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {project.longDescription}
              </p>
            </div>

            {/* In-Depth Metrics Grid */}
            {project.metrics.length > 0 && (
              <div>
                <h2 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-accent-400" /> Operational Metrics
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="bg-slate-950/45 border border-white/5 rounded-2xl p-4 text-center">
                      <div className="text-xl md:text-2xl font-black font-display text-accent-400">{metric.value}</div>
                      <div className="text-[9px] text-slate-500 font-matrix uppercase tracking-wider mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges / Hurdle list */}
            <div>
              <h2 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert size={16} className="text-accent-400" /> Technical Hurdles
              </h2>
              <div className="flex flex-col gap-4">
                {project.challenges.map((c, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-950/40 glassmorphism border border-white/5 rounded-xl">
                    <span className="text-xs font-bold font-matrix text-accent-400 mt-0.5 shrink-0">H{i+1}</span>
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">{c}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results achieved */}
            <div>
              <h2 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award size={16} className="text-accent-400" /> Resolution Outcomes
              </h2>
              <div className="flex flex-col gap-3 bg-slate-950/40 glassmorphism border border-white/5 rounded-xl p-5">
                {project.results.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Architecture diagram & Stats (Right column) */}
          <div className="lg:col-span-5 flex flex-col gap-10">

            {/* Meta logs */}
            <div className="bg-slate-950/40 glassmorphism p-5 border border-white/5 rounded-2xl flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs py-3 border-b border-white/5">
                <span className="text-slate-500 font-display">Development Timeline</span>
                <span className="text-slate-300 font-matrix uppercase text-[10px] flex items-center gap-1.5">
                  <Calendar size={12} /> {project.timeline}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-3">
                <span className="text-slate-500 font-display">Project Status</span>
                <span className="text-emerald-400 font-matrix uppercase text-[10px] flex items-center gap-1.5">
                  <Clock size={12} /> STABLE / COMPLETED
                </span>
              </div>
            </div>

            {/* Architecture Node Map (Interactive SVG Layout) */}
            <div className="bg-slate-950/40 glassmorphism p-6 rounded-3xl border border-white/5 flex flex-col">
              <h2 className="text-xs font-bold font-display text-slate-200 uppercase tracking-widest mb-4">
                Architecture Flow Logic
              </h2>

              <div className="relative w-full flex flex-col gap-0 py-2">
                {project.architecture.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="relative flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-accent-500/15 border border-accent-500/40 text-[10px] font-bold font-matrix text-accent-300 flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-matrix leading-snug text-slate-300 hover:border-accent-500/40 transition-colors">
                        {step}
                      </div>
                    </div>
                    {idx < project.architecture.length - 1 && (
                      <div className="w-px h-6 ml-3 bg-gradient-to-b from-accent-500/40 to-transparent" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Future developments */}
            <div className="bg-slate-950/40 glassmorphism p-6 rounded-2xl border border-white/5">
              <h2 className="text-xs font-bold font-display text-slate-200 uppercase tracking-wider mb-3">Future Roadmap</h2>
              <ul className="flex flex-col gap-2.5 list-none">
                {project.futureImprovements.map((imp, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
                    <span className="text-accent-400 shrink-0">&gt;</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectDetails
