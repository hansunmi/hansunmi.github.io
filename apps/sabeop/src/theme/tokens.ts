/**
 * 디자인 토큰 — 사법길잡이 구현 명세(README) 1장 기준.
 * 화면 코드에서는 색 · 글꼴 · 간격을 반드시 이 파일의 값으로만 지정한다.
 */

export const color = {
  bg: {
    base: '#F2F2F3',
    surface: '#FFFFFF',
  },
  text: {
    primary: '#1D1F20',
    secondary: 'rgba(29, 31, 32, 0.68)',
    // 비활성 탭 · 미래 단계 등 (#1D1F20 @ 40%)
    disabled: 'rgba(29, 31, 32, 0.4)',
    inverse: '#FFFFFF',
  },
  line: {
    divider: 'rgba(29, 31, 32, 0.16)',
    // 테두리 버튼 (brand.500 @ 50%, 이미지 실측 #ACBFD3)
    brand: 'rgba(89, 128, 166, 0.5)',
  },
  brand: {
    100: '#EEF6FF',
    500: '#5980A6',
    700: '#416180',
    800: '#2C455D',
    900: '#1D2D3D',
  },
  sub: {
    300: '#F5B26B',
  },
  agency: {
    police: '#3A5EA8',
    nis: '#9A4A1E',
    prosecution: '#2A7A4A',
  },
  state: {
    neutral: '#6B6F75',
    // ↓ README 표에는 없고 디자인 이미지에서 추출한 값
    selected: '#2196F3', // SCR-02 선택 카드 테두리 · 라디오, SCR-05 선택 일자
    alert: '#FF5454', // 안 읽은 알림 빨간 점
    warning: '#C2570C', // 예외: "정보 갱신 지연" 주황 태그
    placeholder: '#E6E8EB', // 증거 썸네일 · 빈 단계 원
  },
  tooltip: {
    bg: '#1B1D1F',
  },
} as const;

export type AgencyKey = keyof typeof color.agency;

export const font = {
  light: 'Pretendard-Light',
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extrabold: 'Pretendard-ExtraBold',
} as const;

/** 자간: 기본 -1%, 큰 제목 -2.5% (RN letterSpacing은 pt 단위라 크기에 곱한다) */
const ls = (size: number, ratio = -0.01) => size * ratio;

/**
 * 글자 크기는 디자인 이미지에서 글자 폭을 Pretendard 실제 자폭으로 역산한 값.
 * (README 표의 app.h1 21은 이미지에서 24로 측정되어 이미지 기준을 따름)
 */
export const type = {
  h1: { fontFamily: font.bold, fontSize: 24, lineHeight: 34, letterSpacing: ls(24, -0.025) },
  h2: { fontFamily: font.bold, fontSize: 20, lineHeight: 28, letterSpacing: ls(20, -0.025) },
  h3: { fontFamily: font.bold, fontSize: 18, lineHeight: 25, letterSpacing: ls(18, -0.025) },
  title: { fontFamily: font.bold, fontSize: 16, lineHeight: 22, letterSpacing: ls(16) },
  body: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, letterSpacing: ls(14) },
  label: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, letterSpacing: ls(13) },
  caption: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, letterSpacing: ls(12) },
  dday: { fontFamily: font.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: ls(34, -0.025) },
} as const;

export type TypeKey = keyof typeof type;

export const radius = {
  card: 14,
  button: 12,
  chip: 999,
  tag: 6,
} as const;

export const space = {
  // 디자인 이미지 기준 실측값 (README 표기: 화면 16 / 카드 14)
  screenX: 20,
  cardPad: 16,
  band: 10,
  bandThin: 6,
  touch: 44,
} as const;

export const layout = {
  deviceWidth: 393,
  deviceHeight: 852,
} as const;
