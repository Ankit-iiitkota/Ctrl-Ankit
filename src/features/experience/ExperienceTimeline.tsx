import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, ChevronRight, CircleDot } from 'lucide-react'
import { experienceData, projectsData } from '../../utils/mockData'

export const ExperienceTimeline: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative w-full py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            02 &bull; Work Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Professional Timeline
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Timeline body */}
        <div className="flex flex-col gap-10">
          {experienceData.map((exp) => {
            const linkedProjects = projectsData.filter((p) => exp.linkedProjectIds?.includes(p.id))

            return (
              <div
                key={exp.id}
                className="rounded-2xl border border-white/10 bg-[#080b14]/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-accent-500/60 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_0_1px_hsl(var(--accent-hue)_85%_55%/0.3),0_0_35px_hsl(var(--accent-hue)_85%_55%/0.25)]"
              >
                {/* Terminal title bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-matrix text-[11px] text-slate-500 tracking-wide">
                      ~/work/{slugify(exp.company)}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-accent-500/10 border border-accent-500/20 text-[10px] font-bold font-matrix uppercase tracking-widest text-accent-400">
                    Work
                  </span>
                </div>

                <div className="p-6 md:p-8">
                  {/* Role + company header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-accent-400 shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-100 font-display">{exp.role}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-sm font-semibold text-accent-400">{exp.company}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-matrix">
                          <MapPin size={11} /> {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* From / To / Duration stat pills */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <StatPill label="From" value={exp.from} />
                    <StatPill label="To" value={exp.to} />
                    <StatPill label="Duration" value={exp.duration} />
                  </div>

                  {/* Description terminal block */}
                  <div className="rounded-xl border border-white/5 bg-black/30 p-5 mb-6">
                    <p className="font-matrix text-xs text-accent-400 mb-3">
                      <span className="text-slate-600">$</span> cat description.md
                    </p>
                    <div className="border-l-2 border-accent-500/20 pl-4 flex flex-col gap-2.5">
                      {exp.description.map((bullet, bIdx) => (
                        <p key={bIdx} className="text-xs md:text-sm text-slate-400 leading-relaxed">
                          {bullet}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <p className="font-matrix text-xs text-accent-400 mb-2.5">
                    <span className="text-slate-600">$</span> ls ./tech-stack
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {exp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/50 text-2xs font-mono font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Linked completed projects */}
                  {linkedProjects.length > 0 && (
                    <>
                      <p className="font-matrix text-xs text-accent-400 mb-2.5">
                        <span className="text-slate-600">$</span> ls ./completed-projects
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {linkedProjects.map((project) => (
                          <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent-500/20 bg-accent-500/5 text-2xs font-mono font-semibold text-accent-300 hover:bg-accent-500/10 hover:border-accent-500/40 transition-all"
                          >
                            <CircleDot size={11} />
                            {project.title}
                            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Footer status bar */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-white/[0.015]">
                  <span className="font-matrix text-[11px] text-slate-600">$ work --status</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-matrix text-emerald-400/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    COMPLETED &bull; {exp.description.length}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border border-white/5 bg-slate-900/40 px-4 py-3 text-center">
    <p className="font-matrix text-2xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-100 font-display">{value}</p>
  </div>
)

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

export default ExperienceTimeline
