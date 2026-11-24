import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, s } from '../../theme';

type Props = {
  visible: boolean;
  title: string;
  actionLabel: string;
  maxAmount?: number;
  onClose: () => void;
  onSubmit: (amount: number) => void;
};

export function MoneyModal({
  visible,
  title,
  actionLabel,
  maxAmount,
  onClose,
  onSubmit,
}: Props) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRaw('');
    setError(null);
  };

  const handleSubmit = () => {
    const amount = Number(raw.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Введите сумму больше 0');
      return;
    }
    if (maxAmount !== undefined && amount > maxAmount) {
      setError('Недостаточно средств');
      return;
    }
    onSubmit(Number(amount.toFixed(2)));
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <Pressable
          style={styles.fill}
          onPress={() => {
            reset();
            onClose();
          }}
        >
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <Pressable style={styles.card} onPress={() => undefined}>
            <Text style={styles.kicker}>LOCAL INTERFACE</Text>
            <Text style={styles.title}>{title}</Text>
            <TextInput
              value={raw}
              onChangeText={(text) => {
                setRaw(text);
                setError(null);
              }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textDim}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.row}>
              <Pressable
                style={styles.ghost}
                onPress={() => {
                  reset();
                  onClose();
                }}
              >
                <Text style={styles.ghostText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.primary} onPress={handleSubmit}>
                <Text style={styles.primaryText}>{actionLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'center', padding: s(22) },
  kicker: {
    color: colors.textDim,
    fontSize: s(10),
    letterSpacing: 1.4,
    marginBottom: s(6),
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(16, 18, 48, 0.92)',
    borderRadius: radii.lg,
    padding: s(18),
    borderWidth: 1,
    borderColor: 'rgba(150, 140, 255, 0.35)',
  },
  title: {
    color: colors.text,
    fontSize: s(18),
    fontWeight: '700',
    marginBottom: s(12),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: s(12),
    paddingVertical: s(10),
    fontSize: s(18),
  },
  error: {
    color: colors.error,
    marginTop: s(8),
    fontSize: s(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: s(10),
    marginTop: s(16),
  },
  ghost: {
    paddingHorizontal: s(14),
    paddingVertical: s(10),
  },
  ghostText: { color: colors.textMuted, fontWeight: '600' },
  primary: {
    backgroundColor: '#6D5CFF',
    borderRadius: radii.md,
    paddingHorizontal: s(16),
    paddingVertical: s(10),
  },
  primaryText: { color: colors.text, fontWeight: '700' },
});
