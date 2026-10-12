import Tabs from 'expo-router/js-tabs';
import { TabBar } from '../../components/TabBar';
import { color } from '../../theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.bg.surface } }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="diagnose" options={{ title: '진단' }} />
      <Tabs.Screen name="cases" options={{ title: '내 사건' }} />
      <Tabs.Screen name="apply" options={{ title: '신청' }} />
      <Tabs.Screen name="profile" options={{ title: '프로필' }} />
    </Tabs>
  );
}
