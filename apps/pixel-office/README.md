# 픽셀한스 AI 오피스 (React 재구현)

`design_handoff_pixel_office/` 의 HTML 디자인 레퍼런스를 React + Vite + TypeScript 로
재구현한 앱이다. 브라우저에서 레퍼런스를 열었을 때와 동일하게 동작한다.

## 라우팅 (HashRouter)
- `/#/` — 포트폴리오 케이스 스터디
- `/#/demo` — 오피스 데모 (1440 × 900)

케이스 스터디는 데모를 iframe 으로 임베드하고, 컨테이너 폭에 맞춰 `scale()` 로 축소한다.

## 실행
```bash
npm install
npm run dev      # 개발 서버
npm run build    # 빌드 → ../../pixel-office (레포 루트의 /pixel-office/)
```

`vite.config.ts` 의 `base` 가 `/pixel-office/`, `outDir` 이 레포 루트의 `pixel-office/` 이므로,
빌드 결과를 커밋하면 `https://hansunmi.github.io/pixel-office/` 로 바로 배포된다.

## 구조
```
src/
  lib/css.ts        레퍼런스 인라인 스타일을 선언 단위로 그대로 옮기는 헬퍼
  lib/variant.ts    레퍼런스의 style-hover / style-focus / style-active 재현
  office/
    data.ts         시나리오 데이터 (PHASES · MODALS · FILES · 좌표)
    sprites.ts      16×24 문자열 맵 → canvas 2프레임 스프라이트
    log.ts          대화로그 생성 · localStorage(pixelOffice.history)
    useOffice.ts    useReducer 상태 + 자동진행 · 걷기 · 타이핑 타이머
    view.ts         레퍼런스 renderVals() 에 대응하는 파생 값
    OfficeApp.tsx   1440×900 레이아웃 조립
    components/     TopBar · OfficeMap · BottomPanel · 모달 · 시작 화면
  case/             케이스 스터디 페이지와 문구 데이터
```

## 상태 저장
서버 · DB · AI API 없음. 완료된 프로젝트는 `localStorage` 의 `pixelOffice.history` 에 보관된다.
