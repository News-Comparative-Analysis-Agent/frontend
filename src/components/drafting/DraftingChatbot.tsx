import React, { RefObject, useEffect } from 'react'
import Loader from '../ui/Loader'
import { getDiffWithContext } from '../../utils/diffUtils'

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  modifiedContent?: string;
  originalContent?: string; // 💡 제안 당시의 원본 본문 (대조용)
  isApplied?: boolean;
  isCancelled?: boolean; // 💡 제안 취소 여부 추가
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
  onApplySuggestion: (index: number) => void
  onCancelSuggestion: (index: number) => void // 💡 프리뷰 취소 및 원복용
  onUndoSuggestion: (index: number) => void
  chatEndRef: RefObject<HTMLDivElement>
  onMouseDown: (e: React.MouseEvent) => void
}

const DraftingChatbot = ({
  isOpen, setIsOpen, width, isResizing, messages, inputMessage, setInputMessage,
  isChatLoading, handleSendMessage, onApplySuggestion, onCancelSuggestion, onUndoSuggestion, chatEndRef, onMouseDown
}: DraftingChatbotProps) => {
  // 💡 상세 대조 뷰(History) 열림 상태 관리
  const [expandedIndices, setExpandedIndices] = React.useState<number[]>([]);

  const toggleHistory = (idx: number) => {
    setExpandedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

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
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
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

                {/* 💡 AI 수정 제안 카드 (사용자 원본 흐름 적용) */}
                {msg.role === 'ai' && msg.modifiedContent && (
                  <div className="flex gap-2 ml-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="w-6 shrink-0" />
                    <div className="flex flex-col gap-2.5 max-w-[90%] font-medium">
                      <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[12px] font-black flex items-center gap-2 text-primary uppercase tracking-tight">
                               <span className="material-symbols-outlined text-[18px]">edit_note</span>
                               AI 수정 제안
                             </p>
                             {msg.isApplied && (
                               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                 <span className="material-symbols-outlined text-[12px]">check</span>
                                 반영됨
                               </span>
                             )}
                          </div>
                          <p className="text-[13px] leading-relaxed text-slate-600 font-bold whitespace-pre-wrap">
                            {msg.isApplied ? '본문에 수정 내용이 반영되었습니다.' : '기사 본문을 더 매끄럽게 다듬어 보았습니다.'}
                          </p>
                        </div>

                        {/* 💡 2단계: 실시간 본문 비교(Diff) 영역 (디버깅 로그 추가) */}
                        {msg.isApplied && expandedIndices.includes(idx) && (
                          <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-white/60 rounded-xl p-4 border border-amber-200/50 shadow-inner">
                            <p className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5 w-fit">Detailed Comparison</p>
                            
                            <div className="text-[13.5px] leading-[1.9] text-slate-600 font-medium whitespace-pre-wrap">
                              {(() => {
                                // 💡 [디버깅] 대조 데이터 상태 체크
                                console.log('[DIFF_CHECK] Original:', msg.originalContent ? 'OK' : 'EMPTY');
                                console.log('[DIFF_CHECK] Modified:', msg.modifiedContent ? 'OK' : 'EMPTY');

                                if (!msg.originalContent || !msg.modifiedContent) {
                                  return <div className="text-slate-400 italic py-2 text-center">대조할 데이터가 없습니다. 새로운 요청을 보내주세요!</div>;
                                }
                                
                                const diffParts = getDiffWithContext(msg.originalContent, msg.modifiedContent);
                                
                                // 변경된 내용이 없을 경우의 처리
                                if (diffParts.length === 1 && diffParts[0].value.includes('내용이 없습니다')) {
                                  return (
                                    <div className="flex flex-col items-center justify-center py-6 text-emerald-600 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                      <span className="material-symbols-outlined text-[32px] mb-1">verified</span>
                                      <p className="text-[12px] font-bold">현재 본문과 수정 제안이 100% 일치합니다.</p>
                                    </div>
                                  );
                                }

                                return diffParts.map((part, pIdx) => {
                                  if (part.type === 'added') {
                                    return (
                                      <span key={pIdx} className="bg-emerald-100 text-slate-900 px-1 rounded mx-0.5 shadow-sm">
                                        {part.value}
                                      </span>
                                    )
                                  }
                                  if (part.type === 'removed') {
                                    return (
                                      <span key={pIdx} className="bg-rose-100 text-slate-900 px-1 rounded mx-0.5 opacity-90 shadow-sm">
                                        {part.value}
                                      </span>
                                    )
                                  }
                                  if (part.value === ' ... ') {
                                    return <span key={pIdx} className="text-slate-300 font-black px-1 mx-1">...</span>;
                                  }
                                  return <span key={pIdx}>{part.value}</span>
                                });
                              })()}
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-amber-100/50">
                              <p className="text-[11px] text-slate-400 italic leading-none flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">info</span>
                                변경된 지점 주변의 문맥만 추출하여 보여줍니다.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          {/* 상황 1: 이미 적용된 경우 */}
                          {msg.isApplied ? (
                            /* 상황 1: 적용 완료된 경우 */
                            <button 
                              onClick={() => toggleHistory(idx)}
                              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold transition-all shadow-sm ${
                                expandedIndices.includes(idx)
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${expandedIndices.includes(idx) ? 'rotate-180' : ''}`}>
                                {expandedIndices.includes(idx) ? 'expand_less' : 'history'}
                              </span>
                              {expandedIndices.includes(idx) ? '수정 내역 접기' : '수정 내역 다시보기'}
                            </button>
                          ) : msg.isCancelled ? (
                            /* 상황 1.5: 제안을 취소한 경우 (요청에 따라 다시 적용 버튼 제거) 💡 */
                            <button 
                              disabled
                              className="w-full py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[11px] font-bold cursor-default flex items-center justify-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                              제안이 취소되었습니다
                            </button>
                          ) : (
                            /* 상황 2: 아직 어떠한 선택도 하지 않은 경우 */
                            <>
                              <button 
                                onClick={() => onCancelSuggestion(idx)}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-all shadow-sm"
                              >
                                취소
                              </button>
                              <button 
                                onClick={() => onApplySuggestion(idx)}
                                className="flex-[2] py-3 bg-primary text-white rounded-xl text-[12px] font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[18px]">input</span>
                                적용하기
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

          <div className="p-3 border-t border-slate-100 bg-white">
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
