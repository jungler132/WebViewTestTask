export type BrandId = '1win' | 'mostbet' | 'pinup' | 'aviator';

export type Brand = {
  id: BrandId;
  title: string;
  url: string;
  badgeIcon: 'sparkles' | 'star' | 'heart' | 'airplane';
  colors: [string, string, string];
  glow: string;
  titleColor: string;
  inner: string;
};

export const BRANDS: Brand[] = [
  {
    id: '1win',
    title: '1WIN',
    url: 'https://1win.com',
    badgeIcon: 'sparkles',
    // Brand Blue / cyan с 1win.design + референс
    colors: ['#7AFFFF', '#3EC7FF', '#0075FF'],
    glow: '#3EC7FF',
    titleColor: '#7EFFFF',
    inner: '#07162E',
  },
  {
    id: 'mostbet',
    title: 'MOSTBET',
    url: 'https://mostbet.com',
    badgeIcon: 'star',
    colors: ['#FFD56A', '#FF9A1A', '#FF6A00'],
    glow: '#FF9A1A',
    titleColor: '#FFFFFF',
    inner: '#140C08',
  },
  {
    id: 'pinup',
    title: 'Pin-UP',
    url: 'https://pin-up.com',
    badgeIcon: 'heart',
    colors: ['#FF8EC8', '#FF2D6A', '#C4003C'],
    glow: '#FF2D6A',
    titleColor: '#FF3B5C',
    inner: '#16030C',
  },
  {
    id: 'aviator',
    title: 'AVIATOR',
    url: 'https://aviator-game.com',
    badgeIcon: 'airplane',
    colors: ['#E0B8FF', '#A56BFF', '#6A2BFF'],
    glow: '#B07CFF',
    titleColor: '#FFFFFF',
    inner: '#12081F',
  },
];

export function getBrand(id: string): Brand {
  return BRANDS.find((item) => item.id === id) ?? BRANDS[0];
}
