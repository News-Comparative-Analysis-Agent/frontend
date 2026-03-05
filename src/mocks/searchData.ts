import { SearchIssue, MockNewsItem } from '../types';

export const searchIssues: SearchIssue[] = [
  {
    id: 1,
    title: '합당 추진 19일 만에 전격 중단 배경',
    description: "정청래 대표의 기습 합당 제안이 당내 거센 반발에 부딪혔습니다. 특히 '의원 패싱'과 당내 민주주의 훼손 논란이 불거지며 계파 갈등이 표면화되었습니다.",
    points: ['당내 민주주의 절차 무시 논란', '지방선거 전 합당 중지 결정'],
    coverage: 68,
    pattern: 'card-pattern-1'
  },
  {
    id: 2,
    title: '언론사별 시각차 : 리더십 vs 권력투쟁',
    description: '경향신문은 정 대표의 독단적 리더십을 비판한 반면, 조선일보 등 보수 언론은 이번 사태를 공천권과 당권을 둘러싼 여권 내부의 \'난투극\'으로 규정했습니다.',
    points: ['기술 주권 약화 우려 표명', '업계 공동 대응 기구 구성'],
    coverage: 28,
    pattern: 'card-pattern-2'
  },
  {
    id: 3,
    title: '지방선거 공천권 주도권 다툼 양상',
    description: '이번 합당 논란의 기저에는 내년 지방선거 공천권 확보를 위한 계파 간 치열한 셈법이 깔려 있습니다. 조국혁신당과의 합당이 기존 호남권 물갈이로 이어질 것을 우려한 현역 의원들의 집단 반발 체계.',
    points: ['호남 지역구 공천 지형 변화', '계파 간 공천 룰 줄다리기'],
    coverage: 52,
    pattern: 'card-pattern-3'
  },
  {
    id: 4,
    title: '중도층 이탈 우려와 지지율 변화 추이',
    description: "반복되는 야권 통합 논란이 중도 성향 지지층에게 '정치공학적 야합'으로 비춰질 우려가 커지고 있습니다. 최근 여론조사 지표를 바탕으로 합당 논란 전후의 지지율 변동폭을 짚어봅니다.",
    points: ['2030 세대 지지율 하락폭', '정치적 피로도 상승 지표'],
    coverage: 34,
    pattern: 'card-pattern-1'
  },
  {
    id: 5,
    title: '향후 야권 통합 시나리오 전망',
    description: "이번 논의는 중단되었지만, 대선을 앞둔 시점에서의 재추진 가능성은 여전히 열려 있습니다. '선거 연대' 방식의 느슨한 결합부터 '대선 후보 단일화'를 전제로 한 합당까지 전망합니다.",
    points: ['단계적 통합 로드맵 구상', '대선 승리 전략과의 연계성'],
    coverage: 27,
    pattern: 'card-pattern-2'
  }
];

export const searchNewsList: MockNewsItem[] = [
  { id: 1, media: '경향신문', time: '15분 전', title: '"명분 없는 합당은 독약"… 민주당 내 정청래 리더십 타격 불가피' },
  { id: 2, media: '조선일보', time: '32분 전', title: '야권 합당 소동의 본질은 \'공천 전쟁\'… 계파 간 이전투구 본격화' },
  { id: 3, media: '중앙일보', time: '48분 전', title: 'EU AI법 확정, 글로벌 표준될까? 국내 정치권도 기본법 제정 속도' },
  { id: 4, media: '디지털타임스', time: '1시간 전', title: '[분석] AI 가이드라인, 준수하지 못할 시 매출의 7% 과징금 리스크' },
  { id: 5, media: '한겨레', time: '2시간 전', title: '빅테크 규제 정점 찍은 EU AI법... "데이터 주권 회복의 시작"' }
];
