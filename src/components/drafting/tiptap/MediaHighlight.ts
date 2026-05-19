import { Mark, mergeAttributes } from '@tiptap/core'

/**
 * hl-xxx 언론사 색상 하이라이트 span을 위한 Tiptap 커스텀 마크
 */
export const MediaHighlight = Mark.create({
  name: 'mediaHighlight',

  addAttributes() {
    return {
      class: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const el = element as HTMLElement
          const cls = el.className
          if (
            cls &&
            (cls.includes('hl-') ||
              cls.includes('wavy-underline') ||
              cls.includes('text-highlight-'))
          ) {
            return { class: cls }
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes)]
  },
})
