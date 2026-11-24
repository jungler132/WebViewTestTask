import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radii, s } from '../../theme';
import { useAppSelector } from '../../store';
import { selectProgress } from '../../store/tasksSlice';

export function TaskChecklistCard({ fill = false }: { fill?: boolean }) {
  const items = useAppSelector((state) => state.tasks.items);
  const status = useAppSelector((state) => state.status);
  const progress = selectProgress(items);
  const active = items.filter((item) => item.done).length;
  const pending = items.filter((item) => !item.done).length;
  const bar = useSharedValue(progress);

  useEffect(() => {
    bar.value = withTiming(progress, { duration: 420 });
  }, [bar, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.max(bar.value, 0.02) }],
  }));

  return (
    <LinearGradient colors={['#1C2560', '#2A1658', '#141A42']} style={[styles.card, fill && { flex: 1 }]}>
      <Text style={styles.label}>Task Checklist</Text>
      <View style={styles.stats}>
        <View>
          <Text style={styles.statValue}>{active}</Text>
          <Text style={styles.statHint}>Active</Text>
        </View>
        <View>
          <Text style={[styles.statValue, { color: colors.warning }]}>{pending}</Text>
          <Text style={styles.statHint}>Pending</Text>
        </View>
      </View>
      <Text style={styles.progressLabel}>Progress</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fillBar, fillStyle]} />
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>API Status:</Text>
        <Text style={[styles.statusValue, { color: status.loading ? colors.textDim : colors.success }]}>
          {status.loading ? '…' : status.api}
        </Text>
      </View>
      <Text style={styles.perf}>
        App Performance:{' '}
        <Text style={{ color: status.loading ? colors.textDim : colors.success }}>
          {status.loading ? '…' : status.performance}
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: s(12),
    minHeight: s(176),
    borderWidth: 1,
    borderColor: 'rgba(170, 110, 255, 0.32)',
  },
  label: {
    color: colors.textMuted,
    fontSize: s(11),
    fontWeight: '700',
    marginBottom: s(10),
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(10),
  },
  statValue: {
    color: colors.success,
    fontSize: s(16),
    fontWeight: '800',
  },
  statHint: {
    color: colors.textDim,
    fontSize: s(10),
  },
  progressLabel: {
    color: colors.textDim,
    fontSize: s(10),
    marginBottom: s(4),
  },
  track: {
    height: s(7),
    borderRadius: s(4),
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: s(12),
  },
  fillBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#6A8CFF',
    borderRadius: s(4),
    transformOrigin: 'left',
  },
  statusRow: {
    flexDirection: 'row',
    gap: s(6),
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: s(10),
  },
  statusValue: {
    fontSize: s(10),
    fontWeight: '800',
  },
  perf: {
    color: colors.textMuted,
    fontSize: s(10),
    marginTop: s(4),
  },
});
