import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogData } from '../../utils/mockData'

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [scrollProgress, setScrollProgress] = useState(0)

  const post = blogData.find((p) => p.slug === slug)

  // Track reading progress scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (post) {
      window.scrollTo(0, 0)
    }
  }, [post])

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-center px-6">
        <h2 className="text-xl font-bold font-display text-slate-200 mb-4">Article Not Found</h2>
        <Link to="/" className="text-xs text-accent-400 hover:underline">Return to Home Portal</Link>
      </div>
    )
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 py-28 px-6">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 z-[110]">
        <div
          className="h-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-100 mb-8 cursor-pointer select-none group"
          data-cursor="BACK"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>

        {/* Article Meta Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-4 text-3xs text-slate-500 font-matrix mb-4 uppercase">
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 py-4 border-y border-white/5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 rounded bg-slate-950/60 border border-white/5 text-3xs font-medium text-slate-400"
              >
                <Tag size={8} /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/5 bg-slate-900">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Markdown Rendered Article Body */}
        <article className="prose prose-invert prose-xs max-w-none text-slate-350 leading-relaxed font-sans text-xs md:text-sm flex flex-col gap-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => (
                <h2 className="text-lg md:text-xl font-bold font-display text-slate-100 mt-8 mb-4 border-b border-white/5 pb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-base font-bold font-display text-slate-200 mt-6 mb-3" {...props} />
              ),
              p: ({ node, ...props }) => <p className="mb-4 text-slate-400 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 flex flex-col gap-1.5" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 flex flex-col gap-1.5" {...props} />,
              li: ({ node, ...props }) => <li className="text-slate-400" {...props} />,
              code: ({ node, className, children, ...props }) => {
                const isInline = !className
                return isInline ? (
                  <code className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/5 font-matrix text-2xs text-accent-300" {...props}>
                    {children}
                  </code>
                ) : (
                  <div className="w-full bg-slate-950/90 border border-white/10 rounded-xl overflow-hidden my-6 font-matrix text-2xs text-slate-300 shadow-inner">
                    <div className="bg-slate-950 px-4 py-2 border-b border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                      <span>GLSL COMPILER WINDOW</span>
                      <span>UTF-8</span>
                    </div>
                    <pre className="p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed text-emerald-400">
                      <code>{children}</code>
                    </pre>
                  </div>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
        
        {/* Author Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-4 bg-slate-950/20 glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-600 to-accent-400 font-extrabold flex items-center justify-center text-white text-lg">
            A
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 font-display">Ctrl+Ankit Writer</div>
            <div className="text-3xs text-slate-500 font-matrix mt-0.5">PLATFORM CORE ENGINEER</div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default BlogPost
