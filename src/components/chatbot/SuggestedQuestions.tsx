import React from 'react'

type SuggestedQuestionsProps = {
  questions: string[]
  onSelect: (question: string) => void
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onSelect }) => {
  return (
    <div className="grid gap-2 text-xs text-slate-300">
      <p className="font-medium text-slate-400">Suggested questions</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-left text-slate-200 transition hover:border-accent-500/40 hover:bg-slate-900/95 hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
