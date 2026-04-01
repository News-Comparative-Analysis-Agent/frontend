import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * 미저장 변경사항이 있을 때 페이지 이탈을 방지하는 훅입니다.
 * - 브라우저 새로고침/닫기: beforeunload 이벤트로 차단
 * - 내부 라우팅: react-router useBlocker로 차단
 */
export const useUnsavedChangesGuard = (isDirty: boolean) => {
  // 브라우저 새로고침/닫기 방지는 사용자 요청으로 제거 (커스텀 버튼 표시 불가 문제)

  // 내부 라우팅 차단
  const blocker = useBlocker(({ nextLocation }) => {
    return isDirty && !nextLocation.pathname.startsWith('/drafting')
  })

  return { blocker }
}
