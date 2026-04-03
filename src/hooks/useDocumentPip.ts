import { useState, useCallback, useEffect } from 'react';

/**
 * 전역 스타일 시트를 다른 문서(PiP 창)로 복사하는 함수입니다.
 */
const copyStyles = (targetDoc: Document) => {
  const allStyleSheets = Array.from(document.styleSheets);
  
  allStyleSheets.forEach((styleSheet) => {
    try {
      if (styleSheet.cssRules) {
        const newStyle = targetDoc.createElement('style');
        Array.from(styleSheet.cssRules).forEach((rule) => {
          newStyle.appendChild(targetDoc.createTextNode(rule.cssText));
        });
        targetDoc.head.appendChild(newStyle);
      } else if (styleSheet.href) {
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      }
    } catch (e) {
      // CORS 문제로 접근할 수 없는 스타일 시트(예: Google Fonts)는 링크로 처리
      if (styleSheet.href) {
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      }
    }
  });

  // Material Symbols 아이콘 등 구글 폰트 추가 명시 (폰트 누락 방지)
  const materialSymbols = document.querySelector('link[href*="material-symbols-outlined"]');
  if (materialSymbols) {
    targetDoc.head.appendChild(materialSymbols.cloneNode(true));
  }
};

interface UseDocumentPipProps {
  onClose?: () => void;
}

export const useDocumentPip = ({ onClose }: UseDocumentPipProps = {}) => {
  const [pipWindow, setPipWindow] = useState<any>(null);

  const requestPip = useCallback(async (width = 750, height = 850) => {
    // API 지원 여부 확인
    if (!('documentPictureInPicture' in window)) {
      alert('사용 중인 브라우저는 "항상 위" 플로팅 에디터 기능을 지원하지 않습니다. (최신 크롬/엣지 브라우저 권장)');
      return;
    }

    try {
      // 1. PiP 창 열기
      // @ts-ignore
      const windowInstance = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

      // 2. 스타일 복사
      copyStyles(windowInstance.document);

      // 3. 창 닫힘 이벤트 처리
      windowInstance.addEventListener('pagehide', () => {
        setPipWindow(null);
        if (onClose) onClose();
      });

      setPipWindow(windowInstance);
    } catch (error) {
      console.error('Failed to open PiP window:', error);
    }
  }, [onClose]);

  const closePip = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  // 부모 창이 닫히면 PiP 창도 같이 닫기
  useEffect(() => {
    return () => {
      if (pipWindow) pipWindow.close();
    };
  }, [pipWindow]);

  return {
    pipWindow,
    requestPip,
    closePip,
    isPipActive: !!pipWindow,
  };
};
