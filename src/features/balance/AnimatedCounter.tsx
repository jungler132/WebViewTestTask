import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, s } from '../../theme';

type Props = {
  value: number;
  style?: TextStyle;
};

function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function AnimatedCounter({ value, style }: Props) {
  const [display, setDisplay] = useState(formatMoney(0));
  const animated = useSharedValue(0);

  const setFormatted = useCallback((next: number) => {
    setDisplay(formatMoney(next));
  }, []);

  useEffect(() => {
    animated.value = withTiming(value, { duration: 900 });
  }, [animated, value]);

  useAnimatedReaction(
    () => animated.value,
    (current) => {
      runOnJS(setFormatted)(current);
    },
  );

  return <Text style={[styles.value, style]}>{display}</Text>;
}

const styles = StyleSheet.create({
  value: {
    color: colors.text,
    fontSize: s(22),
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
