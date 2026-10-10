/**
 * 시나리오 데이터. 레퍼런스(`Pixel Office v2.dc.html`) 의 logic class 상수를 그대로 옮겼다.
 * `pos` 는 참조 동일성으로 "자리를 옮겼는지"를 판단하므로, 좌표 배열은 반드시 재사용한다.
 */

export type AgentId = 'planner' | 'designer' | 'dev' | 'qa';
export type Pos = readonly [number, number];

export type AgentMeta = {
  name: string;
  rank?: string;
  en: string;
  role: string;
  trait: string;
  color: string;
  hair: string;
};

export const AG: Record<AgentId, AgentMeta> = {
  planner: { name: '기획자', rank: '팀장', en: 'Planner', role: '요구사항 분석 · 상품성 판단 · 화면/기능정의서', trait: '논리적 · 비즈니스 중심', color: 'oklch(0.72 0.12 250)', hair: '#3a2c20' },
  designer: { name: '디자이너', en: 'Designer', role: '브랜드 뼈대 · UI/UX 컨셉 · 디자인 가이드', trait: '감각적 · UX 중시', color: 'oklch(0.72 0.12 350)', hair: '#6a3a2a' },
  dev: { name: '개발자', en: 'Developer', role: '기술 가능범위 판단 · 아키텍처 · 프로토타입 코드', trait: '현실적 · 기술 중심', color: 'oklch(0.72 0.12 150)', hair: '#24211c' },
  qa: { name: '검수자', en: 'QA Reviewer', role: '유저 플로우 검토 · 허점 보완 · 최종 디벨롭', trait: '꼼꼼함 · 비판적', color: 'oklch(0.72 0.12 75)', hair: '#4a3a2a' },
};

export const ORDER: AgentId[] = ['planner', 'designer', 'dev', 'qa'];

export const DESK: Record<AgentId, Pos> = {
  planner: [540, 128],
  designer: [880, 128],
  dev: [540, 488],
  qa: [880, 488],
};
export const CEO: Pos = [300, 184];
export const LOUNGE: Pos = [1180, 210];
export const MEET: Record<AgentId, Pos> = {
  planner: [612, 300],
  designer: [730, 262],
  dev: [730, 360],
  qa: [850, 300],
};

export type AgentState = {
  pos: Pos;
  bubble: string | null;
  status: string;
  task: string;
  thought: string;
  coffee?: boolean;
  monitor?: boolean;
  done?: boolean;
};

export const IDLE: Record<AgentId, AgentState> = {
  planner: { pos: DESK.planner, bubble: '시장 리포트 읽는 중…', status: '대기', task: '업계 트렌드 리포트 검토', thought: '다음 아이디어가 들어오면 바로 경쟁사 분석부터 돌릴 수 있게 템플릿을 정리해 두는 중입니다.', coffee: true },
  designer: { pos: LOUNGE, bubble: '커피 한 잔 더…', status: '휴식', task: '탕비실에서 커피 타는 중', thought: '최근 본 레퍼런스 무드보드를 머릿속으로 정리하고 있어요.' },
  dev: { pos: DESK.dev, bubble: '로그 확인 중', status: '대기', task: '개발 환경 · 의존성 점검', thought: 'LangGraph 상태 전이 테스트를 미리 돌려두는 중입니다.', coffee: true },
  qa: { pos: DESK.qa, bubble: '체크리스트 정리', status: '대기', task: 'QA 체크리스트 업데이트', thought: '지난 프로젝트에서 놓친 엣지 케이스를 체크리스트에 추가하고 있습니다.', coffee: true },
};

const done = (task: string) => ({
  status: '완료',
  bubble: null,
  task,
  thought: 'QA 피드백이 오면 즉시 반영할 수 있도록 대기 중입니다.',
  done: true,
});

export type LogSeed = [AgentId, string];

export type Phase = {
  key: string;
  graph: number;
  kicker: string;
  title: string;
  desc: string;
  agents: Record<AgentId, AgentState>;
  modal?: 'r1' | 'r2';
  meeting?: boolean;
  log?: LogSeed[];
};

export const PHASES: Phase[] = [
  {
    key: 'idle', graph: -1, kicker: 'STANDBY', title: '대기 상태',
    desc: '팀원들이 각자 자리에서 다음 지시를 기다리고 있습니다. 아래 CEO 지시서에 아이디어를 입력하세요.',
    agents: IDLE,
  },
  {
    key: 'receive', graph: 0, kicker: '01 · IDEATION', title: '아이디어 수령',
    desc: '기획자가 사장실로 와서 지시서를 받아갑니다. 상품성 분석이 시작됩니다.',
    agents: {
      planner: { pos: CEO, bubble: '지시서 잘 받았습니다, 사장님!', status: '수령 중', task: 'CEO 지시서 · 첨부파일 수령 및 파싱', thought: '첨부된 요구사항 PDF에서 타깃 사용자와 핵심 기능 후보를 먼저 추출하겠습니다.' },
      designer: { ...IDLE.designer, pos: DESK.designer, bubble: '오, 새 프로젝트다', status: '대기' },
      dev: IDLE.dev,
      qa: IDLE.qa,
    },
    log: [
      ['planner', 'CEO 지시서와 첨부파일 1건을 수령했습니다. 상품성 분석을 시작합니다.'],
      ['designer', '오 반려견 앱이요? 무드보드 미리 모아둘게요.'],
      ['planner', '경쟁 서비스 4곳 비교표 작성 중입니다.'],
    ],
  },
  {
    key: 'report1', graph: 0, kicker: '01 · IDEATION', title: '1차 구상 보고',
    desc: '기획자가 타당성 보고서를 들고 결재를 요청합니다. CEO 응답 전까지 진행이 멈춥니다.',
    modal: 'r1',
    agents: {
      planner: { pos: CEO, bubble: '1차 구상 보고서입니다.', status: '보고 중', task: '1차 구상 보고서 결재 요청', thought: '시장성은 충분하지만, 안전 이슈 대응이 핵심 차별점이 될 것 같습니다.' },
      designer: { ...IDLE.designer, pos: DESK.designer, bubble: null, status: '대기' },
      dev: IDLE.dev,
      qa: IDLE.qa,
    },
    log: [['planner', '1차 구상 보고서를 작성했습니다. 사장님 결재를 기다립니다.']],
  },
  {
    key: 'meeting', graph: 1, kicker: '02 · SPEC_DRAFT', title: '삼자 회의',
    desc: '기획자 · 디자이너 · 개발자가 회의실에 모여 화면/기능 정의와 브랜드, 기술 범위를 맞춥니다.',
    meeting: true,
    agents: {
      planner: { pos: MEET.planner, bubble: '핵심 플로우는 매칭 → 채팅 → 산책기록 3단계로 가죠.', status: '회의 중', task: '화면/기능정의서 초안 공유', thought: '온보딩을 3스텝 이내로 줄여야 초기 이탈을 막을 수 있습니다.' },
      designer: { pos: MEET.designer, bubble: '지도 중심 UI에 따뜻한 톤이 좋겠어요.', status: '회의 중', task: '브랜드 뼈대 · 무드 제안', thought: '신뢰감을 주려면 프로필 인증 배지를 시각적으로 강조해야 해요.' },
      dev: { pos: MEET.dev, bubble: '실시간 위치는 MVP에선 1분 폴링으로 대체할게요.', status: '회의 중', task: '기술 가능범위 검토', thought: '웹소켓 기반 실시간 추적은 2차로 미루고, 지금은 비용이 낮은 방식으로 갑니다.' },
      qa: { ...IDLE.qa, bubble: '회의록 기다리는 중', status: '대기' },
    },
    log: [
      ['planner', '핵심 플로우를 매칭 → 채팅 → 산책기록 3단계로 제안합니다.'],
      ['designer', '지도 중심 레이아웃 + 인증 배지 강조로 신뢰감을 주겠습니다.'],
      ['dev', '실시간 위치는 1분 폴링으로 대체, 웹소켓은 2차 범위로 제안합니다.'],
    ],
  },
  {
    key: 'report2', graph: 2, kicker: '03 · DEV_FEASIBILITY', title: 'CEO 중간 결재',
    desc: '확정된 기획과 디자인 · 기술 방향을 보고합니다. 승인 시 실제 제작에 들어갑니다.',
    modal: 'r2',
    agents: {
      planner: { pos: CEO, bubble: '기획안 최종본 보고드립니다.', status: '보고 중', task: '기획안 보고서 결재 요청', thought: '디자인과 개발 쪽 합의 사항까지 반영한 최종본입니다.' },
      designer: { pos: DESK.designer, bubble: null, status: '대기', task: '결재 대기', thought: '승인 나면 바로 시안 작업 들어갈게요.', coffee: true },
      dev: { pos: DESK.dev, bubble: null, status: '대기', task: '결재 대기', thought: '레포 스캐폴딩은 미리 만들어 두었습니다.', coffee: true },
      qa: IDLE.qa,
    },
    log: [['planner', '화면/기능정의서 v1과 디자인 · 기술 방향을 정리해 결재 요청드립니다.']],
  },
  {
    key: 'work', graph: 2, kicker: '04 · BUILD', title: '디자인 & 개발 실행',
    desc: '각자 책상으로 돌아가 모니터를 켭니다. 디자이너는 UI 시안, 개발자는 핵심 기능을 구현합니다.',
    agents: {
      planner: { pos: DESK.planner, bubble: '기능정의서 v1.2 작성 중', status: '작업 중', task: '기능정의서 상세화 (v1.2)', thought: '예외 케이스(매칭 거절, 노쇼)에 대한 정책을 추가하고 있습니다.', monitor: true },
      designer: { pos: DESK.designer, bubble: 'UI 시안 12 / 18', status: '작업 중', task: 'UI 시안 · 이미지 생성 프롬프트', thought: 'Prompt: "cozy pixel map, warm afternoon light, two walkers with dogs"', monitor: true },
      dev: { pos: DESK.dev, bubble: '매칭 API 구현 중', status: '작업 중', task: '매칭 로직 · 채팅 API 프로토타입', thought: '거리 + 산책 시간대 가중치로 1차 매칭 스코어를 계산합니다.', monitor: true },
      qa: { pos: DESK.qa, bubble: '테스트 시나리오 작성', status: '준비 중', task: 'QA 시나리오 사전 작성', thought: '첫 매칭까지의 경로를 중심으로 시나리오 14개를 준비 중입니다.' },
    },
    log: [
      ['designer', 'UI 시안 작업을 시작했습니다. 컬러 · 타입 가이드 확정.'],
      ['dev', '레포 생성 완료. 매칭/채팅 API 스켈레톤 구현 중입니다.'],
      ['planner', '노쇼 정책 초안 공유드려요. 2회 시 7일 제한 어떠세요?'],
      ['dev', '좋습니다. 제한 로직은 서버에서 처리할게요.'],
      ['qa', '첫 매칭까지 몇 탭 걸리는지 미리 재보겠습니다.'],
    ],
  },
  {
    key: 'qa', graph: 3, kicker: '05 · QA', title: 'QA 검수',
    desc: '검수자가 전체 유저 플로우를 점검하고 매끄럽지 않은 부분을 보완합니다.',
    agents: {
      planner: { pos: DESK.planner, ...done('기능정의서 v1.3 완료') },
      designer: { pos: DESK.designer, ...done('UI 시안 18종 완료') },
      dev: { pos: DESK.dev, ...done('프로토타입 코드 완료') },
      qa: { pos: DESK.qa, bubble: '온보딩 3단계에서 이탈 지점 발견!', status: '검수 중', task: '유저 플로우 전수 검토', thought: '반려견 정보 입력이 너무 길어요. 사진 업로드를 선택 항목으로 바꾸도록 제안합니다.', monitor: true },
    },
    log: [
      ['qa', '온보딩 3단계 이탈 지점 발견 — 반려견 사진을 선택 항목으로 보완했습니다.'],
      ['qa', '매칭 거절 후 빈 화면 → 대체 추천 리스트로 수정했습니다.'],
    ],
  },
  {
    key: 'done', graph: 4, kicker: 'COMPLETE', title: '최종 서비스 개발 팩 완성',
    desc: '모든 책상에 완료 아이콘이 떴습니다. 산출물 서류함에서 결과물을 내려받으세요.',
    agents: {
      planner: { pos: DESK.planner, ...done('기획서 최종본') },
      designer: { pos: DESK.designer, ...done('UI 가이드 최종본') },
      dev: { pos: DESK.dev, ...done('코드 패키지') },
      qa: { pos: CEO, bubble: '최종 개발 팩 보고드립니다!', status: '보고', task: '최종 서비스 개발 팩 보고', thought: '치명 이슈 0건, 개선 제안 6건 반영 완료. 출시 준비가 되었습니다.', done: true },
    },
    log: [['qa', '최종 서비스 개발 팩(기획서 · UI가이드 · 코드 · QA보고서)을 서류함에 담았습니다.']],
  },
];

export const LAST_PHASE = PHASES.length - 1;

export type ModalDef = {
  title: string;
  from: string;
  summary: string;
  items: { k: string; v: string }[];
};

export const MODALS: Record<'r1' | 'r2', ModalDef> = {
  r1: {
    title: '1차 구상 보고서',
    from: '기획자',
    summary: '1인 가구 반려인의 산책 공백을 해결하는 동네 기반 산책 메이트 매칭 서비스로, 시장성이 있다고 판단합니다.',
    items: [
      { k: '타깃', v: '20–30대 1인 가구 반려인, 평일 산책 시간이 부족한 직장인' },
      { k: '상품성', v: '반려 가구 증가 + 기존 대행 서비스 대비 낮은 가격대' },
      { k: '핵심 가치', v: '동네 이웃과 안전하게 산책을 나누는 경험' },
      { k: '리스크 · 대안', v: '낯선 사람 신뢰 문제 → 본인 인증 · 리뷰 배지로 보완' },
    ],
  },
  r2: {
    title: '기획안 보고서',
    from: '기획자 · 디자이너 · 개발자',
    summary: '삼자 회의 결과를 반영한 최종 기획안입니다. 승인 시 UI 시안과 프로토타입 개발에 착수합니다.',
    items: [
      { k: '화면 정의', v: '온보딩 · 매칭 지도 · 채팅 · 산책 기록 · 프로필 (5개 화면)' },
      { k: '디자인 방향', v: '지도 중심 레이아웃, 따뜻한 톤, 인증 배지 강조' },
      { k: '기술 범위', v: '위치 1분 폴링 · 매칭 스코어 API · 채팅 (웹소켓은 2차)' },
      { k: '일정', v: '시안 3일 · 프로토타입 5일 · QA 2일' },
    ],
  },
};

export type FileDef = {
  name: string;
  ext: string;
  at: number;
  owner: AgentId;
  meta: string;
  color: string;
  kind: 'doc' | 'img' | 'code';
  lines?: { h: string; p: string }[];
  shots?: string[];
  tree?: string[];
};

export const FILES: FileDef[] = [
  {
    name: '1차 구상 보고서', ext: 'PDF', at: 2, owner: 'planner', meta: '기획자 · 2p',
    color: 'oklch(0.85 0.06 250)', kind: 'doc',
    lines: [
      { h: '1. 서비스 개요', p: '동네 기반 반려견 산책 메이트 매칭. 이웃과 산책을 나눠 공백을 해결합니다.' },
      { h: '2. 타깃', p: '20–30대 1인 가구 반려인, 평일 산책 시간이 부족한 직장인.' },
      { h: '3. 시장성', p: '반려 가구 증가, 대행 서비스 대비 낮은 가격대로 진입 가능.' },
      { h: '4. 리스크와 대안', p: '신뢰 문제 → 본인 인증, 리뷰 배지, 첫 산책 공개 장소 권장.' },
      { h: '5. 다음 단계', p: '화면/기능정의서 작성 후 디자인 · 개발과 삼자 회의.' },
    ],
  },
  {
    name: '기획서 · 화면/기능정의서', ext: 'PDF', at: 6, owner: 'planner', meta: '기획자 · 24p',
    color: 'oklch(0.85 0.06 250)', kind: 'doc',
    lines: [
      { h: '1. 서비스 정의', p: '매칭 → 채팅 → 산책 기록, 3단계 핵심 플로우.' },
      { h: '2. 정보 구조', p: '홈(지도) · 매칭 · 채팅 · 기록 · 마이 5개 탭.' },
      { h: '3. 화면 정의', p: '온보딩 3스텝, 매칭 지도, 프로필, 채팅, 산책 기록.' },
      { h: '4. 기능 명세', p: '거리 + 시간대 가중치 매칭, 1분 위치 갱신, 리뷰.' },
      { h: '5. 예외 정책', p: '매칭 거절 시 대체 추천, 노쇼 2회 시 일시 제한.' },
    ],
  },
  {
    name: 'UI 디자인 가이드 · 시안', ext: 'PNG', at: 6, owner: 'designer', meta: '디자이너 · 18장',
    color: 'oklch(0.85 0.06 350)', kind: 'img',
    shots: ['온보딩', '매칭 지도', '프로필', '채팅', '산책 기록', '컬러 · 타입'],
  },
  {
    name: '프로토타입 코드', ext: 'ZIP', at: 7, owner: 'dev', meta: '개발자 · 3.2MB',
    color: 'oklch(0.85 0.06 150)', kind: 'code',
    tree: ['walkmate-prototype/', '├─ src/', '│  ├─ screens/', '│  │  ├─ Onboarding.tsx', '│  │  ├─ MatchMap.tsx', '│  │  └─ Chat.tsx', '│  ├─ api/', '│  │  ├─ match.ts', '│  │  └─ location.ts', '│  └─ App.tsx', '├─ README.md', '└─ package.json'],
  },
  {
    name: 'QA 보고서', ext: 'PDF', at: 7, owner: 'qa', meta: '검수자 · 이슈 6건 반영',
    color: 'oklch(0.85 0.06 75)', kind: 'doc',
    lines: [
      { h: '요약', p: '치명 이슈 0건 · 개선 제안 6건 반영 완료.' },
      { h: '#1 온보딩 이탈', p: '반려견 사진 입력을 선택 항목으로 변경.' },
      { h: '#2 매칭 거절 후 빈 화면', p: '대체 추천 리스트 노출로 수정.' },
      { h: '#3 채팅 첫 메시지', p: '추천 인사말 칩 3개 추가.' },
      { h: '#4–6 문구 · 접근성', p: '버튼 문구 통일, 대비율 보정, 터치 영역 44px.' },
    ],
  },
];

export const GRAPH = ['IDEATION', 'SPEC_DRAFT', 'DEV_FEASIBILITY', 'QA'];

export const SPARK = Array.from({ length: 22 }, (_, i) => ({
  x: 380 + ((i * 137) % 640),
  y: 120 + ((i * 89) % 380),
  size: 6 + (i % 3) * 3,
  delay: ((i * 0.17) % 1.6).toFixed(2),
  color: ['oklch(0.72 0.12 250)', 'oklch(0.72 0.12 350)', 'oklch(0.72 0.12 150)', 'oklch(0.72 0.13 75)'][i % 4],
}));
