import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { usePortfolioStore } from './store/usePortfolioStore'
import { useLenis } from './hooks/useLenis'

// Components
import { Navbar } from './components/common/Navbar'
import { CustomCursor } from './components/common/CustomCursor'
import { SplashScreen } from './components/common/SplashScreen'
import { Chatbot } from './components/chatbot/Chatbot'
import { Footer } from './components/common/Footer'

// Features sections (Single page portals)
import { FluidBackground } from './features/hero/FluidBackground'
import { HeroSection } from './features/hero/HeroSection'
import { AboutSection } from './features/about/AboutSection'
import { ExperienceTimeline } from './features/experience/ExperienceTimeline'
import { EducationTimeline } from './features/experience/EducationTimeline'
import { GalaxyOrbitSkills } from './features/skills/GalaxyOrbitSkills'
import { AchievementsSection } from './features/achievements/AchievementsSection'
import { ProjectsScroll } from './features/projects/ProjectsScroll'
import { LeadershipCerts } from './features/leadership-certs/LeadershipCerts'
import { ContactForm } from './features/contact/ContactForm'
import { TestimonialsSection } from './features/testimonials/TestimonialsSection'

// Deep link views
import { ProjectDetails } from './features/projects/ProjectDetails'


// Analytics and keyboard event listener shell
const AppAnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const trackPageView = usePortfolioStore((state) => state.trackPageView)
  const trackClick = usePortfolioStore((state) => state.trackClick)
  const trackKeyPress = usePortfolioStore((state) => state.trackKeyPress)

  // Track page navigation views
  useEffect(() => {
    let page = location.pathname
    if (page === '/') page = 'loader'
    else if (page === '/home') page = 'home'
    else if (page.startsWith('/projects/')) page = 'project-details'
    else if (page.startsWith('/blog/')) page = 'blog-post'
    
    trackPageView(page)
  }, [location.pathname, trackPageView])

  // Track click & keyboard inputs for dashboard analytics
  useEffect(() => {
    const handleGlobalClick = () => trackClick()
    const handleGlobalKeyPress = () => trackKeyPress()

    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('keydown', handleGlobalKeyPress)

    return () => {
      window.removeEventListener('click', handleGlobalClick)
      window.removeEventListener('keydown', handleGlobalKeyPress)
    }
  }, [trackClick, trackKeyPress])

  return <>{children}</>
}

// 404 Custom retro screen with game/retro return home panel
const NotFoundView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07070a] font-display text-center p-6 text-[#ff0055]">
      <div className="absolute inset-0 grid-dots opacity-20" />
      
      <div className="relative z-10 glassmorphism p-8 md:p-12 rounded-3xl border border-[#ff0055]/20 max-w-md shadow-[0_0_30px_rgba(255,0,85,0.05)]">
        <h1 className="text-7xl font-extrabold tracking-tighter">404</h1>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mt-2 mb-4 font-matrix">
          SEGMENT FAULT: ADDRESS RESOLUTION ERROR
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          The requested coordinate memory is either unallocated or has been swept by garbage collections loops.
        </p>
        <Link
          to="/home"
          className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-red-600/10"
        >
          Return to Portal
        </Link>
      </div>
    </div>
  )
}

// Unified homepage layout containing sections
const MainPortalView: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <ExperienceTimeline />
      <EducationTimeline />
      <GalaxyOrbitSkills />
      <AchievementsSection />
      <ProjectsScroll />
      <LeadershipCerts />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
    </div>
  )
}

const AppContent: React.FC = () => {
  useLenis() // Smooth scrolling activation
  const location = useLocation()
  const fromProject = (location.state as { fromProject?: boolean })?.fromProject

  const setActiveSection = usePortfolioStore((state) => state.setActiveSection)

  // Scroll to projects section if returning programmatically from project details
  useEffect(() => {
    if ((location.pathname === '/' || location.pathname === '/home') && fromProject) {
      // Clear location state so refreshes don't scroll again
      window.history.replaceState({}, document.title)

      const timer = setTimeout(() => {
        const el = document.getElementById('projects')
        if (el) {
          el.scrollIntoView({ behavior: 'auto' })
        }
        setActiveSection('projects')
      }, 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [location.pathname, fromProject, setActiveSection])

  // IntersectionObserver Scroll-Spy to automatically highlight active navbar tab on scroll and on load
  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/home') return

    const sections = ['home', 'about', 'projects', 'experience', 'education', 'skills', 'achievements', 'contact']

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // active when the section occupies the central field of the screen
      threshold: 0,
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Give DOM a split second to render and Lenis scroll to settle
    const timer = setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          observer.observe(el)
        }
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [location.pathname, setActiveSection])

  return (
    <>
      {/* Layout items (CustomCursor now mounts once at the App root, above the splash) */}
      <Navbar />
      <Chatbot />

      {/* Routes portal maps */}
      <Routes>
        <Route path="/" element={<MainPortalView />} />
        <Route path="/home" element={<MainPortalView />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </>
  )
}

// Module-level flag: true only for the first render after an actual page load/refresh
// (the module re-executes on every hard refresh, but not on in-app client-side navigation).
let hasShownSplashThisPageLoad = false

// Mounted once, site-wide: the fluid dye-trail canvas needs the resolved theme,
// which only exists below <ThemeProvider>.
const AppShell: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const [showSplash, setShowSplash] = useState(!hasShownSplashThisPageLoad)

  const handleSplashComplete = () => {
    hasShownSplashThisPageLoad = true
    setShowSplash(false)
  }

  return (
    <>
      <FluidBackground theme={resolvedTheme} />
      <CustomCursor />
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Router>
        <AppAnalyticsWrapper>
          <AppContent />
        </AppAnalyticsWrapper>
      </Router>
    </>
  )
}

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
export default App
