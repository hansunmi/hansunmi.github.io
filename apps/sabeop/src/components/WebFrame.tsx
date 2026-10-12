import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import type { Scenario } from '../api';
import { useAppState } from '../state/AppState';
import { color, radius, space } from '../theme/tokens';
import { Txt } from './Txt';

/**
 * 웹에서 넓은 화면으로 열면 iPhone 15(393×852) 프레임 안에 앱을 띄운다.
 * 프레임 여부는 JS가 아니라 CSS 미디어쿼리(src/app/+html.tsx)로 정한다.
 * 그래야 정적 HTML이 처음부터 프레임 안에 그려져, 로딩 중에 전체 화면으로 번쩍이지 않는다.
 * 모바일 브라우저나 네이티브에서는 그대로 전체 화면.
 */
export function WebFrame({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web') return <View style={styles.fill}>{children}</View>;

  return (
    <View style={styles.fill} dataSet={{ sbframe: 'page' }}>
      <View style={styles.fill} dataSet={{ sbframe: 'device' }}>
        <View style={styles.fill} dataSet={{ sbframe: 'app' }}>
          {children}
        </View>
        <View style={styles.statusBar} dataSet={{ sbframe: 'chrome' }} pointerEvents="none">
          <Txt v="title" w="semibold" style={styles.time}>
            9:41
          </Txt>
          <StatusIcons />
        </View>
        <View style={styles.homeIndicator} dataSet={{ sbframe: 'chrome' }} pointerEvents="none" />
      </View>
      <SidePanel />
    </View>
  );
}

const SCENARIOS: { key: Scenario; label: string }[] = [
  { key: 'normal', label: '정상' },
  { key: 'exception', label: '예외' },
];

/** 데스크톱 전용: 프레임 옆 안내 + 개발 메뉴(시나리오) 바로가기 */
function SidePanel() {
  const { scenario, setScenario } = useAppState();
  return (
    <View style={styles.panel} dataSet={{ sbframe: 'panel' }}>
      <Pressable onPress={() => window.location.assign('/#personal')} accessibilityRole="link">
        <Txt v="label" c={color.text.secondary}>
          ← 포트폴리오로
        </Txt>
      </Pressable>
      <Txt v="h3" style={styles.panelTitle}>
        사법길잡이 2026
      </Txt>
      <Txt v="label" c={color.text.secondary}>
        클릭 가능한 프로토타입 · 기준일 2026.10.12
      </Txt>
      <Txt v="caption" c={color.text.secondary} style={styles.panelLabel}>
        시나리오
      </Txt>
      <View style={styles.segment} accessibilityRole="radiogroup">
        {SCENARIOS.map((o) => {
          const on = scenario === o.key;
          return (
            <Pressable
              key={o.key}
              onPress={() => setScenario(o.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={[styles.segItem, on && styles.segOn]}
            >
              <Txt v="label" w={on ? 'bold' : 'regular'} c={on ? color.text.inverse : color.text.primary}>
                {o.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <Txt v="caption" w="regular" c={color.text.secondary} style={styles.panelHint}>
        예외: 내 사건 연동 지연 · 고소장 필수 항목 누락{'\n'}앱 안에서는 탭 화면 제목을 길게 눌러도 바꿀 수 있어요.
      </Txt>
    </View>
  );
}

function StatusIcons() {
  const c = color.text.primary;
  return (
    <Svg width={78} height={14} viewBox="0 0 78 14">
      <Rect x={0} y={9} width={3.2} height={4} rx={1} fill={c} />
      <Rect x={5} y={6.5} width={3.2} height={6.5} rx={1} fill={c} />
      <Rect x={10} y={4} width={3.2} height={9} rx={1} fill={c} />
      <Rect x={15} y={1} width={3.2} height={12} rx={1} fill={c} />
      <Path d="M31 3.6a10 10 0 0 1 13.4 0l-1.6 1.7a7.7 7.7 0 0 0-10.2 0zM33.4 6.3a6.4 6.4 0 0 1 8.6 0l-1.7 1.7a4 4 0 0 0-5.2 0zM35.9 9a2.6 2.6 0 0 1 3.6 0l-1.8 2z" fill={c} />
      <Rect x={51} y={1} width={23} height={12} rx={3.6} stroke={c} strokeOpacity={0.4} fill="none" />
      <Rect x={53} y={3} width={19} height={8} rx={2} fill={c} />
      <Path d="M75.5 5v4a2 2 0 0 0 0-4z" fill={c} fillOpacity={0.4} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 54,
    paddingTop: 18,
    paddingLeft: 44,
    paddingRight: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  time: { fontSize: 17, lineHeight: 22 },
  panel: { position: 'absolute', top: 32, left: 32, width: 260 },
  panelTitle: { marginTop: 16 },
  panelLabel: { marginTop: 20, marginBottom: 6 },
  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: radius.button,
    backgroundColor: color.bg.surface,
    borderWidth: 1,
    borderColor: color.line.divider,
  },
  segItem: { paddingHorizontal: space.cardPad, height: 32, justifyContent: 'center', borderRadius: 9 },
  segOn: { backgroundColor: color.brand[700] },
  panelHint: { marginTop: 10, lineHeight: 18 },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: color.text.primary,
  },
});
