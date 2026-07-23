import React, { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

type ChatInputProps = {
  onSend: (text: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend(value)
      setValue('')
      return
    }

    if (event.key === 'Enter' && event.shiftKey) {
      return
    }
  }

  return (
    <div className="mt-4 flex items-end gap-3 rounded-[24px] border border-white/10 bg-slate-950/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="Type your question… Press Enter to send, Shift+Enter for a new line"
        className="min-h-[52px] w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-0"
      />
      <button
        type="button"
        onClick={() => {
          onSend(value)
          setValue('')
        }}
        disabled={disabled}
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition hover:shadow-[0_16px_40px_rgba(168,85,247,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  )
}
