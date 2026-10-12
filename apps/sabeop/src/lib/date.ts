// 모든 날짜 계산은 목업의 today 기준. 시간대 영향을 없애려고 UTC 자정으로 다룬다.
const DAY = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** to - from (일) */
export function diffDays(fromIso: string, toIso: string): number {
  return Math.round((parseDate(toIso).getTime() - parseDate(fromIso).getTime()) / DAY);
}

/** 마감까지 남은 일수 → "D-15" */
export function dday(todayIso: string, targetIso: string): string {
  const n = diffDays(todayIso, targetIso);
  if (n === 0) return 'D-DAY';
  return n > 0 ? `D-${n}` : `D+${-n}`;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "10.27" */
export function mmdd(iso: string): string {
  const d = parseDate(iso);
  return `${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
}

/** "2026.09.10" */
export function ymd(iso: string): string {
  const d = parseDate(iso);
  return `${d.getUTCFullYear()}.${mmdd(iso)}`;
}

/** "화" */
export function weekday(iso: string): string {
  return WEEKDAYS[parseDate(iso).getUTCDay()];
}

/** "2026.10.10 14:20" */
export function ymdhm(isoDateTime: string): string {
  const time = isoDateTime.slice(11, 16);
  return `${ymd(isoDateTime)} ${time}`;
}

/** from~to 구간에서 today가 지난 비율(0~1) */
export function progress(fromIso: string, toIso: string, todayIso: string): number {
  const total = diffDays(fromIso, toIso);
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, diffDays(fromIso, todayIso) / total));
}
