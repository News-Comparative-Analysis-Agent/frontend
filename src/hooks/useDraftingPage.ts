import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDraftStore } from '../stores/useDraftStore'
import { fetchIssueDraft, fetchDraftImages, fetchDraftCitations } from '../api/issues'
import { PreGeneratedDraft, SidebarQuote, DraftImage, CitationItem } from '../types/analysis'
import { buildMediaColorMap } from '../utils/mediaColors'
import { buildDraftHtml, sanitizeDraftHtml } from '../utils/buildDraftHtml'

import { useUnsavedChangesGuard } from './useUnsavedChangesGuard'
import { usePanelResize } from './usePanelResize'
import { useDraftChat } from './useDraftChat'
import { useEditorDragDrop } from './useEditorDragDrop'

export const useDraftingPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'

  const {
    currentIssueId, title, content, sidebarQuotes, citations,
    setIssueId, setTitle, setContent, setSidebarQuotes, setCitations,
    saveDraft, lastSaved, isDirty, setIsDirty, isSaving,
    undo, redo, pushHistory, setPreviewMode,
    previewContent, setPreviewContent, isPreviewMode // 💡 하단에서 위로 끌어올림
  } = useDraftStore()

  // --- 분리된 훅 조합 ---
  const { blocker } = useUnsavedChangesGuard(isDirty)
  const { panelWidth: chatbotWidth, isResizing, handleResizeStart: handleMouseDown } = usePanelResize()

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [draftImages, setDraftImages] = useState<DraftImage[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<string | null>(null)
  const hasLoadedRef = useRef(false) // 이슈별 로딩 완료 여부 추적
  const historyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 수동 입력 시: 상태는 즉시 업데이트, 히스토리는 1초간 멈췄을 때만 기록 (단축키용)
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      
      if (isPreviewMode) {
        if (newHtml !== previewContent) {
          setPreviewContent(newHtml);
        }
      } else {
        if (newHtml !== content) {
          // 💡 입력 시작 시점에 이전 상태를 한 번 기록 (연속 입력은 하나의 히스토리로 취급)
          if (!historyTimeoutRef.current) {
            pushHistory(content);
          }
          
          setContent(newHtml);
          
          if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current)
          historyTimeoutRef.current = setTimeout(() => {
            historyTimeoutRef.current = null; // 1.2초 후 타이머 해제
          }, 1200)
        }
      }
    }
  }, [setContent, setPreviewContent, content, previewContent, isPreviewMode, pushHistory])

  const {
    messages, inputMessage, setInputMessage, isChatLoading,
    chatEndRef, handleSendMessage, applySuggestion, cancelSuggestion, undoSuggestion
  } = useDraftChat({ 
    issueId, 
    content, 
    editorRef: editorRef as React.RefObject<HTMLDivElement>, 
    setContent,
    previewContent, // 💡 임시 저장소 전달
    setPreviewContent, // 💡 임시 저장소 제어 함수 전달
    setPreviewMode,
    pushHistory,
    undo,
    mediaNames: sidebarQuotes.map(q => q.media) // 💡 언론사 목록 전달
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
      let draft: any = null
      let parsedSuccessfully = false

      if (data.pre_generated_draft) {
        if (typeof data.pre_generated_draft === 'string') {
          // JSON 형태인지만 먼저 가볍게 체크
          const trimmed = data.pre_generated_draft.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
              draft = JSON.parse(data.pre_generated_draft);
              parsedSuccessfully = true;
            } catch (e) {
              console.warn('Draft looks like JSON but parsing failed, treating as plain text.');
              draft = data.pre_generated_draft;
            }
          } else {
            // 명백한 평문 문자열
            draft = data.pre_generated_draft;
          }
        } else {
          // 이미 객체 형태인 경우
          draft = data.pre_generated_draft;
          parsedSuccessfully = true;
        }
      }

      // 미디어 컬러맵 구축을 위한 미디어 목록 수집
      const allMediaFromCards = cards.map(c => c.press);
      const allMediaFromDraft = parsedSuccessfully && draft ? [
        ...(draft.media_views?.map((v: any) => v.press) || []),
        ...((draft.sections || draft.contentions || []).flatMap((c: any) => c.media_views?.map((v: any) => v.press || '')) || [])
      ] : [];
      
      const allMedia = Array.from(new Set([...allMediaFromCards, ...allMediaFromDraft])).filter(Boolean);
      const mediaColorMap = buildMediaColorMap(allMedia)

      const mappedQuotes: SidebarQuote[] = cards.map((card) => {
        const scheme = mediaColorMap[card.press] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' }
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

      try {
        const citData = await fetchDraftCitations(issueId)
        if (citData && citData.article_body) {
          // 서버에서 마커([1])가 찍힌 본문을 보내주면 가공하여 사용
          const safeHtml = sanitizeDraftHtml(citData.article_body, allMedia);
          
          setTitle(citData.title || '') // 💡 제목 설정 추가
          setContent(safeHtml, true)
          setCitations(citData.citations || [])
          console.log(`📎 Citation API 연동 완료: ${citData.citations?.length}개 마커 발견`)
        }
      } catch (citError) {
        console.warn('Citation API failed, falling back to original draft loading:', citError)
        // 실패 시 기존 로직(buildDraftHtml)으로 제목 및 본문 설정 (이미 위에서 수행됨)
        if (draft) {
          setTitle(draft.title || data.name || '')
          const safeHtml = buildDraftHtml(draft, mediaColorMap)
          setContent(safeHtml, true)
        } else {
          setTitle(data.name || '')
          setContent('<p class="text-slate-400">생성된 초안 내용이 없습니다.</p>', true)
        }
      }

    } catch (e) {
      console.error('Failed to load draft:', e)
    } finally {
      loadingRef.current = null
      setIsDirty(false) // 로딩 완료 후 최종적으로 수정되지 않은 상태로 설정
    }
  }, [issueId, setSidebarQuotes, setCitations, setTitle, setContent, setIsDirty])
  
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
      hasLoadedRef.current = false // 이슈 바뀌면 로딩 플래그 초기화
    }
  }, [issueId, currentIssueId, setIssueId, setTitle, setContent, setSidebarQuotes])

  // --- 빈 상태일 때 초안 로드 (이슈당 1회만 실행) ---
  useEffect(() => {
    if (issueId === currentIssueId && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      loadDraft()
    }
    if (issueId === currentIssueId && draftImages.length === 0) {
      loadImages()
    }
  }, [issueId, currentIssueId, draftImages.length, loadDraft, loadImages])

  // --- 💡 고도화된 반응형 사이드바 자동 수납 (사용자 수동 조작 보호 버전) ---
  const prevWidthRef = useRef(window.innerWidth);

  // 1. 초기 로드 시에만 현재 너비에 맞춰 자동 설정 (1회)
  useEffect(() => {
    if (window.innerWidth < 1200) setIsLeftSidebarOpen(false);
    if (window.innerWidth < 1050) setIsRightSidebarOpen(false);
  }, []); // 의존성 배열을 비워서 최초 로드 시에만 실행

  // 2. 창 크기가 실제로 "변경"될 때만 자동 수납 동작 (수동 열기 차단 방지)
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;

      // 특정 임계값을 "넘어가는 순간"에만 자동으로 닫음
      if (prevWidth >= 1200 && currentWidth < 1200) {
        setIsLeftSidebarOpen(false);
      }
      
      if (prevWidth >= 1050 && currentWidth < 1050) {
        setIsRightSidebarOpen(false);
      }

      prevWidthRef.current = currentWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsLeftSidebarOpen, setIsRightSidebarOpen]);

  // --- 에디터 DOM 동기화 ---
  useEffect(() => {
    if (editorRef.current) {
      // 💡 프리뷰 모드면 previewContent를, 아니면 일반 content를 보여줌
      const displayContent = isPreviewMode ? (previewContent || '') : (content || '');
      if (editorRef.current.innerHTML !== displayContent) {
        editorRef.current.innerHTML = displayContent;
      }
    }
  }, [content, previewContent, isPreviewMode])

  const temporarySave = useCallback(async () => {
    console.log('--- [저장 버튼 트리거] ---')
    await saveDraft()
  }, [saveDraft])

  // --- historyTimeoutRef 언마운트 cleanup ---
  useEffect(() => {
    return () => {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    };
  }, []);

  // --- 키보드 단축키 (Undo/Redo/Save) ---
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
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl + Y 또는 Ctrl + Shift + Z (다시 실행)
      if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, temporarySave]);

  // --- 저장 관련 ---
  const formatLastSaved = () => {
    if (!lastSaved) return '저장되지 않음'
    const date = new Date(lastSaved)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} 저장됨`
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
    citations,
    lastSaved,
    isSaving,
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
    applySuggestion,
    cancelSuggestion, // 💡 신규 추가
    undoSuggestion,
    undo,
    redo,
    navigate,
    isDirty,
    setIsDirty,
    blocker,
    temporarySave
  }
}
