import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export function ScreenBackground({ children }: PropsWithChildren) {
  return (
    <LinearGradient colors={[colors.bgTop, colors.bgMid, colors.bgBottom]} style={styles.fill}>
      <View pointerEvents="none" style={styles.auroraTop} />
      <View pointerEvents="none" style={styles.auroraCyan} />
      <View pointerEvents="none" style={styles.auroraBottom} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  auroraTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(132, 72, 255, 0.38)',
    top: -90,
    right: -70,
  },
  auroraCyan: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(50, 190, 255, 0.16)',
    top: 120,
    left: -90,
  },
  auroraBottom: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(70, 40, 180, 0.28)',
    bottom: 40,
    left: -80,
  },
});
