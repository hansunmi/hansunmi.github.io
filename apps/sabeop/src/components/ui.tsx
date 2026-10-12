import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { color, radius, space, type TypeKey } from '../theme/tokens';
import { Icon } from './Icon';
import { Txt } from './Txt';

/** 외부 이동은 안내만 띄우고 끝낸다 (README 4장) */
export function goExternal(onDone?: () => void) {
  const msg = '외부 사이트로 이동해요';
  if (Platform.OS === 'web') {
    window.alert(msg);
    onDone?.();
  } else Alert.alert(msg, undefined, [{ text: '확인', onPress: onDone }]);
}

export function notify(title: string, message?: string) {
  if (Platform.OS === 'web') window.alert(message ? `${title}\n${message}` : title);
  else Alert.alert(title, message);
}

/** 섹션 구분 회색 띠 — 의도된 디자인이므로 지우지 말 것 */
export function Band({ thin = false }: { thin?: boolean }) {
  return <View style={{ height: thin ? space.bandThin : space.band, backgroundColor: color.bg.base }} />;
}

export function Tag({
  label,
  bg,
  fg = color.text.inverse,
  v = 'body',
  style,
}: {
  label: string;
  bg: string;
  fg?: string;
  v?: TypeKey;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }, style]}>
      <Txt v={v} w="semibold" c={fg}>
        {label}
      </Txt>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  /** neutral: 회색 테두리 보조 버튼 (이전 등) */
  variant?: 'filled' | 'outline' | 'neutral';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const filled = variant === 'filled';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        filled
          ? { backgroundColor: color.brand[700] }
          : variant === 'outline'
            ? styles.outline
            : styles.neutral,
        disabled && styles.disabled,
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
    >
      <Txt v="title" c={filled ? color.text.inverse : variant === 'outline' ? color.brand[700] : color.text.primary}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** 탭 첫 화면 헤더: 왼쪽 제목 + 종 아이콘. 제목을 길게 누르면 개발 메뉴 */
export function TabHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const { openDevMenu } = useAppState();
  return (
    <View style={[styles.tabHeader, { paddingTop: insets.top }]}>
      <Pressable onLongPress={openDevMenu} delayLongPress={600} accessibilityHint="길게 누르면 개발 메뉴">
        <Txt v="h3" w="semibold">
          {title}
        </Txt>
      </Pressable>
      <Pressable
        onPress={() => notify('알림', '새 소식이 있어요')}
        accessibilityRole="button"
        accessibilityLabel="알림, 안 읽은 알림 있음"
        hitSlop={6}
        style={styles.bell}
      >
        <Icon name="bell" size={18} color={color.text.primary} strokeWidth={1.5} />
        <View style={styles.bellDot} />
      </Pressable>
    </View>
  );
}

/** 하위 화면 헤더: 뒤로 가기 + 가운데 제목 */
export function SubHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.subHeader, { paddingTop: insets.top }]}>
      <Pressable
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        style={styles.back}
      >
        <Icon name="arrowLeft" size={24} strokeWidth={1.5} />
      </Pressable>
      <Txt v="h3" w="semibold" style={styles.subTitle}>
        {title}
      </Txt>
      <View style={styles.back} />
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: radius.tag,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  button: {
    height: 46,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: { backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.line.brand },
  neutral: { backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.line.divider },
  disabled: { opacity: 0.4 },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    minHeight: 34,
    backgroundColor: color.bg.surface,
  },
  bell: {
    width: 32,
    height: 32,
    marginRight: -2,
    borderRadius: 16,
    backgroundColor: color.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: color.text.primary,
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: color.state.alert,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: color.bg.surface,
  },
  back: {
    width: space.touch,
    height: space.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: { flex: 1, textAlign: 'center' },
});
