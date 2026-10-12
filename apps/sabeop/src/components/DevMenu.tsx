import { Modal, Pressable, StyleSheet, View } from 'react-native';
import type { Scenario } from '../api';
import { useAppState } from '../state/AppState';
import { color, radius, space } from '../theme/tokens';
import { Txt } from './Txt';

const OPTIONS: { key: Scenario; label: string; desc: string }[] = [
  { key: 'normal', label: '정상', desc: '디자인 시안과 같은 상태' },
  { key: 'exception', label: '예외', desc: '기관 정보 연동 지연 · 고소장 필수 항목 누락' },
];

/** 숨은 개발 메뉴 — 탭 화면 제목(사법길잡이 · 내 사건 · 신청하기)을 길게 누르면 열린다 */
export function DevMenu() {
  const { devMenuOpen, closeDevMenu, scenario, setScenario } = useAppState();
  return (
    <Modal visible={devMenuOpen} transparent animationType="fade" onRequestClose={closeDevMenu}>
      <Pressable style={styles.dim} onPress={closeDevMenu}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Txt v="title">개발 메뉴 · 시나리오</Txt>
          <View style={{ height: 12 }} />
          {OPTIONS.map((o) => {
            const on = scenario === o.key;
            return (
              <Pressable
                key={o.key}
                onPress={() => {
                  setScenario(o.key);
                  closeDevMenu();
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={[styles.option, on && styles.optionOn]}
              >
                <Txt v="body" w="bold">
                  {o.label}
                </Txt>
                <Txt v="caption" c={color.text.secondary}>
                  {o.desc}
                </Txt>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    flex: 1,
    backgroundColor: color.text.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.screenX,
  },
  sheet: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: color.bg.surface,
    borderRadius: radius.card,
    padding: space.cardPad,
  },
  option: {
    borderWidth: 1,
    borderColor: color.line.divider,
    borderRadius: radius.button,
    padding: 12,
    marginTop: 8,
    gap: 2,
    minHeight: space.touch,
  },
  optionOn: { borderColor: color.state.selected, backgroundColor: color.brand[100] },
});
