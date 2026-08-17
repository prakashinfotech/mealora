import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mealora brand — indigo-violet
        brand: {
          primary: '#5B4BDB',
          'primary-dark': '#4A3BC0',
          'primary-light': '#EEE9FF',
        },
        // Neutral app tokens — generic semantic naming
        app: {
          black: '#171525',
          gray: '#6B687A',
          'gray-light': '#A09DB8',
          'gray-bg': '#F8F7FC',
          border: '#E5E3F0',
          green: '#16A34A',
          red: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
