import { useState, useCallback, RefObject } from 'react'

interface DropIndicatorState {
  index: number
  rect: DOMRect | null
}

const INITIAL_DROP_INDICATOR: DropIndicatorState = { index: -1, rect: null }

/**
 * 에디터 영역의 이미지 드래그 앤 드롭을 관리하는 훅입니다.
 */
export const useEditorDragDrop = (
  editorRef: RefObject<HTMLDivElement>,
  onEditorInput: () => void
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
    const insertIndex = dropIndicator.index

    setDropIndicator(INITIAL_DROP_INDICATOR)

    if (url && editorRef.current) {
      const wrapper = document.createElement('div')
      wrapper.className = 'my-8 flex flex-col gap-2 relative group'
      wrapper.contentEditable = 'false'

      const imgContainer = document.createElement('div')
      imgContainer.className = 'relative'

      const img = document.createElement('img')
      img.src = url
      img.className = 'w-full rounded-xl shadow-lg border border-slate-200'

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'absolute top-3 right-3 size-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10'
      deleteBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">close</span>'
      deleteBtn.onclick = (ev) => {
        ev.stopPropagation()
        wrapper.remove()
        onEditorInput()
      }

      imgContainer.appendChild(img)
      imgContainer.appendChild(deleteBtn)

      const caption = document.createElement('p')
      caption.className = 'text-center text-[12px] text-slate-400 font-medium'
      caption.innerText = `사진 출처: ${media}`

      wrapper.appendChild(imgContainer)
      wrapper.appendChild(caption)

      const children = Array.from(editorRef.current.children)
      if (insertIndex >= 0 && insertIndex < children.length) {
        editorRef.current.insertBefore(wrapper, children[insertIndex])
      } else {
        editorRef.current.appendChild(wrapper)
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        editorRef.current.appendChild(p)
      }
      onEditorInput()
    }
  }, [dropIndicator.index, editorRef, onEditorInput])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!editorRef.current) return

    const children = Array.from(editorRef.current.children)
    const mouseY = e.clientY

    let closestIndex = children.length
    let closestRect: DOMRect | null = null
    let minDistance = Infinity

    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect()
      const distanceTop = Math.abs(mouseY - rect.top)
      const distanceBottom = Math.abs(mouseY - rect.bottom)

      if (distanceTop < minDistance) {
        minDistance = distanceTop
        closestIndex = index
        closestRect = rect
      }

      if (index === children.length - 1 && distanceBottom < minDistance) {
        minDistance = distanceBottom
        closestIndex = index + 1
        closestRect = rect
      }
    })

    setDropIndicator({ index: closestIndex, rect: closestRect })
  }, [editorRef])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const rect = editorRef.current?.getBoundingClientRect()
    if (rect) {
      if (e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom) {
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
