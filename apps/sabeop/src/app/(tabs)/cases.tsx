import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { getActiveCase, getToday, scheduleReminders, type HistoryItem } from '../../api';
import { Icon } from '../../components/Icon';
import { TermBubble, TermScope, TermText } from '../../components/Term';
import { Txt } from '../../components/Txt';
import { Button, TabHeader, Tag, goExternal } from '../../components/ui';
import { dday, diffDays, mmdd, weekday, ymd, ymdhm } from '../../lib/date';
import { useAppState } from '../../state/AppState';
import { color, radius, space } from '../../theme/tokens';

const HISTORY_PREVIEW = 4;
// 진행 바: 화면 좌우 4pt만 남기고 4칸으로 나눈다 (디자인 실측)
const STEPPER_INSET = 4;

export default function CasesScreen() {
  const { scenario } = useAppState();
  const c = getActiveCase();
  const today = getToday();
  const agencyColor = color.agency[c.agency];
  const [showAll, setShowAll] = useState(false);

  // 3. D-30 · D-7 알림 예약
  useEffect(() => {
    const reminders = [30, 7]
      .map((n) => ({ n, left: diffDays(today, c.deadline) }))
      .filter(({ n, left }) => left >= n)
      .map(({ n }) => ({ date: shiftDate(c.deadline, -n) }));
    scheduleReminders(reminders);
  }, [today, c.deadline]);

  const history = showAll ? c.history : c.history.slice(0, HISTORY_PREVIEW);

  return (
    <View style={styles.screen}>
      <TabHeader title="내 사건" />
      <TermScope style={styles.flex} initialOpen="hist-0-피의자">
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            {/* 예외: 기관 정보 연동 지연 */}
            {scenario === 'exception' && (
              <View style={styles.delay}>
                <Tag label="정보 갱신 지연" bg={color.state.warning} v="caption" />
                <Txt v="body" w="semibold" style={styles.delayTitle}>
                  최신 상태가 아닐 수 있어요
                </Txt>
                <Txt v="caption" c={color.text.secondary}>
                  마지막 갱신 {ymdhm(c.lastSyncedAt)}
                </Txt>
                <Button
                  label="담당 수사관에게 문의"
                  variant="outline"
                  onPress={() => goExternal()}
                  style={styles.delayBtn}
                />
              </View>
            )}

            {/* 1. 사건 요약 */}
            <View style={styles.idRow}>
              <Txt v="body" c={color.text.secondary}>
                {c.id}
              </Txt>
              <Tag label={c.status} bg={agencyColor} />
            </View>
            <Txt v="h2" style={styles.title}>
              {c.title}
            </Txt>
            <View style={styles.infoRows}>
              <InfoRow label="담당 수사관" value={c.investigator} />
              <InfoRow label="접수일" value={ymd(c.filedAt)} />
            </View>

            {/* 2. 배송조회형 진행 바 */}
            <Stepper steps={c.steps} current={c.currentStep} filedAt={c.filedAt} agencyColor={agencyColor} />
            <TermBubble id="step-송치" term="송치" arrowLeft={243} style={styles.stepTip} />

            {/* 3. D-Day 위젯 */}
            <View style={styles.dday} accessibilityLabel={`경찰 수사 마감 예정일까지 ${dday(today, c.deadline)}`}>
              <View>
                <Txt v="body" c={color.text.inverse} style={styles.ddayText}>
                  경찰 수사 마감 예정일까지
                </Txt>
                <Txt v="body" c={color.text.inverse} style={styles.ddayText}>
                  {mmdd(c.deadline)} {weekday(c.deadline)}요일 예정
                </Txt>
              </View>
              <Txt v="dday" c={color.text.inverse}>
                {dday(today, c.deadline)}
              </Txt>
            </View>
          </View>

          {/* 4. 처리 이력 */}
          <View style={styles.historySection}>
            <View style={styles.sectionHead}>
              <Txt v="title">처리 이력</Txt>
              <Pressable onPress={() => setShowAll(!showAll)} hitSlop={12} accessibilityRole="button">
                <Txt v="label" c={color.text.secondary}>
                  {showAll && c.history.length > HISTORY_PREVIEW ? '접기' : '전체 보기'}
                </Txt>
              </Pressable>
            </View>
            <View style={styles.historyCard}>
              {history.map((h, i) => (
                <HistoryRow key={h.date + h.text} item={h} index={i} latest={i === 0} agencyColor={agencyColor} />
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/precedents')}
              accessibilityRole="link"
              hitSlop={12}
              style={styles.precedentLink}
            >
              <Txt v="body" w="semibold" c={color.brand[700]}>
                비슷한 판례 보기 ›
              </Txt>
            </Pressable>
          </View>
        </ScrollView>
      </TermScope>
    </View>
  );
}

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Txt v="title" w="regular" c={color.text.secondary}>
        {label}
      </Txt>
      <Txt v="title" w="regular">
        {value}
      </Txt>
    </View>
  );
}

function Stepper({
  steps,
  current,
  filedAt,
  agencyColor,
}: {
  steps: string[];
  current: number;
  filedAt: string;
  agencyColor: string;
}) {
  return (
    <View style={styles.stepper} accessibilityLabel={`진행 단계 ${current + 1} / ${steps.length}, ${steps[current]} 진행 중`}>
      {/* 연결선: 첫 칸 가운데부터 마지막 칸 가운데까지 */}
      <View style={styles.lineTrack}>
        {steps.slice(1).map((_, i) => (
          <View key={i} style={[styles.lineSeg, { backgroundColor: i < current ? agencyColor : color.state.placeholder }]} />
        ))}
      </View>
      {steps.map((label, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <View key={label} style={styles.stepCol}>
            <View style={styles.dotBox}>
              {now && <View style={[styles.halo, { backgroundColor: agencyColor }]} />}
              <View
                style={[
                  styles.stepDot,
                  { backgroundColor: done ? color.brand[700] : now ? agencyColor : color.state.placeholder },
                ]}
              >
                {done && <Icon name="check" size={12} color={color.text.inverse} strokeWidth={3} />}
              </View>
            </View>
            <Txt
              v="body"
              w={now ? 'semibold' : done ? 'medium' : 'regular'}
              c={now ? agencyColor : done ? color.text.primary : color.text.secondary}
              style={styles.stepLabel}
            >
              {label.endsWith('송치') ? (
                <>
                  {label.replace('송치', '')}
                  <TermText id="step-송치" term="송치" />
                </>
              ) : (
                label
              )}
            </Txt>
            {done && i === 0 && (
              <Txt v="label" c={color.text.secondary} style={styles.stepSub}>
                {mmdd(filedAt)}
              </Txt>
            )}
            {now && (
              <Txt v="label" c={agencyColor} style={styles.stepSub}>
                진행 중
              </Txt>
            )}
          </View>
        );
      })}
    </View>
  );
}

function HistoryRow({
  item,
  index,
  latest,
  agencyColor,
}: {
  item: HistoryItem;
  index: number;
  latest: boolean;
  agencyColor: string;
}) {
  const term = item.terms?.[0];
  const id = term ? `hist-${index}-${term}` : '';
  const textColor = latest ? color.text.primary : color.text.secondary;
  return (
    <View>
      <View style={styles.historyRow}>
        <View style={[styles.historyDot, { backgroundColor: latest ? agencyColor : color.line.divider }]} />
        <Txt v="body" w="bold" style={styles.historyDate}>
          {mmdd(item.date)}
        </Txt>
        <Txt v="body" c={textColor} style={styles.flex}>
          {term && item.text.includes(term) ? (
            <>
              {item.text.split(term)[0]}
              <TermText id={id} term={term} />
              {item.text.split(term).slice(1).join(term)}
            </>
          ) : (
            item.text
          )}
        </Txt>
      </View>
      {term && <TermBubble id={id} term={term} arrowLeft={74} style={styles.historyTip} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  top: { paddingHorizontal: space.screenX, paddingTop: 29, paddingBottom: 20 },
  delay: {
    marginBottom: 20,
    padding: space.cardPad,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line.divider,
    gap: 4,
  },
  delayTitle: { marginTop: 6 },
  delayBtn: { marginTop: 10, height: 44 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { marginTop: 12 },
  infoRows: { marginTop: 12, gap: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepper: {
    flexDirection: 'row',
    marginTop: 34,
    marginHorizontal: STEPPER_INSET - space.screenX,
  },
  lineTrack: {
    position: 'absolute',
    top: 10.5,
    left: '12.5%',
    right: '12.5%',
    height: 3,
    flexDirection: 'row',
  },
  lineSeg: { flex: 1 },
  stepCol: { flex: 1, alignItems: 'center' },
  dotBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 32, height: 32, borderRadius: 16, opacity: 0.18 },
  stepDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { marginTop: 3 },
  stepSub: { marginTop: 1 },
  stepTip: { marginTop: 6 },
  dday: {
    marginTop: 16,
    minHeight: 79,
    borderRadius: radius.card,
    backgroundColor: color.brand[900],
    paddingHorizontal: space.cardPad,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ddayText: { lineHeight: 21 },
  historySection: { flex: 1, backgroundColor: color.bg.base, paddingHorizontal: space.screenX, paddingTop: 20, paddingBottom: 28 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyCard: {
    marginTop: 16,
    backgroundColor: color.bg.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line.divider,
    paddingHorizontal: space.cardPad,
    paddingVertical: 12,
  },
  historyRow: { flexDirection: 'row', alignItems: 'center', minHeight: 26 },
  historyDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 1, marginRight: 8 },
  historyDate: { width: 56 },
  historyTip: { marginLeft: 17, marginTop: 4, marginBottom: 6 },
  precedentLink: { marginTop: 18, alignSelf: 'flex-start' },
});
