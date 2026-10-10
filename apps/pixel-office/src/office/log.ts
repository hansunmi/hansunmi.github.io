import { AG, PHASES, type AgentId } from './data';

/** 대화로그 한 줄 (표시용) */
export type LogLine = {
  who: string;
  color: string;
  text: string;
  time: string;
  min?: number;
};

/** CEO 입력 · 결재 코멘트처럼 시나리오 밖에서 추가되는 로그 */
export type ExtraLog = {
  w: AgentId | 'ceo';
  t: string;
  min: number;
};

export type HistoryEntry = {
  id: number;
  name: string;
  date: string;
  log: LogLine[];
};

const STORAGE_KEY = 'pixelOffice.history';
const CEO_COLOR = '#efe3c8';

const IDLE_CHATTER: [AgentId, string, string][] = [
  ['qa', '지난 프로젝트 회고 체크리스트 3개 추가했어요.', '09:52'],
  ['dev', '선풍기 바람 세기 2단으로 올렸습니다. 서버실보다 여기가 더 더워요.', '09:47'],
  ['designer', '커피머신 원두 바뀌었네요? 산미 괜찮다 ☕', '09:41'],
  ['planner', '오늘 아침 반려동물 시장 리포트 요약해서 공유 폴더에 올려뒀습니다.', '09:35'],
  ['dev', 'LangGraph 상태 전이 테스트 전부 통과했습니다.', '09:28'],
  ['planner', '다들 좋은 아침입니다. 사장님 지시서 오면 바로 착수할게요.', '09:20'],
];

export const DEFAULT_HISTORY: HistoryEntry[] = [
  {
    id: 1,
    name: '사내 회의실 예약 슬랙봇',
    date: '2026.09.24',
    log: [
      { who: '검수자', color: AG.qa.color, text: '최종 서비스 개발 팩을 서류함에 담았습니다.', time: '16:40' },
      { who: 'CEO', color: CEO_COLOR, text: '승인합니다. 진행해 주세요.', time: '11:12' },
      { who: '기획자', color: AG.planner.color, text: '예약 충돌 시 대체 회의실 추천 기능을 제안합니다.', time: '10:20' },
      { who: 'CEO', color: CEO_COLOR, text: '사내 회의실 예약 슬랙봇', time: '10:00' },
    ],
  },
];

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) return parsed as HistoryEntry[];
  } catch {
    /* 읽기 실패 시 기본값 */
  }
  return DEFAULT_HISTORY;
}

export function saveHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* 저장 실패는 무시 (데모) */
  }
}

/** 단계까지 누적된 시나리오 로그 + 추가 로그를 최신순으로 만든다. */
export function buildLog(phase: number, extra: ExtraLog[]): LogLine[] {
  if (phase === 0 && !extra.length) {
    return IDLE_CHATTER.map(([w, t, time]) => ({
      who: AG[w].name,
      color: AG[w].color,
      text: t,
      time,
      min: 0,
    }));
  }

  const rows: ExtraLog[] = [];
  let min = 0;
  PHASES.slice(1, phase + 1).forEach((ph) => {
    (ph.log ?? []).forEach(([w, t]) => {
      min += 2;
      rows.push({ w, t, min });
    });
  });
  extra.forEach((e) => rows.push(e));

  return rows
    .sort((a, b) => b.min - a.min)
    .map((l) => ({
      who: l.w === 'ceo' ? 'CEO' : AG[l.w].name,
      color: l.w === 'ceo' ? CEO_COLOR : AG[l.w].color,
      text: l.t,
      time: `10:${String(l.min).padStart(2, '0')}`,
      min: l.min,
    }));
}

/** 다음 추가 로그가 쓸 분(min) 값 */
export function nextStamp(lines: LogLine[]): number {
  return (lines.length ? Math.max(...lines.map((l) => l.min ?? 0)) : 0) + 1;
}

export function todayStamp(d = new Date()): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
