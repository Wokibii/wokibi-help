import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wokibi: {
          bg: '#0D0D12',
          card: '#1C1C26',
          border: '#2D2D3A',
          purple: '#9333EA',
          'purple-light': '#A855F7',
          muted: '#9CA3AF',
          pending: '#F59E0B',
          progress: '#9333EA',
          done: '#10B981',
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
