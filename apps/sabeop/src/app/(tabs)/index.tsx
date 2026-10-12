import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { classifyIntent, getActiveCase, getCaseCount, getUser } from '../../api';
import { Icon, type IconName } from '../../components/Icon';
import { Txt } from '../../components/Txt';
import { Band, TabHeader, notify } from '../../components/ui';
import { color, font, radius, space, type as typeScale } from '../../theme/tokens';

const CHIPS = ['사기당했어요', '내 사건 어디 있나요?', '고소장 쓰는 법'];

const GUIDES = [
  { no: '01', line1: '검찰청은', line2: '이제 어디로?' },
  { no: '02', line1: '중수청은', line2: '뭐 하는 곳?' },
  { no: '03', line1: '공소청은', line2: '뭐가 달라?' },
];

const GUIDE_W = 154;
const GUIDE_GAP = 8;

export default function HomeScreen() {
  const user = getUser();
  const activeCase = getActiveCase();
  const [query, setQuery] = useState('');

  const submit = () => {
    if (!query.trim()) return;
    if (classifyIntent(query) === 'tracking') router.navigate('/cases');
    else router.push('/diagnosis');
  };

  return (
    <View style={styles.screen}>
      <TabHeader title="사법길잡이" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.padX}>
          <Txt v="h1" style={styles.h1}>
            {user.displayName}, 어떤 도움이{'\n'}필요하신가요?
          </Txt>

          {/* 1. AI 검색 바 */}
          <View style={styles.search}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={submit}
              placeholder="예) 중고거래로 사기를 당했어요"
              placeholderTextColor={color.text.secondary}
              returnKeyType="send"
              accessibilityLabel="무엇이든 물어보세요"
              style={styles.searchInput}
            />
            <Pressable
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel="보내기"
              hitSlop={4}
              style={styles.send}
            >
              <Icon name="arrowUp" size={22} color={color.text.inverse} strokeWidth={2.2} />
            </Pressable>
          </View>

          {/* 칩: 입력 단축키 */}
          <View style={styles.chips}>
            {CHIPS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setQuery(c)}
                accessibilityRole="button"
                hitSlop={{ top: 6, bottom: 6 }}
                style={styles.chip}
              >
                <Txt v="label">{c}</Txt>
              </Pressable>
            ))}
          </View>

          {/* 2. 퀵 카드 3종 */}
          <View style={styles.quick}>
            <QuickRow
              icon="compass"
              title="어디로 가야 할까?"
              sub={
                <Txt v="label" c={color.text.secondary}>
                  질문 3개로 담당 기관 찾기
                </Txt>
              }
              onPress={() => router.push('/diagnosis')}
            />
            <QuickRow
              icon="hourglass"
              title="내 사건 잘 가고 있나?"
              sub={
                <View style={styles.subRow}>
                  <Txt v="label" c={color.text.secondary}>
                    내 사건 {getCaseCount()}건
                  </Txt>
                  <View style={styles.statusPill}>
                    <Txt v="caption" w="bold" c={color.agency[activeCase.agency]}>
                      {activeCase.status}
                    </Txt>
                  </View>
                </View>
              }
              onPress={() => router.navigate('/cases')}
            />
            <QuickRow
              icon="megaphone"
              title="억울하고 답답할 때"
              sub={
                <Txt v="label" c={color.text.secondary}>
                  수사지연 이의제기 · 검사 면담
                </Txt>
              }
              onPress={() => router.navigate('/apply')}
            />
          </View>
        </View>

        <Band thin />

        {/* 3. 절차 가이드 */}
        <View style={styles.guideHead}>
          <Txt v="title">바뀐 형사사법 절차, 이것만 알면 돼요</Txt>
          <Pressable onPress={() => notify('준비 중이에요')} hitSlop={12} accessibilityRole="button">
            <Txt v="body" c={color.text.secondary}>
              전체
            </Txt>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={GUIDE_W + GUIDE_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.guideList}
        >
          {GUIDES.map((g) => (
            <Pressable
              key={g.no}
              onPress={() => notify('준비 중이에요')}
              accessibilityRole="button"
              accessibilityLabel={`${g.line1} ${g.line2}`}
              style={styles.guide}
            >
              <Txt v="caption" w="bold" c={color.sub[300]}>
                {g.no}
              </Txt>
              <View style={styles.guideTitle}>
                <Txt v="title" w="light" c={color.text.inverse} style={styles.guideLine}>
                  <Txt v="title" w="light" c={color.sub[300]} style={styles.guideLine}>
                    {g.line1.slice(0, 1)}
                  </Txt>
                  {g.line1.slice(1)}
                </Txt>
                <Txt v="title" c={color.text.inverse} style={styles.guideLine}>
                  {g.line2}
                </Txt>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function QuickRow({
  icon,
  title,
  sub,
  onPress,
}: {
  icon: IconName;
  title: string;
  sub: ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={styles.quickRow}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={24} color={color.brand[700]} strokeWidth={1.6} />
      </View>
      <View style={styles.quickText}>
        <Txt v="title">{title}</Txt>
        {sub}
      </View>
      <Icon name="chevronRight" size={14} color={color.text.disabled} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  content: { paddingBottom: 40 },
  padX: { paddingHorizontal: space.screenX },
  h1: { marginTop: 23 },
  search: {
    marginTop: 18,
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.brand[100],
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space.cardPad,
    paddingRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...typeScale.title,
    fontFamily: font.regular,
    color: color.text.primary,
    // 웹 포커스 테두리 제거
    outlineStyle: 'none',
  } as object,
  send: {
    width: 38,
    height: 36,
    borderRadius: 10,
    backgroundColor: color.brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: color.brand[900],
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chips: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  chip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: color.line.divider,
    justifyContent: 'center',
  },
  quick: { marginTop: 18, marginBottom: 16 },
  quickRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingRight: 8 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: color.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: { flex: 1, marginLeft: 12, gap: 1 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusPill: {
    backgroundColor: color.brand[100],
    borderRadius: radius.chip,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  guideHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: 22,
  },
  guideList: { paddingHorizontal: space.screenX, gap: GUIDE_GAP, paddingTop: 13 },
  guide: {
    width: GUIDE_W,
    height: 98,
    borderRadius: radius.card,
    backgroundColor: color.brand[700],
    padding: space.cardPad,
    paddingTop: 15,
  },
  guideTitle: { marginTop: 7 },
  guideLine: { lineHeight: 21 },
});
