import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blogData } from '../../utils/mockData'

export const BlogList: React.FC = () => {
  return (
    <section
      id="blog"
      className="relative w-full py-24 px-6 border-b border-white/5 bg-[#0a0a0c]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            07 &bull; Chronicles
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Engineering Insights
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogData.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
              className="group bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:border-white/12"
            >
              {/* Cover Photo */}
              <div className="relative h-44 md:h-auto md:w-2/5 overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Contents details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-3xs text-slate-500 font-matrix mb-3 uppercase">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-100 font-display group-hover:text-accent-300 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-3xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-950/60 border border-white/5 text-[9px] font-medium text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-2xs font-semibold text-accent-400 hover:text-accent-300 font-display tracking-wider group/link cursor-pointer"
                    data-cursor="READ"
                  >
                    Read
                    <ArrowRight size={12} className="transform group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default BlogList
