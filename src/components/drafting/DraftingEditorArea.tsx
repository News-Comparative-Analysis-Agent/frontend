import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Editor } from '@tiptap/core'
import { CitationMarker } from './tiptap/CitationMarker'
import { MediaHighlight } from './tiptap/MediaHighlight'
import { EditorImageNode } from './tiptap/EditorImageNode'
import { DraftImage, CitationItem } from '../../types/analysis'
import { useDraftStore } from '../../stores/useDraftStore'
import { fetchArticleBody } from '../../api/issues'

interface DraftingEditorAreaProps {
  title: string
  setTitle: (title: string) => void
  content: string
  onContentChange: (html: string) => void
  onEditorReady: (editor: Editor) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  dropIndicator: { index: number; rect: DOMRect | null; position: 'top' | 'bottom' }
  handleDragStart: (e: React.DragEvent, url: string, media: string) => void
  draftImages: DraftImage[]
  isCrossCheckMode: boolean
  windowWidth: number
}

// 기사 원문(fullText) 내에서 인용구(quote) 또는 에비던스(evidence)를 찾아 형광펜 하이라이팅을 입혀주는 고도화 헬퍼 함수
const highlightMatchedText = (fullText: string, quote?: string, evidence?: string) => {
  if (!fullText) return null;
  
  // 매칭 후보군 정제 (인용구 우선, 차선으로 에비던스 본문 사용)
  const targets = [quote, evidence]
    .map(t => t?.trim())
    .filter((t): t is string => !!t && t.length > 3);
  
  if (targets.length === 0) return <span>{fullText}</span>;

  let matchTarget = '';
  let matchIndex = -1;

  for (const target of targets) {
    // 1. 대소문자 무관 단순 Substring 매칭 시도
    const idx = fullText.toLowerCase().indexOf(target.toLowerCase());
    if (idx !== -1) {
      matchTarget = fullText.substring(idx, idx + target.length);
      matchIndex = idx;
      break;
    }

    // 2. 만약 사소한 문장 부호/공백 차이로 매칭이 실패할 경우, 단어 기반 근사 매칭 시도
    const words = target.split(/\s+/).filter(w => w.length >= 2);
    if (words.length >= 3) {
      const startPhrase = words.slice(0, 3).join(' ');
      const startIdx = fullText.toLowerCase().indexOf(startPhrase.toLowerCase());
      if (startIdx !== -1) {
        const endPhrase = words[words.length - 1];
        const endIdx = fullText.toLowerCase().indexOf(endPhrase.toLowerCase(), startIdx);
        if (endIdx !== -1 && endIdx - startIdx < target.length * 1.5) {
          matchTarget = fullText.substring(startIdx, endIdx + endPhrase.length);
          matchIndex = startIdx;
          break;
        }
      }
    }
  }

  // 매칭된 구절을 찾았다면 해당 구절을 <mark> 태그로 감싸 형광펜 스타일 적용
  if (matchIndex !== -1 && matchTarget) {
    const before = fullText.substring(0, matchIndex);
    const matched = fullText.substring(matchIndex, matchIndex + matchTarget.length);
    const after = fullText.substring(matchIndex + matchTarget.length);

    return (
      <>
        {before}
        <mark className="bg-orange-100 text-orange-950 font-extrabold px-1 py-0.5 rounded-sm inline whitespace-pre-wrap selection:bg-primary/20">
          {matched}
        </mark>
        {after}
      </>
    );
  }

  return <span>{fullText}</span>;
};

const DraftingEditorArea = ({
  title, setTitle, content, onContentChange, onEditorReady,
  handleDragOver, handleDragLeave, handleDrop, dropIndicator, handleDragStart,
  draftImages, isCrossCheckMode, windowWidth,
}: DraftingEditorAreaProps) => {
  const { isPreviewMode, previewContent, citations } = useDraftStore()

  // 인용 출처 팝오버 상태
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)
  const [articleContent, setArticleContent] = useState<string | null>(null)
  const [isLoadingArticle, setIsLoadingArticle] = useState(false)
  const editorWrapperRef = useRef<HTMLDivElement>(null)

  // Tiptap 에디터 생성
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#F27F0D',
          width: 4,
        },
      }),
      Placeholder.configure({ placeholder: '본문을 입력하세요...' }),
      CitationMarker,
      MediaHighlight,
      EditorImageNode,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'drafting-editor tiptap-editor focus:outline-none min-h-[400px] text-[16px] leading-[1.9] text-slate-700',
      },
    },
  })

  // 에디터 준비 시 부모에게 전달
  useEffect(() => {
    if (editor) onEditorReady(editor)
  }, [editor, onEditorReady])

  // 에디터 컨텐츠 및 편집 가능 여부 동기화 (AI 프리뷰 및 외부 변경 대응)
  useEffect(() => {
    if (!editor) return

    if (isPreviewMode && previewContent !== null) {
      if (previewContent !== editor.getHTML()) {
        editor.commands.setContent(previewContent)
      }
      editor.setEditable(false)
    } else {
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content)
      }
      editor.setEditable(true)
    }
  }, [editor, isPreviewMode, previewContent, content])

  // 팝오버 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveCitation(null)
        setArticleContent(null)
      }
    }
    if (activeCitation) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeCitation])

  // 인용 마커 클릭 감지 (이벤트 위임 - ProseMirror 이벤트 전파 차단을 우회하기 위해 캡처링 단계의 네이티브 이벤트 리스너 등록)
  useEffect(() => {
    const handleNativeClick = (e: MouseEvent) => {
      if (isPreviewMode) return
      const target = e.target as HTMLElement
      
      // 클릭한 대상이 에디터 영역 내부인지 검사
      const wrapper = editorWrapperRef.current
      if (!wrapper || !wrapper.contains(target)) return

      const marker = target.closest('.citation-marker')
      if (marker) {
        const id = marker.getAttribute('data-id')
        const citation = citations.find(c => c.id.toString() === id)
        if (citation) {
          const wrapperRect = wrapper.getBoundingClientRect()
          const leftPos = Math.min(e.clientX - wrapperRect.left, wrapperRect.width - 410)
          const topPos = e.clientY - wrapperRect.top + 15
          setPopoverPos({ top: topPos, left: Math.max(10, leftPos) })
          setActiveCitation(citation)
          setArticleContent(null)
          if (citation.article_id) {
            setIsLoadingArticle(true)
            fetchArticleBody(citation.article_id)
              .then(res => setArticleContent(res.raw_content))
              .catch(() => setArticleContent(null))
              .finally(() => setIsLoadingArticle(false))
          }
        }
      }
    }

    document.addEventListener('click', handleNativeClick, true) // capturing phase
    return () => {
      document.removeEventListener('click', handleNativeClick, true)
    }
  }, [citations, isPreviewMode])

  // 드롭 인디케이터 좌표 계산
  const getIndicatorTop = () => {
    if (!dropIndicator.rect || !editorWrapperRef.current) return '0px'
    const containerRect = editorWrapperRef.current.closest('.mx-auto')?.getBoundingClientRect()
      || editorWrapperRef.current.getBoundingClientRect()
    const targetY = dropIndicator.position === 'top' ? dropIndicator.rect.top : dropIndicator.rect.bottom
    return `${targetY - containerRect.top}px`
  }

  return (
    <section
      className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white relative min-h-0 text-left transition-all duration-500"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`${windowWidth < 1100 ? 'max-w-none px-6' : 'max-w-3xl px-4 sm:px-8'} mx-auto py-12 relative transition-all duration-500`}>
        {/* 드롭 인디케이터 */}
        {dropIndicator.index !== -1 && dropIndicator.rect && (
          <div
            className="absolute left-8 right-8 h-1 bg-primary rounded-full z-50 pointer-events-none shadow-[0_0_10px_rgba(242,127,13,0.5)] transition-all duration-75"
            style={{ top: getIndicatorTop() }}
          />
        )}

        {/* 제목 입력 */}
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
            disabled={isPreviewMode}
          />
        </div>

        {/* Tiptap 에디터 */}
        <div className="relative" ref={editorWrapperRef}>
          <EditorContent editor={editor} />

          {/* 인용 출처 팝오버 */}
          {activeCitation && (
            <div
              ref={popoverRef}
              className="absolute z-[100] w-[420px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden"
              style={{ top: popoverPos.top, left: popoverPos.left }}
            >
              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Evidence</span>
                  <span className="text-[13px] font-bold text-slate-800">{activeCitation.press}</span>
                </div>
                <button onClick={() => { setActiveCitation(null); setArticleContent(null) }}
                  className="size-7 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">close</span>
                </button>
              </div>
              <div className="p-5">
                <h4 className="text-[14px] font-bold text-slate-900 mb-3 leading-tight line-clamp-2">{activeCitation.title}</h4>
                <div className="bg-slate-50 rounded-xl p-4 text-[13px] leading-[1.7] text-slate-600 max-h-[350px] overflow-y-auto custom-scrollbar border border-slate-100">
                  {isLoadingArticle ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                      <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className="text-[12px]">기사 원문 불러오는 중...</span>
                    </div>
                  ) : articleContent ? (
                    <div className="whitespace-pre-wrap text-left break-all text-slate-700 selection:bg-primary/20 leading-[1.8] text-[13px]">
                      {highlightMatchedText(
                        articleContent,
                        activeCitation.quote,
                        activeCitation.evidence
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center py-4">표시할 기사 내용이 없습니다.</p>
                  )}
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

        {/* 관련 뉴스 미디어 (이미지 드래그 소스) */}
        <div className="mt-16 pt-8 border-t border-slate-100" contentEditable={false}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[14.5px] tracking-tight flex items-center gap-2.5 text-slate-800">
                <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined icon-md" style={{ fontVariationSettings: "'wght' 300" }}>description</span>
                </div>
                관련 뉴스 미디어
              </h3>
            </div>
            <div className="bg-orange-50/50 border border-dashed border-orange-200 p-2.5 mb-4 flex items-center justify-center gap-2">
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
                <div className="aspect-video overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm group-hover:shadow-md transition-all">
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
