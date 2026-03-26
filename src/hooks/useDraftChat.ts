import { useState, useRef, useEffect, useCallback, RefObject } from 'react'
import { chatWithAI } from '../api/drafting'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  modifiedContent?: string
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
}

/**
 * AI 챗봇과의 대화 상태 및 액션을 관리하는 훅입니다.
 */
export const useDraftChat = ({
  issueId,
  content,
  editorRef,
  setContent,
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
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsChatLoading(true)

    try {
      const response = await chatWithAI({
        message: userMsg,
        current_content: content,
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
  }, [inputMessage, isChatLoading, content, issueId])

  const applyModifiedContent = useCallback((modifiedContent: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = modifiedContent
      setContent(modifiedContent)
    }
  }, [editorRef, setContent])

  return {
    messages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    chatEndRef,
    handleSendMessage,
    applyModifiedContent,
  }
}
