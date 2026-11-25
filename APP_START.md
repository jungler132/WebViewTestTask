# App Start Instructions

Одна инструкция на **Expo** — одинаково для **Android и iOS**. Отдельный гайд под каждую ОС не нужен: бандлер один, приложение одно, на устройстве открывается через **Expo Go**.

WebView и intent проверять **на телефоне или эмуляторе**, не в браузере (`npm run web` для этого задания не подходит).

Проект на **Expo SDK 58**.

## Expo Share Link (preview)

Ревьюер может открыть сборку **без** `npx expo start` на вашем ПК:

https://expo.dev/accounts/jungler132/projects/hub-tools/updates/cbe3b089-06ec-4794-9367-ecb2b928c46b

1. Открыть ссылку в браузере.
2. Нажать **Preview**.
3. QR сканировать **внутри Expo Go** (версия под SDK 58).

Если QR не открывается — обновить Expo Go. Это EAS Update на ветке `preview`, runtime `1.0.0`.

## Что нужно

- Node.js 18+
- [Expo Go](https://expo.dev/go) на телефоне, **той же мажорной версии SDK 58**
  - Android — Google Play
  - iOS — App Store
- Телефон и компьютер в одной Wi‑Fi, без VPN

## Команды

В корне репозитория:

```bash
npm install
npx expo start
```

Если PowerShell пишет, что выполнение сценариев запрещено:

```powershell
npm.cmd install
npx.cmd expo start
```

В терминале Metro:

| Клавиша | Куда |
| --- | --- |
| QR | физический Android или iPhone |
| `a` | Android-эмулятор (Android Studio) |
| `i` | iOS-симулятор (**только macOS**) |

## Как открыть на телефоне (Android и iOS)

1. Запустите **Expo Go**.
2. В Expo Go нажмите **Scan QR code** и отсканируйте QR из терминала.
3. Не сканируйте QR системной камерой (на iPhone Safari будет бесконечно открывать проект; на Android тоже лучше сразу Expo Go).

После правок в коде: в Expo Go потрясти устройство → **Reload**. Либо:

```bash
npx expo start --clear
```

## Если проект не грузится или сразу закрывается

Телефон не видит ПК (файрвол Windows, гостевая Wi‑Fi, AP isolation) — туннель, и для Android, и для iOS:

```bash
npx expo start --tunnel --clear
```

Первый запуск туннеля может минуту ставить `@expo/ngrok`.

Порт **8081** занят старым Metro:

```powershell
netstat -ano | findstr :8081
taskkill /PID <PID_из_последней_колонки> /F
npx expo start
```

Либо согласиться на порт 8082, когда Expo спросит.

Если приложение открылось и сразу закрылось — обновите Expo Go под SDK 58 и снова `--clear`.

На Android-эмуляторе: в Android Studio должен быть запущен AVD, затем `a` в терминале Expo.

## Разрешения

Камера и фототека прописаны в `app.json`. Система спросит их при загрузке файла / верификации внутри WebView (и на Android, и на iOS).

Описание архитектуры, редиректов WebView и тестов по ТЗ — в [README.md](README.md).
