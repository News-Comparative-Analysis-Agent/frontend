import { Node, mergeAttributes } from '@tiptap/core'

/**
 * 인용 마커([1], [2]) 를 위한 Tiptap 커스텀 노드
 * - atom: true → 커서가 내부에 진입 불가, 단일 단위로 취급
 */
export const CitationMarker = Node.create({
  name: 'citationMarker',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      'data-id': { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span.citation-marker[data-id]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const id = HTMLAttributes['data-id']
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'citation-marker',
        contenteditable: 'false',
      }),
      `[${id}]`,
    ]
  },
})
