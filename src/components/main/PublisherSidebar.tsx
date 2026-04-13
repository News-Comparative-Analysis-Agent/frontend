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
          {/* 사이드바 본체 (배경 어둡게 하지 않음) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[320px] bg-white/95 backdrop-blur-md shadow-[20px_0_50px_rgba(0,0,0,0.1)] z-[100] border-r border-slate-100 flex flex-col pt-24 pb-12 px-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">언론사 필터</h3>
              <button 
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-8">
                {/* '전체' 선택 섹션 */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer" onClick={() => handleMediaChange('전체')}>
                  <span className="text-sm font-bold text-slate-700">전체 언론사 선택</span>
                  <div className={`size-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    selectedMedia.length === allPublishers.length 
                      ? 'bg-primary border-primary' 
                      : 'bg-white border-slate-300'
                  }`}>
                    {selectedMedia.length === allPublishers.length && (
                      <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                    )}
                  </div>
                </div>

                {/* 초성 그룹별 리스트 */}
                {sortedInitials.map(initial => (
                  <div key={initial} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-primary/40 w-5">{initial}</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 pl-5">
                      {groupedPublishers[initial].map(pub => (
                        <div 
                          key={pub}
                          onClick={() => handleMediaChange(pub)}
                          className="flex items-center justify-between py-2 cursor-pointer group"
                        >
                          <span className={`text-[14px] transition-colors ${
                            selectedMedia.includes(pub) ? 'font-bold text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                          }`}>
                            {pub}
                          </span>
                          <div className={`size-4 rounded border transition-all flex items-center justify-center ${
                            selectedMedia.includes(pub) 
                              ? 'bg-primary border-primary' 
                              : 'bg-white border-slate-200 group-hover:border-slate-300'
                          }`}>
                            {selectedMedia.includes(pub) && (
                              <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
            >
              선택 완료
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PublisherSidebar;
