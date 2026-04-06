import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * 미저장 변경사항이 있을 때 페이지 이탈을 방지하는 훅입니다.
 * - 브라우저 새로고침/닫기: beforeunload 이벤트로 차단
 * - 내부 라우팅: react-router useBlocker로 차단
 */
export const useUnsavedChangesGuard = (isDirty: boolean) => {
  // 브라우저 새로고침/닫기 방지 (변경사항 발생 시에만)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // 💡 표준에 따라 returnValue를 설정해야 브라우저의 이탈 방지 대화 상자가 나타남
        e.returnValue = '작성 중인 내용이 있습니다. 저장하지 않고 나갈까요?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 내부 라우팅 차단 (SPA 내부 이동 시)
  const blocker = useBlocker(({ nextLocation }) => {
    return isDirty && !nextLocation.pathname.startsWith('/drafting')
  })

  return { blocker }
}
