import { Linking } from 'react-native';

/**
 * Non-http(s) schemes that must leave WebView and open a native app
 * (banks, SBP, wallets, messengers). http(s) stays inside WebView so
 * payment gateways and 3-D Secure redirects keep working.
 */
const EXTERNAL_SCHEMES = new Set([
  'sberpay',
  'sberbankonline',
  'sbolonline',
  'sberbank',
  'bank100000000111',
  'bank100000000004',
  'tinkoffbank',
  'tinkoff',
  'intent',
  'whatsapp',
  'tg',
  'telegram',
  'viber',
  'mailto',
  'tel',
  'sms',
  'sbp',
  'mirpay',
  'yoomoney',
  'yandexmoney',
  'qiwi',
  'payeer',
  'webmoney',
  'tonkeeper',
  'cryptowallet',
]);

function getScheme(url: string): string {
  const match = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  return match ? match[1].toLowerCase() : '';
}

export function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function shouldOpenExternally(url: string): boolean {
  if (!url || url === 'about:blank') {
    return false;
  }
  if (isHttpUrl(url)) {
    return false;
  }
  const scheme = getScheme(url);
  if (!scheme) {
    return false;
  }
  if (EXTERNAL_SCHEMES.has(scheme)) {
    return true;
  }
  // Unknown custom scheme (bank apps add new ones often) — do not trap it in WebView.
  return scheme !== 'about' && scheme !== 'data' && scheme !== 'file' && scheme !== 'blob';
}

function fallbackFromIntent(url: string): string | null {
  const fallback = url.match(/S\.browser_fallback_url=([^;]+)/i);
  if (fallback?.[1]) {
    return decodeURIComponent(fallback[1]);
  }
  const schemeHost = url.match(/^intent:\/\/([^#]+)/i);
  const extraScheme = url.match(/scheme=([^;]+)/i);
  if (schemeHost?.[1] && extraScheme?.[1]) {
    return `${extraScheme[1]}://${schemeHost[1]}`;
  }
  return null;
}

export async function openExternalUrl(url: string): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
    if (url.toLowerCase().startsWith('intent:')) {
      const fallback = fallbackFromIntent(url);
      if (fallback) {
        await Linking.openURL(fallback);
      }
    }
  } catch {
    if (url.toLowerCase().startsWith('intent:')) {
      const fallback = fallbackFromIntent(url);
      if (fallback) {
        await Linking.openURL(fallback);
      }
    }
  }
}

export function shouldAllowWebViewRequest(
  url: string,
  isTopFrame: boolean = true,
): boolean {
  // Android fires this for iframes (games). Never block subframes.
  if (!isTopFrame) {
    return true;
  }
  if (shouldOpenExternally(url)) {
    void openExternalUrl(url);
    return false;
  }
  return true;
}

/** Games and 3DS often call window.open; Android has no second WebView to show. */
export const SAME_WINDOW_OPEN_SCRIPT = `
(function() {
  var nativeOpen = window.open;
  window.open = function(url) {
    if (url && /^https?:/i.test(String(url))) {
      window.location.href = url;
      return window;
    }
    if (nativeOpen) {
      return nativeOpen.apply(window, arguments);
    }
    return window;
  };
})();
true;
`;

export const ANDROID_CHROME_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';

