import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPrecedentCriteria, getToday, searchPrecedents, type Precedent } from '../api';
import { Icon } from '../components/Icon';
import { Txt } from '../components/Txt';
import { SubHeader, Tag, goExternal } from '../components/ui';
import { color, font, radius, space, type as typeScale } from '../theme/tokens';

type Criteria = { label: string; text: string } | null;

export default function PrecedentsScreen() {
  const insets = useSafeAreaInsets();
  const base = getPrecedentCriteria();
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [criteria, setCriteria] = useState<Criteria>({ label: base.label, text: base.text });
  const [filter, setFilter] = useState(base.filters[0]);

  const result = useMemo(
    () => searchPrecedents({ keyword, filter, today: getToday() }),
    [keyword, filter],
  );

  // 새 검색을 하면 기준 칩이 검색어 칩으로 바뀐다
  const search = () => {
    const k = query.trim();
    if (!k) return;
    setKeyword(k);
    setCriteria({ label: '검색어', text: k });
  };

  const clearCriteria = () => {
    setCriteria(null);
    setKeyword('');
  };

  return (
    <View style={styles.screen}>
      <SubHeader title="비슷한 사건 찾기" />

      {/* 1~3. 상단 고정 */}
      <View style={styles.top}>
        <View style={styles.search}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            placeholder="키워드로 다시 찾기"
            placeholderTextColor={color.text.secondary}
            returnKeyType="search"
            accessibilityLabel="키워드로 다시 찾기"
            style={styles.searchInput}
          />
          <Pressable onPress={search} accessibilityRole="button" accessibilityLabel="검색" hitSlop={4} style={styles.searchBtn}>
            <Icon name="search" size={22} color={color.text.inverse} strokeWidth={2.2} />
          </Pressable>
        </View>

        {criteria && (
          <View style={styles.criteria}>
            <Txt v="body" w="bold" c={color.brand[900]}>
              {criteria.label}
            </Txt>
            <Txt v="body" style={styles.criteriaText} numberOfLines={1}>
              {criteria.text}
            </Txt>
            <Pressable
              onPress={clearCriteria}
              accessibilityRole="button"
              accessibilityLabel="검색 기준 해제"
              hitSlop={14}
              style={styles.criteriaX}
            >
              <Icon name="close" size={14} color={color.text.secondary} strokeWidth={2} />
            </Pressable>
          </View>
        )}

        <View style={styles.filters} accessibilityRole="radiogroup">
          {base.filters.map((f) => {
            const on = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                hitSlop={{ top: 7, bottom: 7 }}
                style={[styles.filter, on && styles.filterOn]}
              >
                <Txt v="body" w={on ? 'semibold' : 'regular'} c={on ? color.text.inverse : color.text.primary}>
                  {f}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listHead}>
          <Txt v="title">비슷한 판례 {result.total}건</Txt>
          <Txt v="label" c={color.text.secondary}>
            유사도순
          </Txt>
        </View>
        {result.items.map((p) => (
          <PrecedentCard key={p.id} p={p} />
        ))}
      </ScrollView>

      {/* 5. 면책 고지 — 스크롤해도 사라지지 않게 고정 */}
      <View style={[styles.disclaimer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.disclaimerLine} />
        <Txt v="label" c={color.text.secondary} style={styles.disclaimerText}>
          판례는 참고용이에요. 사건마다 결과는 달라질 수 있어요.
        </Txt>
        <Pressable onPress={() => goExternal()} accessibilityRole="link" hitSlop={12} style={styles.consult}>
          <Txt v="label" w="semibold" c={color.brand[700]}>
            무료 법률상담 연결 ›
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

function PrecedentCard({ p }: { p: Precedent }) {
  const high = p.similarity === 'high';
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Tag label={high ? '유사도 높음' : '유사도 보통'} bg={high ? color.brand[700] : color.state.neutral} />
        <Txt v="label" c={color.text.secondary}>
          {p.court} · {p.caseNo}
        </Txt>
      </View>
      <Txt v="h3" style={styles.cardTitle}>
        {p.title}
      </Txt>
      <Txt v="body" style={styles.cardSummary} numberOfLines={3}>
        {p.summary}
        {p.summaryStrong ? (
          <>
            {'\n'}
            <Txt v="body" w="bold">
              {p.summaryStrong}
            </Txt>
          </>
        ) : null}
      </Txt>
      <View style={styles.outcomes}>
        {p.outcomes.map((o) => (
          <View key={o} style={styles.outcome}>
            <Txt v="label" w="semibold">
              {o}
            </Txt>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  top: { paddingHorizontal: space.screenX, paddingTop: 19, paddingBottom: 20, backgroundColor: color.bg.surface },
  search: {
    height: 49,
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
    outlineStyle: 'none',
  } as object,
  searchBtn: {
    width: 38,
    height: 37,
    borderRadius: 10,
    backgroundColor: color.brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteria: {
    marginTop: 24,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: radius.chip,
    backgroundColor: color.bg.base,
  },
  criteriaText: { marginLeft: 7, flexShrink: 1 },
  criteriaX: { marginLeft: 10 },
  filters: { flexDirection: 'row', gap: 7, marginTop: 15 },
  filter: {
    height: 31,
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: color.line.divider,
    justifyContent: 'center',
  },
  filterOn: { backgroundColor: color.brand[900], borderColor: color.brand[900] },
  list: { flex: 1, backgroundColor: color.bg.base },
  listContent: { paddingHorizontal: space.screenX, paddingTop: 29, paddingBottom: 24, gap: 14 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -1 },
  card: {
    backgroundColor: color.bg.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line.divider,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,
    shadowColor: color.text.primary,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { marginTop: 8 },
  cardSummary: { marginTop: 8 },
  outcomes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  outcome: {
    backgroundColor: color.bg.base,
    borderRadius: radius.tag,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  disclaimer: { backgroundColor: color.bg.base, paddingHorizontal: space.screenX },
  disclaimerLine: { height: 1, backgroundColor: color.line.divider },
  disclaimerText: { marginTop: 13 },
  consult: { marginTop: 3, alignSelf: 'flex-start' },
});
