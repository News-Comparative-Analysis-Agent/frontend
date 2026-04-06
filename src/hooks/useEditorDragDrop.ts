import { useState, useCallback, RefObject } from 'react'

interface DropIndicatorState {
  index: number
  rect: DOMRect | null
  position: 'top' | 'bottom'
  range?: Range | null
}

const INITIAL_DROP_INDICATOR: DropIndicatorState = { index: -1, rect: null, position: 'top', range: null }

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
    const { range, index } = dropIndicator

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
      deleteBtn.className = 'editor-delete-btn absolute top-3 right-3 size-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10'
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

      // 💡 문장 사이 (Range) 삽입 로직
      if (range) {
        try {
          const container = range.startContainer;
          const offset = range.startOffset;
          
          // 텍스트 노드인 경우 문단 분할 시도
          if (container.nodeType === Node.TEXT_NODE) {
            const parent = container.parentElement;
            if (parent && parent.closest('.drafting-editor')) {
              // 부모 블록(보통 <p>)을 찾음
              const block = parent.closest('p, h4, div:not(.group)') as HTMLElement;
              if (block && editorRef.current.contains(block)) {
                // 새로운 블록 생성
                const newBlock = block.cloneNode(false) as HTMLElement;
                
                // 💡 extractContents를 사용하여 마우스 위치부터 블록 끝까지의 모든 노드를 한 번에 추출
                const splitRange = document.createRange();
                splitRange.setStart(container, offset);
                splitRange.setEndAfter(block.lastChild as Node);
                
                const fragment = splitRange.extractContents();
                newBlock.appendChild(fragment);
                
                // 현재 블록 뒤에 이미지와 새 블록 삽입
                block.parentNode?.insertBefore(wrapper, block.nextSibling);
                wrapper.parentNode?.insertBefore(newBlock, wrapper.nextSibling);
                onEditorInput();
                return;
              }
            }
          }
        } catch (err) {
          console.warn('Failed to split paragraph, falling back to block insertion', err);
        }
      }

      // 💡 문단 사이 (Index) 삽입 (폴백)
      const children = Array.from(editorRef.current.children)
      if (index >= 0 && index < children.length) {
        editorRef.current.insertBefore(wrapper, children[index])
      } else {
        editorRef.current.appendChild(wrapper)
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        editorRef.current.appendChild(p)
      }
      onEditorInput()
    }
  }, [dropIndicator, editorRef, onEditorInput])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!editorRef.current) return

    // 💡 0. 자동 스크롤(Auto-scroll) 처리
    const scrollContainer = editorRef.current.closest('section');
    if (scrollContainer) {
      const rect = scrollContainer.getBoundingClientRect();
      const threshold = 120; // 📜 스크롤 감지 영역 (상하단 120px)
      const maxSpeed = 20;   // 🚀 최대 스크롤 속도
      
      // 상단 스크롤 (마우스가 상단 경계에 접근 시)
      if (e.clientY < rect.top + threshold) {
        const intensity = (rect.top + threshold - e.clientY) / threshold;
        scrollContainer.scrollTop -= Math.ceil(maxSpeed * intensity);
      } 
      // 하단 스크롤 (마우스가 하단 경계에 접근 시)
      else if (e.clientY > rect.bottom - threshold) {
        const intensity = (e.clientY - (rect.bottom - threshold)) / threshold;
        scrollContainer.scrollTop += Math.ceil(maxSpeed * intensity);
      }
    }

    // 💡 1. Caret 기반 정밀 위치 탐색 시도
    // @ts-ignore
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (range && editorRef.current.contains(range.startContainer)) {
      const container = range.startContainer;
      
      // 문장 경계 스냅 로직 적용
      if (container.nodeType === Node.TEXT_NODE) {
        const text = container.textContent || "";
        const offset = range.startOffset;
        
        // 주변 구두점(. ? !) 위치 탐색
        const boundaries = [0, text.length];
        const regex = /[.?!]\s*/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          boundaries.push(match.index + match[0].length);
        }
        
        // 가장 가까운 경계 찾기
        const closestBoundary = boundaries.reduce((prev, curr) => 
          Math.abs(curr - offset) < Math.abs(prev - offset) ? curr : prev
        );
        
        // 해당 경계로 range 보정
        range.setStart(container, closestBoundary);
        range.setEnd(container, closestBoundary);
        
        // 시각적 좌표 확보
        const rect = range.getBoundingClientRect();
        
        setDropIndicator({ index: -1, rect, position: 'bottom', range });
        return;
      }
    }

    // 💡 2. 문단 사이 탐색 (폴백 로직)
    const children = Array.from(editorRef.current.children)
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

    setDropIndicator({ index: closestIndex, rect: closestRect, position, range: null })
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
