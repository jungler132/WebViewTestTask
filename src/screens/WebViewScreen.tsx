import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppWebView, type WebViewHandle, type WebViewNavState } from '../features/webview/AppWebView';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { colors, s } from '../theme';
import { getBrand } from '../features/webview/brands';
import {
  ANDROID_CHROME_UA,
  isHttpUrl,
  SAME_WINDOW_OPEN_SCRIPT,
  shouldAllowWebViewRequest,
} from '../features/webview/handleNavigation';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

export function WebViewScreen({ navigation, route }: Props) {
  const brand = getBrand(route.params.brandId);
  const insets = useSafeAreaInsets();
  const webRef = useRef<WebViewHandle>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const firstPaintDone = useRef(false);

  const handleNavChange = (nav: WebViewNavState) => {
    setCanGoBack(nav.canGoBack);
  };

  useEffect(() => {
    void NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setError('Нет соединения с интернетом');
        setLoading(false);
      }
    });
  }, []);

  const retry = useCallback(async () => {
    firstPaintDone.current = false;
    setError(null);
    setLoading(true);
    setProgress(0.12);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const net = await NetInfo.fetch();
    const offline = net.isConnected === false || net.isInternetReachable === false;

    if (offline) {
      setProgress(0);
      setLoading(false);
      setError('Нет соединения с интернетом');
      return;
    }

    setReloadKey((value) => value + 1);
  }, []);

  const goBack = () => {
    if (canGoBack) {
      webRef.current?.goBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={styles.fill}>
      <View style={[styles.header, { paddingTop: insets.top + s(8), borderBottomColor: brand.glow }]}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={s(22)} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{brand.title}</Text>
        <Pressable onPress={retry} hitSlop={12} style={styles.back}>
          <Ionicons name="refresh" size={s(18)} color={colors.textMuted} />
        </Pressable>
      </View>
      {loading && !error ? (
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={brand.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progress, { width: `${Math.max(progress * 100, 8)}%` }]}
          />
        </View>
      ) : (
        <View style={styles.progressSpacer} />
      )}

      {error ? (
        <View style={styles.error}>
          <Ionicons name="cloud-offline-outline" size={s(42)} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Не удалось загрузить страницу</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retry} onPress={retry} disabled={loading && !error}>
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.fill}>
          {loading ? (
            <View style={styles.skeleton}>
              <View style={styles.skelBlock} />
              <View style={[styles.skelBlock, { width: '70%' }]} />
              <View style={[styles.skelBlock, { height: s(120) }]} />
              <ActivityIndicator color={brand.glow} />
            </View>
          ) : null}
          <AppWebView
            key={reloadKey}
            ref={webRef}
            source={{ uri: brand.url }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically
            mixedContentMode="always"
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            allowsBackForwardNavigationGestures
            nestedScrollEnabled
            androidLayerType="hardware"
            userAgent={Platform.OS === 'android' ? ANDROID_CHROME_UA : undefined}
            injectedJavaScriptBeforeContentLoaded={SAME_WINDOW_OPEN_SCRIPT}
            startInLoadingState
            onLoadProgress={(event: { nativeEvent: { progress: number } }) => {
              setProgress(event.nativeEvent.progress);
              if (event.nativeEvent.progress >= 1) {
                firstPaintDone.current = true;
                setLoading(false);
              }
            }}
            onLoadStart={() => {
              setError(null);
              if (!firstPaintDone.current) {
                setLoading(true);
              }
            }}
            onLoadEnd={() => {
              firstPaintDone.current = true;
              setLoading(false);
            }}
            onNavigationStateChange={handleNavChange}
            onShouldStartLoadWithRequest={(request: { url: string; isTopFrame?: boolean }) =>
              shouldAllowWebViewRequest(request.url, request.isTopFrame !== false)
            }
            onOpenWindow={(event: { nativeEvent: { targetUrl: string } }) => {
              const url = event.nativeEvent.targetUrl;
              if (!url) {
                return;
              }
              if (isHttpUrl(url)) {
                webRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(url)}; true;`);
                return;
              }
              shouldAllowWebViewRequest(url);
            }}
            onError={() => {
              setLoading(false);
              setError('Ошибка загрузки страницы');
            }}
            onHttpError={(event: { nativeEvent: { statusCode: number } }) => {
              if (event.nativeEvent.statusCode >= 500) {
                setError(`HTTP ${event.nativeEvent.statusCode}`);
              }
            }}
            onFileDownload={async () => {
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070B1E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingBottom: s(10),
    backgroundColor: '#0B1028',
    borderBottomWidth: 1.5,
  },
  back: { width: s(32), alignItems: 'center' },
  title: { color: colors.text, fontSize: s(16), fontWeight: '700' },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progress: { height: 3 },
  progressSpacer: { height: 3 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: '#0B1028',
    padding: s(18),
    gap: s(12),
  },
  skelBlock: {
    height: s(16),
    borderRadius: s(8),
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(24),
    gap: s(10),
  },
  errorTitle: { color: colors.text, fontSize: s(18), fontWeight: '700' },
  errorText: { color: colors.textMuted, textAlign: 'center' },
  retry: {
    marginTop: s(8),
    backgroundColor: '#6D5CFF',
    borderRadius: s(12),
    paddingHorizontal: s(22),
    paddingVertical: s(10),
  },
  retryText: { color: colors.text, fontWeight: '700' },
});
