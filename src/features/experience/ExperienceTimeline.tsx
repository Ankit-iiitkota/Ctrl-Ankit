import React from 'react'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { experienceData } from '../../utils/mockData'

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
        <div className="relative border-l border-white/10 pl-6 md:pl-10 ml-4 md:ml-8 flex flex-col gap-12">
          {experienceData.map((exp) => {
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline node dot */}
                <span className="absolute -left-[31px] md:-left-[47px] top-8 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2 border-accent-500 shadow-[0_0_12px_hsl(var(--accent-hue)_85%_55%)] transition-transform duration-300 group-hover:scale-110">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse" />
                </span>

                {/* Card Container */}
                <div className="bg-slate-950/20 glassmorphism rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-accent-500/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start">
                    {/* Left Column: Company, Role, Period, Location */}
                    <div className="md:w-1/3 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-accent-400">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-400 font-matrix">
                            <Calendar size={10} />
                            <span>{exp.period}</span>
                          </div>
                          <h3 className="text-base md:text-lg font-extrabold text-slate-100 font-display mt-0.5">
                            {exp.role}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-[10px] font-bold text-accent-400 tracking-wider uppercase">
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/50 border border-white/5 text-[10px] font-medium text-slate-400 font-matrix">
                          <MapPin size={10} /> {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Bullets & Tags */}
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      <ul className="flex flex-col gap-3 pl-4 list-disc text-slate-400 text-xs md:text-sm leading-relaxed">
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="hover:text-slate-300 transition-colors">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      
                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-4 border-t border-white/5">
                        {exp.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/40 border border-white/5 text-3xs font-medium text-slate-400 hover:text-accent-300 hover:border-accent-500/30 transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default ExperienceTimeline
