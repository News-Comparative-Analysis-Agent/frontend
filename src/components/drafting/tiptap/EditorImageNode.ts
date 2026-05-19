import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import EditorImageView from './EditorImageView'

/**
 * 에디터 내 이미지 블록을 위한 Tiptap 커스텀 노드
 * - src, media(출처 언론사) 속성 보관
 * - ReactNodeViewRenderer 로 EditorImageView 컴포넌트 렌더링
 */
export const EditorImageNode = Node.create({
  name: 'editorImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      media: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-editor-image-id]',
        getAttrs: (element) => {
          const el = element as HTMLElement
          const img = el.querySelector('img')
          const caption = el.querySelector('p')
          return {
            src: img?.src || null,
            media: caption?.textContent?.replace('사진 출처: ', '') || '',
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-editor-image-id': 'tiptap' }),
      ['div', { class: 'relative' }, ['img', { src: node.attrs.src, class: 'w-full shadow-lg border border-slate-200' }]],
      ['p', { class: 'text-center text-[12px] text-slate-400 font-medium' }, `사진 출처: ${node.attrs.media || ''}`]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditorImageView)
  },
})
