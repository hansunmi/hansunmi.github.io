import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { LAST_PHASE, ORDER, PHASES, type AgentId } from './data';
import {
  buildLog,
  loadHistory,
  saveHistory,
  todayStamp,
  type ExtraLog,
  type HistoryEntry,
} from './log';
import { buildView } from './view';

export type Attachment = { name: string; ext: string };

export type OfficeProps = {
  /** 단계 자동 진행 */
  autoplay?: boolean;
  /** 자동 진행 간격(초) */
  stepSeconds?: number;
  /** 시작 화면 노출 */
  showIntro?: boolean;
  /** 말풍선 노출 */
  showBubbles?: boolean;
};

export type OfficeState = {
  phase: number;
  selected: AgentId | null;
  prompt: string;
  attachments: Attachment[];
  projectName: string;
  extra: ExtraLog[];
  memo: string;
  toast: string | null;
  flash: boolean;
  history: HistoryEntry[];
  viewing: number | null;
  menuOpen: boolean;
  pid: number | null;
  intro: boolean;
  walking: Partial<Record<AgentId, boolean>>;
  typed: number;
  celebrate: boolean;
  preview: number | null;
};

const IDLE_PROJECT_NAME = '새 프로젝트 대기 중';

type Action =
  | { type: 'goto'; phase: number }
  | { type: 'setPrompt'; value: string }
  | { type: 'setMemo'; value: string }
  | { type: 'attach' }
  | { type: 'removeAttachment'; index: number }
  | { type: 'setToast'; value: string | null }
  | { type: 'setFlash'; value: boolean }
  | { type: 'setHistory'; history: HistoryEntry[] }
  | { type: 'openHistory'; id: number }
  | { type: 'removeHistory'; id: number }
  | { type: 'viewCurrent' }
  | { type: 'toggleMenu' }
  | { type: 'closeOverlays' }
  | { type: 'selectAgent'; id: AgentId }
  | { type: 'closePopup' }
  | { type: 'setPreview'; index: number | null; closePopup?: boolean }
  | { type: 'enter' }
  | { type: 'setWalking'; walking: Partial<Record<AgentId, boolean>> }
  | { type: 'setTyped'; value: number }
  | { type: 'setCelebrate'; value: boolean }
  | { type: 'submit'; name: string; text: string; pid: number }
  | { type: 'newProject' }
  | { type: 'decide'; text: string; min: number; phase: number };

function clampPhase(n: number): number {
  return Math.max(0, Math.min(LAST_PHASE, n));
}

function reducer(state: OfficeState, action: Action): OfficeState {
  switch (action.type) {
    case 'goto': {
      const phase = clampPhase(action.phase);
      if (phase === state.phase) return state;
      return { ...state, phase, selected: null, memo: '' };
    }
    case 'setPrompt':
      return { ...state, prompt: action.value };
    case 'setMemo':
      return { ...state, memo: action.value };
    case 'attach':
      return {
        ...state,
        attachments: [
          ...state.attachments,
          state.attachments.length % 2
            ? { name: '와이어프레임.png', ext: 'IMG' }
            : { name: '시장조사.txt', ext: 'TXT' },
        ],
      };
    case 'removeAttachment':
      return { ...state, attachments: state.attachments.filter((_, i) => i !== action.index) };
    case 'setToast':
      return { ...state, toast: action.value };
    case 'setFlash':
      return { ...state, flash: action.value };
    case 'setHistory':
      return { ...state, history: action.history };
    case 'openHistory':
      return { ...state, viewing: action.id, menuOpen: false, selected: null };
    case 'removeHistory': {
      const history = state.history.filter((h) => h.id !== action.id);
      return { ...state, history, viewing: state.viewing === action.id ? null : state.viewing };
    }
    case 'viewCurrent':
      return { ...state, viewing: null, menuOpen: false, selected: null };
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    case 'closeOverlays':
      if (!state.selected && !state.menuOpen) return state;
      return { ...state, selected: null, menuOpen: false };
    case 'selectAgent':
      return { ...state, selected: state.selected === action.id ? null : action.id };
    case 'closePopup':
      return { ...state, selected: null };
    case 'setPreview':
      return { ...state, preview: action.index, selected: action.closePopup ? null : state.selected };
    case 'enter':
      return { ...state, intro: false };
    case 'setWalking':
      return { ...state, walking: action.walking };
    case 'setTyped':
      return state.typed === action.value ? state : { ...state, typed: action.value };
    case 'setCelebrate':
      return { ...state, celebrate: action.value };
    case 'submit':
      return {
        ...state,
        phase: 1,
        pid: action.pid,
        projectName: action.name,
        extra: [{ w: 'ceo', t: action.text, min: 0 }],
      };
    case 'newProject':
      return {
        ...state,
        phase: 0,
        extra: [],
        projectName: IDLE_PROJECT_NAME,
        prompt: '',
        selected: null,
        pid: null,
      };
    case 'decide': {
      const phase = clampPhase(action.phase);
      return {
        ...state,
        extra: [...state.extra, { w: 'ceo', t: action.text, min: action.min }],
        phase,
        selected: null,
        memo: '',
      };
    }
    default:
      return state;
  }
}

function initialState(props: OfficeProps): OfficeState {
  return {
    phase: 0,
    selected: null,
    prompt: '',
    attachments: [{ name: '요구사항_v1.pdf', ext: 'PDF' }],
    projectName: IDLE_PROJECT_NAME,
    extra: [],
    memo: '',
    toast: null,
    flash: false,
    history: loadHistory(),
    viewing: null,
    menuOpen: false,
    pid: null,
    intro: props.showIntro ?? true,
    walking: {},
    typed: 0,
    celebrate: false,
    preview: null,
  };
}

export type OfficeActions = {
  go: (phase: number) => void;
  setPrompt: (value: string) => void;
  setMemo: (value: string) => void;
  attach: () => void;
  removeAttachment: (index: number) => void;
  toggleMenu: () => void;
  viewCurrent: () => void;
  openHistory: (id: number) => void;
  removeHistory: (id: number) => void;
  selectAgent: (id: AgentId) => void;
  closePopup: () => void;
  closeOverlays: () => void;
  setPreview: (index: number | null, closePopup?: boolean) => void;
  enter: () => void;
  showToast: (message: string) => void;
  flashCabinet: () => void;
  submit: (text: string) => void;
  newProject: () => void;
  decide: (text: string, min: number, phase: number) => void;
};

export function useOffice(props: OfficeProps) {
  const [state, dispatch] = useReducer(reducer, props, initialState);
  const { phase, viewing, intro, pid, history, projectName, extra } = state;

  const autoplay = props.autoplay ?? true;
  const stepSeconds = props.stepSeconds ?? 7;

  const typing = useRef<{ delay?: number; interval?: number }>({});
  const toastTimer = useRef<number | undefined>(undefined);
  const flashTimer = useRef<number | undefined>(undefined);
  const celebrateTimer = useRef<number | undefined>(undefined);

  /** 도착(1.65s) 후 말풍선을 38ms/글자로 타이핑한다. */
  const startTyping = useCallback((delay: number) => {
    window.clearTimeout(typing.current.delay);
    window.clearInterval(typing.current.interval);
    dispatch({ type: 'setTyped', value: 0 });
    typing.current.delay = window.setTimeout(() => {
      dispatch({ type: 'setWalking', walking: {} });
      let n = 0;
      typing.current.interval = window.setInterval(() => {
        n += 1;
        dispatch({ type: 'setTyped', value: n });
        if (n >= 60) window.clearInterval(typing.current.interval);
      }, 38);
    }, delay);
  }, []);

  // 보관 프로젝트 열람 중에는 항상 완료 상태(마지막 단계)로 보여준다.
  const effPhase = viewing ? LAST_PHASE : phase;
  const prev = useRef({ phase: effPhase, viewing });

  useEffect(() => {
    startTyping(400);
    return () => {
      window.clearTimeout(typing.current.delay);
      window.clearInterval(typing.current.interval);
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(celebrateTimer.current);
    };
  }, [startTyping]);

  // 단계 전환: 자리를 옮기는 에이전트를 찾아 걷기 모션을 켠다.
  useEffect(() => {
    const from = prev.current.phase;
    const viewChanged = prev.current.viewing !== viewing;
    prev.current = { phase: effPhase, viewing };
    if (from === effPhase && !viewChanged) return;

    const A = PHASES[from].agents;
    const B = PHASES[effPhase].agents;
    const walking: Partial<Record<AgentId, boolean>> = {};
    ORDER.forEach((id) => {
      if (A[id].pos !== B[id].pos) walking[id] = true;
    });
    const moved = Object.keys(walking).length > 0;

    dispatch({ type: 'setWalking', walking });
    startTyping(moved ? 1650 : 200);

    if (effPhase === LAST_PHASE && !viewing && phase === LAST_PHASE) {
      window.clearTimeout(celebrateTimer.current);
      dispatch({ type: 'setCelebrate', value: true });
      celebrateTimer.current = window.setTimeout(
        () => dispatch({ type: 'setCelebrate', value: false }),
        4200,
      );
    }
  }, [effPhase, viewing, phase, startTyping]);

  // 자동 진행 (결재 대기 단계에서는 멈춘다)
  useEffect(() => {
    if (viewing || intro || !autoplay) return;
    if (phase <= 0 || phase >= LAST_PHASE) return;
    if (PHASES[phase].modal) return;
    const t = window.setTimeout(() => dispatch({ type: 'goto', phase: phase + 1 }), stepSeconds * 1000);
    return () => window.clearTimeout(t);
  }, [phase, viewing, intro, autoplay, stepSeconds]);

  // 완료 시 히스토리에 자동 보관
  useEffect(() => {
    if (phase !== LAST_PHASE || !pid) return;
    if (history.some((h) => h.id === pid)) return;
    const next: HistoryEntry[] = [
      { id: pid, name: projectName, date: todayStamp(), log: buildLog(LAST_PHASE, extra) },
      ...history,
    ];
    dispatch({ type: 'setHistory', history: next });
  }, [phase, pid, history, projectName, extra]);

  const actions = useMemo<OfficeActions>(
    () => ({
      go: (n) => dispatch({ type: 'goto', phase: n }),
      setPrompt: (value) => dispatch({ type: 'setPrompt', value }),
      setMemo: (value) => dispatch({ type: 'setMemo', value }),
      attach: () => dispatch({ type: 'attach' }),
      removeAttachment: (index) => dispatch({ type: 'removeAttachment', index }),
      toggleMenu: () => dispatch({ type: 'toggleMenu' }),
      viewCurrent: () => dispatch({ type: 'viewCurrent' }),
      openHistory: (id) => dispatch({ type: 'openHistory', id }),
      removeHistory: (id) => dispatch({ type: 'removeHistory', id }),
      selectAgent: (id) => dispatch({ type: 'selectAgent', id }),
      closePopup: () => dispatch({ type: 'closePopup' }),
      closeOverlays: () => dispatch({ type: 'closeOverlays' }),
      setPreview: (index, closePopup) => dispatch({ type: 'setPreview', index, closePopup }),
      enter: () => dispatch({ type: 'enter' }),
      showToast: (message) => {
        window.clearTimeout(toastTimer.current);
        dispatch({ type: 'setToast', value: message });
        toastTimer.current = window.setTimeout(() => dispatch({ type: 'setToast', value: null }), 2000);
      },
      flashCabinet: () => {
        window.clearTimeout(flashTimer.current);
        dispatch({ type: 'setFlash', value: true });
        flashTimer.current = window.setTimeout(() => dispatch({ type: 'setFlash', value: false }), 600);
      },
      submit: (text) => {
        const name = text.length > 22 ? `${text.slice(0, 22)}…` : text;
        dispatch({ type: 'submit', name, text, pid: Date.now() });
      },
      newProject: () => dispatch({ type: 'newProject' }),
      decide: (text, min, target) => dispatch({ type: 'decide', text, min, phase: target }),
    }),
    [],
  );

  // 히스토리 변경(보관 · 삭제)을 localStorage 에 반영한다.
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const view = useMemo(
    () => buildView({ state, actions, showBubbles: props.showBubbles ?? true }),
    [state, actions, props.showBubbles],
  );

  return view;
}
