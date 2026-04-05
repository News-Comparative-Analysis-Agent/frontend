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
  content: '안녕하세요!\n기사 작성을 돕는 AI 챗봇입니다.\n다음과 같은 작업을 요청하실 수 있습니다:\n\n• 문장 교정: 맞춤법 검사 및 비문/오탈자 정밀 수정\n• 분량 조절: 특정 자수나 문단 길이에 맞춘 내용 최적화\n• 스타일 전환: 스트레이트, 사설, 기획 기사 등 톤 변경\n• 헤드라인 추천: 클릭을 유도하는 매력적인 제목 제안\n• 데이터 요약: 복잡한 원문 내용을 핵심 한 줄로 브리핑\n\n무엇을 도와드릴까요? 아래 입력창에 내용을 적어주세요!',
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
        messages: currentMessages.map((msg, idx) => {
          // 마지막 질문(사용자 메시지)에 현재 본문 컨텍스트를 강력하게 주입하여 AI가 인지하게 함
          if (idx === currentMessages.length - 1 && msg.role === 'user') {
            return {
              role: 'user',
              content: `### 현재 기사 초안 상태 ###\n${realTimeContent}\n\n### 기자의 요청 ###\n${msg.content}`
            };
          }
          return { role: msg.role, content: msg.content };
        }),
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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    chatEndRef,
    handleSendMessage
  }
}
