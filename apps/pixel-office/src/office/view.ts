import {
  AG,
  CEO,
  DESK,
  FILES,
  GRAPH,
  LAST_PHASE,
  MODALS,
  ORDER,
  PHASES,
  SPARK,

  type AgentState,
} from './data';
import type { MouseEvent } from 'react';
import { buildLog, nextStamp, type LogLine } from './log';
import { sprites } from './sprites';
import type { OfficeActions, OfficeState } from './useOffice';

const MAP_W = 1360;
const MAP_H = 560;
const STEP_TOTAL = PHASES.length;
const DEFAULT_IDEA = '반려견 산책 메이트 매칭 앱';

function progressOf(s: AgentState): number {
  if (s.done) return 100;
  if (s.monitor) return 64;
  if (/회의/.test(s.status)) return 35;
  if (/보고|수령/.test(s.status)) return 80;
  if (/준비/.test(s.status)) return 20;
  return 0;
}

type BuildArgs = {
  state: OfficeState;
  actions: OfficeActions;
  showBubbles: boolean;
};

/** 레퍼런스 logic class 의 renderVals() 를 그대로 옮긴 파생 값 계산. */
export function buildView({ state, actions, showBubbles }: BuildArgs) {
  const { selected, walking, typed } = state;
  const SP = sprites();

  const archived = state.viewing ? state.history.find((h) => h.id === state.viewing) ?? null : null;
  const phase = archived ? LAST_PHASE : state.phase;
  const P = PHASES[phase];

  const agents = ORDER.map((id) => {
    const s = P.agents[id];
    const meta = AG[id];
    const w = !!walking[id];
    const atCeo = s.pos === CEO;
    return {
      id,
      ...meta,
      status: w ? '이동 중' : s.status,
      walking: w,
      bubble: s.bubble ? s.bubble.slice(0, typed) : '',
      caret: s.bubble && typed < s.bubble.length ? 'inline-block' : 'none',
      hasBubble: showBubbles && !!s.bubble && !w && typed > 0,
      left: s.pos[0] - 16,
      top: s.pos[1] - 44,
      sprite: SP[id],
      sheetAnim: w ? 'sheet2 .32s steps(2) infinite' : 'none',
      z: s.pos[1] > 300 ? 25 : atCeo ? 12 : 18,
      tagBg: selected === id ? meta.color : '#fffdf7',
      bodyAnim: w
        ? 'bob .25s steps(2) infinite'
        : s.monitor
          ? 'breathe .5s steps(2) infinite'
          : 'breathe 2.4s steps(2) infinite',
      carry: atCeo,
      dotAnim:
        s.monitor || /회의|보고|검수|수령/.test(s.status) ? 'blink 1s steps(2) infinite' : 'none',
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        actions.selectAgent(id);
      },
    };
  });

  const files = FILES.map((f, i) => {
    const ready = phase >= f.at;
    const working = !ready && phase >= f.at - 2 && phase > 0;
    return {
      ...f,
      index: i,
      locked: !ready,
      opacity: ready ? 1 : 0.45,
      metaText: ready ? f.meta : working ? '작성 중…' : '대기',
      action: ready ? '미리보기' : '잠김',
      onClick: () => actions.setPreview(i),
    };
  });

  const readyIdx = files.map((f, i) => (!f.locked ? i : -1)).filter((i) => i >= 0);
  const readyCount = readyIdx.length;

  const popup = (() => {
    if (!selected) return null;
    const s = P.agents[selected];
    const outputs = files
      .filter((f) => f.owner === selected && !f.locked)
      .map((f) => ({
        name: f.name,
        ext: f.ext,
        color: f.color,
        open: () => actions.setPreview(f.index, true),
      }));
    return {
      ...AG[selected],
      sprite: SP[selected],
      status: walking[selected] ? '이동 중' : s.status,
      task: s.task,
      thought: s.thought,
      progress: progressOf(s),
      statusBg: s.done ? 'oklch(0.85 0.1 150)' : s.monitor ? 'oklch(0.85 0.1 200)' : '#f1ece0',
      outputs,
      noOutputs: outputs.length === 0,
      left: Math.min(Math.max(s.pos[0] + 30, 10), MAP_W - 320),
      top: Math.min(Math.max(s.pos[1] - 140, 10), MAP_H - 380),
    };
  })();

  const desks = ORDER.map((id, i) => {
    const s = P.agents[id];
    const on = !!s.monitor;
    return {
      id,
      left: DESK[id][0] - 65,
      top: DESK[id][1] - 4,
      screen: on ? 'oklch(0.85 0.12 200)' : '#3a4048',
      scanImg: on ? 'linear-gradient(rgba(36,33,28,.18) 1px,transparent 1px)' : 'none',
      scanAnim: on ? 'scan .6s steps(4) infinite' : 'none',
      glow: on ? '0 0 10px oklch(0.85 0.12 200)' : 'none',
      done: !!s.done,
      delay: (i * 0.25).toFixed(2),
      steam: !!s.coffee && s.pos === DESK[id],
      fan: id === 'planner' || id === 'dev',
    };
  });

  const gi = P.graph;
  const graph = GRAPH.map((label, i) => {
    const st = gi > i ? 'done' : gi === i ? 'active' : 'todo';
    return {
      label: (st === 'done' ? '✓ ' : '') + label,
      arrow: i < GRAPH.length - 1,
      bg: st === 'active' ? 'oklch(0.72 0.13 75)' : 'transparent',
      fg: st === 'active' ? '#24211c' : st === 'done' ? 'oklch(0.8 0.12 150)' : '#8a8478',
      border:
        st === 'active'
          ? 'oklch(0.72 0.13 75)'
          : st === 'done'
            ? 'oklch(0.6 0.1 150)'
            : '#4a453c',
    };
  });

  const logRaw: LogLine[] = archived ? archived.log : buildLog(phase, state.extra);
  const log = logRaw.map((l, i) => ({
    ...l,
    anim: i === 0 && !archived ? 'fadeUp .4s steps(4)' : 'none',
  }));

  const modalDef = !archived && P.modal && !walking.planner ? MODALS[P.modal] : null;
  const stamp = () => nextStamp(logRaw);

  const pvIdx = state.preview;
  const pf = pvIdx != null ? files[pvIdx] : null;
  const pv = pf
    ? {
        name: pf.name,
        ext: pf.ext,
        color: pf.color,
        meta: pf.meta,
        owner: AG[pf.owner].name,
        isDoc: pf.kind === 'doc',
        isImg: pf.kind === 'img',
        isCode: pf.kind === 'code',
        lines: pf.lines ?? [],
        shots: pf.shots ?? [],
        tree: pf.tree ?? [],
        toc: (pf.lines
          ? pf.lines.map((l) => l.h)
          : pf.shots
            ? pf.shots
            : ['src/screens · 화면 3종', 'src/api · 매칭 · 위치', 'README · 실행 방법']
        ).map((t, i) => ({ n: String(i + 1).padStart(2, '0'), t })),
      }
    : null;

  const stepPreview = (d: number) => {
    if (pvIdx == null) return;
    const k = readyIdx.indexOf(pvIdx);
    if (k < 0) return;
    actions.setPreview(readyIdx[(k + d + readyIdx.length) % readyIdx.length]);
  };

  return {
    // ── 프로젝트 · 히스토리
    projectName: archived ? archived.name : state.projectName,
    projectKicker: archived ? `보관됨 · ${archived.date}` : '현재 프로젝트',
    isArchive: !!archived,
    menuOpen: state.menuOpen,
    toggleMenu: actions.toggleMenu,
    currentName: state.projectName,
    currentMeta:
      state.phase === 0
        ? '지시서 대기'
        : `${state.phase + 1}/${STEP_TOTAL} · ${PHASES[state.phase].title}`,
    currentRowBg: archived ? 'transparent' : '#f1ece0',
    viewCurrent: actions.viewCurrent,
    history: state.history.map((h) => ({
      ...h,
      bg: archived && archived.id === h.id ? '#f1ece0' : 'transparent',
      open: () => actions.openHistory(h.id),
      remove: () => actions.removeHistory(h.id),
    })),
    historyCount: state.history.length,
    historyEmpty: state.history.length === 0,

    // ── 맵
    graph,
    agents,
    desks,
    popup,
    closePopup: actions.closePopup,
    bgClick: actions.closeOverlays,
    ceoSprite: SP.ceo,

    // ── 단계
    stepLabel: `${phase + 1}/${STEP_TOTAL} · ${P.title.split(' ')[0]}`,
    steps: PHASES.map((_, i) => ({
      bg: i < phase ? '#24211c' : i === phase ? 'oklch(0.72 0.13 75)' : 'transparent',
    })),
    prev: () => !archived && actions.go(phase - 1),
    next: () => !archived && actions.go(phase + 1),
    phaseKicker: P.kicker,
    phaseTitle: P.title,
    phaseDesc: P.desc,
    waitingCeo: !!P.modal && !archived,
    meetingLive: !!P.meeting && !walking.planner,
    meetingBg: P.meeting ? '#d3e2d6' : '#dfe6e0',
    ceoStamp: !archived && (phase === 3 || phase === 5) && typed < 40,
    sparkles: SPARK,
    celebrate: state.celebrate && !archived,

    // ── 산출물 서류함
    files,
    readyCount,
    cabinetBadge: readyCount > 0,
    notAllReady: readyCount < FILES.length,
    cabinetAnim: phase === LAST_PHASE ? 'pulse 1.4s steps(4) infinite' : 'none',
    allBtnBg: readyCount < FILES.length ? '#e9e4d8' : 'oklch(0.72 0.14 150)',
    allBtnFg: readyCount < FILES.length ? '#a9a397' : '#24211c',
    downloadAll: () => actions.showToast('최종 서비스 개발 팩.zip 다운로드 (데모)'),
    openCabinet: (e: MouseEvent) => {
      e.stopPropagation();
      if (readyIdx.length) {
        actions.setPreview(readyIdx[readyIdx.length - 1]);
      } else {
        actions.flashCabinet();
        actions.showToast('아직 서류함이 비어 있어요');
      }
    },
    cabinetFlash: state.flash ? '#efe3c8' : '#fbf9f4',

    // ── 산출물 미리보기
    pv,
    closePreview: () => actions.setPreview(null),
    pvPrev: () => stepPreview(-1),
    pvNext: () => stepPreview(1),
    pvDownload: () => pf && actions.showToast(`${pf.name}.${pf.ext.toLowerCase()} 다운로드 (데모)`),

    // ── CEO 지시서
    prompt: state.prompt,
    onPrompt: (value: string) => actions.setPrompt(value),
    promptLocked: !!archived || (phase > 0 && phase < LAST_PHASE),
    attachments: state.attachments.map((a, i) => ({
      ...a,
      remove: () => actions.removeAttachment(i),
    })),
    attach: actions.attach,
    submitLabel: archived
      ? '현재 프로젝트로 돌아가기'
      : phase === 0
        ? '기획자에게 전달 ▶'
        : phase === LAST_PHASE
          ? '새 프로젝트 시작'
          : '진행 중…',
    submitBg:
      archived || phase === 0 || phase === LAST_PHASE ? 'oklch(0.82 0.1 75)' : '#e9e4d8',
    submit: () => {
      if (archived) return actions.viewCurrent();
      if (phase === LAST_PHASE) {
        actions.showToast('이전 프로젝트는 히스토리에 보관되었습니다');
        return actions.newProject();
      }
      if (phase !== 0) return;
      actions.submit(state.prompt.trim() || DEFAULT_IDEA);
    },

    // ── 대화로그
    log,
    logEmpty: log.length === 0,

    // ── 결재 모달
    modal: modalDef,
    memo: state.memo,
    onMemo: (value: string) => actions.setMemo(value),
    approve: () => actions.decide('승인합니다. 진행해 주세요.', stamp() + 2, phase + 1),
    revise: () =>
      actions.decide(
        `수정 요청: ${state.memo.trim() || '보완 후 다시 보고해 주세요.'}`,
        stamp(),
        phase - 1,
      ),

    // ── 시작 화면 · 토스트
    hasIntro: state.intro,
    introAgents: ORDER.map((id, i) => ({
      ...AG[id],
      sprite: SP[id],
      delay: (0.15 + i * 0.1).toFixed(2),
    })),
    enter: actions.enter,
    toast: state.toast,
  };
}

export type OfficeView = ReturnType<typeof buildView>;
export type AgentView = OfficeView['agents'][number];
export type FileView = OfficeView['files'][number];
export type PopupView = NonNullable<OfficeView['popup']>;
export type PreviewView = NonNullable<OfficeView['pv']>;

