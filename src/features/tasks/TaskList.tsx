import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, s } from '../../theme';
import { toggleTask } from '../../store/tasksSlice';
import { useAppDispatch, useAppSelector } from '../../store';

export function TaskList() {
  const items = useAppSelector((state) => state.tasks.items);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable key={item.id} style={styles.row} onPress={() => dispatch(toggleTask(item.id))}>
          <Checkbox done={item.done} />
          <Text style={[styles.title, item.done && styles.done]}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Checkbox({ done }: { done: boolean }) {
  const scale = useSharedValue(done ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(done ? 1 : 0.9, { damping: 14, stiffness: 220 });
  }, [done, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.box, done && styles.boxDone, style]}>
      {done ? <Ionicons name="checkmark" size={s(14)} color="#082018" /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: s(8) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    backgroundColor: 'rgba(20, 26, 70, 0.7)',
    borderRadius: radii.md,
    padding: s(12),
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    color: colors.text,
    fontSize: s(14),
    flex: 1,
  },
  done: {
    color: colors.textDim,
    textDecorationLine: 'line-through',
  },
  box: {
    width: s(22),
    height: s(22),
    borderRadius: s(7),
    borderWidth: 1.5,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: {
    backgroundColor: colors.success,
  },
});
