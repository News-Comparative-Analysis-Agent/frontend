import { useState, useRef, useEffect, useCallback, RefObject } from 'react'
import { chatWithAI } from '../api/drafting'
import { applyMediaBolding } from '../utils/mediaBolding'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  modifiedContent?: string
  originalContent?: string // 💡 제안 당시의 원본 본문 (대조용)
  isApplied?: boolean
  isCancelled?: boolean // 💡 사용자가 제안을 명시적으로 취소했는지 여부
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'ai',
  content: '안녕하세요!\n기사 작성을 돕는 AI 챗봇입니다.\n다음과 같은 작업을 요청하실 수 있습니다:\n\n• 문장 교정: 맞춤법 검사 및 비문/오탈자 정밀 수정\n• 분량 조절: 특정 자수나 문단 길이에 맞춘 내용 최적화\n• 스타일 전환: 스트레이트, 사설, 기획 기사 등 톤 변경\n• 헤드라인 추천: 클릭을 유도하는 매력적인 제목 제안\n• 데이터 요약: 복잡한 원문 내용을 핵심 한 줄로 브리핑\n\n무엇을 도와드릴까요? 아래 입력창에 내용을 적어주세요!',
}

interface UseDraftChatOptions {
  issueId: string
  content: string
  editorRef: RefObject<HTMLDivElement>
  setContent: (content: string, skipDirty?: boolean) => void
  previewContent: string | null
  setPreviewContent: (content: string | null) => void
  setPreviewMode: (val: boolean) => void
  pushHistory: () => void
  undo: () => void
  mediaNames?: string[] // 💡 추가
}

/**
 * AI 챗봇과의 대화 상태 및 액션을 관리하는 훅입니다.
 */
export const useDraftChat = ({
  issueId,
  content: realContent,
  editorRef,
  setContent,
  previewContent,
  setPreviewContent,
  setPreviewMode,
  pushHistory,
  undo: storeUndo,
  mediaNames = [] // 💡 기본값 빈 배열
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
    
    // 사용자 메시지에도 언론사 볼드 처리 적용
    const boldedUserMsg = applyMediaBolding(userMsg, mediaNames);
    
    // 현재 메시지 목록을 상태에서 직접 가져옴 (클로저 문제 해결을 위해 최신값 보장)
    const currentMessages: ChatMessage[] = [...messages, { role: 'user' as const, content: boldedUserMsg }]
    setMessages(currentMessages)
    setIsChatLoading(true)

    // 실시간 에디터 내용 확보 (AI 요청 전 최신 상태 확보)
    const realTimeContent = editorRef.current?.innerHTML || realContent;

    try {

      const response = await chatWithAI({
        messages: currentMessages.map((msg, idx) => {
          // 마지막 질문(사용자 메시지)에 현재 본문 컨텍스트를 강력하게 주입하여 AI가 인지하게 함
          if (idx === currentMessages.length - 1 && msg.role === 'user') {
            return {
              role: 'user',
              content: `### 현재 기사 초안 상태 ###\n${realTimeContent}\n\n### 기자의 요청 ###\n${msg.content}\n\n(※ 중요: 답변 시 'modified_content'와 같은 기술 용어는 생략하고 자연스럽게 전문가처럼 답변해 주세요.)`
            };
          }
          return { role: msg.role, content: msg.content };
        }),
        current_content: realTimeContent,
        issue_id: Number(issueId),
      })

      let aiMsgContent = response.response;
      const aiModifiedContent = response.modified_content;

      // 💡 [AI 말실수 교정] 기술 용어가 포함된 경우 자연스러운 표현으로 치환
      if (aiMsgContent) {
        aiMsgContent = aiMsgContent
          .replace(/`modified_content`/g, '수정 제안')
          .replace(/modified_content/g, '수정 제안')
          .replace(/`original_content`/g, '원본 내용')
          .replace(/original_content/g, '원본 내용')
          .replace(/JSON/g, '항목')
          .replace(/필드/g, '부분');
      }

      // 💡 [2단계 확장] 본문 실시간 프리뷰 주입 (실제 본문 보존)
      if (aiModifiedContent) {
        import('../utils/diffUtils').then(({ generateFullDiffHtml }) => {
          // AI가 제안한 내용에도 언론사 이름이 있다면 볼드 처리 적용
          const boldedModifiedContent = applyMediaBolding(aiModifiedContent, mediaNames);
          
          const fullDiffHtml = generateFullDiffHtml(realContent, boldedModifiedContent);
          setPreviewContent(fullDiffHtml); // 💡 임시 저장소에만 주입
          setPreviewMode(true); // 에디터 프리뷰 모드 활성화

          // 메시지 목록 업데이트 시에도 볼드 처리된 내용을 저장하여 적용 시 반영되도록 함
          const boldedMsgContent = applyMediaBolding(aiMsgContent || '수정 제안을 생성했습니다. 아래 대조창에서 확인해 보세요.', mediaNames);
          
          setMessages(prev => [...prev, {
            role: 'ai',
            content: boldedMsgContent,
            modifiedContent: boldedModifiedContent,
            originalContent: realTimeContent,
            isApplied: false
          }])
        }).catch(err => console.error('Diff Preview Error:', err));
      } else {
        const boldedMsgContent = applyMediaBolding(aiMsgContent || '응답을 생성했습니다.', mediaNames);
        setMessages(prev => [...prev, {
          role: 'ai',
          content: boldedMsgContent,
          isApplied: false
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '죄송합니다. 서버와 통신 중 오류가 발생했습니다.',
      }])
    } finally {
      setIsChatLoading(false)
    }
  }, [inputMessage, isChatLoading, realContent, issueId, messages, editorRef, mediaNames])

  // AI의 수정 제안을 수동으로 에디터에 반영 (지능형 태그 세척 포함)
  const applySuggestion = useCallback((index: number) => {
    const msg = messages[index];
    if (msg?.role === 'ai') {
      pushHistory(); // Undo 스냅샷 저장

      // 💡 [지능형 태그 세척] 사용자가 하이라이트 상태에서 수정한 내용을 반영하기 위해 에디터에서 직접 읽어옴
      if (editorRef.current) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorRef.current.innerHTML;

        // 1. 빨간색 하이라이트(삭제 예정) 요소들 제거
        const removedSpans = tempDiv.querySelectorAll('.bg-rose-100');
        removedSpans.forEach(span => span.remove());

        // 2. 초록색 하이라이트(추가) 태그 제거 (글자만 남김)
        const addedSpans = tempDiv.querySelectorAll('.bg-emerald-100');
        addedSpans.forEach(span => {
          const text = span.textContent || '';
          span.replaceWith(text);
        });

        // 3. 태그 세척 과정에서 사라졌을 수 있는 언론사 볼드 처리 재적용
        const cleanedHtml = tempDiv.innerHTML;
        const reBoldedHtml = applyMediaBolding(cleanedHtml, mediaNames);

        // 4. 최종 정제된 내용을 본문에 주입 및 프리뷰 종료
        setContent(reBoldedHtml);
        setPreviewContent(null);
        setPreviewMode(false);
      } else if (msg.modifiedContent) {
        setContent(msg.modifiedContent);
        setPreviewContent(null);
        setPreviewMode(false);
      }

      // 해당 메시지의 반영 상태 업데이트
      const newMessages = [...messages];
      newMessages[index] = { ...msg, isApplied: true };
      setMessages(newMessages);
    }
  }, [messages, setContent, setPreviewContent, setPreviewMode, pushHistory, editorRef]);

  // 프리뷰 상태를 취소하고 원래 본문으로 복구 (카드는 유지)
  const cancelSuggestion = useCallback((index: number) => {
    setPreviewContent(null); // 💡 임시 하이라이트 컨텐츠만 비움
    setPreviewMode(false); // 💡 프리뷰 모드 종료

    // 💡 해당 메시지의 취소 상태 업데이트
    const newMessages = [...messages];
    if (newMessages[index]) {
      newMessages[index] = { ...newMessages[index], isCancelled: true, isApplied: false };
      setMessages(newMessages);
    }
  }, [messages, setPreviewContent, setPreviewMode]);

  // 반영된 수정 제안을 취소하고 이전으로 되돌림
  const undoSuggestion = useCallback((index: number) => {
    const msg = messages[index];
    if (msg?.role === 'ai' && msg.isApplied) {
      setPreviewContent(null);
      setPreviewMode(false);
      storeUndo(); // 스토어의 Undo 실행

      // 해당 메시지의 반영 상태 해제
      const newMessages = [...messages];
      newMessages[index] = { ...msg, isApplied: false };
      setMessages(newMessages);
    }
  }, [messages, storeUndo, setPreviewContent, setPreviewMode]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    chatEndRef,
    handleSendMessage,
    applySuggestion,
    cancelSuggestion, // 💡 신규 추가
    undoSuggestion
  }
}
