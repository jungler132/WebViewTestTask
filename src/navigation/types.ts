import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BrandId } from '../features/webview/brands';

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  WebView: { brandId: BrandId };
};
