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
  // 💡 수정 내역 토글 상태 (디자인 확인용)
  const [isHistoryVisible, setIsHistoryVisible] = React.useState(false);
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

            {/* 💡 AI 수정 제안 카드 (라이트 모드 + 본문 하이라이트 연동) */}
            {/* 💡 AI 수정 제안 카드 (단일 말풍선 내 토글 히스토리 모드) */}
            <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 text-left">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm text-left">
                <span className="material-symbols-outlined text-white icon-sm">smart_toy</span>
              </div>
              <div className="flex flex-col gap-2.5 max-w-[90%] text-left">
                <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-4 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[12px] font-black flex items-center gap-2 text-primary uppercase tracking-tight">
                         <span className="material-symbols-outlined text-[18px]">edit_note</span>
                         AI 수정 제안
                       </p>
                       <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">check</span>
                         반영됨
                       </span>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                      본문 수정이 정상적으로 반영되었습니다.
                    </p>
                  </div>

                  {/* 💡 띄어쓰기/어조 변화까지 포착하는 단어 단위 상세 대조 뷰 */}
                  {isHistoryVisible && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-white/60 rounded-xl p-3.5 border border-amber-200/50 shadow-inner">
                      <p className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest mb-2.5">Detailed Comparison</p>
                      
                      <div className="text-[13px] leading-[1.8] text-slate-600 font-medium whitespace-pre-wrap">
                        현대 저널리즘은 
                        <span className="bg-red-50 text-red-500/70 line-through decoration-red-500/30 mx-1 px-1 rounded">데이터</span>
                        <span className="bg-emerald-50 text-emerald-800 font-black ring-1 ring-emerald-200/50 mx-1 px-1.5 py-0.5 rounded shadow-sm">데이터 기반의</span>
                        분석과 
                        <span className="bg-red-50 text-red-500/70 line-through decoration-red-500/30 mx-1 px-1 rounded">다각도 검증을</span>
                        <span className="bg-emerald-50 text-emerald-800 font-black ring-1 ring-emerald-200/50 mx-1 px-1.5 py-0.5 rounded shadow-sm">다각도 검증 시스템을</span>
                        통해 신뢰성을 확보하는 방향으로 진화하고 있으며
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-amber-100/50">
                        <p className="text-[11px] text-slate-400 italic leading-none flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          조사 및 전문 용어 표현이 더욱 정밀하게 다듬어졌습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                        isHistoryVisible 
                          ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                          : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[15px] transition-transform duration-300 ${isHistoryVisible ? 'rotate-180' : ''}`}>
                        {isHistoryVisible ? 'expand_less' : 'history'}
                      </span>
                      {isHistoryVisible ? '수정 내역 접기' : '수정 내역 다시보기'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
