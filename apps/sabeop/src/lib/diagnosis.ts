import type { AgencyKey } from '../theme/tokens';
import type { DiagnosisAnswers } from '../state/AppState';

export const UNKNOWN = 'unknown';

type Option = { id: string; label: string; desc?: string };
type Step = {
  key: keyof DiagnosisAnswers;
  name: string;
  question: string;
  helper: string;
  options: Option[];
  /** '?' 해설을 붙일 용어 */
  term?: string;
};

const unknownOption: Option = { id: UNKNOWN, label: '잘 모르겠어요' };

export const DIAGNOSIS_STEPS: Step[] = [
  {
    key: 'type',
    name: '피해 유형',
    question: '어떤 피해를 입으셨나요?',
    helper: '가장 가까운 것을 골라주세요.',
    options: [
      { id: 'used-trade', label: '중고거래 · 소액사기' },
      { id: 'investment', label: '투자 · 금융 사기' },
      { id: 'phishing', label: '보이스피싱' },
      unknownOption,
    ],
  },
  {
    key: 'amount',
    name: '피해 금액',
    question: '피해 금액은 얼마인가요?',
    helper: '정확하지 않아도 괜찮아요. 대략 골라주세요.',
    options: [
      { id: 'under-500m', label: '5억 원 미만', desc: '중고거래·소액 사기 대부분' },
      { id: 'over-500m', label: '5억 원 이상', desc: '대규모 경제범죄일 수 있어요' },
      unknownOption,
    ],
    term: '중대범죄',
  },
  {
    key: 'party',
    name: '상대방 신분',
    question: '상대방은 누구인가요?',
    helper: '아는 만큼만 골라주세요.',
    options: [
      { id: 'person', label: '개인' },
      { id: 'company', label: '회사 · 단체' },
      { id: 'official', label: '공무원' },
      unknownOption,
    ],
  },
];

export function optionLabel(key: keyof DiagnosisAnswers, id?: string): string {
  const step = DIAGNOSIS_STEPS.find((s) => s.key === key);
  return step?.options.find((o) => o.id === id)?.label ?? '';
}

export function optionDesc(key: keyof DiagnosisAnswers, id?: string): string | undefined {
  const step = DIAGNOSIS_STEPS.find((s) => s.key === key);
  return step?.options.find((o) => o.id === id)?.desc;
}

export type Verdict = { kind: 'decided'; agency: AgencyKey } | { kind: 'pending' };

/**
 * 판별 로직(목업): 금액 5억 원 미만 → 경찰 / 5억 원 이상 → 중대범죄수사청 / 잘 모르겠어요 → 판별 보류
 */
// TODO: API — 실제 판별은 서버 규칙 엔진
export function judge(answers: DiagnosisAnswers): Verdict {
  if (answers.amount === 'under-500m') return { kind: 'decided', agency: 'police' };
  if (answers.amount === 'over-500m') return { kind: 'decided', agency: 'nis' };
  return { kind: 'pending' };
}

export const AGENCY_NAME: Record<AgencyKey, string> = {
  police: '경찰',
  nis: '중대범죄수사청',
  prosecution: '공소청',
};
