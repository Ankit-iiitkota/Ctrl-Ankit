import React, { useEffect, useState } from 'react'
import { Activity, Clock, MousePointer, Terminal as TermIcon, Layers, Globe } from 'lucide-react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const AnalyticsDashboard: React.FC = () => {
  const analytics = usePortfolioStore((state) => state.analytics)
  const [duration, setDuration] = useState('00:00')

  // Live session timer
  useEffect(() => {
    const updateDuration = () => {
      const diffMs = Date.now() - analytics.sessionStart
      const diffSecs = Math.floor(diffMs / 1000)
      const mins = Math.floor(diffSecs / 60)
      const secs = diffSecs % 60
      
      const pad = (n: number) => String(n).padStart(2, '0')
      setDuration(`${pad(mins)}m ${pad(secs)}s`)
    }

    updateDuration()
    const timer = setInterval(updateDuration, 1000)
    return () => clearInterval(timer)
  }, [analytics.sessionStart])

  // Total Interactions sum
  const totalInteractions = analytics.clicks + analytics.keysPressed

  // Custom SVG bar chart parameters
  const viewKeys = Object.keys(analytics.pageViews)
  const viewVals = Object.values(analytics.pageViews)
  const maxVal = Math.max(...viewVals, 1)

  return (
    <section
      id="dashboard"
      className="relative w-full py-24 px-6 border-b border-white/5 bg-[#0a0a0c] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            08 &bull; Console
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Visitor Analytics Suite
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
          <p className="text-xs text-slate-500 font-matrix mt-4">
            LOCAL INTERACTIONS REPORT LOGS ACCUMULATING ON CLIENT INSTANCE
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Duration Card */}
          <div className="bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl text-accent-400">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-matrix uppercase">Session Duration</div>
              <div className="text-lg font-black font-display text-slate-200 mt-0.5">{duration}</div>
            </div>
          </div>

          {/* Clicks & Keypress */}
          <div className="bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl text-accent-400">
              <MousePointer size={20} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-matrix uppercase">Interactions Sum</div>
              <div className="text-lg font-black font-display text-slate-200 mt-0.5">{totalInteractions} logs</div>
            </div>
          </div>

          {/* Terminal commands counter */}
          <div className="bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl text-accent-400">
              <TermIcon size={20} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-matrix uppercase">Shell Commands</div>
              <div className="text-lg font-black font-display text-slate-200 mt-0.5">{analytics.terminalCommandsCount} runs</div>
            </div>
          </div>

          {/* Theme adjustments */}
          <div className="bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl text-accent-400">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-matrix uppercase">Theme Alterations</div>
              <div className="text-lg font-black font-display text-slate-200 mt-0.5">{analytics.themeChanges} tweaks</div>
            </div>
          </div>

        </div>

        {/* Charts and map layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Custom SVG Page Views Graph (Left 5-columns) */}
          <div className="lg:col-span-5 bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-1.5">
                <Activity size={14} className="text-accent-400" /> Module Navigation hits
              </h3>

              {/* Bar charts bars mapping */}
              <div className="flex flex-col gap-4">
                {viewKeys.map((key) => {
                  const val = analytics.pageViews[key] || 0
                  const pct = (val / maxVal) * 100

                  return (
                    <div key={key} className="text-xs">
                      <div className="flex justify-between text-2xs font-matrix text-slate-400 mb-1.5 uppercase">
                        <span>{key}</span>
                        <span>{val} views</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <span className="text-[9px] text-slate-600 font-matrix mt-6">
              ACCURACY VERIFIED VIA LOCALSTORE CACHE LOGS
            </span>
          </div>

          {/* Interactive Geo map chart (Right 7-columns) */}
          <div className="lg:col-span-7 bg-slate-950/20 glassmorphism rounded-2xl border border-white/5 p-6 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-1.5">
                <Globe size={14} className="text-accent-400" /> Global Connection Nodes
              </h3>
              <p className="text-[10px] text-slate-500 font-sans mb-6">
                Active server sync simulated request hubs responding to visitor routes.
              </p>

              {/* Vector/styled map mock */}
              <div className="relative w-full aspect-[2/1] bg-slate-950/70 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-4">
                {/* SVG representing dotted outline map */}
                <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />
                
                {/* Pulsing signal nodes */}
                {/* Silicon Valley */}
                <div className="absolute top-[35%] left-[20%] flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500 border border-white/20"></span>
                  <span className="absolute left-4 top-[-2px] text-[8px] font-matrix text-slate-400 font-bold uppercase">SF</span>
                </div>

                {/* London/Europe */}
                <div className="absolute top-[28%] left-[50%] flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500 border border-white/20"></span>
                  <span className="absolute left-4 top-[-2px] text-[8px] font-matrix text-slate-400 font-bold uppercase">LHR</span>
                </div>

                {/* Tokyo */}
                <div className="absolute top-[40%] left-[82%] flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500 border border-white/20"></span>
                  <span className="absolute left-4 top-[-2px] text-[8px] font-matrix text-slate-400 font-bold uppercase">NRT</span>
                </div>
                
                {/* Sydney */}
                <div className="absolute top-[75%] left-[88%] flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500 border border-white/20"></span>
                  <span className="absolute left-4 top-[-2px] text-[8px] font-matrix text-slate-400 font-bold uppercase">SYD</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-matrix pt-4 mt-2 border-t border-white/5">
              <span>LATENCY RANGES: 12ms - 84ms</span>
              <span>ROUTING LOG: STABLE</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
export default AnalyticsDashboard
