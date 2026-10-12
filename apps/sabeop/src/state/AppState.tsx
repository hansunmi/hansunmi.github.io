import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getInitialScenario, type Scenario } from '../api';

/** 진단 응답. 값은 선택지 id, 'unknown'은 '잘 모르겠어요' */
export type DiagnosisAnswers = {
  type?: string;
  amount?: string;
  party?: string;
};

type AppState = {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  devMenuOpen: boolean;
  openDevMenu: () => void;
  closeDevMenu: () => void;
  answers: DiagnosisAnswers;
  setAnswers: (a: DiagnosisAnswers) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario>(getInitialScenario());
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({});

  const value = useMemo(
    () => ({
      scenario,
      setScenario,
      devMenuOpen,
      openDevMenu: () => setDevMenuOpen(true),
      closeDevMenu: () => setDevMenuOpen(false),
      answers,
      setAnswers,
    }),
    [scenario, devMenuOpen, answers],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppStateProvider가 필요해요');
  return v;
}
