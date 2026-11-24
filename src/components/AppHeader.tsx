import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, s } from '../theme';

type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBtn}>
        <Ionicons name="menu" size={s(20)} color={colors.text} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconBtn}>
        <Ionicons name="planet-outline" size={s(18)} color="#C4B5FF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(20),
  },
  title: {
    color: colors.text,
    fontSize: s(18),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  iconBtn: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(180, 170, 255, 0.18)',
  },
});
