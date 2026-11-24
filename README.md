# Hub & Tools (Partner Portal)

Тестовое мобильное приложение на **React Native / Expo**: хаб WebView с deep links и локальный UI-модуль (баланс, чеклист, аналитика).

## Что внутри

- **Part 1.** Блок `INTERACTIVE WEBVIEW DEEP LINKS`: кнопки **1WIN**, **MOSTBET**, **Pin-UP**, **AVIATOR**. Каждая открывает WebView соответствующего сервиса.
- **Part 2.** Блок `LOCAL INTERFACE`: Balance Tracker (счётчик, график, Top Up / Send) и Task Checklist & Analytics (чеклист, прогресс, API Status / App Performance).

UI: тёмная неоновая тема (deep blue / dark purple), glow, градиенты, Safe Area.

### Откуда визуал

Макет из ТЗ — основной. Поверх него взяты приёмы из реальных dark-neon прототипов:

- [Vault Nine / Crypto Wallet](https://sleek.design/templates/crypto-wallet-app) — obsidian + violet→cyan aurora, glow на балансе, glass-dock внизу
- [Zelus Wallet](https://www.laknerdesign.com/zelus-wallet) — dark purple + оранжевый неон на акцентах
- [1win.design palette](https://1win.design/palette) — Brand Blue / cyan для кнопки 1WIN

Кнопки брендов не копируют чужие макеты 1:1: у каждого свой градиент, inner-fill и иконка, как на референсе ТЗ.

---

## Стек

| Технология | Зачем |
| --- | --- |
| Expo SDK 58 + TypeScript | Сборка iOS/Android без отдельного native toolchain, TypeScript для контрактов навигации и стора |
| React Navigation (native-stack + bottom-tabs) | Стек для WebView поверх табов Home / Checklist / Analytics / Settings |
| `react-native-webview` | Сами страницы брендов, редиректы, окна, файлы |
| Redux Toolkit | Локальный стейт: баланс, задачи, статусы |
| `react-native-reanimated` | Press-scale кнопок, animated counter, микроанимация чекбоксов |
| `react-native-svg` | Sparkline графика активности |
| `expo-linear-gradient` / `expo-blur` | Карточки, брендовые обводки, модалки |
| `@react-native-community/netinfo` | Офлайн-стейт WebView |
| `expo-image-picker` | Permissions камеры/галереи для загрузки файлов в WebView |
| `@expo/vector-icons` | Иконки шапки, таббара и брендов |

---

## Запуск

Полная инструкция (Android и iOS, один Expo-поток): **[APP_START.md](APP_START.md)**.

Кратко:

```bash
npm install
npx expo start
```

QR сканировать **внутри Expo Go**. Если телефон не видит ПК: `npx expo start --tunnel --clear`. Эмулятор: `a` (Android) или `i` (iOS, macOS).

---

## Структура проекта

```text
App.tsx                          # Provider, SafeArea, загрузка статусов
index.ts                         # gesture-handler + registerRootComponent
src/
  theme/                         # цвета, scale() от ширины экрана
  navigation/                    # Tabs + Root Stack, типы экранов
  store/                         # Redux: balance, tasks, status
  screens/
    HomeScreen.tsx               # кнопки WebView + LOCAL INTERFACE
    WebViewScreen.tsx            # WebView, loader, back, ошибки
    TasksScreen.tsx              # полный чеклист
    AnalyticsScreen.tsx          # график и runtime-статусы
    SettingsScreen.tsx           # краткие сведения о приложении
  features/
    webview/
      brands.ts                  # URL и визуал брендов
      handleNavigation.ts        # редиректы / intent / native apps
      AppWebView.ts              # обёртка над WebView (типы RN 0.88)
      BrandButton.tsx
    balance/                     # карточка, counter, sparkline, модалки
    tasks/                       # чеклист и прогресс
  components/                    # фон, шапка, заголовки секций
```

---

## Навигация

```text
RootStack
  Tabs (bottom tabs)
    Home | Tasks | Analytics | Settings
  WebView (открывается с Home по brandId)
```

Назад в WebView: сначала `webview.goBack()`, если истории нет — выход на табы.

---

## Локальный стейт (Redux Toolkit)

- **balance** — сумма `$1,240.50`, процент, точки графика. Top Up / Send с валидацией (число > 0, Send не больше баланса).
- **tasks** — чеклист, `toggleTask`, прогресс = выполнено / всего.
- **status** — при старте `fetchStatus` имитирует async-запрос (~1.1 с) и ставит API Status `OK`, App Performance `99.4%`.

Не Context: один store проще шарить между Home, Tasks и Analytics.

---

## WebView: как обрабатываются редиректы

Логика в [`src/features/webview/handleNavigation.ts`](src/features/webview/handleNavigation.ts), подключение в [`src/screens/WebViewScreen.tsx`](src/screens/WebViewScreen.tsx).

### Что остаётся внутри WebView

Любой `http://` и `https://`. Так работают:

- обычная навигация сайта;
- платёжные шлюзы;
- 3-D Secure (редирект на ACS банка и обратно);
- `window.open` на https — URL грузим в том же WebView (`onOpenWindow`).

### Что уходит в нативное приложение

Если схема **не** http(s), загрузку в WebView **отменяем** (`return false`) и открываем систему через `Linking.openURL`.

Покрытые схемы (банки, СБП, кошельки, мессенджеры):

`sberpay`, `sberbankonline`, `sbolonline`, `sberbank`, `bank100000000111`, `bank100000000004`, `tinkoffbank`, `tinkoff`, `sbp`, `mirpay`, `yoomoney`, `yandexmoney`, `qiwi`, `payeer`, `webmoney`, `tonkeeper`, `whatsapp`, `tg`, `telegram`, `viber`, `mailto`, `tel`, `sms`, `intent`.

Неизвестная кастомная схема тоже уходит наружу — банки часто добавляют новые intent-URL. В WebView не оставляем `about`, `data`, `file`, `blob`.

### Android `intent://`

1. Пробуем `Linking.openURL(intent://…)`.
2. Если приложение не установлено — достаём `S.browser_fallback_url` или собираем `scheme://host` из extras.

### Хуки WebView

- `onShouldStartLoadWithRequest` — фильтр каждого перехода.
- `onOpenWindow` — `target=_blank` / `window.open` (банковские SDK часто так открывают приложение).
- `originWhitelist={['*']}` + `mixedContentMode="always"` — смешанный контент шлюзов.
- `javaScriptEnabled`, `domStorageEnabled`, `sharedCookiesEnabled` — сессия и 3DS.
- `setSupportMultipleWindows={false}` — игры 1win и попапы грузятся в том же WebView (на Android второй window иначе крутит лоадер бесконечно).
- `allowsInlineMediaPlayback` / `allowsFullscreenVideo` — видео и канвас игр.
- Android: Chrome mobile User-Agent без `; wv`, iframe-навигацию не перехватываем.

### Загрузка файлов и камера

Permissions в `app.json` (CAMERA, PHOTO LIBRARY). `onFileDownload` запрашивает доступ к медиатеке, чтобы формы KYC/оплаты могли прикрепить файл.

### UX загрузки и ошибок

- Progress bar сверху + skeleton, пока страница грузится.
- Нет сети (`NetInfo`) или `onError` / HTTP 5xx — экран ошибки и кнопка **Повторить**.

---

## UI / UX

- Safe Area на всех экранах.
- Размеры через `s()` / `vs()` от ширины/высоты экрана, без жёстких пикселей в макете.
- Кнопки брендов: уникальный градиент, glow, иконка, press scale.
- Animated Counter баланса при маунте и после операций.
- Чекбоксы с spring-scale.

---

## Как тестировать каждый кейс ТЗ

Делать на устройстве (Expo Go / эмулятор), не в браузере: WebView и intent на web неполноценны.

### Part 1. WebView

1. **4 брендовые кнопки**  
   Home → по очереди **1WIN / MOSTBET / Pin-UP / AVIATOR**. Каждая открывает свой WebView с заголовком бренда. Кнопка сжимается (scale) при нажатии.

2. **Индикация загрузки**  
   При открытии: skeleton поверх экрана и цветной Progress Bar сверху. После загрузки оба пропадают.

3. **Назад внутри WebView**  
   Внутри сайта уйти на внутреннюю страницу (меню, аккаунт). Стрелка назад: сначала предыдущая страница WebView, с корня сайта — возврат на Home.

4. **http(s) редиректы / 3DS / шлюзы**  
   На сайте открыть кассу / депозит (если доступно без полного KYC). Редиректы на `https://` платёжки остаются **внутри** WebView, не улетают в Safari.

5. **Deep link / intent (банк, СБП, кошелёк)**  
   На шаге оплаты выбрать метод, который открывает приложение (Сбер, Тинькофф, СБП, кошелёк). Ожидание: WebView не грузит `sberpay://` / `intent://` / `tinkoffbank://`, система предлагает открыть приложение. Если приложения нет — fallback URL, без краша.

6. **Модалки, файлы, камера**  
   Регистрация / верификация: `target=_blank` остаётся в том же WebView. При выборе файла iOS/Android запрашивают галерею/камеру (`app.json` permissions).

7. **Нет сети**  
   Открыть любой бренд → включить авиарежим → обновить (иконка refresh) или переоткрыть. Экран ошибки, кнопка **Повторить**. Выключить авиарежим → Повторить → страница грузится.

8. **Ошибка загрузки**  
   При недоступном хосте / HTTP 5xx — тот же error-state и **Повторить**.

### Part 2. LOCAL INTERFACE

9. **Animated Counter**  
   Зайти на Home: баланс считает до `$1,240.50`. После Top Up / Send цифра анимируется снова.

10. **График**  
    Sparkline в карточке Balance Tracker. После Top Up линия растёт, после Send — падает. Таб **Analytics** — тот же график крупнее.

11. **Top Up**  
    Top Up → пусто / `0` / `-1` → ошибка «Введите сумму больше 0». `50` → Add → баланс +50, график обновился.

12. **Send**  
    Send → сумма больше баланса → «Недостаточно средств». Валидная сумма → баланс уменьшился.

13. **Чеклист и микроанимация**  
    Таб списка: тап по задаче — чекбокс с spring, зачёркивание. На Home в карточке Active/Pending меняются.

14. **Прогресс-бар**  
    Отметить все задачи — бар почти полный. Снять галочки — сжимается.

15. **API Status / App Performance**  
    Холодный старт: около секунды «…», затем `OK` и `99.4%` (async thunk).

### UI / навигация

16. **Safe Area**  
    iPhone с челкой и Android: шапка не под notch, floating tab bar над home indicator.

17. **Tabs + Stack**  
    Home / Checklist / Analytics / Settings. WebView поверх табов, назад возвращает на табы.

18. **Тема**  
    Deep purple/blue фон, glow у кнопок, скругления, blur на таббаре и модалках.

---

## Соответствие ТЗ

- [x] 4 брендовые кнопки → WebView
- [x] Deep linking / intent (банки, СБП, кошельки)
- [x] http(s) редиректы шлюзов и 3DS внутри WebView
- [x] Модалки / файлы / камера (permissions + WebView windows)
- [x] Skeleton + progress bar
- [x] Назад внутри WebView
- [x] Офлайн/ошибка + «Повторить»
- [x] Balance Tracker: градиент, counter, график, Top Up / Send
- [x] Task Checklist: чекбоксы, прогресс, API Status, App Performance
- [x] Тёмная neon-тема, Stack + Tabs, Redux Toolkit, Reanimated

Стартовые URL (меняются в `src/features/webview/brands.ts`):

- 1win → https://1win.com
- Mostbet → https://mostbet.com
- Pin-Up → https://pin-up.com
- Aviator → https://aviator-game.com
