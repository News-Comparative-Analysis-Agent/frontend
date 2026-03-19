/**
 * 언론사별 색상 매핑 유틸리티입니다.
 * AnalysisPage와 DraftingPage 등 여러 곳에서 공통으로 사용됩니다.
 */

export const MEDIA_COLOR_SCHEMES = [
  { key: 'indigo'  as const, bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200',  hl: 'hl-indigo'  },
  { key: 'violet'  as const, bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  hl: 'hl-violet'  },
  { key: 'emerald' as const, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hl: 'hl-emerald' },
  { key: 'cyan'    as const, bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200',    hl: 'hl-cyan'    },
  { key: 'slate'   as const, bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-300',   hl: 'hl-slate'   },
] as const;

export type MediaColorScheme = typeof MEDIA_COLOR_SCHEMES[number];

/** 색상 key만 추출한 배열 (OpinionCard 등에서 사용) */
export const COLOR_KEYS = MEDIA_COLOR_SCHEMES.map(s => s.key);
export type ColorKey = typeof COLOR_KEYS[number];

/**
 * 언론사 이름 목록을 받아 각 언론사에 고유한 색상 스킴을 배정한 맵을 반환합니다.
 * 동일 세션 내에서 같은 언론사는 항상 같은 색상을 유지합니다.
 */
export function buildMediaColorMap(mediaNames: string[]): Record<string, MediaColorScheme> {
  const map: Record<string, MediaColorScheme> = {};
  const unique = Array.from(new Set(mediaNames));
  unique.forEach((name, idx) => {
    map[name] = MEDIA_COLOR_SCHEMES[idx % MEDIA_COLOR_SCHEMES.length];
  });
  return map;
}

/**
 * 단일 인덱스 기반 색상 key를 반환합니다. (AnalysisPage 등에서 사용)
 */
export function getColorKeyByIndex(idx: number): ColorKey {
  return COLOR_KEYS[idx % COLOR_KEYS.length];
}
