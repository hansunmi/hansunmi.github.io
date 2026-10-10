import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CaseStudyPage } from './case/CaseStudyPage';
import { DemoPage } from './DemoPage';

/** GitHub Pages 배포를 위해 HashRouter 를 쓴다. `/#/` 케이스 스터디, `/#/demo` 오피스 데모. */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CaseStudyPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
