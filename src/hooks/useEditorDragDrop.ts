import { useState, useCallback, RefObject } from 'react'

interface DropIndicatorState {
  index: number
  rect: DOMRect | null
  position: 'top' | 'bottom'
  range?: Range | null
}

const INITIAL_DROP_INDICATOR: DropIndicatorState = { index: -1, rect: null, position: 'top', range: null }

// 에디터 내 삽입된 이미지에 부여할 고유 ID 카운터
let editorImageCounter = 0

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
    const sourceImageId = e.dataTransfer.getData('editor-image-id')

    // 이미지 드래그가 아니면 (텍스트 드래그 등) 완전히 무시
    if (!media && !sourceImageId) {
      setDropIndicator(INITIAL_DROP_INDICATOR)
      return
    }
    const { range, index } = dropIndicator

    setDropIndicator(INITIAL_DROP_INDICATOR)

    if (url && editorRef.current) {
      // 새 이미지 래퍼 생성
      const newImageId = `editor-img-${++editorImageCounter}`
      const wrapper = document.createElement('div')
      wrapper.className = 'my-8 flex flex-col gap-2 relative group'
      wrapper.contentEditable = 'false'
      wrapper.setAttribute('draggable', 'true')
      wrapper.setAttribute('data-editor-image-id', newImageId)
      // 에디터 내 이미지 드래그 시 고유 ID를 dataTransfer에 설정
      wrapper.addEventListener('dragstart', (ev: DragEvent) => {
        if (ev.dataTransfer) {
          ev.dataTransfer.setData('text/plain', url)
          ev.dataTransfer.setData('source', media)
          ev.dataTransfer.setData('editor-image-id', newImageId)
        }
      })

      const imgContainer = document.createElement('div')
      imgContainer.className = 'relative'

      const img = document.createElement('img')
      img.src = url
      img.className = 'w-full shadow-lg border border-slate-200'

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

      // 원본 요소 제거 헬퍼 (에디터 내 이미지 이동 시에만 실행)
      const removeSource = () => {
        if (!sourceImageId) return
        const oldEl = editorRef.current?.querySelector(`[data-editor-image-id="${sourceImageId}"]`)
        oldEl?.remove()
      }

      // 💡 문장 사이 (Range) 삽입 로직
      if (range) {
        try {
          const container = range.startContainer;
          const offset = range.startOffset;
          
          if (container.nodeType === Node.TEXT_NODE) {
            const parent = container.parentElement;
            if (parent && parent.closest('.drafting-editor')) {
              const block = parent.closest('p, h4, div:not(.group)') as HTMLElement;
              if (block && editorRef.current.contains(block)) {
                const newBlock = block.cloneNode(false) as HTMLElement;
                
                const splitRange = document.createRange();
                splitRange.setStart(container, offset);
                if (block.lastChild) {
                  splitRange.setEndAfter(block.lastChild);
                } else {
                  splitRange.setEnd(block, 0);
                }
                
                const fragment = splitRange.extractContents();
                newBlock.appendChild(fragment);
                
                block.parentNode?.insertBefore(wrapper, block.nextSibling);
                wrapper.parentNode?.insertBefore(newBlock, wrapper.nextSibling);
                removeSource();
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
      removeSource();
      onEditorInput()
    }
  }, [dropIndicator, editorRef, onEditorInput])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!editorRef.current) return

    // 이미지 드래그(썸네일/에디터 이미지)가 아니면 인디케이터 표시 안 함
    const types = e.dataTransfer.types
    const isImageDrag = types.includes('source') || types.includes('editor-image-id')
    if (!isImageDrag) return

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

    // 💡 1. Caret 기반 정밀 위치 탐색 시도 (크로스브라우저 호환)
    // Firefox/Safari는 caretPositionFromPoint(표준), Chrome은 caretRangeFromPoint 사용
    let range: Range | null = null;
    if ('caretPositionFromPoint' in document) {
      const pos = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    } else if ('caretRangeFromPoint' in document) {
      range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
    }
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
