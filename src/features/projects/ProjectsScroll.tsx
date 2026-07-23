import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ImageOff } from 'lucide-react'
import { projectsData } from '../../utils/mockData'

const categories = ['All', 'Full Stack & AI/ML', 'AI & ML']

export const ProjectsScroll: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const navigate = useNavigate()

  const filteredProjects = projectsData.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  )

  return (
    <section id="projects" className="relative w-full py-24 px-6 border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 flex flex-col items-center"
        >
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-950/40 border border-accent-500/20 text-2xs font-bold font-display uppercase tracking-widest text-accent-400 mb-5">
            05 &bull; Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 font-display mb-4">
            Featured <span className="text-accent-gradient">Work</span>
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-xl text-sm md:text-base">
            Full-stack products, AI-powered platforms, and automation tools spanning
            backend systems, UX, retrieval pipelines, and production infrastructure.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-display transition-all duration-300 active:scale-95 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-accent-600 text-white border-accent-600 shadow-[0_0_14px_hsl(var(--accent-hue)_85%_55%/0.25)]'
                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stacked deck: full-width cards, alternating text/image sides, sticking and
            overlapping as you scroll past them (matches the reference's stacked-card feel) */}
        <div className="flex flex-col gap-8 relative pb-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, i) => {
              const isEven = i % 2 === 0

              return (
                <div
                  key={project.id}
                  className="w-full static lg:sticky"
                  style={{ top: `calc(6rem + ${i * 28}px)`, zIndex: i + 1 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="group relative w-full rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-white/20 transition-colors duration-300 cursor-pointer"
                    data-cursor="CASE"
                  >
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[420px]`}>
                      {/* Content Side */}
                      <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center flex-1 lg:w-1/2">
                        <span className="text-2xs font-bold font-display uppercase tracking-widest text-accent-400 mb-4 block">
                          {project.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-slate-100 mb-4 group-hover:text-accent-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-7">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.slice(0, 6).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-lg text-2xs font-mono bg-accent-500/10 text-accent-300 border border-accent-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 mt-auto">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-accent-300 hover:bg-accent-500/10 transition-colors px-4 py-2 rounded-lg -ml-4"
                            data-cursor="GITHUB"
                          >
                            <Github size={18} />
                            Source Code
                          </a>
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-accent-300 hover:bg-accent-500/10 transition-colors px-4 py-2 rounded-lg"
                              data-cursor="LINK"
                            >
                              <ExternalLink size={18} />
                              Live Demo
                            </a>
                          )}
                          <Link
                            to={`/projects/${project.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
                            data-cursor="CASE"
                          >
                            View Project &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Image / Placeholder Side */}
                      <div className="lg:w-1/2 bg-slate-900/40 border-t lg:border-t-0 lg:border-l border-white/5 p-6 sm:p-10 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/5 to-transparent opacity-60 pointer-events-none" />
                        {project.image ? (
                          <div className="relative z-10 w-full aspect-[16/10] rounded-xl overflow-hidden ring-1 ring-white/10 bg-black">
                            <img
                              src={project.image}
                              alt={`${project.title} preview`}
                              className="h-full w-full object-contain opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                            />
                          </div>
                        ) : (
                          <div className="relative z-10 w-full aspect-[16/10] flex flex-col items-center justify-center gap-2 rounded-xl ring-1 ring-white/10 bg-slate-950/50">
                            <ImageOff size={28} className="text-slate-700" strokeWidth={1.25} />
                            <span className="text-2xs font-mono uppercase tracking-widest text-slate-600">
                              Preview coming soon
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-20 text-slate-500 font-display">
              No matching software solutions resolved.
            </div>
          )}
        </div>

        {/* View more on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-14"
        >
          <a
            href="https://github.com/Ankit-iiitkota"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-slate-950/50 border border-white/10 text-sm font-bold font-display text-slate-200 hover:text-accent-300 hover:bg-white/5 transition-all duration-300 active:scale-95"
            data-cursor="LINK"
          >
            <Github size={18} />
            Explore more repositories
          </a>
        </motion.div>
      </div>
    </section>
  )
}
export default ProjectsScroll
