import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Home, User, Briefcase, GraduationCap, Layers, Activity, Trophy, Mail } from 'lucide-react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { ThemeToggle } from './ThemeToggle'
import { MusicToggle } from './MusicToggle'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Activity },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'contact', label: 'Contact', icon: Mail }
]

export const Navbar: React.FC = () => {
  const activeSection = usePortfolioStore((state) => state.activeSection)
  const setActiveSection = usePortfolioStore((state) => state.setActiveSection)
  const { resolvedTheme, setTheme } = useTheme()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isDark = resolvedTheme === 'dark'

  // Track scrolling to add glass effect shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)

    // Smooth scroll to element
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      <nav
        className={`pointer-events-auto relative transition-all duration-500 rounded-2xl lg:rounded-full w-full max-w-6xl 2xl:max-w-[88rem] flex items-center justify-between px-4 sm:px-6 h-14 lg:h-16 border ${
          scrolled
            ? 'bg-[#0c0c10]/90 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
            : 'bg-[#0c0c10]/40 backdrop-blur-md border-white/5'
        }`}
      >
        {/* Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          data-cursor="HOME"
        >
          <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <img
              src="/logo.png"
              alt="Ankit Chaurasiya logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.25)]"
            />
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-slate-100 group-hover:text-accent-300 transition-colors hero-title hidden sm:block">
            Ctrl+Ankit
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 xl:px-3.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-accent-500/10 text-accent-300 font-semibold shadow-[0_0_14px_hsl(var(--accent-hue)_85%_55%/0.12)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/10'
                }`}
                data-cursor="NAV"
              >
                <Icon size={15} className={isActive ? 'text-accent-300' : 'text-slate-500'} />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Desktop Utilities */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="w-px h-4 bg-white/10 mx-1" />
          <MusicToggle />
          <ThemeToggle />
        </div>

        {/* Mobile: only hamburger button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-slate-100 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-colors active:scale-95"
            data-cursor="MENU"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Subtle glowing bottom line beneath the whole bar */}
        <span className="pointer-events-none absolute -bottom-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent shadow-[0_1px_8px_hsl(var(--accent-hue)_85%_55%/0.45)]" />
      </nav>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full mt-2 left-4 right-4 pointer-events-auto rounded-2xl border border-white/10 py-5 px-5 shadow-2xl flex flex-col gap-2 animate-fade-in bg-[#0c0c10]/95 backdrop-blur-xl">
          {/* Nav links */}
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-left text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-accent-400 bg-accent-600/10 border-l-2 border-accent-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-accent-400' : 'text-slate-500'} />
                {item.label}
              </button>
            )
          })}

          {/* Settings divider */}
          <div className="border-t border-white/8 mt-2 pt-4 flex flex-col gap-2">

            {/* Theme toggle row */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {isDark ? <Moon size={15} /> : <Sun size={15} />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200">Appearance</p>
                  <p className="text-[10px] text-slate-500">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={`relative w-11 h-6 rounded-full border transition-colors duration-300 ${
                isDark ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-amber-500/20 border-amber-500/30'
              }`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                  isDark 
                    ? 'left-5 bg-cyan-400 shadow-cyan-500/40' 
                    : 'left-0.5 bg-amber-400 shadow-amber-500/40'
                }`} />
              </div>
            </button>

            {/* Music toggle row */}
            <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent-500/10 text-accent-400">
                  <MusicToggle />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200">Background Music</p>
                  <p className="text-[10px] text-slate-500">Tap the icon to play/mute</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
