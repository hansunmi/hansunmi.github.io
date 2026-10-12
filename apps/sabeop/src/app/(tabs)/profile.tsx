import { StyleSheet, View } from 'react-native';
import { Txt } from '../../components/Txt';
import { TabHeader } from '../../components/ui';
import { color } from '../../theme/tokens';

// 간편 인증 · 알림 설정 · 제출 서류함 — 다음 단계에서 설계
export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <TabHeader title="프로필" />
      <View style={styles.empty}>
        <Txt v="body" c={color.text.secondary}>
          준비 중
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.surface },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
