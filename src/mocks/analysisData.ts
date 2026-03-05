import { OpinionItem } from '../types';

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
