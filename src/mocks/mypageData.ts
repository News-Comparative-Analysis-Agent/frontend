export interface ScrapedArticle {
  id: number;
  category: string;
  categoryColor: 'primary' | 'blue';
  scrapDate: string;
  title: string;
  summary: string;
}

export const scrapedArticles: ScrapedArticle[] = [
  {
    id: 1,
    category: '정치',
    categoryColor: 'primary',
    scrapDate: '2024.03.22',
    title: '제22대 국회의원 선거 사전투표 안내 및 주요 정당별 핵심 공약 비교',
    summary: '오는 4월 10일 실시되는 제22대 국회의원 선거를 앞두고 사전투표 일정과 방법, 그리고 각 정당이 내세운 10대 핵심 공약을 분석했습니다. 유권자들이 주목해야 할 경제, 복지, 외교 분야의 차이점을 중점적으로 다룹니다.'
  },
  {
    id: 2,
    category: '경제',
    categoryColor: 'blue',
    scrapDate: '2024.03.21',
    title: '금리 동결 이후 시장 반응과 부동산 시장 전망 보고서',
    summary: '한국은행의 기준금리 동결 결정 이후 금융 시장의 자금 흐름 변화를 추적했습니다. 전문가들은 당분간 금리 인하 시점이 늦춰질 것으로 예상하며, 대출 금리 변동에 따른 부동산 시장의 매수 심리 변화를 경고하고 있습니다.'
  },
  {
    id: 3,
    category: '기술',
    categoryColor: 'blue',
    scrapDate: '2024.03.20',
    title: '생성형 AI 기술의 진화: 텍스트를 넘어 고품질 비디오 생성 시대로',
    summary: '최근 공개된 Sora 등 고성능 비디오 생성 AI 모델이 콘텐츠 산업에 미칠 영향을 분석합니다. 창작자의 역할 변화와 저작권 문제, 가짜 뉴스 생성 등 기술적 진보에 따른 윤리적 과제들을 현직 개발자들의 인터뷰를 통해 짚어봅니다.'
  }
];

export const draftItems = [
  {
    id: 1,
    title: '국민의힘 공천 과정 논란: 공정성 시비와 호남 비하 논란 확산',
    lastModified: '1시간 전 수정됨'
  },
  {
    id: 2,
    title: '반도체 산업 지원법 통과에 따른 국내 기업 수혜 및 향후 투자 전략',
    lastModified: '5시간 전 수정됨'
  },
  {
    id: 3,
    title: '기후 위기 대응을 위한 신재생 에너지 전환 가속화 방안 및 글로벌 규제 동향',
    lastModified: '어제 수정됨'
  }
];
