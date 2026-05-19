import React from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'

/**
 * 에디터 내 삽입된 이미지를 렌더링하는 React NodeView 컴포넌트
 * - 삭제 버튼 포함
 * - 사진과 설명 사이의 여백을 최소화하고, 평소에는 평문처럼 보이도록 디자인 개선
 */
const EditorImageView: React.FC<NodeViewProps> = ({ node, deleteNode, updateAttributes }) => {
  const mediaValue = node.attrs.media || ''

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ media: e.target.value })
  }

  return (
    <NodeViewWrapper>
      <div
        className="my-4 flex flex-col gap-1 relative group"
        contentEditable={false}
        data-drag-handle=""
      >
        <div className="relative">
          <img
            src={node.attrs.src}
            alt={mediaValue}
            className="w-full shadow-lg border border-slate-200"
          />
          <button
            className="editor-delete-btn absolute top-3 right-3 size-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10"
            onClick={deleteNode}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        {/* 출처/설명 텍스트 편집 필드 (평소에는 배경/테두리 없이 텍스트에 딱 붙도록 스타일링) */}
        <div className="flex justify-center w-full mt-0.5">
          <input
            type="text"
            className="text-center text-[12.5px] text-slate-400 font-medium bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-slate-200 rounded-md py-0.5 px-2 w-full max-w-xl focus:outline-none focus:ring-0 transition-all duration-150"
            value={mediaValue}
            onChange={handleMediaChange}
            placeholder="사진 출처 또는 설명을 입력하세요..."
            onKeyDown={(e) => {
              e.stopPropagation()
            }}
          />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default EditorImageView
