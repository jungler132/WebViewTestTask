import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, radii, s } from '../../theme';
import type { Brand } from './brands';

type Props = {
  brand: Brand;
  onPress: () => void;
};

const ICONS: Record<Brand['badgeIcon'], keyof typeof Ionicons.glyphMap> = {
  sparkles: 'sparkles-outline',
  star: 'star',
  heart: 'heart',
  airplane: 'airplane',
};

export function BrandButton({ brand, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.55 + scale.value * 0.45,
  }));

  return (
    <Animated.View style={[styles.shadow, animatedStyle, { shadowColor: brand.glow }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 16, stiffness: 280 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
      >
        <LinearGradient colors={brand.colors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.border}>
          <View style={[styles.inner, { backgroundColor: brand.inner }]}>
            <View style={[styles.sheen, { backgroundColor: brand.glow }]} />
            <BrandTitle brand={brand} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>webview</Text>
              <Ionicons name={ICONS[brand.badgeIcon]} size={s(15)} color={brand.glow} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

function BrandTitle({ brand }: { brand: Brand }) {
  if (brand.id === 'mostbet') {
    return (
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>M</Text>
        <Ionicons name="star" size={s(17)} color="#FF9A1A" />
        <Text style={[styles.title, { color: '#FFFFFF' }]}>ST</Text>
        <Text style={[styles.title, { color: '#FF9A1A' }]}>BET</Text>
      </View>
    );
  }

  if (brand.id === 'aviator') {
    return (
      <View style={styles.titleRow}>
        <Ionicons name="airplane" size={s(16)} color="#E8D7FF" />
        <Text style={[styles.title, { color: brand.titleColor, marginLeft: s(6) }]}>{brand.title}</Text>
      </View>
    );
  }

  return <Text style={[styles.title, { color: brand.titleColor }]}>{brand.title}</Text>;
}

const styles = StyleSheet.create({
  shadow: {
    marginBottom: s(12),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  border: {
    borderRadius: radii.pill,
    padding: s(2),
  },
  inner: {
    borderRadius: radii.pill,
    minHeight: s(58),
    paddingHorizontal: s(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    width: s(90),
    height: s(90),
    borderRadius: s(45),
    left: -s(20),
    opacity: 0.12,
  },
  title: {
    fontSize: s(22),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  badgeText: {
    color: colors.textDim,
    fontSize: s(11),
    fontWeight: '600',
  },
});
