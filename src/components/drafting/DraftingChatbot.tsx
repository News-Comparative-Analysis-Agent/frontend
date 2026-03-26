import React, { RefObject } from 'react'
import Loader from '../ui/Loader'

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  modifiedContent?: string;
}

interface DraftingChatbotProps {
  width: number
  isResizing: boolean
  messages: ChatMessage[]
  inputMessage: string
  setInputMessage: (msg: string) => void
  isChatLoading: boolean
  handleSendMessage: () => void
  applyModifiedContent: (modifiedContent: string) => void
  chatEndRef: RefObject<HTMLDivElement>
  onMouseDown: (e: React.MouseEvent) => void
}

const DraftingChatbot = ({
  width, isResizing, messages, inputMessage, setInputMessage,
  isChatLoading, handleSendMessage, applyModifiedContent, chatEndRef, onMouseDown
}: DraftingChatbotProps) => {
  return (
    <>
      <div 
        id="sidebar-resize-handle"
        className={`w-1 cursor-col-resize border-l border-slate-200 hover:bg-primary z-40 relative ${isResizing ? 'bg-primary' : ''}`}
        onMouseDown={onMouseDown}
      />

      <aside 
        id="chatbot-sidebar"
        className={`border-l border-slate-200 flex flex-col bg-white shrink-0 ${isResizing ? '' : 'transition-[width] duration-300'}`}
        style={{ width: `${width}px` }}
      >
        <div className="flex-1 flex flex-col overflow-hidden text-left">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-primary text-lg">forum</span>
              Smart AI Assistant
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                  </div>
                )}
                <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-3 rounded-xl leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-orange-50 border border-orange-100 text-slate-800 rounded-tr-none' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.modifiedContent && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[16px]">edit_note</span>
                        <span className="text-[11px] font-bold">AI의 수정 제안이 있습니다</span>
                      </div>
                      <button 
                        onClick={() => applyModifiedContent(msg.modifiedContent!)}
                        className="w-full py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        본문에 반영하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
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
                className="w-full bg-slate-50 border-slate-200 rounded-xl py-2 px-3 pr-10 text-[13px] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-50" 
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
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DraftingChatbot
