import { useState, useCallback, RefObject } from 'react'
import { Editor } from '@tiptap/core'

interface DropIndicatorState {
  index: number
  rect: DOMRect | null
  position: 'top' | 'bottom'
}

const INITIAL_DROP_INDICATOR: DropIndicatorState = { index: -1, rect: null, position: 'top' }

/**
 * Tiptap 에디터의 이미지 드래그 앤 드롭을 관리하는 훅입니다.
 * - editorRef: Tiptap Editor 인스턴스
 * - 이미지 삽입: editor.chain().insertContent() 사용
 * - DOM 접근: editor.view.dom 으로 Tiptap 내부 ProseMirror DOM 참조
 */
export const useEditorDragDrop = (
  editorRef: RefObject<Editor | null>,
  onEditorInput: (html: string) => void
) => {
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState>(INITIAL_DROP_INDICATOR)

  const handleDragStart = useCallback((_e: React.DragEvent, url: string, media: string) => {
    _e.dataTransfer.setData('text/plain', url)
    _e.dataTransfer.setData('source', media)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const url = e.dataTransfer.getData('text/plain')
    const media = e.dataTransfer.getData('source')

    // 이미지 드래그가 아니면 무시
    if (!media || !url) {
      setDropIndicator(INITIAL_DROP_INDICATOR)
      return
    }

    const { index } = dropIndicator
    setDropIndicator(INITIAL_DROP_INDICATOR)

    const editor = editorRef.current
    if (!editor) return

    // 💡 Tiptap 문서 구조의 block index를 기준으로 삽입 위치(pos)를 계산합니다.
    const doc = editor.state.doc
    let insertPos = doc.content.size
    let currentBlock = 0

    doc.forEach((node, pos) => {
      if (currentBlock === index) {
        insertPos = pos
      }
      currentBlock++
    })

    // 계산된 블록 경계선 위치에 정확하게 이미지 노드를 주입
    editor.chain().focus().insertContentAt(insertPos, {
      type: 'editorImage',
      attrs: { src: url, media },
    }).run()

    onEditorInput(editor.getHTML())
  }, [editorRef, onEditorInput, dropIndicator])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const editor = editorRef.current
    if (!editor) return

    // 💡 1. 자동 스크롤(Auto-scroll) 처리: 모든 드래그 동작(외부 및 내부 이동)에 대해 우선 수행
    const editorDom = editor.view.dom as HTMLElement
    const scrollContainer = editorDom.closest('section')
    if (scrollContainer) {
      const rect = scrollContainer.getBoundingClientRect()
      const threshold = 120
      const maxSpeed = 25
      if (e.clientY < rect.top + threshold) {
        const intensity = (rect.top + threshold - e.clientY) / threshold
        scrollContainer.scrollTop -= Math.ceil(maxSpeed * intensity)
      } else if (e.clientY > rect.bottom - threshold) {
        const intensity = (e.clientY - (rect.bottom - threshold)) / threshold
        scrollContainer.scrollTop += Math.ceil(maxSpeed * intensity)
      }
    }

    // 이미지 드래그가 아니면 가이드라인 인디케이터 표시 안 함
    const types = e.dataTransfer.types
    const isImageDrag = types.includes('source')
    if (!isImageDrag) return

    // 문단 사이 드롭 위치 계산 (가이드라인 렌더링용)
    const children = Array.from(editorDom.children)
    const mouseY = e.clientY

    let closestIndex = children.length
    let closestRect: DOMRect | null = null
    let position: 'top' | 'bottom' = 'bottom'
    let minDistance = Infinity

    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect()
      const midY = (rect.top + rect.bottom) / 2
      const distance = Math.abs(mouseY - midY)

      if (distance < minDistance) {
        minDistance = distance
        closestRect = rect
        if (mouseY < midY) {
          closestIndex = index
          position = 'top'
        } else {
          closestIndex = index + 1
          position = 'bottom'
        }
      }
    })

    setDropIndicator({ index: closestIndex, rect: closestRect, position })
  }, [editorRef])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const editorDom = editorRef.current?.view.dom as HTMLElement | undefined
    const rect = editorDom?.getBoundingClientRect()
    if (rect) {
      if (
        e.clientX <= rect.left ||
        e.clientX >= rect.right ||
        e.clientY <= rect.top ||
        e.clientY >= rect.bottom
      ) {
        setDropIndicator(INITIAL_DROP_INDICATOR)
      }
    }
  }, [editorRef])

  return {
    dropIndicator,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  }
}
