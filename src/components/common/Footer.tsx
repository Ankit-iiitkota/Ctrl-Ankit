import React from 'react'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { ConstellationBackground } from '../../features/experience/ConstellationBackground'

const socialLinks = [
  { icon: <Github size={16} />, href: 'https://github.com/Ankit-iiitkota', label: 'GitHub', color: '#ec4899' },
  { icon: <Linkedin size={16} />, href: 'https://www.linkedin.com/in/ankitchaurasiya29/', label: 'LinkedIn', color: '#22d3ee' },
  { icon: <Mail size={16} />, href: 'mailto:ankitiiitkota@gmail.com', label: 'Email', color: '#34d399' }
]

const footerNavLinks = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
]

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative w-full border-t border-white/5 overflow-hidden">
      <ConstellationBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
              <img src="/logo.png" alt="Ankit Chaurasiya logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-accent-400 font-display">Ankit Chaurasiya</p>
              <p className="text-xs text-slate-500">Full Stack Developer</p>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                data-cursor="LINK"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:text-white"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${item.color}70`
                  e.currentTarget.style.boxShadow = `0 10px 26px ${item.color}35`
                  e.currentTarget.style.backgroundColor = `${item.color}15`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.backgroundColor = ''
                }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider + nav row */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 order-2 sm:order-1">
            &copy; {year} Ankit Chaurasiya. All rights reserved.
          </p>

          <nav className="flex items-center gap-6 order-1 sm:order-2">
            {footerNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="group relative text-xs font-medium text-slate-400 transition-colors hover:text-white"
                data-cursor="NAV"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
        </div>

        <p className="mt-3 flex items-center justify-center sm:justify-start gap-1 text-[11px] text-slate-600">
          Crafted with <Heart size={11} className="text-rose-500 fill-rose-500" /> and code
        </p>
      </div>
    </footer>
  )
}

export default Footer
