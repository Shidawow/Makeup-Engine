import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 60px rgba(31, 41, 55, 0.10)',
      },
    },
  },
  plugins: [],
} satisfies Config;
