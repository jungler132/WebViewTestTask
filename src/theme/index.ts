import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const s = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size));

export const vs = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size));

/** Deep Blue / Dark Purple + aurora (Vault Nine / Zelus + референс ТЗ). */
export const colors = {
  bgTop: '#2A0F55',
  bgMid: '#14143F',
  bgBottom: '#070B24',
  card: 'rgba(18, 24, 62, 0.78)',
  cardBorder: 'rgba(140, 170, 255, 0.28)',
  text: '#F7F9FF',
  textMuted: 'rgba(214, 224, 255, 0.7)',
  textDim: 'rgba(176, 192, 255, 0.48)',
  accent: '#8B7CFF',
  cyan: '#4DE8FF',
  success: '#3DFF9A',
  warning: '#FFB020',
  error: '#FF5C7A',
  tabBar: 'rgba(8, 10, 28, 0.72)',
};

export const radii = {
  sm: s(12),
  md: s(18),
  lg: s(24),
  pill: s(30),
};

export const spacing = {
  xs: s(6),
  sm: s(10),
  md: s(16),
  lg: s(22),
  xl: s(28),
};
