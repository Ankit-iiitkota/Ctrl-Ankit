import React, { useEffect, useRef } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const commandList = ['help', 'about', 'skills', 'projects', 'contact', 'clear']

export const TerminalEmulator: React.FC = () => {
  const terminalHistory = usePortfolioStore((state) => state.terminalHistory)
  const addTerminalCommand = usePortfolioStore((state) => state.addTerminalCommand)
  const clearTerminalHistory = usePortfolioStore((state) => state.clearTerminalHistory)
  const setTerminalInput = usePortfolioStore((state) => state.setTerminalInput)
  const terminalInput = usePortfolioStore((state) => state.terminalInput)

  const terminalBottomRef = useRef<HTMLDivElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on additions
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  // Interpret commands
  const evaluateCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    
    if (trimmed === '') return

    let output = ''
    switch (trimmed) {
      case 'help':
        output = 'Available commands:\n' +
          '  about    - Fetch developer bio profile.\n' +
          '  skills   - List key skill systems.\n' +
          '  projects - List compiled case studies.\n' +
          '  resume   - Get resume file download.\n' +
          '  contact  - Display connectivity details.\n' +
          '  clear    - Flush terminal console lines.'
        break
      case 'about':
        output = 'BIO LOG:\n' +
          'A systems architect focused on high-scale backends and WebGL Graphics.\n' +
          'Bridges structural solidity and visual aesthetics seamlessly.\n' +
          'Located: Delhi, India.\n' +
          'Motto: "Perfect compiles, fluid visuals."'
        break
      case 'skills':
        output = 'SKILL MATRIX:\n' +
          '  - FRONTEND : React 19, TypeScript, WebGL/GLSL, Tailwind v4.\n' +
          '  - BACKEND  : Go, Rust, Node.js, Redis, Apache Kafka.\n' +
          '  - DEV OPS  : Docker, Kubernetes, AWS Clouds, Terraform.'
        break
      case 'projects':
        output = 'ACTIVE CASE STUDIES:\n' +
          '  - NovaNet   - Decentralized GPU network node orchestration.\n' +
          '  - Aether    - Real-time GLSL WebGL Ray Tracer.\n' +
          '  - Sentinels - Threat logs pipeline visual globe console.'
        break
      case 'resume':
        output = 'Downloading resume file...'
        const link = document.createElement('a')
        link.href = '/Resume_Ankit_Chaurasiya.pdf'
        link.download = 'Ankit_Chaurasiya_Resume.pdf'
        link.click()
        break
      case 'contact':
        output = 'CONTACT LOG:\n' +
          '  - Email    : contact@engineer.io\n' +
          '  - GitHub   : github.com/ankitchaurasiya\n' +
          '  - LinkedIn : linkedin.com/in/ankit-chaurasiya\n' +
          'Send me an email directly or trigger form submits below!'
        break
      case 'clear':
        clearTerminalHistory()
        setTerminalInput('')
        return
      default:
        if (trimmed.startsWith('sudo')) {
          output = 'VIOLATION: User is not in the sudoers file. This incident will be reported to system administrator.'
        } else {
          output = `Command not recognized: "${trimmed}". Type "help" for a list of operations.`
        }
    }

    addTerminalCommand(cmd, output)
    setTerminalInput('')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    evaluateCommand(terminalInput)
  }

  return (
    <section
      id="terminal"
      className="relative w-full py-24 px-6 border-b border-white/5 bg-[#0a0a0c] text-[var(--text-primary)] font-matrix"
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Section header */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-500">
            06 &bull; Fun Lab
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Ctrl+Ankit Terminal OS
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Emulator Box */}
        <div className="relative w-full h-[400px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col p-5 shadow-lg">
          
          {/* Console Output Screen */}
          <div className="relative z-10 flex-1 overflow-y-auto flex flex-col gap-3.5 pr-2 scrollbar-thin">
            {terminalHistory.map((log) => {
              if (log.command === 'matrix' || log.command === 'hack') return null;
              
              return (
                <div key={log.id} className="text-left leading-relaxed text-xs">
                  {log.command !== 'init' && log.command !== 'clear' && (
                    <div className="text-accent-500 font-semibold mb-1">
                      <span>guest@Ctrl+Ankit ~ </span>
                      <span className="text-[var(--text-primary)]">&gt; {log.command}</span>
                    </div>
                  )}
                  <pre className="font-matrix whitespace-pre-wrap text-[var(--text-primary)] text-2xs opacity-85 pl-2">
                    {log.output}
                  </pre>
                </div>
              )
            })}
            <div ref={terminalBottomRef} />
          </div>

          {/* Command execution inputs */}
          <form
            onSubmit={handleFormSubmit}
            className="relative z-10 border-t border-[var(--border-color)] pt-3.5 mt-3 flex items-center gap-2 text-xs"
          >
            <span className="text-accent-500 font-bold shrink-0">guest@Ctrl+Ankit ~ &gt;</span>
            <input
              ref={terminalInputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type command..."
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[var(--text-primary)] font-matrix caret-accent-500 select-all placeholder-slate-400/60 dark:placeholder-slate-600"
            />
          </form>

        </div>

        {/* Quick Launch Shortcuts tag panel */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
          <span className="text-3xs text-[var(--text-secondary)] font-matrix self-center uppercase mr-1">Tap to run:</span>
          {commandList.map((cmd) => (
            <button
              key={cmd}
              onClick={() => evaluateCommand(cmd)}
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--border-hover-color)] text-3xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-matrix shadow-sm"
              data-cursor="RUN"
            >
              {cmd}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
export default TerminalEmulator
