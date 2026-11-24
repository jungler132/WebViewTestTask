import { WebView as NativeWebView } from 'react-native-webview';

export type WebViewHandle = {
  goBack: () => void;
  injectJavaScript: (script: string) => void;
  reload: () => void;
};

export type WebViewNavState = {
  canGoBack: boolean;
  url?: string;
};

// RN 0.88 + webview 14: published prop types collapse to `never`. Runtime is fine.
export const AppWebView = NativeWebView as any;
