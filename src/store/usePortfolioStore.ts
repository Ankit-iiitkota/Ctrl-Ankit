import { create } from 'zustand'

export interface CommandLog {
  id: string
  command: string
  output: string
  timestamp: Date
}

export interface VisitorStats {
  pageViews: Record<string, number>
  sessionStart: number
  clicks: number
  keysPressed: number
  terminalCommandsCount: number
  projectsViewed: string[]
  themeChanges: number
}

interface PortfolioState {
  // Navigation & Shell
  activeSection: string
  customCursorEnabled: boolean
  accentHue: number

  // Terminal Emulator
  terminalHistory: CommandLog[]
  terminalInput: string

  // Dashboard Analytics
  analytics: VisitorStats

  // Actions
  setActiveSection: (section: string) => void
  setCustomCursorEnabled: (enabled: boolean) => void
  setAccentHue: (hue: number) => void
  
  // Terminal Actions
  addTerminalCommand: (command: string, output: string) => void
  clearTerminalHistory: () => void
  setTerminalInput: (input: string) => void
  
  // Analytics Actions
  trackPageView: (page: string) => void
  trackClick: () => void
  trackKeyPress: () => void
  trackProjectView: (projectId: string) => void
  incrementThemeChanges: () => void
}

const getInitialAnalytics = (): VisitorStats => {
  const stored = localStorage.getItem('portfolio_analytics')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        sessionStart: Date.now() // Start new session duration tracker
      }
    } catch (e) {
      console.error('Failed to parse analytics', e)
    }
  }
  return {
    pageViews: { 'home': 1 },
    sessionStart: Date.now(),
    clicks: 0,
    keysPressed: 0,
    terminalCommandsCount: 0,
    projectsViewed: [],
    themeChanges: 0
  }
}

const saveAnalytics = (stats: VisitorStats) => {
  localStorage.setItem('portfolio_analytics', JSON.stringify(stats))
}

export const usePortfolioStore = create<PortfolioState>((set) => {
  // Initialize Accent Hue from localStorage or default (263)
  const initialHue = Number(localStorage.getItem('portfolio_accent_hue') || '263')
  document.documentElement.style.setProperty('--accent-hue', String(initialHue))

  return {
    // Nav / Settings States
    activeSection: 'home',
    customCursorEnabled: true,
    accentHue: initialHue,
    
    // Terminal States
    terminalHistory: [
      {
        id: 'welcome',
        command: 'init',
        output: 'Welcome to Ctrl+Ankit Terminal OS v2.0.0.\nType "help" to see all available commands.',
        timestamp: new Date()
      }
    ],
    terminalInput: '',
    
    // Analytics
    analytics: getInitialAnalytics(),
    
    // Shell Actions
    setActiveSection: (section) => set({ activeSection: section }),
    setCustomCursorEnabled: (enabled) => set({ customCursorEnabled: enabled }),

    setAccentHue: (hue) => set((state) => {
      localStorage.setItem('portfolio_accent_hue', String(hue))
      document.documentElement.style.setProperty('--accent-hue', String(hue))
      
      // Update analytics too
      const updatedAnalytics = {
        ...state.analytics,
        themeChanges: state.analytics.themeChanges + 1
      }
      saveAnalytics(updatedAnalytics)
      
      return { accentHue: hue, analytics: updatedAnalytics }
    }),
    
    // Terminal Actions
    addTerminalCommand: (command, output) => set((state) => {
      const log: CommandLog = {
        id: Math.random().toString(36).substr(2, 9),
        command,
        output,
        timestamp: new Date()
      }
      const updatedHistory = [...state.terminalHistory, log]
      
      const updatedAnalytics = {
        ...state.analytics,
        terminalCommandsCount: state.analytics.terminalCommandsCount + 1
      }
      saveAnalytics(updatedAnalytics)
      
      return {
        terminalHistory: updatedHistory,
        analytics: updatedAnalytics
      }
    }),
    
    clearTerminalHistory: () => set({
      terminalHistory: [
        {
          id: 'welcome',
          command: 'clear',
          output: 'Terminal cleared.',
          timestamp: new Date()
        }
      ]
    }),
    
    setTerminalInput: (input) => set({ terminalInput: input }),
    
    // Analytics Trackers
    trackPageView: (page) => set((state) => {
      const views = { ...state.analytics.pageViews }
      views[page] = (views[page] || 0) + 1
      
      const updated = {
        ...state.analytics,
        pageViews: views
      }
      saveAnalytics(updated)
      return { analytics: updated }
    }),
    
    trackClick: () => set((state) => {
      const updated = {
        ...state.analytics,
        clicks: state.analytics.clicks + 1
      }
      saveAnalytics(updated)
      return { analytics: updated }
    }),
    
    trackKeyPress: () => set((state) => {
      const updated = {
        ...state.analytics,
        keysPressed: state.analytics.keysPressed + 1
      }
      saveAnalytics(updated)
      return { analytics: updated }
    }),
    
    trackProjectView: (projectId) => set((state) => {
      if (state.analytics.projectsViewed.includes(projectId)) return {}
      const updated = {
        ...state.analytics,
        projectsViewed: [...state.analytics.projectsViewed, projectId]
      }
      saveAnalytics(updated)
      return { analytics: updated }
    }),
    
    incrementThemeChanges: () => set((state) => {
      const updated = {
        ...state.analytics,
        themeChanges: state.analytics.themeChanges + 1
      }
      saveAnalytics(updated)
      return { analytics: updated }
    })
  }
})
