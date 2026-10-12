import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const ICONS: Record<string, IconName> = {
  index: 'home',
  diagnose: 'diagnose',
  cases: 'folder',
  apply: 'edit',
  profile: 'user',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const label = descriptors[route.key].options.title ?? route.name;
        const tint = focused ? color.brand[700] : color.text.secondary;
        const onPress = () => {
          // 진단은 탭바를 숨기는 하위 화면
          if (route.name === 'diagnose') {
            router.push('/diagnosis');
            return;
          }
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={styles.item}
          >
            <Icon name={ICONS[route.name]} size={24} color={tint} filled={focused} strokeWidth={1.4} />
            <Txt v="body" w={focused ? 'bold' : 'medium'} c={tint} style={styles.label}>
              {label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingHorizontal: space.screenX,
    backgroundColor: color.bg.surface,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: color.line.divider,
  },
  item: {
    flex: 1,
    height: 62,
    alignItems: 'center',
    paddingTop: 15,
  },
  label: { marginTop: 4 },
});
