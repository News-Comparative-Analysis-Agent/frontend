import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDraftStore } from '../stores/useDraftStore'
import { fetchIssueDraft } from '../api/issues'
import { PreGeneratedDraft, SidebarQuote } from '../types/analysis'
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
    saveDraft, lastSaved, isDirty, setIsDirty
  } = useDraftStore()

  // --- 분리된 훅 조합 ---
  const { blocker } = useUnsavedChangesGuard(isDirty)
  const { panelWidth: chatbotWidth, isResizing, handleResizeStart: handleMouseDown } = usePanelResize()

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<string | null>(null)

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      if (newContent !== content) {
        setContent(newContent)
      }
    }
  }, [setContent, content])

  const {
    messages, inputMessage, setInputMessage, isChatLoading,
    chatEndRef, handleSendMessage, applyModifiedContent
  } = useDraftChat({ issueId, content, editorRef: editorRef as React.RefObject<HTMLDivElement>, setContent })

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
        setContent(safeHtml)
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    } finally {
      loadingRef.current = null
    }
  }, [issueId, setSidebarQuotes, setTitle, setContent])

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
  }, [issueId, currentIssueId, content, title, sidebarQuotes, loadDraft])

  // --- 에디터 DOM 동기화 ---
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // --- 저장 관련 ---
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
