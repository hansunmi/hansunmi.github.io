import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';
import { getActiveCase, getUser } from '../api';
import { Icon } from '../components/Icon';
import { Txt } from '../components/Txt';
import { Button, SubHeader, Tag, goExternal } from '../components/ui';
import {
  ITEMS,
  MOCK_PICKS,
  QUESTIONS,
  filledCount,
  initialAnswers,
  missingRequired,
  validateEvidence,
  type Answers,
  type Evidence,
} from '../lib/complaint';
import { AGENCY_NAME, judge, optionDesc } from '../lib/diagnosis';
import { useAppState } from '../state/AppState';
import { color, font, radius, space, type as typeScale } from '../theme/tokens';

const REASON = {
  police: '피해 금액 5억 원 미만의 일반 사기는 개정법에 따라 경찰이 전담해요.',
  nis: '피해 금액 5억 원 이상의 경제범죄는 중대범죄수사청이 맡아요.',
  prosecution: '',
} as const;

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const { answers: diag, scenario } = useAppState();
  const user = getUser();
  const verdict = judge(diag);

  // ── 스마트 고소장 ──
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(scenario));
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Evidence[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const pickCursor = useRef(0);
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  // 개발 메뉴에서 시나리오를 바꾸면 초기 상태로
  useEffect(() => {
    setAnswers(initialAnswers(scenario));
    setDraft('');
    setError(null);
  }, [scenario]);

  const current = QUESTIONS.find((q) => !answers[q.id]);
  const shown = current ? QUESTIONS.slice(0, QUESTIONS.indexOf(current) + 1) : QUESTIONS;
  const missing = missingRequired(answers);

  const send = () => {
    if (!current || !draft.trim()) return;
    const msg = current.validate?.(draft.trim());
    if (msg) {
      setError(msg);
      return;
    }
    setAnswers({ ...answers, [current.id]: draft.trim() });
    setDraft('');
    setError(null);
  };

  const pick = () => {
    // TODO: API — 기기 파일 선택기 + 업로드
    const file = MOCK_PICKS[pickCursor.current % MOCK_PICKS.length];
    pickCursor.current += 1;
    const msg = validateEvidence(file);
    setFileError(msg);
    if (!msg) setFiles([...files, file]);
  };

  return (
    <View style={styles.screen}>
      <SubHeader title="진단 결과" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* 1 · 2. 결과 카드 + 이유 */}
        <View style={styles.result}>
          {verdict.kind === 'decided' ? (
            <>
              <Tag label={AGENCY_NAME[verdict.agency]} bg={color.agency[verdict.agency]} />
              <Txt v="h2" style={styles.resultTitle}>
                {user.displayName}의 사건은{'\n'}
                <Txt v="h2" c={color.agency[verdict.agency]}>
                  {verdict.agency === 'police' ? getActiveCase().office : AGENCY_NAME[verdict.agency]}
                </Txt>{' '}
                담당이에요
              </Txt>
              <Txt v="body" c={color.text.secondary} style={styles.resultSub}>
                {optionDesc('amount', diag.amount)}
              </Txt>
              <View style={styles.reason}>
                <Txt v="title">왜 {AGENCY_NAME[verdict.agency]}인가요?</Txt>
                <Txt v="body" style={styles.reasonBody}>
                  {REASON[verdict.agency]}
                </Txt>
              </View>
            </>
          ) : (
            <>
              <Tag label="판단이 어려워요" bg={color.state.neutral} />
              <Txt v="h2" style={styles.resultTitle}>
                가까운 경찰서에 접수하면{'\n'}맞는 기관으로 넘겨줘요
              </Txt>
              <Button
                label="가까운 경찰서 보기"
                variant="outline"
                onPress={() => goExternal()}
                style={styles.nearBtn}
              />
            </>
          )}
        </View>

        {/* 3. 대화형 작성 */}
        <View style={styles.complaint}>
          <View style={styles.sectionHead}>
            <Txt v="title">스마트 고소장</Txt>
            <Txt v="label" c={color.text.secondary} accessibilityLabel={`육하원칙 6개 중 ${filledCount(answers)}개 작성`}>
              {filledCount(answers)} / {ITEMS.length} 항목
            </Txt>
          </View>

          <View style={styles.chat}>
            {shown.map((q) => (
              <View key={q.id} style={styles.chatPair}>
                <View style={[styles.bubble, styles.bot]}>
                  <Txt v="body">{q.ask}</Txt>
                </View>
                {answers[q.id] ? (
                  <View style={[styles.bubble, styles.me]}>
                    <Txt v="body" c={color.text.inverse}>
                      {answers[q.id]}
                    </Txt>
                  </View>
                ) : null}
              </View>
            ))}

            {current && (
              <View>
                <View style={[styles.inputRow, error && styles.inputRowError]}>
                  <TextInput
                    ref={inputRef}
                    value={draft}
                    onChangeText={(t) => {
                      setDraft(t);
                      if (error) setError(null);
                    }}
                    onSubmitEditing={send}
                    placeholder={current.placeholder}
                    placeholderTextColor={color.text.disabled}
                    returnKeyType="send"
                    accessibilityLabel={current.ask}
                    style={styles.input}
                  />
                  <Pressable
                    onPress={send}
                    accessibilityRole="button"
                    accessibilityLabel="답변 보내기"
                    style={[styles.sendBtn, !draft.trim() && styles.sendOff]}
                  >
                    <Icon name="arrowUp" size={18} color={color.text.inverse} strokeWidth={2.2} />
                  </Pressable>
                </View>
                {error && (
                  <Txt v="caption" c={color.state.warning} style={styles.error} accessibilityLiveRegion="polite">
                    {error}
                  </Txt>
                )}
              </View>
            )}
          </View>

          {/* 예외: 필수 항목 누락 */}
          {missing.length > 0 && (
            <View style={styles.missing}>
              <Txt v="body" w="bold">
                {missing.length}개 항목 남음
              </Txt>
              <View style={styles.missingChips}>
                {missing.map((q) => (
                  <View key={q.id} style={styles.dashedChip}>
                    <Txt v="caption" c={color.text.secondary}>
                      {q.short}
                    </Txt>
                  </View>
                ))}
              </View>
              <Button
                label="이어서 작성하기"
                variant="outline"
                onPress={() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                  inputRef.current?.focus();
                }}
                style={styles.continueBtn}
              />
            </View>
          )}

          {/* 4. 증거 첨부 */}
          <Pressable
            onPress={pick}
            accessibilityRole="button"
            accessibilityLabel="증거 사진 첨부"
            accessibilityHint="JPG, PNG, PDF 파일, 파일당 20MB 이하"
            style={styles.evidence}
          >
            {[0, 1].map((i) => (
              <Thumb key={i} file={files[i]} more={i === 1 && files.length > 2 ? files.length - 2 : 0} />
            ))}
            <View style={styles.evidenceText}>
              <Txt v="title">증거 사진 끌어다 놓기</Txt>
              <Txt v="label" c={color.text.secondary}>
                {files.length ? `${files.length}개 첨부했어요` : '카톡 캡처 · 입금 내역'}
              </Txt>
            </View>
          </Pressable>
          {fileError && (
            <Txt v="caption" c={color.state.warning} style={styles.error} accessibilityLiveRegion="polite">
              {fileError}
            </Txt>
          )}

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

      {/* 5. 하단 고정 버튼 */}
      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom + 2, 16) }]}>
        <Button
          label="고소장 미리보기 · HWP / PDF"
          disabled={missing.length > 0}
          // 전자 접수(외부) → 접수 완료 시 사건번호 연동 → 내 사건
          onPress={() => goExternal(() => router.navigate('/cases'))}
        />
      </View>
    </View>
  );
}

function Thumb({ file, more }: { file?: Evidence; more: number }) {
  if (!file) {
    return (
      <View style={styles.thumb}>
        <Svg width={44} height={44} viewBox="0 0 44 44">
          {[-22, -8, 6, 20, 34, 48].map((x) => (
            <Line key={x} x1={x} y1={44} x2={x + 44} y2={0} stroke={color.bg.surface} strokeOpacity={0.55} strokeWidth={5} />
          ))}
        </Svg>
      </View>
    );
  }
  const ext = file.name.split('.').pop()?.toUpperCase();
  return (
    <View style={[styles.thumb, styles.thumbFile]}>
      <Txt v="caption" w="bold" c={color.brand[700]}>
        {more ? `+${more + 1}` : ext}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  scroll: { flexGrow: 1 },
  result: { paddingHorizontal: space.screenX, paddingTop: 29, paddingBottom: 20 },
  resultTitle: { marginTop: 8 },
  resultSub: { marginTop: 8 },
  reason: {
    marginTop: 14,
    backgroundColor: color.brand[100],
    borderRadius: radius.card,
    paddingHorizontal: space.cardPad,
    paddingTop: 14,
    paddingBottom: 16,
  },
  reasonBody: { marginTop: 6, lineHeight: 19 },
  nearBtn: { marginTop: 16 },
  complaint: {
    flex: 1,
    backgroundColor: color.bg.base,
    paddingHorizontal: space.screenX,
    paddingTop: 28,
    paddingBottom: 32,
  },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chat: { marginTop: 16, gap: 9 },
  chatPair: { gap: 9 },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: color.bg.surface,
    borderWidth: 1,
    borderColor: color.line.divider,
  },
  me: { alignSelf: 'flex-end', backgroundColor: color.brand[700] },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.bg.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line.divider,
    paddingLeft: 12,
    paddingRight: 5,
    height: 46,
  },
  inputRowError: { borderColor: color.state.warning },
  input: {
    flex: 1,
    height: '100%',
    ...typeScale.body,
    fontFamily: font.regular,
    color: color.text.primary,
    outlineStyle: 'none',
  } as object,
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: color.brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOff: { opacity: 0.4 },
  error: { marginTop: 6, marginLeft: 4 },
  missing: {
    marginTop: 14,
    backgroundColor: color.bg.surface,
    borderRadius: radius.card,
    padding: space.cardPad,
  },
  missingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  dashedChip: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.text.disabled,
    borderRadius: radius.chip,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  continueBtn: { marginTop: 12, height: 44 },
  evidence: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.text.disabled,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: color.state.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbFile: { backgroundColor: color.brand[100] },
  evidenceText: { flex: 1, marginLeft: 4, gap: 2 },
  precedentLink: { marginTop: 18, alignSelf: 'flex-start' },
  bottom: {
    paddingHorizontal: space.screenX,
    paddingTop: 14,
    backgroundColor: color.bg.surface,
  },
});
