import { Quote } from '../types';

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
