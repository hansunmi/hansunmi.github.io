import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { color, layout } from '../theme/tokens';

/**
 * 웹 정적 HTML 루트.
 * 넓은 화면의 폰 프레임을 CSS로 그려서, JS가 뜨기 전 첫 화면부터 프레임 안에 보이게 한다.
 * (WebFrame의 data-sbframe 속성을 대상으로 한다. RN Web의 클래스 스타일을 이기려고 !important)
 */
const { deviceWidth: W, deviceHeight: H } = layout;

const frameCss = `
[data-sbframe="chrome"], [data-sbframe="panel"] { display: none !important; }

@media (min-width: 600px) {
  [data-sbframe="page"] {
    align-items: center !important;
    justify-content: center !important;
    background-color: ${color.bg.base} !important;
  }
  [data-sbframe="device"] {
    flex: none !important;
    width: ${W}px !important;
    height: ${H}px !important;
    border-radius: 48px !important;
    overflow: hidden !important;
    background-color: ${color.bg.surface} !important;
    box-shadow: 0 16px 40px rgba(29, 31, 32, 0.18) !important;
  }
  /* iPhone 15 안전 영역: 상태 바 59 · 홈 인디케이터 34 */
  [data-sbframe="app"] { padding-top: 59px !important; padding-bottom: 34px !important; }
  [data-sbframe="chrome"] { display: flex !important; }
}
/* 창 높이가 낮으면 프레임을 줄인다 */
@media (min-width: 600px) and (max-height: ${H + 48}px) { [data-sbframe="device"] { transform: scale(0.92); } }
@media (min-width: 600px) and (max-height: 840px) { [data-sbframe="device"] { transform: scale(0.85) !important; } }
@media (min-width: 600px) and (max-height: 780px) { [data-sbframe="device"] { transform: scale(0.78) !important; } }
@media (min-width: 600px) and (max-height: 720px) { [data-sbframe="device"] { transform: scale(0.72) !important; } }
@media (min-width: 600px) and (max-height: 660px) { [data-sbframe="device"] { transform: scale(0.64) !important; } }

@media (min-width: 960px) {
  [data-sbframe="panel"] { display: flex !important; }
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>사법길잡이 2026 · 프로토타입</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: frameCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
