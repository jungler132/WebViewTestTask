import { ScrollView, StyleSheet, View } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { ScreenBackground } from '../components/ScreenBackground';
import { SectionTitle } from '../components/SectionTitle';
import { BalanceCard } from '../features/balance/BalanceCard';
import { TaskChecklistCard } from '../features/tasks/TaskChecklistCard';
import { BrandButton } from '../features/webview/BrandButton';
import { BRANDS } from '../features/webview/brands';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { s, vs } from '../theme';

type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigation>();

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + vs(8), paddingBottom: insets.bottom + vs(88) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader title="Partner Portal" />
        <SectionTitle title="INTERACTIVE WEBVIEW DEEP LINKS" />
        {BRANDS.map((brand) => (
          <BrandButton
            key={brand.id}
            brand={brand}
            onPress={() => navigation.navigate('WebView', { brandId: brand.id })}
          />
        ))}
        <View style={styles.local}>
          <SectionTitle title="LOCAL INTERFACE" />
          <View style={styles.cards}>
            <View style={styles.cardSlot}>
              <BalanceCard />
            </View>
            <View style={styles.cardSlot}>
              <TaskChecklistCard fill />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: s(16),
  },
  local: {
    marginTop: s(14),
  },
  cards: {
    flexDirection: 'row',
    gap: s(10),
  },
  cardSlot: {
    flex: 1,
  },
});
