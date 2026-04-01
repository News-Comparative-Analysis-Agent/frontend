import { useState, useRef, useEffect, useCallback, RefObject } from 'react'
import { chatWithAI } from '../api/drafting'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  modifiedContent?: string
  isApplied?: boolean
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'ai',
  content: '안녕하세요! 기사의 문장력을 높이거나 특정 논조를 강화하고 싶으시면 말씀해주세요.',
}

interface UseDraftChatOptions {
  issueId: string
  content: string
  editorRef: RefObject<HTMLDivElement>
  setContent: (content: string) => void
  pushHistory: () => void
  undo: () => void
}

/**
 * AI 챗봇과의 대화 상태 및 액션을 관리하는 훅입니다.
 */
export const useDraftChat = ({
  issueId,
  content,
  editorRef,
  setContent,
  pushHistory,
  undo: storeUndo
}: UseDraftChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [inputMessage, setInputMessage] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isChatLoading) return

    const userMsg = inputMessage.trim()
    setInputMessage('')
    
    // 현재 메시지 목록을 상태에서 직접 가져옴 (클로저 문제 해결을 위해 최신값 보장)
    const currentMessages: ChatMessage[] = [...messages, { role: 'user' as const, content: userMsg }]
    setMessages(currentMessages)
    setIsChatLoading(true)

    try {
      // 실시간 에디터 내용 확보 (React 상태 지연 대비 강제 동기화)
      const realTimeContent = editorRef.current?.innerHTML || content;

      const response = await chatWithAI({
        messages: currentMessages.map(({ role, content }) => ({ role, content })),
        current_content: realTimeContent,
        issue_id: Number(issueId),
      })

      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.response,
        modifiedContent: response.modified_content,
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '죄송합니다. 서버와 통신 중 오류가 발생했습니다.',
      }])
    } finally {
      setIsChatLoading(false)
    }
  }, [inputMessage, isChatLoading, content, issueId, messages, editorRef])

  const applyModifiedContent = useCallback((modifiedContent: string, index: number) => {
    if (editorRef.current) {
      // 1. 반영 전 현재 상태를 히스토리에 기록
      pushHistory()
      
      // 2. 본문에 내용 반영
      editorRef.current.innerHTML = modifiedContent
      setContent(modifiedContent)

      // 3. 해당 메시지를 '반영됨' 상태로 변경
      setMessages(prev => prev.map((msg, i) => 
        i === index ? { ...msg, isApplied: true } : msg
      ))
    }
  }, [editorRef, setContent, pushHistory])

  const undoApply = useCallback((index: number) => {
    // 1. 스토어의 전체 Undo 실행 (직전에 pushHistory 했으므로 정확히 그 시점으로 복구됨)
    storeUndo()

    // 2. 해당 메시지를 '미반영' 상태로 복구
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isApplied: false } : msg
    ))
  }, [storeUndo])

  return {
    messages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    chatEndRef,
    handleSendMessage,
    applyModifiedContent,
    undoApply
  }
}
