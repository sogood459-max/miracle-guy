import type { MarketBriefing } from '../types'

const now = new Date().toISOString()
const today = now.slice(0, 10)

export const seedBriefings: MarketBriefing[] = [
  {
    id: crypto.randomUUID(),
    market: '미국',
    date: today,
    summary:
      'S&P500 지수: 전일 대비 소폭 상승 마감. 연준 금리 동결 기대감과 기술주 실적 호조가 지수를 견인. AI 반도체 관련주 변동성 확대.',
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    market: '한국',
    date: today,
    summary:
      '삼성전자·SK하이닉스 메모리 반도체 업황 개선 기대감에 동반 강세. HBM 수요 증가 관련 뉴스가 주가에 긍정적으로 반영.',
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    market: '일본',
    date: today,
    summary: '니케이225 지수, 엔화 약세와 수출주 강세에 힘입어 상승 마감. 반도체 장비주 변동성 두드러짐.',
    createdAt: now,
  },
]
