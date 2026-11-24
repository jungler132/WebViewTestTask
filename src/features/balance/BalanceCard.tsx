import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, s } from '../../theme';
import { send, topUp } from '../../store/balanceSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { AnimatedCounter } from './AnimatedCounter';
import { MoneyModal } from './MoneyModal';
import { Sparkline } from './Sparkline';

export function BalanceCard() {
  const dispatch = useAppDispatch();
  const { amount, changePercent, chart } = useAppSelector((state) => state.balance);
  const [mode, setMode] = useState<'topup' | 'send' | null>(null);

  return (
    <LinearGradient colors={['#24306F', '#2C1C68', '#151A48']} style={styles.card}>
      <Text style={styles.label}>Balance Tracker</Text>
      <Text style={styles.sub}>Balance</Text>
      <View style={styles.amountRow}>
        <AnimatedCounter value={amount} style={styles.amount} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+{changePercent.toFixed(1)}%</Text>
        </View>
      </View>
      <Sparkline points={chart} />
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => setMode('topup')}>
          <Text style={styles.actionText}>Top Up</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => setMode('send')}>
          <Text style={styles.actionText}>Send</Text>
        </Pressable>
      </View>
      <MoneyModal
        visible={mode === 'topup'}
        title="Top Up"
        actionLabel="Add"
        onClose={() => setMode(null)}
        onSubmit={(value) => dispatch(topUp(value))}
      />
      <MoneyModal
        visible={mode === 'send'}
        title="Send"
        actionLabel="Send"
        maxAmount={amount}
        onClose={() => setMode(null)}
        onSubmit={(value) => dispatch(send(value))}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.lg,
    padding: s(12),
    minHeight: s(176),
    borderWidth: 1,
    borderColor: 'rgba(90, 160, 255, 0.32)',
  },
  label: {
    color: colors.textMuted,
    fontSize: s(11),
    fontWeight: '700',
  },
  sub: {
    color: colors.textDim,
    fontSize: s(10),
    marginTop: s(2),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: s(2),
  },
  amount: {
    fontSize: s(18),
    fontVariant: ['tabular-nums'],
  },
  badge: {
    backgroundColor: 'rgba(61, 255, 154, 0.16)',
    borderRadius: s(8),
    paddingHorizontal: s(6),
    paddingVertical: s(2),
  },
  badgeText: {
    color: colors.success,
    fontSize: s(10),
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: s(10),
  },
  action: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: s(12),
    paddingVertical: s(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  actionText: {
    color: colors.text,
    fontSize: s(11),
    fontWeight: '700',
  },
});
