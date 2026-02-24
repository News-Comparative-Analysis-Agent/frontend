import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { draftingQuotes } from '../mocks/newsData'
import Button from '../components/ui/Button'
import { useDraftStore } from '../stores/useDraftStore'

const DraftingPage = () => {
  const navigate = useNavigate()
  const { title, content, setTitle, setContent, saveDraft, lastSaved } = useDraftStore()
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [chatbotWidth, setChatbotWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [dropIndicator, setDropIndicator] = useState<{ index: number; rect: DOMRect | null }>({ index: -1, rect: null })
  const editorRef = useRef<HTMLDivElement>(null)
  const resizeRafRef = useRef<number | null>(null)

  // 초기 본문 설정 (한 번만 실행)
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [])

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

  return (
    <Layout variant="white" activeStep={3} hideFooter>
        <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span>심층 분석</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-800 font-bold">초안 작성</span>
          </div>
        </div>

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
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {draftingQuotes.map(quote => (
                  <div key={quote.id} className={`bg-white border-l-4 ${quote.borderColor} rounded shadow-sm overflow-hidden group px-3 py-2.5`}>
                    <details className="source-details group/details text-left">
                      <summary className="source-summary list-none outline-none cursor-pointer mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[12px] font-bold ${quote.textColor} px-1.5 py-0.5 ${quote.bg} rounded`}>
                              {quote.media}
                            </span>
                            <div className="flex items-center gap-0.5 text-[11px] font-bold text-slate-400 group-hover/details:text-primary transition-colors">
                              <span className="material-symbols-outlined text-[12px]">link</span>
                              <span>{quote.links.length}개 출처</span>
                              <span className="material-symbols-outlined text-[12px] source-arrow transition-transform">chevron_right</span>
                            </div>
                          </div>
                        </div>
                      </summary>
                      <div className="bg-slate-50 rounded-lg p-2.5 mb-3 border border-slate-100 text-left">
                        <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-tight flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">list_alt</span>
                          참조 원문 기사 리스트
                        </p>
                        <div className="space-y-2">
                          {quote.links.map((link, idx) => (
                             <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-600 hover:text-primary leading-tight transition-colors cursor-pointer">
                              <span className="material-symbols-outlined text-[12px] mt-0.5 opacity-40 shrink-0">open_in_new</span>
                              <span>{link}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                    <p className="text-[13px] leading-relaxed text-slate-700 font-medium line-clamp-3 text-left">{quote.text}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-slate-200 bg-white text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-slate-600">
                    <span className="material-symbols-outlined text-primary text-lg">content_paste_search</span>
                    실시간 표절률
                  </h3>
                  <span className="text-sm font-bold text-primary">5%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '5%' }}></div>
                </div>
                <p className="text-xs text-slate-400 leading-tight">다양한 언론사의 보도문을 참고하여 심층적인 기사가 작성되었습니다.</p>
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
                      ? `${dropIndicator.rect.top - 12 + editorRef.current!.parentElement!.scrollTop - editorRef.current!.parentElement!.getBoundingClientRect().top}px` 
                      : dropIndicator.index < Array.from(editorRef.current!.children).length
                        ? `${Array.from(editorRef.current!.children)[dropIndicator.index].getBoundingClientRect().top - 12 + editorRef.current!.parentElement!.scrollTop - editorRef.current!.parentElement!.getBoundingClientRect().top}px`
                        : `${Array.from(editorRef.current!.children)[dropIndicator.index-1].getBoundingClientRect().bottom + 12 + editorRef.current!.parentElement!.scrollTop - editorRef.current!.parentElement!.getBoundingClientRect().top}px`
                  }}
                />
              )}

              <div className="group relative mb-10 w-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Title</span>
                  <div className="flex items-center bg-orange-50 border border-orange-100 rounded-lg shadow-sm hover:bg-orange-100 transition-colors group/regen overflow-hidden">
                    <div className="px-2 py-1.5 border-r border-orange-200 flex items-center justify-center bg-white/50">
                      <span className="material-symbols-outlined text-[18px] text-primary group-hover/regen:rotate-90 transition-transform duration-500">auto_awesome</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-primary">
                      <span className="text-xs font-bold whitespace-nowrap">제목 다시 생성</span>
                    </button>
                  </div>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none text-[28px] font-bold focus:ring-0 resize-none p-0 placeholder-slate-200 leading-snug overflow-hidden" 
                  placeholder="제목을 입력하세요..." 
                  rows={2}
                  value={title}
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
                  <>
                    <p className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">[미디어스=고성욱 기자]</p>
                    <p>
                      정청래 더불어민주당 대표의 갑작스러운 조국혁신당 합당 추진이 당내 갈등만 남기고 중단됐다. <span className="hl-neutral">주요 일간지들</span>은 명분 없이 절차까지 무시한 정 대표의 불통·독단적 리더십이 불러온 당연한 결과라고 입을 모았다.
                    </p>
                    <p>
                      정 대표는 11일 저녁 비공개 최고위원회의 종료 후 “오늘 민주당 긴급 최고위와 함께 지방선거 전 합당 논의를 중단하기로 결정했다"고 밝혔다. <span className="hl-progressive">경향신문</span>은 이에 대해 "합당 같은 중대사를 충분한 내부 소통과 공감·명분 축적 없이 밀어붙인 데 따른 당연한 결과"라며 비판의 목소리를 높였습니다.
                    </p>
                    <p className="relative group">
                      <span className="hl-conservative">중앙일보</span>는 이번 합당 무산 "정략에 골몰한 정청래의 예고된 결말"이라고 짚으며, 합당 제안이 여권 내 '명·청 갈등'을 수면 위로 부상시키는 부작용만 낳았다고 지적했습니다. 특히 정 대표가 합당을 자신의 당대표 연임을 위한 정치적 입지 강화 수단으로 사용하려 했다는 의혹이 제기되며 당내 신뢰 위기가 극에 달한 점을 꼬집었습니다.
                    </p>
                    <p className="relative group">
                      <span className="hl-progressive">경향신문</span>은 이번 합당 논의 중단 사태를 두고 정청래 법사위원장의 독단적인 의사 결정이 부른 '예고된 참사'라고 규정했습니다. 충분한 당내 합의 과정 없이 추진된 합당 제안이 민주주의 절차를 훼손하고 당내 분열을 야기했다는 비판입니다.
                    </p>
                    <p className="relative group">
                      <span className="hl-conservative">조선일보</span>는 이번 사태의 본질을 <span className="wavy-underline">단순한 해프닝<span className="analysis-tooltip"><span className="block font-bold mb-1 text-primary">윤리 검증 알림</span>당내 '권력 투쟁'의 본질을 희석시킬 수 있는 가벼운 용어입니다. 사안의 중대성을 고려한 표현이 권장됩니다.</span></span>이 아닌 '내부 권력 투쟁'으로 규정했습니다. 8월 전당대회를 앞두고 차기 당권과 공천권을 확보하려는 계파 간 이해관계가 충돌하며 발생한 소모적 이전투구라는 분석입니다.
                    </p>
                    <p>
                      결론적으로 이번 사태는 독단적으로 당을 운영해 온 <span className="wavy-underline">정청래식 리더십<span className="analysis-tooltip"><span className="block font-bold mb-1 text-primary">윤리 검증 알림</span>특정 인물의 리더십 스타일을 비판적인 프레임으로 규정하는 표현입니다. 사실 관계 중심의 서술이 필요합니다.</span></span>이 중대 고비에 직면했음을 상징합니다. 민생 현안이 산적한 가운데 불필요한 내홍으로 국정 동력을 소모했다는 비판을 피하기 어려워 보입니다.
                    </p>
                  </>
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
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-slate-700 leading-relaxed">
                    안녕하세요! 기사의 문장력을 높이거나 특정 논조를 강화하고 싶으시면 말씀해주세요.
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-tl-xl rounded-br-xl rounded-bl-xl text-slate-800 leading-relaxed max-w-[85%]">
                    현재 문단에 중립적 데이터 통계를 하나 추가해줘.
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100">
                <div className="relative">
                  <input 
                    className="w-full bg-slate-50 border-slate-200 rounded-xl py-2 px-3 pr-10 text-[13px] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all" 
                    placeholder="AI와 대화하여 기사 작성..." 
                    type="text" 
                  />
                  <button className="absolute right-2 top-1.5 text-primary hover:text-orange-600 transition-colors">
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
              onClick={() => navigate('/final-review')}
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
