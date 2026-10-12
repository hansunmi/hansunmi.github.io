import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { DevMenu } from '../components/DevMenu';
import { WebFrame } from '../components/WebFrame';
import { AppStateProvider } from '../state/AppState';
import { fontAssets } from '../theme/fonts';
import { color } from '../theme/tokens';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  // 웹은 정적 HTML과 첫 렌더가 같아야 해서 글꼴을 기다리지 않는다 (font-display로 교체)
  if (!loaded && Platform.OS !== 'web') return null;

  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <WebFrame>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg.surface } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="diagnosis" />
          <Stack.Screen name="result" />
          <Stack.Screen name="precedents" />
        </Stack>
        <DevMenu />
      </WebFrame>
    </AppStateProvider>
  );
}
