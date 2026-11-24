import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '../components/ScreenBackground';
import { Sparkline } from '../features/balance/Sparkline';
import { AnimatedCounter } from '../features/balance/AnimatedCounter';
import { useAppSelector } from '../store';
import { colors, radii, s, vs } from '../theme';

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { amount, changePercent, chart } = useAppSelector((state) => state.balance);
  const status = useAppSelector((state) => state.status);

  return (
    <ScreenBackground>
      <View style={[styles.content, { paddingTop: insets.top + vs(8), paddingBottom: insets.bottom + vs(72) }]}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Balance</Text>
          <AnimatedCounter value={amount} />
          <Text style={styles.change}>+{changePercent.toFixed(1)}% activity</Text>
          <Sparkline points={chart} width={Dimensions.get('window').width - s(64)} height={s(90)} />
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Runtime</Text>
          <Text style={styles.meta}>API Status: {status.loading ? '…' : status.api}</Text>
          <Text style={styles.meta}>App Performance: {status.loading ? '…' : status.performance}</Text>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: s(16),
    gap: s(14),
  },
  title: {
    color: colors.text,
    fontSize: s(22),
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(20, 26, 70, 0.75)',
    borderRadius: radii.lg,
    padding: s(16),
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: s(8),
  },
  label: { color: colors.textMuted, fontWeight: '700' },
  change: { color: colors.success, fontWeight: '700' },
  meta: { color: colors.text, fontSize: s(14) },
});
