import React, { RefObject, useEffect } from 'react'
import Loader from '../ui/Loader'
import { useDraftStore } from '../../stores/useDraftStore'

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  modifiedContent?: string;
  isApplied?: boolean;
}

interface DraftingChatbotProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  width: number
  isResizing: boolean
  messages: ChatMessage[]
  inputMessage: string
  setInputMessage: (msg: string) => void
  isChatLoading: boolean
  handleSendMessage: () => void
  chatEndRef: RefObject<HTMLDivElement>
  onMouseDown: (e: React.MouseEvent) => void
}

const DraftingChatbot = ({
  isOpen, setIsOpen, width, isResizing, messages, inputMessage, setInputMessage,
  isChatLoading, handleSendMessage, chatEndRef, onMouseDown
}: DraftingChatbotProps) => {
  return (
    <>
      <div 
        id="sidebar-resize-handle"
        className={`w-1 cursor-col-resize border-l border-slate-200 hover:bg-primary z-40 relative ${isResizing ? 'bg-primary' : ''} ${!isOpen ? 'hidden' : ''}`}
        onMouseDown={onMouseDown}
      />

      <aside 
        id="chatbot-sidebar"
        className={`border-l border-slate-200 flex flex-col bg-white shrink-0 overflow-hidden ${isResizing ? '' : 'transition-all duration-300'} ${!isOpen ? '!w-0 !border-none' : ''}`}
        style={{ width: isOpen ? `${width}px` : '0px' }}
      >
        <div className="flex-1 flex flex-col overflow-hidden text-left">
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <h3 className="font-bold text-[14.5px] tracking-tight flex items-center gap-2.5 text-slate-800">
              <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined icon-md">forum</span>
              </div>
              AI ChatBot
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="사이드바 접기"
            >
              <span className="material-symbols-outlined icon-md">menu_open</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white icon-sm">smart_toy</span>
                  </div>
                )}
        <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
          <div className={`p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
            msg.role === 'user' 
              ? 'bg-orange-50 border border-orange-100 text-slate-800 rounded-tr-none' 
              : 'bg-slate-100 text-slate-700 rounded-tl-none'
          }`}>
            {msg.content}
          </div>
        </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white icon-sm">smart_toy</span>
                </div>
                <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none flex items-center justify-center">
                  <Loader size="sm" className="scale-75" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-slate-100">
            <div className="relative">
              <input 
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-12 text-[14px] outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all shadow-sm placeholder:text-slate-400 disabled:opacity-50" 
                placeholder={isChatLoading ? "AI가 생각 중입니다..." : "AI와 대화하여 기사 작성..."}
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isChatLoading}
              />
              <button 
                className={`absolute right-2 top-1.5 transition-colors ${isChatLoading || !inputMessage.trim() ? 'text-slate-300 pointer-events-none' : 'text-primary hover:text-orange-600'}`}
                onClick={handleSendMessage}
                disabled={isChatLoading || !inputMessage.trim()}
              >
                <span className="material-symbols-outlined icon-md">send</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DraftingChatbot
