import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGlossary } from '../api';
import { Icon } from '../components/Icon';
import { TermScope, TooltipBox, useTerm } from '../components/Term';
import { Txt } from '../components/Txt';
import { Button, SubHeader } from '../components/ui';
import { DIAGNOSIS_STEPS, optionLabel } from '../lib/diagnosis';
import { useAppState } from '../state/AppState';
import { color, radius, space } from '../theme/tokens';

export default function DiagnosisScreen() {
  const insets = useSafeAreaInsets();
  const { answers, setAnswers } = useAppState();
  const [stepIndex, setStepIndex] = useState(0);
  const step = DIAGNOSIS_STEPS[stepIndex];
  const selected = answers[step.key];
  const total = DIAGNOSIS_STEPS.length;

  const prev = () => (stepIndex === 0 ? router.back() : setStepIndex(stepIndex - 1));
  const next = () => {
    if (!selected) return;
    if (stepIndex === total - 1) router.push('/result');
    else setStepIndex(stepIndex + 1);
  };

  // 이전 단계에서 고른 답 (칩으로 상단에 표시)
  const previous = DIAGNOSIS_STEPS.slice(0, stepIndex).map((s) => optionLabel(s.key, answers[s.key]));

  return (
    <View style={styles.screen}>
      <SubHeader title="관할 진단" />
      <TermScope style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 4. 진행률 */}
          <View
            style={styles.track}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: total, now: stepIndex + 1 }}
          >
            <View style={[styles.fill, { width: `${((stepIndex + 1) / total) * 100}%` }]} />
          </View>
          <View style={styles.progressRow}>
            <Txt v="label" c={color.text.secondary}>
              진행률
            </Txt>
            <Txt v="body" w="bold">
              {stepIndex + 1} / {total}
            </Txt>
          </View>

          {/* 1. 이전 답 칩 */}
          {previous.length > 0 && (
            <View style={styles.answerChips}>
              {previous.map((label, i) => (
                <Pressable
                  key={i}
                  onPress={() => setStepIndex(i)}
                  accessibilityRole="button"
                  accessibilityHint="이 단계로 돌아가기"
                  style={styles.answerChip}
                >
                  <Icon name="check" size={13} color={color.brand[700]} strokeWidth={2.4} />
                  <Txt v="label" w="semibold" c={color.brand[700]}>
                    {label}
                  </Txt>
                </Pressable>
              ))}
            </View>
          )}

          <Txt v="caption" w="bold" c={color.brand[700]} style={styles.stepLabel}>
            STEP {stepIndex + 1} · {step.name}
          </Txt>
          <Txt v="h1" style={styles.question}>
            {step.question}
          </Txt>
          <Txt v="body" c={color.text.secondary} style={styles.helper}>
            {step.helper}
          </Txt>

          {/* 2. 선택 카드 */}
          <View style={styles.options} accessibilityRole="radiogroup">
            {step.options.map((o) => {
              const on = selected === o.id;
              return (
                <Pressable
                  key={o.id}
                  onPress={() => setAnswers({ ...answers, [step.key]: o.id })}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={[styles.option, on && styles.optionOn]}
                >
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
                  <Txt v="title" style={styles.optionLabel}>
                    {o.label}
                  </Txt>
                  {o.desc && (
                    <Txt v="body" c={color.text.secondary} style={styles.optionDesc} numberOfLines={1}>
                      {o.desc}
                    </Txt>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* 3. 용어 '?' */}
          {step.term && <TermHelp term={step.term} id={`diag-${step.key}`} />}
        </ScrollView>
      </TermScope>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom + 2, 16) }]}>
        <Button label="이전" variant="neutral" onPress={prev} style={styles.prevBtn} />
        <Button label="다음" onPress={next} disabled={!selected} style={styles.flex} />
      </View>
    </View>
  );
}

/** '?'를 누르면 아래에 말풍선이 열린다 */
function TermHelp({ term, id }: { term: string; id: string }) {
  const { open, toggle } = useTerm();
  const text = getGlossary()[term];
  // 해설 안의 담당 기관 이름은 굵게
  const [before, after] = text.split('중대범죄수사청');
  return (
    <View style={styles.termWrap}>
      <Pressable
        onPress={() => toggle(id)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open === id }}
        hitSlop={{ top: 12, bottom: 12 }}
        style={styles.termLink}
      >
        <Icon name="help" size={17} color={color.brand[700]} strokeWidth={1.6} />
        <Txt v="body" w="medium" c={color.brand[700]}>
          ‘{term}’가 뭔가요?
        </Txt>
      </Pressable>
      {open === id && (
        <TooltipBox style={styles.tip}>
          <Txt v="body" c={color.text.inverse} style={styles.tipText}>
            {after === undefined ? (
              text
            ) : (
              <>
                {before.trimEnd()}
                {'\n'}
                <Txt v="body" w="bold" c={color.text.inverse} style={styles.tipText}>
                  중대범죄수사청
                </Txt>
                {after}
              </>
            )}
          </Txt>
        </TooltipBox>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  flex: { flex: 1 },
  content: { paddingHorizontal: space.screenX, paddingBottom: 24 },
  track: {
    marginTop: 9,
    height: 6,
    borderRadius: radius.chip,
    backgroundColor: color.state.placeholder,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.chip, backgroundColor: color.brand[700] },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  answerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 30 },
  answerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 27,
    paddingHorizontal: 10,
    borderRadius: radius.chip,
    backgroundColor: color.brand[100],
  },
  stepLabel: { marginTop: 25 },
  question: { marginTop: 3 },
  helper: { marginTop: 4 },
  options: { marginTop: 25, gap: 9 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: space.cardPad,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line.divider,
    backgroundColor: color.bg.surface,
  },
  optionOn: { borderColor: color.state.selected, backgroundColor: color.brand[100] },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.line.divider,
    backgroundColor: color.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: color.state.selected, backgroundColor: color.state.selected },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.bg.surface },
  optionLabel: { marginLeft: 14 },
  optionDesc: { marginLeft: 6, flexShrink: 1 },
  termWrap: { marginTop: 24 },
  termLink: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  tip: { marginTop: 8 },
  tipText: { lineHeight: 21 },
  bottom: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: space.screenX,
    paddingTop: 8,
    backgroundColor: color.bg.surface,
  },
  prevBtn: { width: 115 },
});
