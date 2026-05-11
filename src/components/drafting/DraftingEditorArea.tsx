import React, { RefObject, useState, useEffect, useRef } from 'react'
import { DraftImage, CitationItem } from '../../types/analysis'
import { useDraftStore } from '../../stores/useDraftStore'
import { fetchArticleBody } from '../../api/issues'

interface DraftingEditorAreaProps {
  title: string
  setTitle: (title: string) => void
  content: string
  editorRef: React.RefObject<HTMLDivElement>
  handleEditorInput: () => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  dropIndicator: { index: number; rect: DOMRect | null; position: 'top' | 'bottom'; range?: Range | null }
  handleDragStart: (e: React.DragEvent, url: string, media: string) => void
  draftImages: DraftImage[]
  isCrossCheckMode: boolean
}

const DraftingEditorArea = ({
  title, setTitle, content, editorRef, handleEditorInput,
  handleDragOver, handleDragLeave, handleDrop, dropIndicator, handleDragStart,
  draftImages, isCrossCheckMode
}: DraftingEditorAreaProps) => {
  const { isPreviewMode, citations } = useDraftStore()
  
  // 💡 선택된 인용구 상태 (팝오버 표시용)
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  // 💡 기사 원문 lazy-load 상태
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveCitation(null);
        setArticleContent(null);
      }
    };
    if (activeCitation) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeCitation]);

  // 💡 인용 마커 수정 방지 로직 (MutationObserver를 이용한 실시간 강제 부여)
  useEffect(() => {
    if (!editorRef.current) return;

    const enforceNonEditable = () => {
      const markers = editorRef.current?.querySelectorAll('.citation-marker');
      markers?.forEach(marker => {
        // 💡 오염된 내용 자가 치유 로직 (숫자 이외의 문자 제거)
        const currentText = marker.textContent || "";
        // 숫자가 포함되어 있고, 형식이 [숫자]가 아니거나 이상한 문자가 섞인 경우
        if (currentText && /[^0-9[\]]/.test(currentText)) {
          const numbers = currentText.replace(/[^0-9]/g, "");
          if (numbers) {
            marker.textContent = `[${numbers}]`;
            // 수정 후 에디터 입력 이벤트 발생시켜 저장 유도
            setTimeout(() => handleEditorInput(), 0);
          }
        }

        if (marker.getAttribute('contenteditable') !== 'false') {
          marker.setAttribute('contenteditable', 'false');
        }
      });
    };

    // 초기 마커 처리
    enforceNonEditable();

    // 실시간 감시 (사용자가 입력하는 중에도 강제 적용)
    const observer = new MutationObserver((mutations) => {
      enforceNonEditable();
    });

    observer.observe(editorRef.current, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });

    return () => observer.disconnect();
  }, []); // 컴포넌트 마운트 시 한 번만 등록

  const handleEditorClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    const target = e.target as HTMLElement;

    // 💡 1. 인용 마커 클릭 감지
    const marker = target.closest('.citation-marker');
    if (marker) {
      const id = marker.getAttribute('data-id');
      const citation = citations.find(c => c.id.toString() === id);
      if (citation) {
        // 에디터 컨테이너 기준 상대 좌표 계산
        const editorWrapper = editorRef.current?.parentElement;
        if (editorWrapper) {
          const wrapperRect = editorWrapper.getBoundingClientRect();
          const leftPos = Math.min(e.clientX - wrapperRect.left, wrapperRect.width - 410);
          const topPos = e.clientY - wrapperRect.top + 15;
          setPopoverPos({ top: topPos, left: Math.max(10, leftPos) });
          setActiveCitation(citation);
          setArticleContent(null); // 이전 내용 초기화

          // 💡 article_id가 있으면 기사 원문 lazy-load
          if (citation.article_id) {
            setIsLoadingArticle(true);
            fetchArticleBody(citation.article_id)
              .then(res => setArticleContent(res.raw_content))
              .catch(() => setArticleContent(null))
              .finally(() => setIsLoadingArticle(false));
          }
          return;
        }
      }
    }

    // 2. 삭제 버튼 클릭 감지
    const deleteBtn = target.closest('.editor-delete-btn');
    if (deleteBtn) {
      const wrapper = deleteBtn.closest('.relative.group');
      if (wrapper) {
        wrapper.remove();
        handleEditorInput();
      }
    }
  };

  // 유도선 좌표 계산 보정
  const getIndicatorTop = () => {
    if (!dropIndicator.rect || !editorRef.current) return '0px';
    const container = editorRef.current.parentElement?.parentElement; // max-w-3xl div
    if (!container) return '0px';
    
    const containerRect = container.getBoundingClientRect();
    const targetY = dropIndicator.position === 'top' ? dropIndicator.rect.top : dropIndicator.rect.bottom;
    
    // 💡 뷰포트 상대 좌표 차이를 이용해 컨테이너 내부의 정확한 absolute top 계산
    return `${targetY - containerRect.top}px`;
  };

  return (
    <section 
      className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white relative min-h-0 text-left transition-all duration-500"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl px-4 sm:px-8 mx-auto py-12 relative">
        {(dropIndicator.index !== -1 || dropIndicator.range) && dropIndicator.rect && (
          <div 
            className="absolute left-8 right-8 h-1 bg-primary rounded-full z-50 pointer-events-none shadow-[0_0_10px_rgba(242,127,13,0.5)] transition-all duration-75"
            style={{ top: getIndicatorTop() }}
          />
        )}

        <div className={`group relative mb-10 w-full transition-opacity duration-300 ${isPreviewMode ? 'opacity-80' : ''}`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-default">Article Title</span>
          </div>
          <textarea 
            className="w-full bg-transparent border-none text-[28px] font-bold focus:ring-0 resize-none p-0 placeholder-slate-200 leading-snug overflow-hidden" 
            placeholder="제목을 입력하세요..." 
            rows={2}
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="relative">
          <div 
            ref={editorRef}
            className={`space-y-6 text-[16px] leading-[1.9] text-slate-700 focus:outline-none drafting-editor min-h-[400px] relative`} 
            contentEditable="true"
            onInput={handleEditorInput}
            onClick={handleEditorClick}
            suppressContentEditableWarning={true}
          />

          {/* 💡 인용 출처 팝오버 */}
          {activeCitation && (
            <div 
              ref={popoverRef}
              className="absolute z-[100] w-[420px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden"
              style={{ top: popoverPos.top, left: popoverPos.left }}
            >
              {/* 헤더 */}
              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Evidence</span>
                  <span className="text-[13px] font-bold text-slate-800">{activeCitation.press}</span>
                </div>
                <button onClick={() => { setActiveCitation(null); setArticleContent(null); }}
                  className="size-7 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">close</span>
                </button>
              </div>

              {/* 본문 */}
              <div className="p-5">
                <h4 className="text-[14px] font-bold text-slate-900 mb-3 leading-tight line-clamp-2">{activeCitation.title}</h4>
                <div className="bg-slate-50 rounded-xl p-4 text-[13px] leading-[1.7] text-slate-600 max-h-[350px] overflow-y-auto custom-scrollbar border border-slate-100">
                  {isLoadingArticle ? (
                    // 로딩 중
                    <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                      <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className="text-[12px]">기사 원문 불러오는 중...</span>
                    </div>
                  ) : (() => {
                    const displayText = articleContent || "";
                    if (!displayText) return <p className="text-slate-400 italic text-center py-4">표시할 기사 내용이 없습니다.</p>;

                    // 💡 하이라이팅 대상 문장 결정: 본문 인용구(quote)만 정교하게 사용
                    const fullQuote = (activeCitation.quote || "").trim();
                    if (!fullQuote) return <span>{displayText}</span>;
 
                    // 💡 마침표(.)를 기준으로 쪼개서 각 문장을 하이라이팅 대상으로 등록
                    const sentences = fullQuote.split('.').map(s => s.trim()).filter(s => s.length > 5);
                    if (sentences.length === 0) return <span>{displayText}</span>;
 
                    const quoteSentences = Array.from(new Set(sentences));
                    if (quoteSentences.length === 0) return <span>{displayText}</span>;

                    // 모든 문장을 하이라이트하기 위해 누적 처리
                    let segments: (string | JSX.Element)[] = [displayText];

                    quoteSentences.forEach(sentence => {
                      const newSegments: (string | JSX.Element)[] = [];
                      const escaped = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
                      const regex = new RegExp(`(${escaped})`, 'g');

                      segments.forEach(seg => {
                        if (typeof seg !== 'string') {
                          newSegments.push(seg);
                          return;
                        }

                        const parts = seg.split(regex);
                        parts.forEach((part, i) => {
                          if (i % 2 === 1) { // 매칭된 부분
                            newSegments.push(
                              <mark key={`${sentence}-${i}`} className="bg-yellow-200 text-yellow-950 font-bold px-1 py-0.5 rounded-sm shadow-sm ring-1 ring-yellow-300">
                                {part}
                              </mark>
                            );
                          } else if (part) {
                            newSegments.push(part);
                          }
                        });
                      });
                      segments = newSegments;
                    });

                    return <>{segments}</>;
                  })()}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">{activeCitation.published_at}</span>
                  <a href={activeCitation.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline">
                    원문 기사 보기
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100" contentEditable="false">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[14.5px] tracking-tight flex items-center gap-2.5 text-slate-800">
                <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined icon-md">perm_media</span>
                </div>
                관련 뉴스 미디어
              </h3>
            </div>
            <div className="bg-orange-50/50 border border-dashed border-orange-200 rounded-lg p-2.5 mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary icon-md">drag_pan</span>
              <p className="text-[11px] font-bold text-primary">이미지를 본문에 드래그하여 삽입하세요</p>
            </div>
          </div>
            <div className="flex flex-nowrap gap-4 overflow-x-auto custom-scrollbar-h pb-4 -mx-1 px-1">
            {draftImages.map((item, idx) => (
              <div 
                key={`${item.url}-${idx}`} 
                className="group relative flex flex-col gap-2 cursor-grab active:cursor-grabbing flex-shrink-0 w-44"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.url, item.publisher)}
              >
                <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm group-hover:shadow-md transition-all">
                  <img alt={item.publisher} className="w-full h-full object-cover" src={item.url} />
                </div>
                <span className="text-[10px] font-medium text-slate-500 text-center truncate px-1" title={item.title}>
                  {item.publisher}
                </span>
              </div>
            ))}
            {draftImages.length === 0 && (
              <div className="w-full py-8 text-center text-slate-300 text-xs font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                표시할 관련 미디어가 없습니다.
              </div>
            )}
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default DraftingEditorArea
