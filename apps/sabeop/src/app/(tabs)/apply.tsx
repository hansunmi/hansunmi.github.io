import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { getActiveCase, getClosedCase, getInterviewSlots, getToday, scheduleReminders } from '../../api';
import { TermBubble, TermScope, TermText } from '../../components/Term';
import { Txt } from '../../components/Txt';
import { Band, Button, TabHeader, Tag, goExternal } from '../../components/ui';
import { dday, diffDays, mmdd, progress, weekday, ymd } from '../../lib/date';
import { color, font, radius, space, type as typeScale } from '../../theme/tokens';

/** 접수 후 이 기간 동안 소식이 없으면 수사지연 이의제기 자동 활성화 */
const DELAY_DAYS = 30;
/** 불송치 이의신청: 마감 D-7부터 매일 알림 */
const APPEAL_DAILY_FROM = 7;
// 진행 단계 인덱스 (steps: 고소 접수 · 경찰 수사 · 공소청 송치 · 기소 결정)
const STEP_POLICE = 1;
const STEP_DECISION = 3;

export default function ApplyScreen() {
  const today = getToday();
  const active = getActiveCase();
  const closed = getClosedCase();
  const slots = getInterviewSlots();

  const elapsed = diffDays(active.filedAt, today);
  const appealLeft = diffDays(today, closed.appealDeadline);

  // 4. 상태 기반 노출
  const showDelay = active.currentStep <= STEP_POLICE && elapsed >= DELAY_DAYS;
  const showInterview = active.currentStep < STEP_DECISION;
  const showAppeal = closed.status === '불송치 결정' && appealLeft >= 0;

  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!showAppeal) return;
    const days = Array.from({ length: Math.min(APPEAL_DAILY_FROM, appealLeft) + 1 }, (_, i) => i);
    scheduleReminders(days.map((d) => ({ date: shift(closed.appealDeadline, -d) })));
  }, [showAppeal, appealLeft, closed.appealDeadline]);

  const sections = [
    showDelay && (
      <View key="delay" style={styles.section}>
        {/* 1. 수사지연 이의제기 */}
        <Tag label="자동 활성화" bg={color.brand[900]} />
        <Txt v="h2" style={styles.title}>
          접수 후 한 달째 결과가 없어요
        </Txt>
        <Txt v="body" c={color.text.secondary} style={styles.desc}>
          고소 접수 {ymd(active.filedAt)} ({elapsed}일째) · 지연 이의제기를 할 수 있어요.
        </Txt>
        {/* 공식 문서 제출이라 신중하게 누르도록 의도적으로 테두리 버튼 */}
        <Button label="독촉장 작성 · 정부24로 제출" variant="outline" onPress={() => goExternal()} style={styles.btn} />
      </View>
    ),
    showInterview && (
      <View key="interview" style={styles.section}>
        {/* 2. 검사 면담 신청 */}
        <Tag label="공소청" bg={color.agency.prosecution} />
        <Txt v="h2" style={styles.title}>
          기소 결정 전, 검사와 면담하기
        </Txt>
        <View style={styles.slots} accessibilityRole="radiogroup">
          {slots.map((s) => {
            const on = slot === s;
            const tint = on ? color.state.selected : undefined;
            return (
              <Pressable
                key={s}
                onPress={() => setSlot(s)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${mmdd(s)} ${weekday(s)}요일`}
                style={[styles.slot, on && styles.slotOn]}
              >
                <Txt v="title" w="semibold" c={tint}>
                  {mmdd(s)}
                </Txt>
                <Txt v="label" c={tint ?? color.text.secondary}>
                  {weekday(s)}
                </Txt>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="면담 사유를 적어주세요 (필수)"
          placeholderTextColor={color.text.secondary}
          multiline
          textAlignVertical="top"
          accessibilityLabel="면담 사유 (필수)"
          style={styles.reason}
        />
        <Button
          label="면담 신청"
          disabled={!slot || !reason.trim()}
          onPress={() => goExternal()}
          style={styles.btnFilled}
        />
      </View>
    ),
    showAppeal && (
      <View key="appeal" style={styles.section}>
        {/* 3. 불송치 이의신청 */}
        <View style={styles.appealHead}>
          <View style={styles.tagTerm}>
            <Txt v="body" w="semibold" c={color.text.inverse}>
              <TermText id="apply-불송치" term="불송치" underlineColor={color.text.inverse} /> 결정
            </Txt>
          </View>
          <Txt v="label" c={color.text.secondary} style={styles.appealCase} numberOfLines={1}>
            {closed.id} {closed.title}
          </Txt>
          <Txt v="h2" w="extrabold">
            {dday(today, closed.appealDeadline)}
          </Txt>
        </View>
        <TermBubble id="apply-불송치" term="불송치" arrowLeft={24} style={styles.tip} />
        <Txt v="body" style={styles.appealDesc}>
          {mmdd(closed.noticeAt)} 통지 후{' '}
          <Txt v="body" w="bold">
            {diffDays(closed.noticeAt, closed.appealDeadline)}일 이내
          </Txt>{' '}
          이의신청할 수 있어요
        </Txt>
        <View
          style={styles.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress(closed.noticeAt, closed.appealDeadline, today) * 100) }}
        >
          <View
            style={[styles.trackFill, { width: `${progress(closed.noticeAt, closed.appealDeadline, today) * 100}%` }]}
          />
        </View>
        <Txt v="label" c={color.text.secondary} style={styles.appealFoot}>
          {mmdd(closed.appealDeadline)} {weekday(closed.appealDeadline)}요일까지 · D-{APPEAL_DAILY_FROM}부터 매일 알려드려요
        </Txt>
      </View>
    ),
  ].filter(Boolean);

  return (
    <View style={styles.screen}>
      <TabHeader title="신청하기" />
      <TermScope style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {sections.map((s, i) => (
            <View key={i}>
              {i > 0 ? <Band /> : <View style={styles.firstGap} />}
              {s}
            </View>
          ))}
          {sections.length === 0 && (
            <View style={styles.section}>
              <Txt v="body" c={color.text.secondary}>
                지금 신청할 수 있는 항목이 없어요.
              </Txt>
            </View>
          )}
        </ScrollView>
      </TermScope>
    </View>
  );
}

function shift(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  flex: { flex: 1 },
  section: { paddingHorizontal: space.screenX, paddingTop: 20, paddingBottom: 20 },
  // 탭 첫 화면: 헤더 아래 첫 섹션은 29 (띠 아래 섹션은 20)
  firstGap: { height: 9 },
  title: { marginTop: 8 },
  desc: { marginTop: 9 },
  btn: { marginTop: 12, height: 45 },
  slots: { flexDirection: 'row', gap: 9, marginTop: 14 },
  slot: {
    flex: 1,
    height: 57,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: color.line.divider,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  slotOn: { borderColor: color.state.selected, backgroundColor: color.brand[100] },
  reason: {
    marginTop: 13,
    height: 65,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: color.line.divider,
    paddingHorizontal: 14,
    paddingTop: 12,
    ...typeScale.body,
    fontFamily: font.regular,
    color: color.text.primary,
    outlineStyle: 'none',
  } as object,
  btnFilled: { marginTop: 13, height: 45 },
  appealHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagTerm: {
    backgroundColor: color.state.neutral,
    borderRadius: radius.tag,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  appealCase: { flex: 1 },
  tip: { marginTop: 6 },
  appealDesc: { marginTop: 12 },
  track: {
    marginTop: 7,
    height: 6,
    borderRadius: radius.chip,
    backgroundColor: color.state.placeholder,
    overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: radius.chip, backgroundColor: color.brand[700] },
  appealFoot: { marginTop: 8 },
});
