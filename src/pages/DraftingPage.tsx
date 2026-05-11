import React, { useState, useRef, useEffect } from 'react'
import Layout from '../layouts/Layout'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useDraftingPage } from '../hooks/useDraftingPage'

// 하위 컴포넌트 임포트
import DraftingLeftSidebar from '../components/drafting/DraftingLeftSidebar'
import DraftingEditorArea from '../components/drafting/DraftingEditorArea'
import DraftingChatbot from '../components/drafting/DraftingChatbot'
import DraftingFooterActions from '../components/drafting/DraftingFooterActions'
import ConfirmModal from '../components/ui/ConfirmModal'

/**
 * 초안 작성 페이지
 * - 로직: useDraftingPage 커스텀 훅에서 독립적으로 관리
 * - UI: 기능 단위의 서브 컴포넌트로 분리하여 대형 컴포넌트 해소 (600라인 -> 100라인 미만)
 */
const DraftingPage = () => {
  const {
    issueId,
    title, setTitle,
    content,
    sidebarQuotes,
    lastSaved, isSaving, saveDraft, formatLastSaved,
    draftImages,
    isLeftSidebarOpen, setIsLeftSidebarOpen,
    isRightSidebarOpen, setIsRightSidebarOpen,
    setComparisonLayout,
    chatbotWidth, isResizing,
    messages, inputMessage, setInputMessage, isChatLoading,
    dropIndicator, editorRef, chatEndRef,
    handleEditorInput, handleMouseDown,
    handleDragStart, handleDragOver, handleDragLeave, handleDrop,
    handleSendMessage,
    applySuggestion,
    cancelSuggestion,
    undoSuggestion,
    navigate,
    blocker,
    temporarySave
  } = useDraftingPage()

  // 가이드 배너 상태 추가
  const [showGuide, setShowGuide] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isGuideHiddenLocally, setIsGuideHiddenLocally] = useState(false)
  
  // 크로스체크 모드 및 선택된 기사 상태 (2단계)
  const [isCrossCheckMode, setIsCrossCheckMode] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)

  // 윈도우 너비 감지 (배너 위치 계산용)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // 팝업 감시를 위한 Ref
  const popupRef = useRef<Window | null>(null)
  const popupTimerRef = useRef<any>(null)

  // --- 사이드바 축소 시 보여줄 고유 언론사 목록 추출 ---
  const uniqueMediaList = Array.from(new Map(sidebarQuotes.map(q => [q.media, q])).values());

  const openArticlePopup = (url: string) => {
    if (!url) return;
    
    // 기존 타이머가 있다면 제거
    if (popupTimerRef.current) {
      clearInterval(popupTimerRef.current);
    }
    
    // 💡 사용자의 현재 화면 해상도를 감지하여 정확히 절반(50%) 너비로 설정하되,
    // 윈도우(OS)의 투명 테두리(Invisible Borders)가 차지하는 면적을 감안하여 살짝 적게(49.5%) 줍니다.
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const popupWidth = Math.floor(screenWidth * 0.495); // 절반보다 약간 작게
    
    try {
      window.moveTo(screenWidth - popupWidth, 0); // 화면 우측으로 배치
      window.resizeTo(popupWidth, screenHeight);
    } catch (e) {
      console.warn("Main window control limited by browser policy");
    }
    
    const features = `width=${popupWidth},height=${screenHeight},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
    const popup = window.open(url, 'CrossCheckArticle', features);
    popupRef.current = popup;

    // 팝업 닫힘 감지 타이머 시작
    if (popup) {
      popupTimerRef.current = setInterval(() => {
        if (popup.closed) {
          if (popupTimerRef.current) clearInterval(popupTimerRef.current);
          setSelectedQuote(null);
          setIsCrossCheckMode(false);
          popupRef.current = null;
        }
      }, 1000);
    }
  };

  // 언마운트 및 리사이즈 이벤트 정리
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      if (popupTimerRef.current) clearInterval(popupTimerRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  const handleCloseGuide = () => {
    if (dontShowAgain) {
      setIsGuideHiddenLocally(true)
    }
    setShowGuide(false)
  }

  const handleLeaveWithoutSaving = () => {
    blocker.proceed?.()
  }

  const handleSaveAndLeave = async () => {
    await temporarySave()
    blocker.proceed?.()
  }

  // --- 일반 뷰 ---
  return (
    <Layout variant="white" activeStep={3} hideFooter>
      <Breadcrumb items={['심층 분석', '초안 작성']} />

      <main className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* 💡 기사 비교 가이드 배너 (팝업창이 왼쪽 50%를 가리므로, 오른쪽 50% 영역의 중앙인 75% 지점으로 배치) */}
        {showGuide && isCrossCheckMode && selectedQuote && (
          <div 
            className="fixed top-28 right-0 z-[100] animate-bounce-subtle pointer-events-none flex justify-center transition-all duration-300"
            style={{ left: (windowWidth > 1100) ? '50%' : '0' }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-3 border border-white/20 pointer-events-auto w-[90%] max-w-[450px]">
              <div className="flex items-center gap-5">
                <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[14px] font-black tracking-tight text-white">
                    쾌적한 작성을 위해 창을 양옆으로 배치해 보세요!
                  </p>
                  <p className="text-[11px] font-bold text-slate-400">
                    단축키 안내: <span className="text-primary px-1.5 py-0.5 bg-white/5 rounded mx-1">Windows 키</span> + <span className="text-primary px-1.5 py-0.5 bg-white/5 rounded mx-1">⬅️ ➡️ 방향키</span>
                  </p>
                </div>
                <button 
                  onClick={handleCloseGuide}
                  className="ml-auto size-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  title="닫기"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              
              <div className="flex items-center justify-end border-t border-white/5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <input 
                    type="checkbox" 
                    className="size-4 rounded border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                  />
                  <span className="text-[10px] font-bold text-slate-400 group-hover/check:text-slate-300 transition-colors">다시 보지 않기</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 1. 좌측 사이드바: 핵심 인용구 저장소 */}
        <DraftingLeftSidebar 
          isOpen={isLeftSidebarOpen}
          setIsOpen={setIsLeftSidebarOpen}
          sidebarQuotes={sidebarQuotes}
          isCrossCheckMode={isCrossCheckMode}
          setIsCrossCheckMode={setIsCrossCheckMode}
          selectedQuote={selectedQuote}
          setSelectedQuote={(quote) => {
            setSelectedQuote(quote)
            if (quote && !isGuideHiddenLocally) {
              setShowGuide(true) // 기사 선택 시 가이드 표시 (숨기기 설정 안 했을 때만)
            }
          }}
          setComparisonLayout={setComparisonLayout}
        />

        {/* 좌측 사이드바가 닫혔을 때 나타나는 영역 (원본 디자인 유지) */}
        {!isLeftSidebarOpen && (
          <div className={`flex flex-col items-center gap-4 py-4 ${windowWidth < 1100 ? 'px-2' : 'px-3'} self-stretch shrink-0 overflow-y-auto transition-all`}>
            {/* 사이드바 열기 버튼 (원본 둥근 사각형 디자인 복구) */}
            <button 
              onClick={() => setIsLeftSidebarOpen(true)}
              className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-lg text-primary hover:bg-orange-50 hover:scale-110 active:scale-90 transition-all duration-200 shrink-0"
              title="사이드바 열기"
            >
              <span className="material-symbols-outlined icon-md">check</span>
            </button>

            {/* 언론사 칩형(Pill) 리스트 */}
            <div className="flex flex-col items-start gap-2.5 py-3 border-t border-slate-100 mt-1">
              {uniqueMediaList.map((media, idx) => (
                <button
                  key={media.id}
                  onClick={() => {
                    setSelectedQuote(media);
                    setIsCrossCheckMode(true);
                    setIsRightSidebarOpen(false); // 💡 아이콘 클릭 시 우측 챗봇도 자동으로 닫기
                    openArticlePopup(media.links?.[0]);
                  }}
                  className={`${windowWidth < 1100 ? 'h-7 px-2.5 text-[10px]' : 'h-9 px-4 text-[12px]'} rounded-full flex items-center justify-center font-black border-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap ${
                    selectedQuote?.media === media.media 
                      ? `${media.bg} ${media.borderColor} ${media.textColor} scale-105 shadow-md ring-2 ring-primary/20` 
                      : 'bg-white border-slate-200 text-slate-400 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:border-primary/30'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {media.media}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. 중앙 에디터 영역: 제목 및 본문 편집 (좌우 버튼 공간 확보를 위해 조건부 여백 유지) */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isLeftSidebarOpen ? (windowWidth < 1100 ? 'pl-4' : 'pl-12 md:pl-0') : ''} ${!isRightSidebarOpen ? (windowWidth < 1100 ? 'pr-4' : 'pr-12 md:pr-0') : ''}`}>
          <DraftingEditorArea 
            title={title}
            setTitle={setTitle}
            content={content}
            editorRef={editorRef}
            handleEditorInput={handleEditorInput}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            dropIndicator={dropIndicator}
            handleDragStart={handleDragStart}
            draftImages={draftImages}
            isCrossCheckMode={isCrossCheckMode}
            windowWidth={windowWidth}
          />
        </div>

        {/* 3. 우측 챗봇 사이드바: AI 어시스턴트 및 리사이징 핸들 */}
        <DraftingChatbot 
          isOpen={isRightSidebarOpen}
          setIsOpen={setIsRightSidebarOpen}
          width={chatbotWidth}
          isResizing={isResizing}
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          isChatLoading={isChatLoading}
          handleSendMessage={handleSendMessage}
          onApplySuggestion={applySuggestion}
          onCancelSuggestion={cancelSuggestion} // 💡 프리뷰 취소 및 본문 원복 연동
          onUndoSuggestion={undoSuggestion}
          chatEndRef={chatEndRef}
          onMouseDown={handleMouseDown}
        />

        {/* 우측 사이드바가 닫혔을 때 나타나는 플로팅 열기 버튼 (화면 끝에 완벽 밀착 및 테두리 제거) */}
        {!isRightSidebarOpen && (
          <button 
            onClick={() => setIsRightSidebarOpen(true)}
            className="fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-white pl-2.5 pr-1 py-5 rounded-l-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.05)] text-primary hover:bg-orange-50 hover:pl-4 transition-all duration-300 group flex flex-col items-center gap-1.5"
            title="AI 챗봇 열기"
          >
            <span className="material-symbols-outlined text-[22px]">chat_bubble</span>
            <span className="[writing-mode:vertical-lr] text-[10px] font-black tracking-widest text-slate-400 group-hover:text-primary">AI CHAT</span>
          </button>
        )}
      </main>

      {/* 4. 하단 푸터 액션바: 저장 및 다음 단계 이동 */}
      <DraftingFooterActions 
         lastSaved={lastSaved}
         isSaving={isSaving}
         saveDraft={saveDraft}
         onFinalReview={async () => {
           await temporarySave();
           navigate(`/final-review?id=${issueId}`);
         }}
         formatLastSaved={formatLastSaved}
      />

      {/* 이탈 방지 확인 모달 */}
      <ConfirmModal 
        isOpen={blocker.state === 'blocked'}
        title="작성 중인 내용이 있습니다"
        description="저장하지 않고 이동하시겠습니까? 이동하면 작업한 내용이 손실될 수 있습니다."
        cancelLabel="나가기"
        confirmLabel="임시저장하기"
        variant="danger"
        onCancel={handleLeaveWithoutSaving}
        onConfirm={handleSaveAndLeave}
      />
    </Layout>
  )
}

export default DraftingPage
