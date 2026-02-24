import { MediaGroup, OpinionItem, SearchIssue, MockNewsItem, Quote } from '../types';

export const mainNewsData: MediaGroup[] = [
  {
    category: '조선일보',
    color: 'bg-slate-900',
    textColor: 'text-primary',
    borderColor: 'border-slate-300',
    articles: [
      { id: 1, title: '반도체 초격차 전략, 정부 대규모 세제 혜택 지원책 발표', rank: 1, image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: '노동시장 유연화 및 근로시간 개편안 쟁점 정리', rank: 2 },
      { id: 3, title: '한미일 경제 안보 협력 강화 및 공급망 대응', rank: 3 },
      { id: 4, title: '수도권 광역급행철도(GTX) 노선 연장 및 부동산 동향', rank: 4 },
      { id: 5, title: '지방시대 선포 및 지역 균형 발전 로드맵 발표', rank: 5 },
      { id: 6, title: '국제 유가 급등에 따른 국내 물가 영향 분석', rank: 6 },
      { id: 7, title: 'AI 기술 도입을 통한 기업 생산성 혁신 사례', rank: 7 },
      { id: 8, title: '신재생 에너지 비중 확대 및 전력 수급 계획', rank: 8 },
      { id: 9, title: '고령화 사회 대응을 위한 연금 개혁안 쟁점', rank: 9 },
      { id: 10, title: '글로벌 공급망 재편과 한국의 전략적 선택', rank: 10 },
    ]
  },
  {
    category: '한겨레',
    color: 'bg-stance-blue',
    textColor: 'text-stance-blue',
    borderColor: 'border-slate-300',
    articles: [
      { id: 1, title: 'EU AI법 가이드라인 최종 확정 및 국내 산업계 파급 효과 심층 분석', rank: 1, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: '전세사기 특별법 개정안 국회 본회의 통과', rank: 2 },
      { id: 3, title: '기후 위기 대응 예산 전면 재검토 촉구', rank: 3 },
      { id: 4, title: '비정규직 처우 개선을 위한 제도적 장치 마련 시급', rank: 4 },
      { id: 5, title: '地域(지역) 균형 발전을 위한 공공기관 이전 로드맵 발표', rank: 5 },
      { id: 6, title: '차별금지법 제정 촉구 및 인권 보호 강화', rank: 6 },
      { id: 7, title: '플랫폼 노동자 권리 보장을 위한 법적 지원', rank: 7 },
      { id: 8, title: '그린 뉴딜 정책 가속화 및 환경 보호 전략', rank: 8 },
      { id: 9, title: '사회안전망 강화를 위한 복지 예산 증액 논의', rank: 9 },
      { id: 10, title: '교육 격차 해소를 위한 공교육 정상화 방안', rank: 10 },
    ]
  },
  {
    category: '경향신문',
    color: 'bg-stance-blue',
    textColor: 'text-stance-blue',
    borderColor: 'border-slate-300',
    articles: [
      { id: 1, title: '탄소중립 이행 속도조절 논란과 환경 규제의 미래', rank: 1, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: '비정규직 처우 개선을 위한 제도적 장치 마련 시급', rank: 2 },
      { id: 3, title: '지역 균형 발전 및 인구 감소 대응 전략 발표', rank: 3 },
      { id: 4, title: '최저임금 결정 체계 개편 및 사회적 합의', rank: 4 },
      { id: 5, title: '청년 주거 안정을 위한 공공주택 공급 확대', rank: 5 },
      { id: 6, title: '성평등 사회 실현을 위한 정책적 지원 강화', rank: 6 },
      { id: 7, title: '기초연금 인상 및 노인 복지 인프라 확충', rank: 7 },
      { id: 8, title: '디지털 격차 해소를 위한 전국민 정보 교육', rank: 8 },
      { id: 9, title: '소상공인 보호 및 골목상권 활성화 대책', rank: 9 },
      { id: 10, title: '문화 예술인 권리 보호 및 창작 지원 예산', rank: 10 },
    ]
  },
  {
    category: '동아일보',
    color: 'bg-slate-900',
    textColor: 'text-primary',
    borderColor: 'border-slate-300',
    articles: [
      { id: 1, title: '기업 상속세 개편을 통한 가업 승계 활성화 방안 확정', rank: 1, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: '첨단 전략 산업 육성을 위한 규제 샌드박스 확대', rank: 2 },
      { id: 3, title: '한일 셔틀 외교 및 안보 협력 협의체 구성', rank: 3 },
      { id: 4, title: '수출 경쟁력 강화를 위한 물류 인프라 개선', rank: 4 },
      { id: 5, title: '바이오 헬스케어 산업 육성 로드맵 발표', rank: 5 },
      { id: 6, title: '그린 모빌리티 보급 확대 및 인프라 구축', rank: 6 },
      { id: 7, title: '혁신 성장 펀드 조성을 통한 벤처 투자 활성화', rank: 7 },
      { id: 8, title: '지능형 로봇 산업 경쟁력 확보 전략 발표', rank: 8 },
      { id: 9, title: '스타트업 글로벌 진출 지원 프로그램 강화', rank: 9 },
      { id: 10, title: '차세대 통신 기술(6G) 연구 개발 투자 확대', rank: 10 },
    ]
  },
  {
    category: '연합뉴스',
    color: 'bg-slate-900',
    textColor: 'text-primary',
    borderColor: 'border-slate-300',
    articles: [
      { id: 1, title: '한미 방조비 분담금 협상 본격 시작... 쟁점 분석', rank: 1, image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: '우주항공청 개청 및 선도 국가 도약 선언', rank: 2 },
      { id: 3, title: '글로벌 금리 변동성에 따른 국내 금융시장 대응', rank: 3 },
      { id: 4, title: 'K-방산 수출 다변화 및 글로벌 점유율 확대', rank: 4 },
      { id: 5, title: '원자력 발전 비중 확대 및 에너지 안보 강화', rank: 5 },
      { id: 6, title: '양자 과학 기술 연구 개발 투자 로드맵 발표', rank: 6 },
      { id: 7, title: '디지털 자산 가이드라인 마련 및 투자자 보호', rank: 7 },
      { id: 8, title: '지능형 교통 시스템(ITS) 구축 및 자율주행 협력', rank: 8 },
      { id: 9, title: '글로벌 공급망 리스크 관리 및 자원 안보 확보', rank: 9 },
      { id: 10, title: '신성장 동력 확보를 위한 R&D 예산 효율화', rank: 10 },
    ]
  }
];

export const opinions: OpinionItem[] = [
  {
    id: 1,
    media: '한겨레',
    stance: 'progressive',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    textHighlight: 'text-highlight-progressive',
    title: '"명분 없는 합당은 <span class="text-highlight-progressive">정치적 자해</span>"',
    analysisTitle: '절차적 정당성 상실과 정치적 신뢰 저하 비판',
    description: '정청래 대표의 기습적 제안이 가져온 당내 민주주의 훼손을 본질적인 문제로 진단합니다. 조국혁신당과의 합당이 단순한 숫자 늘리기가 아닌, 가치와 명분이 우선되어야 함을 강조하며, 이번 사태가 야권 전반의 도덕성과 정치적 신뢰도에 미칠 악영향을 우려하는 신중하고 비판적인 논조를 유지합니다.',
    sources: [
      '합당 무산, 명분보다 \'정치공학\' 앞세운 당연한 결말',
      '민주주의 절차 무너뜨린 정청래의 독주, 당내 내홍 자초',
      '차기 지방선거 공천권보다 중요한 것은 국민의 신뢰'
    ]
  },
  {
    id: 2,
    media: '경향신문',
    stance: 'progressive',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    textHighlight: 'text-highlight-progressive',
    title: '"독단 리더십이 부른 <span class="text-highlight-progressive">당연한 결과</span>"',
    analysisTitle: '명분 없는 강행과 실질적 내홍 비판',
    description: '충분한 내부 소통 없는 \'깜짝 제안\'이 결국 실효성 없는 권력 투쟁만 불러왔다고 강도 높게 비판합니다. \'연합정치\'의 가치를 훼손하고 당내 민주주의를 위협하는 독단적 리더십이 이번 사태의 본질이라며, 수평적 소통 구조로의 회복을 통한 야권 연대를 대안으로 제시합니다.',
    sources: [
      '합당 무산, 3주 내홍 맹성하고 정치혁신 길로',
      '정청래 리더십 위기, 민주주의 실종된 당내 민주화',
      '야권 연대의 기초는 신뢰... 합당 소동의 교훈'
    ]
  },
  {
    id: 3,
    media: '중앙일보',
    stance: 'neutral',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    textHighlight: 'text-highlight-neutral',
    title: '"정략적 수단 의심받는 <span class="text-highlight-neutral">명·청 갈등</span> 본격화"',
    analysisTitle: '친명-친청 계파 간 주도권 경쟁 부각',
    description: '이번 합당 추진을 정 대표 개인의 정치적 입지 강화와 당권 장악을 위한 \'고도의 정략\'으로 규정합니다. 민생과 국정 현안은 뒤로한 채 오로지 차기 권력 구도에만 함몰되어 벌어지는 \'명·청 계파 갈등\'의 민낯을 부각시키며, 제1야당의 책임감 없는 태도를 강력히 비판하는 논조입니다.',
    sources: [
      '합당 무산, 정략에 골몰한 정청래의 예고된 결말',
      '공천권 둘러싼 명·청 갈등, 야권 통합의 걸림돌',
      '정청래의 무리수, 당내 반발만 사고 끝난 19일'
    ]
  },
  {
    id: 4,
    media: '동아일보',
    stance: 'conservative',
    bg: 'bg-red-50',
    border: 'border-red-100',
    textHighlight: 'text-highlight-conservative',
    title: '"졸속 추진이 부른 <span class="text-highlight-conservative">신뢰의 위기</span>"',
    analysisTitle: '당정 및 내부 소통 부재 집중 조망',
    description: '주요 의원들을 철저히 \'패싱\'하고 정해진 결론만 밀어붙이는 \'답정너\'식 밀실 추진이 이번 혼란의 시발점이라고 지적합니다. 절차적 정당성이 결여된 행위가 불러온 불필요한 당내 에너지 소모와 정책 부재를 꼬집으며, 야권 전반의 신뢰 위기로 번질 가능성을 경고하는 목소리를 높이고 있습니다.',
    sources: [
      '불통과 졸속으로 혼란 자초한 \'밀실\' 합당',
      '의회 민주주의 무력화시키는 거대 야당의 횡포',
      '합당 소동으로 본 민주당의 민주주의 현주소'
    ]
  },
  {
    id: 5,
    media: '조선일보',
    stance: 'conservative',
    bg: 'bg-red-50',
    border: 'border-red-100',
    textHighlight: 'text-highlight-conservative',
    title: '"차기 대권 위한 <span class="text-highlight-conservative">친명계의 난투극</span>"',
    analysisTitle: '야권 통합 명분 아래 숨겨진 권력 투쟁',
    description: '이번 사태를 이재명 대표의 연임을 앞두고 친명계 내부에서 벌어지는 치열한 충성 경쟁과 주도권 다툼의 산물로 정의합니다. 합당이라는 명분을 내세웠지만 실상은 호남 주도권을 놓지 않으려는 기존 기득권과 새로운 세력 간의 충돌이라며, 야권의 분열상을 비판적으로 조명합니다.',
    sources: [
      '합당 무산으로 드러난 야권 내부의 \'공천 전쟁\'',
      '정청래의 무리수, 이재명 연임 가도에 악재 되나',
      '호남 민심은 뒷전, 오직 공천권만 챙기는 야권'
    ]
  }
];

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

export const draftingQuotes: Quote[] = [
  {
    id: 1,
    media: '한겨레',
    type: 'progressive',
    bg: 'bg-blue-50',
    textColor: 'text-progressive',
    borderColor: 'border-progressive',
    text: '"명분 없는 합당 추진은 결국 내부 권력 투쟁만 표면화시킨 정치적 자해 행위다."',
    links: [
      '명분 없는 합당 추진, 정치적 자해 행위 비판',
      '정청래 대표 리더십 논란과 당내 내홍 심화'
    ]
  },
  {
    id: 2,
    media: '중앙일보',
    type: 'neutral',
    bg: 'bg-slate-100',
    textColor: 'text-neutral',
    borderColor: 'border-neutral',
    text: '"정략적 수단으로 전락한 합당 제안은 당 대표 연임을 위한 입지 강화용이라는 의심을 지울 수 없다."',
    links: [
      "정략적 수단 의심, '명·청 갈등' 본격화 분석"
    ]
  },
  {
    id: 3,
    media: '경향신문',
    type: 'progressive',
    bg: 'bg-blue-50',
    textColor: 'text-progressive',
    borderColor: 'border-progressive',
    text: '"의원들과의 사전 협의 없는 독단적 합당 제안은 민주당의 시스템 민주주의 절차를 정면으로 부인한 것이다."',
    links: [
      '의원 패싱과 졸속 추진, 민주당 시스템 민주주의 실종'
    ]
  },
  {
    id: 4,
    media: '조선일보',
    type: 'conservative',
    bg: 'bg-red-50',
    textColor: 'text-red-500',
    borderColor: 'border-conservative',
    text: '"친명과 비명 간의 차기 공천권 확보를 위한 난투극이며, 합당은 그저 명분에 불과했다."',
    links: [
      '본질은 공천권 다툼, 계파 간 암투 노출 지적',
      '민주당 전당대회 앞두고 보이지 않는 손들의 혈투'
    ]
  }
];
