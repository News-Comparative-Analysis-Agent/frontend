import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDraftStore } from '../stores/useDraftStore'
import { fetchIssueDraft, fetchDraftImages } from '../api/issues'
import { PreGeneratedDraft, SidebarQuote, DraftImage } from '../types/analysis'
import { buildMediaColorMap } from '../utils/mediaColors'
import { buildDraftHtml } from '../utils/buildDraftHtml'

import { useUnsavedChangesGuard } from './useUnsavedChangesGuard'
import { usePanelResize } from './usePanelResize'
import { useDraftChat } from './useDraftChat'
import { useEditorDragDrop } from './useEditorDragDrop'

export const useDraftingPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'

  const {
    currentIssueId, title, content, sidebarQuotes,
    setIssueId, setTitle, setContent, setSidebarQuotes,
    saveDraft, lastSaved, isDirty, setIsDirty,
    undo, pushHistory, pendingDiff
  } = useDraftStore()

  // --- 분리된 훅 조합 ---
  const { blocker } = useUnsavedChangesGuard(isDirty)
  const { panelWidth: chatbotWidth, isResizing, handleResizeStart: handleMouseDown } = usePanelResize()

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [draftImages, setDraftImages] = useState<DraftImage[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<string | null>(null)
  const historyTimeoutRef = useRef<any>(null)

  // 수동 입력 시: 상태는 즉시 업데이트, 히스토리는 1초간 멈췄을 때만 기록 (단축키용)
  const handleEditorInput = useCallback(() => {
    if (pendingDiff) return // 💡 리뷰 모드 중에는 본문 오염을 막기 위해 저장을 차단합니다.
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      if (newContent !== content) {
        setContent(newContent)

        // 1초간 입력이 없으면 현재 상태를 히스토리에 기록 (Ctrl+Z용 스냅샷)
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current)
        historyTimeoutRef.current = setTimeout(() => {
          pushHistory()
        }, 1000)
      }
    }
  }, [setContent, content, pushHistory])

  const {
    messages, inputMessage, setInputMessage, isChatLoading,
    chatEndRef, handleSendMessage, applyModifiedContent, undoApply
  } = useDraftChat({ 
    issueId, 
    content, 
    editorRef: editorRef as React.RefObject<HTMLDivElement>, 
    setContent,
    pushHistory,
    undo
  })

  const {
    dropIndicator, handleDragStart, handleDrop, handleDragOver, handleDragLeave
  } = useEditorDragDrop(editorRef as React.RefObject<HTMLDivElement>, handleEditorInput)

  // --- 초안 로딩 ---
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
        const safeHtml = buildDraftHtml(draft, mediaColorMap)
        setContent(safeHtml, true) // 로딩 시에는 isDirty를 켜지 않음
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    } finally {
      loadingRef.current = null
      setIsDirty(false) // 로딩 완료 후 최종적으로 수정되지 않은 상태로 설정
    }
  }, [issueId, setSidebarQuotes, setTitle, setContent, setIsDirty])
  
  // --- 이미지 로딩 ---
  const loadImages = useCallback(async () => {
    if (!issueId) return
    try {
      const images = await fetchDraftImages(issueId)
      setDraftImages(images)
    } catch (e) {
      console.error('Failed to load draft images:', e)
    }
  }, [issueId])

  // --- 이슈 전환 감지 ---
  useEffect(() => {
    if (issueId !== currentIssueId) {
      setIssueId(issueId)
      setTitle('')
      setContent('')
      setSidebarQuotes([])
      loadingRef.current = null
    }
  }, [issueId, currentIssueId, setIssueId, setTitle, setContent, setSidebarQuotes])

  // --- 빈 상태일 때 초안 로드 ---
  useEffect(() => {
    if (issueId === currentIssueId && !content && !title && sidebarQuotes.length === 0) {
      loadDraft()
    }
    if (issueId === currentIssueId && draftImages.length === 0) {
      loadImages()
    }
  }, [issueId, currentIssueId, content, title, sidebarQuotes, draftImages.length, loadDraft, loadImages])

  // --- 에디터 DOM 동기화 ---
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const temporarySave = useCallback(async () => {
    console.log('--- [저장 단축키 트리거] ---')
    await saveDraft()
  }, [saveDraft])

  // --- 키보드 단축키 (Undo/Save) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      const key = e.key.toLowerCase();
      
      // Ctrl + S (저장)
      if (key === 's') {
        e.preventDefault();
        temporarySave();
      }
      
      // Ctrl + Z (타이핑 되돌리기)
      if (key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    // 브라우저 새로고침/닫기 시 자동 저장 시도
    const handleBeforeUnload = () => {
      if (isDirty) {
        saveDraft(); // 변경사항이 있다면 저장 처리
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [undo, temporarySave, isDirty, saveDraft]);

  // --- 저장 관련 ---
  const formatLastSaved = () => {
    if (!lastSaved) return '저장되지 않음'
    const date = new Date(lastSaved)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} 저장됨`
  }

  // --- 비교 모드 (Comparison Mode) 전환 ---
  const setComparisonLayout = useCallback((enable: boolean) => {
    if (enable) {
      setIsLeftSidebarOpen(false)
      setIsRightSidebarOpen(false)
    } else {
      setIsLeftSidebarOpen(true)
      setIsRightSidebarOpen(true)
    }
  }, [])

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
    draftImages,
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    setComparisonLayout,
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
    undoApply,
    navigate,
    isDirty,
    setIsDirty,
    blocker,
    temporarySave
  }
}
