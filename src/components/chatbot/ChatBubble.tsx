import React from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from './Chatbot'

type ChatBubbleProps = {
  message: ChatMessage
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          {isUser ? <User size={14} /> : <Bot size={14} />}
          <span>{isUser ? 'You' : 'Assistant'}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>
        <div
          className={`rounded-[28px] border px-4 py-3 text-sm leading-6 ${
            isUser
              ? 'rounded-br-[8px] rounded-tl-[28px] rounded-tr-[28px] rounded-bl-[28px] bg-slate-800 border-slate-700 text-slate-100'
              : 'rounded-br-[28px] rounded-tl-[8px] rounded-tr-[28px] rounded-bl-[28px] bg-slate-900/95 border-slate-700 text-slate-100'
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
