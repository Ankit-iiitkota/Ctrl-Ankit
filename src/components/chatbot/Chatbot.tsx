import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Minus, Maximize2, Minimize2 } from 'lucide-react'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { SuggestedQuestions } from './SuggestedQuestions'
import { TypingIndicator } from './TypingIndicator'
import { suggestedQuestions } from '../../data/portfolioData'
import { getAssistantResponse } from '../../utils/chatbotEngine'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const createTimestamp = () => new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })

type WindowState = 'closed' | 'minimized' | 'open' | 'maximized'

export const Chatbot: React.FC = () => {
  const [windowState, setWindowState] = useState<WindowState>('closed')
  const isOpen = windowState === 'open' || windowState === 'maximized'
  const isMinimized = windowState === 'minimized'
  const isMaximized = windowState === 'maximized'
  const [showHint] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi, I’m Ankit’s AI portfolio assistant. Ask me anything about Ankit’s skills, projects, experience, achievements, or contact details.',
      timestamp: createTimestamp()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  const handleScrollWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()

    const container = scrollContainerRef.current
    if (!container) {
      event.preventDefault()
      return
    }

    const canScroll = container.scrollHeight > container.clientHeight
    if (!canScroll) {
      event.preventDefault()
      return
    }

    const isAtTop = container.scrollTop === 0 && event.deltaY < 0
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight && event.deltaY > 0

    if (isAtTop || isAtBottom) {
      event.preventDefault()
      return
    }

    container.scrollTop += event.deltaY
    event.preventDefault()
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, scrollToBottom])

  const handleSend = async (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText || isSending) return

    setError(null)
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedText,
      timestamp: createTimestamp()
    }

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: createTimestamp()
    }

    const nextMessages = [...messages, userMessage, assistantMessage]
    setMessages(nextMessages)
    setIsTyping(true)
    setIsSending(true)

    const controller = new AbortController()

    try {
      await getAssistantResponse(
        trimmedText,
        (delta) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: message.content + delta }
                : message
            )
          )
        },
        controller.signal
      )
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Something went wrong while generating the response.'
      )
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, content: 'I experienced a technical issue generating that response.' }
            : message
        )
      )
    } finally {
      setIsTyping(false)
      setIsSending(false)
    }
  }

  const handleSuggestion = (question: string) => {
    window.requestAnimationFrame(() => handleSend(question))
  }

  const openChat = () => setWindowState((current) => (current === 'closed' || current === 'minimized' ? 'open' : current))
  const closeChat = () => setWindowState('closed')
  const minimizeChat = () => setWindowState('minimized')
  const toggleMaximize = () => setWindowState((current) => (current === 'maximized' ? 'open' : 'maximized'))
  const toggleFromButton = () => setWindowState((current) => (current === 'closed' || current === 'minimized' ? 'open' : 'closed'))

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex w-[280px] max-w-[80vw] items-center justify-between gap-3 rounded-full border border-white/10 bg-slate-950/95 px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl cursor-pointer"
            onClick={openChat}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <Sparkles size={14} />
              </div>
              <p className="truncate text-xs font-semibold text-slate-100">Ankit Portfolio Assistant</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeChat()
              }}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isMaximized ? '50vw' : 350,
              height: isMaximized ? '65vh' : 420
            }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[92vw] min-w-[320px] flex-col rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/90 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_14px_40px_rgba(168,85,247,0.25)]">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">Ankit Portfolio Assistant</p>
                  <p className="truncate text-[11px] text-slate-500">Ask anything about Ankit’s work and skills.</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={minimizeChat}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10"
                  aria-label="Minimize chat"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={toggleMaximize}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10"
                  aria-label={isMaximized ? 'Restore chat' : 'Maximize chat'}
                >
                  {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={closeChat}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-[#0b1122]/95">
              <div className="flex h-full flex-col px-4 py-4">
                <div
                  ref={scrollContainerRef}
                  onWheel={handleScrollWheel}
                  className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                  style={{ overscrollBehavior: 'contain' }}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatBubble key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
                  <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSuggestion} />
                  <ChatInput onSend={handleSend} disabled={isSending} />
                  {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {windowState === 'closed' && (
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showHint && (
              <motion.button
                onClick={toggleFromButton}
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [0, -4, 0] }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.25, ease: 'easeOut' },
                  x: { duration: 0.25, ease: 'easeOut' },
                  scale: { duration: 0.25, ease: 'easeOut' },
                  y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                }}
                whileHover={{ scale: 1.04 }}
                className="group relative flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500/15 via-fuchsia-500/15 to-indigo-500/15 px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-[0_15px_45px_rgba(168,85,247,0.25)] backdrop-blur-xl ring-1 ring-inset ring-white/15 transition-colors hover:ring-white/25"
              >
                {/* Soft glow behind the pill */}
                <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-md" />

                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
                </span>

                <Sparkles size={13} className="shrink-0 text-fuchsia-300" />

                <span className="bg-gradient-to-r from-white via-fuchsia-100 to-white bg-clip-text text-transparent">
                  Ask Ankit Assistant
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={toggleFromButton}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-[0_20px_60px_rgba(168,85,247,0.35)] transition focus:outline-none focus:ring-2 focus:ring-violet-400"
            aria-label="Ask Ankit"
            title="Ask Ankit"
          >
            <Sparkles size={22} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
