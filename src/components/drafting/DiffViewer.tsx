import React, { useMemo } from 'react';
import { generateDiff } from '../../utils/diffText';

interface DiffViewerProps {
  originalText: string;
  modifiedText: string;
  className?: string;
}

/**
 * 원문과 수정본의 차이를 시각적으로 보여주는 컴포넌트입니다.
 * - 삭제된 내용은 빨간색 취소선으로 표시
 * - 추가된 내용은 초록색 하이라이트로 표시
 */
const DiffViewer: React.FC<DiffViewerProps> = ({ originalText, modifiedText, className = '' }) => {
  const diffParts = useMemo(() => generateDiff(originalText, modifiedText), [originalText, modifiedText]);

  return (
    <div className={`leading-relaxed break-keep whitespace-pre-wrap text-[14px] ${className}`}>
      {diffParts.map((part, index) => {
        if (part.removed) {
          return (
            <span 
              key={index} 
              className="bg-red-50 text-red-600 line-through decoration-red-300 px-0.5 rounded-sm mx-0.5"
              title="삭제된 내용"
            >
              {part.value}
            </span>
          );
        }
        
        if (part.added) {
          return (
            <span 
              key={index} 
              className="bg-green-50 text-green-700 font-medium px-0.5 rounded-sm mx-0.5"
              title="새로 추가된 내용"
            >
              {part.value}
            </span>
          );
        }

        return <span key={index} className="text-slate-700">{part.value}</span>;
      })}
    </div>
  );
};

export default DiffViewer;
