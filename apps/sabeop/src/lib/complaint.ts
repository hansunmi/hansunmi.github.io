import type { Scenario } from '../api';

/** 육하원칙 6항목 */
export type Item = '누가' | '언제' | '어디서' | '무엇을' | '어떻게' | '왜';
export const ITEMS: Item[] = ['누가', '언제', '어디서', '무엇을', '어떻게', '왜'];

type Question = {
  id: string;
  ask: string;
  /** 이 답이 채우는 항목 */
  items: Item[];
  required: boolean;
  /** 빠졌을 때 점선 칩에 쓰는 이름 */
  short: string;
  placeholder: string;
  validate?: (text: string) => string | null;
};

const DATE = /(\d{1,2})\s*월\s*(\d{1,2})\s*일|\d{4}\s*[.\-/]\s*\d{1,2}\s*[.\-/]\s*\d{1,2}|\b\d{1,2}\s*[./]\s*\d{1,2}\b/;
const MONEY = /\d[\d,]*\s*(만|천|백|억)?\s*원|\d+\s*(만|천|억)/;

export const QUESTIONS: Question[] = [
  {
    id: 'when-where',
    ask: '언제, 어디서 거래하셨나요?',
    items: ['언제', '어디서'],
    required: true,
    short: '언제 · 어디서',
    placeholder: '예) 9월 3일, 중고거래 앱에서요',
    validate: (t) => (DATE.test(t) ? null : '날짜를 함께 적어주세요. 예) 9월 3일'),
  },
  {
    id: 'amount',
    ask: '얼마를 입금하셨나요?',
    items: ['무엇을'],
    required: true,
    short: '입금 금액',
    placeholder: '예) 200만 원',
    validate: (t) => (MONEY.test(t) ? null : '금액을 숫자로 적어주세요. 예) 200만 원'),
  },
  {
    id: 'who',
    ask: '상대방의 닉네임이나 연락처를 알려주세요.',
    items: ['누가'],
    required: false,
    short: '상대방',
    placeholder: '예) 닉네임 노트북팔아요',
  },
  {
    id: 'how',
    ask: '어떻게 연락이 끊겼나요?',
    items: ['어떻게'],
    required: false,
    short: '경위',
    placeholder: '예) 입금 후 차단됐어요',
  },
  {
    id: 'why',
    ask: '왜 사기라고 생각하셨나요?',
    items: ['왜'],
    required: false,
    short: '이유',
    placeholder: '예) 물건을 보내지 않았어요',
  },
];

export type Answers = Record<string, string>;

/** 시나리오별 초기 답변 (정상: 디자인 시안 상태, 예외: 필수 항목 누락) */
export function initialAnswers(scenario: Scenario): Answers {
  if (scenario === 'exception') return { 'when-where': '9월 3일, 중고거래 앱에서요' };
  return { 'when-where': '9월 3일, 중고거래 앱에서요', amount: '200만 원' };
}

export function filledCount(answers: Answers): number {
  return QUESTIONS.filter((q) => answers[q.id]).reduce((n, q) => n + q.items.length, 0);
}

export function missingRequired(answers: Answers) {
  return QUESTIONS.filter((q) => q.required && !answers[q.id]);
}

// ── 증거 첨부 ──
export type Evidence = { name: string; sizeMB: number };
export const EVIDENCE_RULE = { exts: ['jpg', 'jpeg', 'png', 'pdf'], maxMB: 20 };

export function validateEvidence(file: Evidence): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!EVIDENCE_RULE.exts.includes(ext)) return 'JPG · PNG · PDF 파일만 올릴 수 있어요.';
  if (file.sizeMB > EVIDENCE_RULE.maxMB) return `파일 하나에 ${EVIDENCE_RULE.maxMB}MB까지 올릴 수 있어요.`;
  return null;
}

// TODO: API — 실제로는 기기 파일 선택기. 목업은 순서대로 하나씩 고른 것으로 처리
export const MOCK_PICKS: Evidence[] = [
  { name: '카톡캡처_0903.png', sizeMB: 1.2 },
  { name: '입금내역.pdf', sizeMB: 0.4 },
  { name: '거래화면_녹화.mov', sizeMB: 48 },
  { name: '판매글_캡처.jpg', sizeMB: 23.5 },
];
