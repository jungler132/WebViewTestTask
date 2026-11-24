import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, s } from '../theme';
import type { TabParamList } from '../navigation/types';

const ICONS: Record<keyof TabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Home: ['home', 'home-outline'],
  Tasks: ['list', 'list-outline'],
  Analytics: ['document-text', 'document-text-outline'],
  Settings: ['settings', 'settings-outline'],
};

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, s(10)) }]}>
      <BlurView intensity={42} tint="dark" style={styles.dock}>
        <View style={styles.inner}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const name = route.name as keyof TabParamList;
            const icon = ICONS[name][focused ? 0 : 1];
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.item}
              >
                {focused ? <View style={styles.glow} /> : null}
                <Ionicons name={icon} size={s(22)} color={focused ? '#C9B8FF' : 'rgba(200,210,255,0.38)'} />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: s(18),
    right: s(18),
    bottom: 0,
  },
  dock: {
    borderRadius: s(28),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(160, 150, 255, 0.22)',
    backgroundColor: colors.tabBar,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: s(56),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: 'rgba(140, 110, 255, 0.28)',
  },
});
