import { useState, useCallback, useEffect, useRef } from 'react'

interface PanelResizeOptions {
  initialWidth?: number
  minWidth?: number
  maxWidth?: number
}

/**
 * 패널의 드래그 리사이즈를 관리하는 훅입니다.
 * requestAnimationFrame으로 렌더링을 최적화합니다.
 */
export const usePanelResize = ({
  initialWidth = 320,
  minWidth = 250,
  maxWidth = 800,
}: PanelResizeOptions = {}) => {
  const [panelWidth, setPanelWidth] = useState(initialWidth)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRafRef = useRef<number | null>(null)

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    if (resizeRafRef.current) return
    resizeRafRef.current = requestAnimationFrame(() => {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth)
      }
      resizeRafRef.current = null
    })
  }, [isResizing, minWidth, maxWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    if (resizeRafRef.current) {
      cancelAnimationFrame(resizeRafRef.current)
      resizeRafRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return {
    panelWidth,
    isResizing,
    handleResizeStart,
  }
}
