import React, { RefObject } from 'react'

interface DraftingEditorAreaProps {
  title: string
  setTitle: (title: string) => void
  content: string
  editorRef: RefObject<HTMLDivElement>
  handleEditorInput: () => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  dropIndicator: { index: number; rect: DOMRect | null }
  handleDragStart: (e: React.DragEvent, url: string, media: string) => void
}

const DraftingEditorArea = ({
  title, setTitle, content, editorRef, handleEditorInput,
  handleDragOver, handleDragLeave, handleDrop, dropIndicator, handleDragStart
}: DraftingEditorAreaProps) => {
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
          <div className="flex items-center justify-between mb-4">
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
          className="space-y-6 text-[16px] leading-[1.8] text-slate-700 focus:outline-none" 
          contentEditable="true"
          onInput={handleEditorInput}
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
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 1, media: '연합뉴스', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY33rzUtzizNkambfkpf7PrbmaCPi3Vs2XhrFST7J9j0Auo6ROoJdI99n39p8kX3QyEEUtTFw75VImv0O4NvrIXq7CP2ZKyO8NbkqCkZWvxbEuti95lCCVBtBSHUVRbhJUC4-VdAA96qxNc_KRHTo_MGtnkhEZxjymY8608LA8RGNGJcovh3J3VhAUB4vyUA2L3SC7YvAK7EHrW114yDftkTUpbD47aXsHvTyjTFWeLDGYtAqFdkUtvQPbmkio8Z-MJGKA70SaKR0' },
              { id: 2, media: '중앙일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTH5_zsN3VhlYXQHLzSA4rz7aZsg6BXywdnp0NYxbkOQW4PfhG40NpXDK_1E6ntCfOKi4r1xLsVm4LUxsqmKonCtXh4rDGb7KimC_I6NTWdLcs6UsQWcjSOHTnltFP2d-k9gf8Evx70u0OHENUSXbBX1IUZpYQWIf8OF-E8Wod_Fm0MRpIc3UwhtkQVncU9vsD-crZolcZLknAz2J5iQfPf6G3_12I-SP2_NjCaE-OxIwSJabTA0G70XPIBAp7IfYEGw1RSetfVCo' },
              { id: 3, media: '조선일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAC0PIARJCfi-y5DtCzhSV5jKG_I---yFnHfW5SVJkciM1xPymzoAyCbzw0RJ7aloMzdE4LYl5onPqs_MDKhj5AJTb05YP4T9H88YU01Z4kwwSRPjNRVdwCbRRokdmiT7hFF2x-Si9uEpkfIKAviXLJ6vGD4YZYbxPLKEvEszOq7FyZUPmLmmzoMyCcEn_CGlXP3XVrOPd9ooVbspDGvCNpHo_f5Jti3UzFgkC-iPY0oJUtEOQJn3TWlqN8of-rnmPrIAatz5lqWs' },
              { id: 4, media: '동아일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtS6C_-dLN1_nRN01H5ykacQWw1aodmT40-cBvVmRYo-qePP6GDRoqk0n8DtVAytgpnrEj_smAjDoLHOlu3bAgKBwu3mxNRzzjuEXSIkL7jv-NZGJNwqEG2D5WClXcR--GctBEgjWyH2sGST9IbaogAkiVxJ5fvETk3IzEu6GLS7Y_b8maxHTv-_7zFMA50dX-cRq485TWPGoMJ1nze-Hchrr39fMeE1mhTXm1BaBldHVQ8EqIv5dAhE7YAr5XOQbwVe6HVwL18Xc' }
            ].map(item => (
              <div 
                key={item.id} 
                className="group relative flex flex-col gap-2 cursor-grab active:cursor-grabbing"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.url, item.media)}
              >
                <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm group-hover:shadow-md transition-all">
                  <img alt={item.media} className="w-full h-full object-cover" src={item.url} />
                </div>
                <span className="text-[10px] font-medium text-slate-500 text-center">{item.media}</span>
              </div>
            ))}
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
