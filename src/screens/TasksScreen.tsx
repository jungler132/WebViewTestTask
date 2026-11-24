import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '../components/ScreenBackground';
import { SectionTitle } from '../components/SectionTitle';
import { TaskList } from '../features/tasks/TaskList';
import { TaskChecklistCard } from '../features/tasks/TaskChecklistCard';
import { colors, s, vs } from '../theme';

export function TasksScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground>
      <View style={[styles.content, { paddingTop: insets.top + vs(8), paddingBottom: insets.bottom + vs(72) }]}>
        <Text style={styles.title}>Checklist</Text>
        <TaskChecklistCard />
        <View style={styles.list}>
          <SectionTitle title="TASKS" withChevron={false} />
          <TaskList />
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
  list: { flex: 1 },
});
