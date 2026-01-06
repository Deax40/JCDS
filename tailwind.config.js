/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a1a1a',
        'secondary': '#666666',
        'secondary2': '#999999',
        'surface': '#f5f5f5',
        'line': '#e5e5e5',
        'red': '#db4444',
        'green': '#22c55e',
        'yellow': '#fbbf24',
        'purple': '#a855f7',
        'blue': '#3b82f6',
        'cyan': {
          500: '#06b6d4'
        },
        'orange': '#f97316',
        'pink': '#ec4899',
        'emerald': {
          500: '#10b981'
        },
        'teal': {
          500: '#14b8a6'
        },
        'indigo': {
          500: '#6366f1'
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        display: ['Sora', 'Poppins', 'sans-serif'],
      },
      fontSize: {
        'display1': ['64px', { lineHeight: '1.2', fontWeight: '600' }],
        'display2': ['56px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading1': ['48px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading2': ['40px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading3': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading4': ['32px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading5': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading6': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        'body1': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body2': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption1': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption2': ['10px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
