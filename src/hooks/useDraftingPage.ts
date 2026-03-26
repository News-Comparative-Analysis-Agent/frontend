import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, useBlocker } from 'react-router-dom'
import { useDraftStore } from '../stores/useDraftStore'
import { chatWithAI } from '../api/drafting'
import { fetchIssueDraft } from '../api/issues'
import { PreGeneratedDraft, SidebarQuote } from '../types/analysis'
import { buildMediaColorMap } from '../utils/mediaColors'
import DOMPurify from 'dompurify'

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  modifiedContent?: string;
}

export const useDraftingPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'

  const { 
    currentIssueId, title, content, sidebarQuotes, 
    setIssueId, setTitle, setContent, setSidebarQuotes, 
    saveDraft, lastSaved, isDirty, setIsDirty
  } = useDraftStore()

  // 브라우저 끄기/새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // 내부 라우팅 차단
  const blocker = useBlocker(({ nextLocation }) => {
    return isDirty && !nextLocation.pathname.startsWith('/drafting')
  })

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [chatbotWidth, setChatbotWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [dropIndicator, setDropIndicator] = useState<{ index: number; rect: DOMRect | null }>({ index: -1, rect: null })
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: '안녕하세요! 기사의 문장력을 높이거나 특정 논조를 강화하고 싶으시면 말씀해주세요.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  const editorRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const resizeRafRef = useRef<number | null>(null)
  const loadingRef = useRef<string | null>(null)

  // 채팅 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      if (newContent !== content) {
        setContent(newContent)
      }
    }
  }, [setContent, content])

  const loadDraft = useCallback(async () => {
    if (!issueId || loadingRef.current === issueId) return
    loadingRef.current = issueId

    try {
      const data = await fetchIssueDraft(issueId)
      if (loadingRef.current !== issueId) return

      const cards = data.claim_cards ?? []
      let draft: PreGeneratedDraft | null = null
      try {
        if (data.pre_generated_draft) {
          draft = JSON.parse(data.pre_generated_draft)
        }
      } catch (e) {
        console.error('JSON Parse Error:', e)
      }

      const allMedia = [
        ...cards.map(c => c.press),
        ...(draft?.contentions?.flatMap(c => c.media_views?.map(v => v.press)) || [])
      ].filter(Boolean)
      const mediaColorMap = buildMediaColorMap(allMedia)
      
      const mappedQuotes: SidebarQuote[] = cards.map((card) => {
        const scheme = mediaColorMap[card.press] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', hl: 'hl-neutral' }
        return {
          id: card.id,
          media: card.press,
          bg: scheme.bg,
          textColor: scheme.text,
          borderColor: scheme.border,
          text: card.claim,
          evidence: card.evidence,
          links: [card.url]
        }
      })
      
      setSidebarQuotes(mappedQuotes)

      if (draft) {
        setTitle(draft.title || '')
        let html = `<p class="mb-4">${draft.introduction || ''}</p>`
        draft.contentions?.forEach(contention => {
          html += `<h4 class="font-bold text-slate-900 mt-8 mb-4">${contention.contention_title || ''}</h4>`
          html += `<p class="mb-4">${contention.conflict_summary || ''}</p>`
          contention.media_views?.forEach(view => {
            const scheme = mediaColorMap[view.press]
            const hlClass = scheme ? scheme.hl : 'hl-neutral'
            html += `<p class="mb-3"><span class="${hlClass}">${view.press || ''}</span>은(는) "${view.claim || ''}"라고 주장하며, "${view.narrative || ''}"라고 전했습니다.</p>`
          })
        })
        html += `<p class="mt-8 pt-4 border-t border-slate-100">${draft.summary || ''}</p>`
        const safeHtml = DOMPurify.sanitize(html)
        setContent(safeHtml)
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    } finally {
      loadingRef.current = null
    }
  }, [issueId, setSidebarQuotes, setTitle, setContent])

  useEffect(() => {
    if (issueId !== currentIssueId) {
      setIssueId(issueId)
      setTitle('')
      setContent('')
      setSidebarQuotes([])
      loadingRef.current = null
    }
  }, [issueId, currentIssueId, setIssueId, setTitle, setContent, setSidebarQuotes])

  useEffect(() => {
    if (issueId === currentIssueId && !content && !title && sidebarQuotes.length === 0) {
      loadDraft()
    }
  }, [issueId, currentIssueId, content, title, sidebarQuotes, loadDraft])

  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleMouseDown = (e: React.MouseEvent) => {
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
      if (newWidth >= 250 && newWidth <= 800) {
        setChatbotWidth(newWidth)
      }
      resizeRafRef.current = null
    })
  }, [isResizing])

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

  const handleDragStart = (e: React.DragEvent, url: string, media: string) => {
    e.dataTransfer.setData('text/plain', url)
    e.dataTransfer.setData('source', media)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const url = e.dataTransfer.getData('text/plain')
    const media = e.dataTransfer.getData('source')
    const insertIndex = dropIndicator.index
    
    setDropIndicator({ index: -1, rect: null })
    
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
      deleteBtn.onclick = (e) => {
        e.stopPropagation()
        wrapper.remove()
        handleEditorInput()
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
      handleEditorInput()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
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
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = editorRef.current?.getBoundingClientRect()
    if (rect) {
      if (e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom) {
        setDropIndicator({ index: -1, rect: null })
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatLoading) return

    const userMsg = inputMessage.trim()
    setInputMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsChatLoading(true)

    try {
      const response = await chatWithAI({
        message: userMsg,
        current_content: content,
        issue_id: Number(issueId)
      })

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: response.response,
        modifiedContent: response.modified_content 
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'ai', content: '죄송합니다. 서버와 통신 중 오류가 발생했습니다.' }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const applyModifiedContent = (modifiedContent: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = modifiedContent
      setContent(modifiedContent)
    }
  }

  const formatLastSaved = () => {
    if (!lastSaved) return '저장되지 않음'
    const date = new Date(lastSaved)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} 저장됨`
  }

  const temporarySave = async () => {
    console.log('--- [임시저장 API 연동 준비] ---')
    console.log('이슈 ID:', issueId)
    console.log('제목:', title)
    console.log('본문 내용 (HTML):', content)
    console.log('사이드바 인용구 개수:', sidebarQuotes.length)
    console.log('발생 시간:', new Date().toISOString())
    console.log('-------------------------------')
    
    // 실제 저장 로직 호출
    await saveDraft()
  }

  return {
    issueId,
    currentIssueId,
    title,
    setTitle,
    content,
    setContent,
    sidebarQuotes,
    lastSaved,
    saveDraft,
    formatLastSaved,
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    chatbotWidth,
    isResizing,
    messages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    dropIndicator,
    editorRef,
    chatEndRef,
    handleEditorInput,
    handleMouseDown,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSendMessage,
    applyModifiedContent,
    navigate,
    isDirty,
    setIsDirty,
    blocker,
    temporarySave
  }
}
