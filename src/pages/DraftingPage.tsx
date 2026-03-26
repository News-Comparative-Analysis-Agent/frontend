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
    lastSaved, saveDraft, formatLastSaved,
    isLeftSidebarOpen, setIsLeftSidebarOpen,
    chatbotWidth, isResizing,
    messages, inputMessage, setInputMessage, isChatLoading,
    dropIndicator, editorRef, chatEndRef,
    handleEditorInput, handleMouseDown,
    handleDragStart, handleDragOver, handleDragLeave, handleDrop,
    handleSendMessage, applyModifiedContent,
    navigate,
    blocker,
    temporarySave
  } = useDraftingPage()

  const handleLeaveWithoutSaving = () => {
    blocker.proceed?.()
  }

  const handleSaveAndLeave = async () => {
    await temporarySave()
    blocker.proceed?.()
  }

  return (
    <Layout variant="white" activeStep={3} hideFooter>
      <Breadcrumb items={['심층 분석', '초안 작성']} />

      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* 1. 좌측 사이드바: 핵심 인용구 저장소 */}
        <DraftingLeftSidebar 
          isOpen={isLeftSidebarOpen}
          setIsOpen={setIsLeftSidebarOpen}
          sidebarQuotes={sidebarQuotes}
        />

        {/* 좌측 사이드바가 닫혔을 때 나타나는 플로팅 열기 버튼 */}
        {!isLeftSidebarOpen && (
          <button 
            onClick={() => setIsLeftSidebarOpen(true)}
            className="fixed top-[112px] left-6 z-40 bg-white border border-slate-200 p-2.5 rounded-xl shadow-lg text-primary hover:bg-orange-50 hover:scale-110 active:scale-90 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">menu_open</span>
          </button>
        )}

        {/* 2. 중앙 에디터 영역: 제목 및 본문 편집 */}
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
        />

        {/* 3. 우측 챗봇 사이드바: AI 어시스턴트 및 리사이징 핸들 */}
        <DraftingChatbot 
          width={chatbotWidth}
          isResizing={isResizing}
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          isChatLoading={isChatLoading}
          handleSendMessage={handleSendMessage}
          applyModifiedContent={applyModifiedContent}
          chatEndRef={chatEndRef}
          onMouseDown={handleMouseDown}
        />
      </main>

      {/* 4. 하단 푸터 액션바: 저장 및 다음 단계 이동 */}
      <DraftingFooterActions 
         lastSaved={lastSaved}
         saveDraft={saveDraft}
         onFinalReview={() => navigate(`/final-review?id=${issueId}`)}
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
