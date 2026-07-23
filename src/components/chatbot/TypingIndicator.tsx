import React from 'react'

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 rounded-[28px] bg-slate-900/95 px-4 py-3 text-sm text-slate-300 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <span className="inline-flex h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(168,85,247,0.45)] animate-pulse" />
      <span>Assistant is typing...</span>
    </div>
  )
}
