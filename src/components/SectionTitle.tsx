import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, s } from '../theme';

type Props = {
  title: string;
  withChevron?: boolean;
};

export function SectionTitle({ title, withChevron = true }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {withChevron ? (
        <Ionicons name="chevron-down" size={s(14)} color={colors.textDim} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(12),
    paddingHorizontal: s(4),
  },
  title: {
    color: 'rgba(210, 220, 255, 0.55)',
    fontSize: s(10),
    letterSpacing: 1.6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
