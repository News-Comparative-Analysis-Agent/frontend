import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import { useDraftStore } from '../stores/useDraftStore'
import Breadcrumb from '../components/ui/Breadcrumb'
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

const DraftingPage = () => {
  const navigate = useNavigate()
  const { 
    currentIssueId, title, content, sidebarQuotes, 
    setIssueId, setTitle, setContent, setSidebarQuotes, 
    saveDraft, lastSaved 
  } = useDraftStore()
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [chatbotWidth, setChatbotWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [dropIndicator, setDropIndicator] = useState<{ index: number; rect: DOMRect | null }>({ index: -1, rect: null })
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: '안녕하세요! 기사의 문장력을 높이거나 특정 논조를 강화하고 싶으시면 말씀해주세요.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'
  
  const editorRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const resizeRafRef = useRef<number | null>(null)

  // 채팅 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 실제 데이터 로드 및 본문 생성
  const loadingRef = useRef<string | null>(null)

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

  // 1. 이슈 ID 변경 감지 및 스토어 리셋
  useEffect(() => {
    if (issueId !== currentIssueId) {
      setIssueId(issueId)
      setTitle('')
      setContent('')
      setSidebarQuotes([])
      loadingRef.current = null
    }
  }, [issueId, currentIssueId, setIssueId, setTitle, setContent, setSidebarQuotes])

  // 2. 데이터가 없는 경우 페칭 실행
  useEffect(() => {
    if (issueId === currentIssueId && !content && !title && sidebarQuotes.length === 0) {
      loadDraft()
    }
  }, [issueId, currentIssueId, content, title, sidebarQuotes, loadDraft])

  // 3. 스토어의 content와 실제 에디터 DOM 동기화
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
  }

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
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current)
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
        handleEditorInput() // 이미지 삭제 후 상태 업데이트
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
      handleEditorInput() // 본문 업데이트
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

  const formatLastSaved = () => {
    if (!lastSaved) return '저장되지 않음'
    const date = new Date(lastSaved)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} 저장됨`
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
        current_content: content
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

  return (
    <Layout variant="white" activeStep={3} hideFooter>
        <Breadcrumb items={['심층 분석', '초안 작성']} />

        <main className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Sidebar */}
          <aside 
            id="left-sidebar"
            className={`w-72 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 overflow-hidden transition-all duration-300 relative group min-h-0 ${isLeftSidebarOpen ? '' : '!w-0 !border-none'}`}
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <h2 className="font-bold text-xs uppercase tracking-widest flex items-center gap-1 md:gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-primary text-lg">format_quote</span>
                  핵심 인용구 저장소
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  icon="menu_open"
                  onClick={() => setIsLeftSidebarOpen(false)}
                  className="size-8 rounded-full"
                  title="사이드바 접기"
                />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {sidebarQuotes.map(quote => (
                  <div 
                    key={quote.id} 
                    className={`bg-white border-l-4 ${quote.borderColor || 'border-slate-300'} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden px-4 py-3.5 cursor-pointer`}
                    onClick={() => quote.links?.[0] && window.open(quote.links[0], '_blank')}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${quote.textColor || 'text-slate-600'} px-2 py-0.5 ${quote.bg || 'bg-slate-50'} rounded-md border ${quote.borderColor?.replace('border-', 'border-') || 'border-slate-200'} opacity-80`}>
                        {quote.media}
                      </span>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        <span>원문 보기</span>
                      </div>
                    </div>
                    <h4 className="text-[13.5px] leading-relaxed text-slate-700 font-bold transition-colors line-clamp-3 text-left">
                      {quote.text}
                    </h4>
                  </div>
                ))}
                {sidebarQuotes.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-3">
                    <span className="material-symbols-outlined text-[40px]">format_quote</span>
                    <p className="text-sm font-medium">인용할 수 있는 핵심 정보가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {!isLeftSidebarOpen && (
            <button 
              onClick={() => setIsLeftSidebarOpen(true)}
              className="fixed top-[112px] left-6 z-40 bg-white border border-slate-200 p-2.5 rounded-xl shadow-lg text-primary hover:bg-orange-50 hover:scale-110 active:scale-90 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">menu_open</span>
            </button>
          )}

          <section 
            className="flex-1 overflow-y-auto custom-scrollbar bg-white relative min-h-0 text-left"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="max-w-3xl mx-auto py-12 px-8 relative">
              {dropIndicator.index !== -1 && dropIndicator.rect && (
                <div 
                  className="absolute left-8 right-8 h-1 bg-primary rounded-full z-50 pointer-events-none shadow-[0_0_10px_rgba(242,127,13,0.5)] transition-all duration-75"
                  style={{ 
                    top: dropIndicator.index === 0 
                      ? `${dropIndicator.rect.top - 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px` 
                      : dropIndicator.index < Array.from(editorRef.current?.children || []).length
                        ? `${Array.from(editorRef.current?.children || [])[dropIndicator.index].getBoundingClientRect().top - 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px`
                        : `${Array.from(editorRef.current?.children || [])[dropIndicator.index-1].getBoundingClientRect().bottom + 12 + (editorRef.current?.parentElement?.scrollTop || 0) - (editorRef.current?.parentElement?.getBoundingClientRect().top || 0)}px`
                  }}
                />
              )}

              <div className="group relative mb-10 w-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Title</span>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none text-[28px] font-bold focus:ring-0 resize-none p-0 placeholder-slate-200 leading-snug overflow-hidden" 
                  placeholder="제목을 입력하세요..." 
                  rows={2}
                  value={title || ''}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div 
                ref={editorRef}
                className="space-y-6 text-[16px] leading-[1.8] text-slate-700 focus:outline-none" 
                contentEditable="true"
                onInput={handleEditorInput}
              >
                {!content && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <span className="material-symbols-outlined text-[48px] mb-4 animate-pulse">article</span>
                    <p className="text-sm font-medium">초안 데이터를 불러오고 있습니다...</p>
                  </div>
                )}
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100" contentEditable="false">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-primary text-lg">perm_media</span>
                      관련 뉴스 미디어
                    </h3>
                  </div>
                  <div className="bg-orange-50/50 border border-dashed border-orange-200 rounded-lg p-2.5 mb-4 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">drag_pan</span>
                    <p className="text-[11px] font-bold text-primary">이미지를 본문에 드래그하여 삽입하세요</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 1, media: '연합뉴스', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY33rzUtzizNkambfkpf7PrbmaCPi3Vs2XhrFST7J9j0Auo6ROoJdI99n39p8kX3QyEEUtTFw75VImv0O4NvrIXq7CP2ZKyO8NbkqCkZWvxbEuti95lCCVBtBSHUVRbhJUC4-VdAA96qxNc_KRHTo_MGtnkhEZxjymY8608LA8RGNGJcovh3J3VhAUB4vyUA2L3SC7YvAK7EHrW114yDftkTUpbD47aXsHvTyjTFWeLDGYtAqFdkUtvQPbmkio8Z-MJGKA70SaKR0' },
                    { id: 2, media: '중앙일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTH5_zsN3VhlYXQHLzSA4rz7aZsg6BXywdnp0NYxbkOQW4PfhG40NpXDK_1E6ntCfOKi4r1xLsVm4LUxsqmKonCtXh4rDGb7KimC_I6NTWdLcs6UsQWcjSOHTnltFP2d-k9gf8Evx70u0OHENUSXbBX1IUZpYQWIf8OF-E8Wod_Fm0MRpIc3UwhtkQVncU9vsD-crZolcZLknAz2J5iQfPf6G3_12I-SP2_NjCaE-OxIwSJabTA0G70XPIBAp7IfYEGw1RSetfVCo' },
                    { id: 3, media: '조선일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAC0PIARJCfi-y5DtCzhSV5jKG_I---yFnHfW5SVJkciM1xPymzoAyCbzw0RJ7aloMzdE4LYl5onPqs_MDKhj5AJTb05YP4T9H88YU01Z4kwwSRPjNRVdwCbRRokdmiT7hFF2x-Si9uEpkfIKAviXLJ6vGD4YZYbxPLKEvEszOq7FyZUPmLmmzoMyCcEn_CGlXP3XVrOPd9ooVbspDGvCNpHo_f5Jti3UzFgkC-iPY0oJUtEOQJn3TWlqN8of-rnmPrIAatz5lqWs' },
                    { id: 4, media: '동아일보', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtS6C_-dLN1_nRN01H5ykacQWw1aodmT40-cBvVmRYo-qePP6GDRoqk0n8DtVAytgpnrEj_smAjDoLHOlu3bAgKBwu3mxNRzzjuEXSIkL7jv-NZGJNwqEG2D5WClXcR--GctBEgjWyH2sGST9IbaogAkiVxJ5fvETk3IzEu6GLS7Y_b8maxHTv-_7zFMA50dX-cRq485TWPGoMJ1nze-Hchrr39fMeE1mhTXm1BaBldHVQ8EqIv5dAhE7YAr5XOQbwVe6HVwL18Xc' }
                  ].map(item => (
                    <div 
                      key={item.id} 
                      className="group relative flex flex-col gap-2 cursor-grab active:cursor-grabbing"
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, item.url, item.media)}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm group-hover:shadow-md transition-all">
                        <img alt={item.media} className="w-full h-full object-cover" src={item.url} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 text-center">{item.media}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60 font-medium">
                <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
                <p className="text-xs text-slate-500 leading-relaxed text-left">
                  <span className="font-bold text-slate-700">AI 생성 고지:</span> 본 기사는 생성형 AI 기술을 활용하여 작성된 초안을 바탕으로 기자의 최종 편집 및 검수를 거쳤습니다.
                </p>
              </div>
            </div>
          </section>

          <div 
            id="sidebar-resize-handle"
            className={`w-1 cursor-col-resize border-l border-slate-200 hover:bg-primary z-40 relative ${isResizing ? 'bg-primary' : ''}`}
            onMouseDown={handleMouseDown}
          />

          <aside 
            id="chatbot-sidebar"
            className={`border-l border-slate-200 flex flex-col bg-white shrink-0 ${isResizing ? '' : 'transition-[width] duration-300'}`}
            style={{ width: `${chatbotWidth}px` }}
          >
            <div className="flex-1 flex flex-col overflow-hidden text-left">
              <div className="p-4 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-primary text-lg">forum</span>
                  Smart AI Assistant
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-sm">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                      </div>
                    )}
                    <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`p-3 rounded-xl leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-orange-50 border border-orange-100 text-slate-800 rounded-tr-none' 
                          : 'bg-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {msg.modifiedContent && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-primary">
                            <span className="material-symbols-outlined text-[16px]">edit_note</span>
                            <span className="text-[11px] font-bold">AI의 수정 제안이 있습니다</span>
                          </div>
                          <button 
                            onClick={() => applyModifiedContent(msg.modifiedContent!)}
                            className="w-full py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                          >
                            본문에 반영하기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-slate-100">
                <div className="relative">
                  <input 
                    className="w-full bg-slate-50 border-slate-200 rounded-xl py-2 px-3 pr-10 text-[13px] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-50" 
                    placeholder={isChatLoading ? "AI가 생각 중입니다..." : "AI와 대화하여 기사 작성..."}
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isChatLoading}
                  />
                  <button 
                    className={`absolute right-2 top-1.5 transition-colors ${isChatLoading || !inputMessage.trim() ? 'text-slate-300 pointer-events-none' : 'text-primary hover:text-orange-600'}`}
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !inputMessage.trim()}
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <footer className="h-20 border-t border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between z-30 shrink-0 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 tracking-tight">
              <span className="material-symbols-outlined text-base">history</span>
              마지막 저장: {formatLastSaved()}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" icon="save" onClick={saveDraft}>
              <span>임시저장</span>
            </Button>
            <Button 
              onClick={() => navigate(`/final-review?id=${issueId}`)}
              size="lg"
              className="px-10"
            >
              <span>검토 이동</span>
            </Button>
          </div>
        </footer>
    </Layout>
  )
}

export default DraftingPage
