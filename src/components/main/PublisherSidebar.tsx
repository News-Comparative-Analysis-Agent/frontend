import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublisherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allPublishers: string[];
  selectedMedia: string[];
  handleMediaChange: (media: string) => void;
}

// 초성 추출 함수
const getInitialConsonant = (text: string) => {
  const code = text.charCodeAt(0) - 0xAC00;
  if (code > -1 && code < 11172) {
    const list = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    return list[Math.floor(code / 588)];
  }
  return text.charAt(0).toUpperCase();
};

const PublisherSidebar = ({
  isOpen,
  onClose,
  allPublishers,
  selectedMedia,
  handleMediaChange,
}: PublisherSidebarProps) => {
  // ESC 키로 닫기 기능 추가
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 언론사 그룹화 (초성 기준)
  const groupedPublishers = allPublishers.reduce((acc, pub) => {
    const initial = getInitialConsonant(pub);
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(pub);
    return acc;
  }, {} as Record<string, string[]>);

  // 초성 순서 정렬
  const sortedInitials = Object.keys(groupedPublishers).sort((a, b) => {
    if (a.match(/[ㄱ-ㅎ]/) && b.match(/[A-Z]/)) return -1;
    if (a.match(/[A-Z]/) && b.match(/[ㄱ-ㅎ]/)) return 1;
    return a.localeCompare(b);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 상단 드롭다운 본체 (최대한 세로로 작게 구성) */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-14 xl:top-16 left-0 w-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] z-[90] border-b border-slate-200 rounded-b-[20px] flex flex-col pt-4 pb-4 px-6 xl:px-12"
          >
            <div className="max-w-[1440px] mx-auto w-full">
              {/* 헤더 영역: 타이틀과 전체선택을 한 줄에 배치 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-6 bg-primary rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-white">tune</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-800 tracking-tight leading-none">언론사 필터</h3>
                  </div>
                  
                  <div className="h-4 w-px bg-slate-200 mx-1"></div>

                  <div className="flex items-center gap-2.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200/60 cursor-pointer group hover:bg-slate-100 transition-colors" onClick={() => handleMediaChange('전체')}>
                    <span className="text-[12px] font-bold text-slate-600">전체 언론사 선택</span>
                    <div className={`size-4 rounded border-2 transition-all flex items-center justify-center ${
                      selectedMedia.length === allPublishers.length 
                        ? 'bg-primary border-primary' 
                        : 'bg-white border-slate-300'
                    }`}>
                      {selectedMedia.length === allPublishers.length && (
                        <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="size-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* 그리드 영역: 세로 구분선 추가로 다단 가독성 극대화 */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[42vh]">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-8 py-2">
                  {sortedInitials.map((initial, index) => (
                    <div 
                      key={initial} 
                      className={`space-y-2 px-4 border-r border-slate-100 last:border-r-0
                        ${(index + 1) % 2 === 0 ? 'border-r-0' : ''} 
                        md:${(index + 1) % 2 === 0 ? 'border-r' : ''} 
                        md:${(index + 1) % 4 === 0 ? 'border-r-0' : ''}
                        lg:${(index + 1) % 4 === 0 ? 'border-r' : ''}
                        lg:${(index + 1) % 6 === 0 ? 'border-r-0' : ''}
                        xl:${(index + 1) % 6 === 0 ? 'border-r' : ''}
                        xl:${(index + 1) % 8 === 0 ? 'border-r-0' : ''}
                      `}
                    >
                      {/* 초성 강조 배지 - 부드러운 컬러로 변경 */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex items-center justify-center size-5 bg-primary/10 text-primary text-[11px] font-black rounded-md">{initial}</span>
                        <div className="h-px flex-1 bg-slate-100"></div>
                      </div>
                      <div className="space-y-1">
                        {groupedPublishers[initial].map(pub => (
                          <div 
                            key={pub}
                            onClick={() => handleMediaChange(pub)}
                            className="flex items-center justify-between py-1 cursor-pointer group hover:bg-slate-50/80 px-1 rounded transition-colors"
                          >
                            <span className={`text-[12px] transition-colors ${
                              selectedMedia.includes(pub) ? 'font-bold text-slate-900' : 'text-slate-500 font-medium group-hover:text-slate-800'
                            }`}>
                              {pub}
                            </span>
                            <div className={`size-3.5 rounded border transition-all flex items-center justify-center ${
                              selectedMedia.includes(pub) 
                                ? 'bg-primary border-primary' 
                                : 'bg-white border-slate-200 group-hover:border-slate-300'
                            }`}>
                              {selectedMedia.includes(pub) && (
                                <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 푸터 영역: 버튼 크기 줄이고 우측 정렬 */}
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-1.5 bg-primary text-white shadow-sm rounded-lg font-bold text-[12px] tracking-tight hover:bg-primary/90 transition-all"
                >
                  적용하기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PublisherSidebar;
