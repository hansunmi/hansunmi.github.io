import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { getGlossary } from '../api';
import { color, radius } from '../theme/tokens';
import { Txt } from './Txt';

/**
 * 인라인 용어 해설.
 * - 용어를 누르면 그 자리 아래에 말풍선이 열린다.
 * - 화면의 다른 곳을 누르면 닫히고, 한 번에 하나만 열린다.
 */
type TermState = { open: string | null; toggle: (id: string) => void };
const TermCtx = createContext<TermState>({ open: null, toggle: () => {} });

export function TermScope({
  children,
  style,
  initialOpen = null,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 처음부터 열어 둘 말풍선 */
  initialOpen?: string | null;
}) {
  const [open, setOpen] = useState<string | null>(initialOpen);
  const openRef = useRef(open);
  openRef.current = open;
  // 터치가 시작될 때 열려 있던 말풍선 (같은 용어를 다시 누르면 닫히게)
  const beforeTouch = useRef<string | null>(null);

  return (
    <TermCtx.Provider
      value={{
        open,
        toggle: (id) => setOpen(beforeTouch.current === id ? null : id),
      }}
    >
      <View
        style={style}
        onStartShouldSetResponderCapture={() => {
          beforeTouch.current = openRef.current;
          if (openRef.current) setOpen(null);
          return false;
        }}
      >
        {children}
      </View>
    </TermCtx.Provider>
  );
}

export function useTerm() {
  return useContext(TermCtx);
}

/** 점선 밑줄 용어. 반드시 Txt 안에 중첩해서 쓴다 (글꼴은 부모를 따른다). */
export function TermText({
  id,
  term,
  children,
  underlineColor,
}: {
  id: string;
  term: string;
  children?: ReactNode;
  underlineColor?: string;
}) {
  const { toggle } = useTerm();
  return (
    <Text
      onPress={() => toggle(id)}
      accessibilityRole="button"
      accessibilityHint={`${term} 뜻 보기`}
      style={[styles.term, underlineColor ? { textDecorationColor: underlineColor } : null]}
    >
      {children ?? term}
    </Text>
  );
}

/** 말풍선. arrowLeft를 주면 위쪽에 꼬리가 생긴다. */
export function TermBubble({
  id,
  term,
  arrowLeft,
  style,
}: {
  id: string;
  term: string;
  arrowLeft?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { open } = useTerm();
  if (open !== id) return null;
  return (
    <TooltipBox arrowLeft={arrowLeft} style={style}>
      <Txt v="body" c={color.text.inverse} style={styles.tipText}>
        <Txt v="body" w="bold" c={color.text.inverse}>
          {term}
        </Txt>
        {' — '}
        {getGlossary()[term]}
      </Txt>
    </TooltipBox>
  );
}

export function TooltipBox({
  children,
  arrowLeft,
  style,
}: {
  children: ReactNode;
  arrowLeft?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style} accessibilityLiveRegion="polite">
      {arrowLeft != null && <View style={[styles.arrow, { left: arrowLeft - 8 }]} />}
      <View style={styles.bubble}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  term: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: color.text.primary,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color.tooltip.bg,
  },
  bubble: {
    backgroundColor: color.tooltip.bg,
    borderRadius: radius.button,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tipText: {
    lineHeight: 19,
  },
});
