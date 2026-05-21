import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F5F0',
        ink: '#1A1614',
        accent: '#8B4513',
        'accent-light': '#C8A97A',
        border: '#E5DDD0',
        muted: '#8C8279',
        card: '#FFFEFB',
      },
      fontFamily: {
        haiku: [
          '"Hiragino Mincho ProN"',
          '"Yu Mincho"',
          '"Noto Serif CJK JP"',
          'serif',
        ],
        sans: [
          '"Hiragino Kaku Gothic ProN"',
          '"Yu Gothic"',
          '"Noto Sans CJK JP"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

export default config
