export interface ScrapedArticle {
  id: number
  category: string
  categoryColor: 'primary' | 'blue'
  scrapDate: string
  title: string
  summary: string
}

export interface DraftItem {
  id: number
  title: string
  lastModified: string
}

export const scrapedArticles: ScrapedArticle[] = [
  {
    id: 1,
    category: '경제/반도체',
    categoryColor: 'primary',
    scrapDate: '2024.05.23 09:12 스크랩',
    title: 'HBM 시장 경쟁 심화: SK하이닉스와 삼성전자의 기술 격차 분석',
    summary:
      '최근 인공지능(AI) 반도체 수요가 폭증함에 따라 고대역폭 메모리(HBM) 시장이 급격히 팽창하고 있습니다. SK하이닉스는 기존 주도권을 유지하기 위해 공정을 고도화하고 있으며, 삼성전자는 대규모 투자를 통해 추격을 가속화하고 있습니다. 향후 수율 및 품질 안정화가 시장 점유율의 핵심 변수로 작용할 전망입니다.',
  },
  {
    id: 2,
    category: '글로벌/IT',
    categoryColor: 'blue',
    scrapDate: '2024.05.22 14:45 스크랩',
    title: 'EU AI 법안 통과가 국내 기업에 미치는 규제 영향과 대응 방안',
    summary:
      '유럽연합(EU)의 인공지능법 최종 가이드라인이 발표되면서 글로벌 빅테크 기업들에 비상이 걸렸습니다. 국내 AI 스타트업 역시 유럽 시장 진출을 위해서는 엄격한 윤리 기준과 위험 관리 프로세스를 구축해야 합니다. 해당 법안은 고위험 AI에 대해 강력한 징벌적 과징금을 예고하고 있어 철저한 대비가 요구됩니다.',
  },
]

export const draftItems: DraftItem[] = [
  {
    id: 1,
    title: '국내 AI 윤리 가이드라인 도입에 따른 업계 현황 취재 건',
    lastModified: '마지막 수정: 1시간 전 (2024.05.24 15:42)',
  },
  {
    id: 2,
    title: '반도체 클러스터 전력 인프라 확충에 관한 기획 기사',
    lastModified: '마지막 수정: 어제 (2024.05.23 11:20)',
  },
  {
    id: 3,
    title: '금리 동결 이후 시장 유동성 변화 추이 분석 및 비평',
    lastModified: '마지막 수정: 3일 전 (2024.05.21 18:05)',
  },
]
