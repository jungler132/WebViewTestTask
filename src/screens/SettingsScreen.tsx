import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '../components/ScreenBackground';
import { colors, radii, s, vs } from '../theme';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground>
      <View style={[styles.content, { paddingTop: insets.top + vs(8), paddingBottom: insets.bottom + vs(72) }]}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.row}>App: Hub & Tools</Text>
          <Text style={styles.row}>Version: 1.0.0</Text>
          <Text style={styles.row}>Theme: Deep Blue / Dark Purple</Text>
          <Text style={styles.hint}>
            WebView deep links, payment redirects and local modules live on the Home tab.
          </Text>
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
  row: { color: colors.text, fontSize: s(14) },
  hint: { color: colors.textMuted, marginTop: s(8), lineHeight: s(20) },
});
