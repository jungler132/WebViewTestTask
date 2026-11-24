import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import type { ChartPoint } from '../../store/balanceSlice';
import { s } from '../../theme';

type Props = {
  points: ChartPoint[];
  width?: number;
  height?: number;
  color?: string;
};

export function Sparkline({
  points,
  width = s(128),
  height = s(44),
  color = '#3DFF9A',
}: Props) {
  if (points.length < 2) {
    return null;
  }

  const maxY = Math.max(...points.map((p) => p.y));
  const minY = Math.min(...points.map((p) => p.y));
  const range = Math.max(maxY - minY, 1);

  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = 4 + (height - 8) - ((point.y - minY) / range) * (height - 8);
    return { x, y };
  });

  const line = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
  const last = coords[coords.length - 1];
  const area = `${line} L${last.x.toFixed(1)} ${height} L0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.35" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#sparkFill)" />
      <Path d={line} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
