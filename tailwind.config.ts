import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FC8019',
          'orange-dark': '#E16A00',
          'orange-light': '#FEF3EB',
        },
        swiggy: {
          black: '#02060C',
          gray: '#686B78',
          'gray-light': '#93959F',
          'gray-bg': '#F5F5F5',
          border: '#E9E9EB',
          green: '#3D9B6D',
          red: '#E43B4F',
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
