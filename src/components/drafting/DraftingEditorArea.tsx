import React, { RefObject } from 'react'
import { DraftImage } from '../../types/analysis'

interface DraftingEditorAreaProps {
  title: string
  setTitle: (title: string) => void
  content: string
  editorRef: React.RefObject<HTMLDivElement>
  handleEditorInput: () => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  dropIndicator: { index: number; rect: DOMRect | null }
  handleDragStart: (e: React.DragEvent, url: string, media: string) => void
  draftImages: DraftImage[]
}

const DraftingEditorArea = ({
  title, setTitle, content, editorRef, handleEditorInput,
  handleDragOver, handleDragLeave, handleDrop, dropIndicator, handleDragStart,
  draftImages
}: DraftingEditorAreaProps) => {

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const deleteBtn = target.closest('.editor-delete-btn');
    if (deleteBtn) {
      const wrapper = deleteBtn.closest('.relative.group');
      if (wrapper) {
        wrapper.remove();
        handleEditorInput();
      }
    }
  };

  return (
    <section 
      className="flex-1 overflow-y-auto custom-scrollbar bg-white relative min-h-0 text-left"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl mx-auto py-12 px-8 relative">
        {dropIndicator.index !== -1 && dropIndicator.rect && (
          <div 
            className="absolute left-8 right-8 h-1 bg-primary rounded-full z-50 pointer-events-none shadow-[0_0_10px_rgba(242,127,13,0.5)] transition-all duration-75"
            style={{ 
              top: dropIndicator.index === 0 
                ? `${dropIndicator.rect.top - 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px` 
                : dropIndicator.index < Array.from(editorRef.current?.children || []).length
                  ? `${Array.from(editorRef.current?.children || [])[dropIndicator.index].getBoundingClientRect().top - 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px`
                  : `${Array.from(editorRef.current?.children || [])[dropIndicator.index-1].getBoundingClientRect().bottom + 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px`
            }}
          />
        )}

        <div className="group relative mb-10 w-full">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Title</span>
          </div>
          <textarea 
            className="w-full bg-transparent border-none text-[28px] font-bold focus:ring-0 resize-none p-0 placeholder-slate-200 leading-snug overflow-hidden" 
            placeholder="제목을 입력하세요..." 
            rows={2}
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div 
          ref={editorRef}
          className="space-y-6 text-[16px] leading-[1.8] text-slate-700 focus:outline-none drafting-editor" 
          contentEditable="true"
          onInput={handleEditorInput}
          onClick={handleEditorClick}
        >
          {!content && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <span className="material-symbols-outlined text-[48px] mb-4 animate-pulse">article</span>
              <p className="text-sm font-medium">초안 데이터를 불러오고 있습니다...</p>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100" contentEditable="false">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <span className="material-symbols-outlined text-primary text-lg">perm_media</span>
                관련 뉴스 미디어
              </h3>
            </div>
            <div className="bg-orange-50/50 border border-dashed border-orange-200 rounded-lg p-2.5 mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">drag_pan</span>
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
        
        <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60 font-medium">
          <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
          <p className="text-xs text-slate-500 leading-relaxed text-left">
            <span className="font-bold text-slate-700">AI 생성 고지:</span> 본 기사는 생성형 AI 기술을 활용하여 작성된 초안을 바탕으로 기자의 최종 편집 및 검수를 거쳤습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DraftingEditorArea
