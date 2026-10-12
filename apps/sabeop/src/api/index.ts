import data from '../mocks/data.json';
import precedentData from '../mocks/precedents.json';

export type Scenario = 'normal' | 'exception';

export type HistoryItem = { date: string; text: string; terms?: string[] };

export type ActiveCase = {
  id: string;
  title: string;
  agency: 'police' | 'nis' | 'prosecution';
  status: string;
  office: string;
  investigator: string;
  filedAt: string;
  deadline: string;
  steps: string[];
  currentStep: number;
  history: HistoryItem[];
  lastSyncedAt: string;
};

export type ClosedCase = {
  id: string;
  title: string;
  status: string;
  noticeAt: string;
  appealDeadline: string;
};

export type Precedent = {
  id: string;
  similarity: 'high' | 'mid';
  court: string;
  caseNo: string;
  year: number;
  categories: string[];
  title: string;
  summary: string;
  summaryStrong?: string;
  outcomes: string[];
};

export type Intent = 'diagnosis' | 'tracking' | 'complaint';

// TODO: API — 서버 기준일. 지금은 목업 today를 쓴다.
export function getToday(): string {
  return data.today;
}

// TODO: API — 간편 인증 후 사용자 정보
export function getUser() {
  return data.user;
}

export function getInitialScenario(): Scenario {
  return data.scenario as Scenario;
}

// TODO: API — 사건 목록 (기관 시스템 연동)
export function getActiveCase(): ActiveCase {
  return data.cases[0] as ActiveCase;
}

// TODO: API — 사건 목록 (기관 시스템 연동)
export function getClosedCase(): ClosedCase {
  return data.cases[1] as ClosedCase;
}

export function getCaseCount(): number {
  return data.cases.length;
}

// TODO: API — 공소청 면담 가능 일자
export function getInterviewSlots(): string[] {
  return data.interviewSlots;
}

// TODO: API — 용어 사전
export function getGlossary(): Record<string, string> {
  return data.glossary;
}

// TODO: API — 판례 검색 (유사도 정렬)
export function searchPrecedents(params: {
  keyword?: string;
  filter: string;
  today: string;
}): { total: number; items: Precedent[] } {
  const thisYear = Number(params.today.slice(0, 4));
  let items = precedentData.items as Precedent[];
  if (params.filter === '최근 3년') items = items.filter((p) => p.year >= thisYear - 2);
  else if (params.filter !== '전체') items = items.filter((p) => p.categories.includes(params.filter));
  if (params.keyword) {
    const k = params.keyword.replace(/\s/g, '');
    const hit = items.filter((p) => (p.title + p.summary + p.categories.join('')).replace(/\s/g, '').includes(k));
    // 목업: 일치 항목이 없어도 목록은 비우지 않는다
    if (hit.length) items = hit;
  }
  const total = params.filter === '전체' && !params.keyword ? precedentData.total : items.length;
  return { total, items };
}

// TODO: API — 자연어 의도 분류. 목업은 키워드 매칭.
export function classifyIntent(text: string): Intent {
  const t = text.replace(/\s/g, '');
  if (/어디있|어디까지|진행|내사건|조회|추적/.test(t)) return 'tracking';
  if (/고소장|쓰는법|작성/.test(t)) return 'complaint';
  return 'diagnosis';
}

/** 잠금화면 푸시 문구 — 민감정보 보호를 위해 사건 내용을 넣지 않는다 */
export const PUSH_MESSAGE = '새 소식이 있어요';

// TODO: API — 로컬/서버 푸시 예약. 목업은 예약 일정만 계산해 돌려준다.
export function scheduleReminders(reminders: { date: string }[]) {
  return reminders.map((r) => ({ ...r, body: PUSH_MESSAGE }));
}

// TODO: API — 내 사건에서 뽑은 검색 기준
export function getPrecedentCriteria() {
  return { ...precedentData.criteria, filters: precedentData.filters };
}
