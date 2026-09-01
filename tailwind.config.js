/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Zen', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Zen Mono', 'ui-monospace', 'monospace'],
        display: ['Zen', 'sans-serif'],
      },
      colors: {
        border: 'rgba(255, 255, 255, 0.08)',
        background: '#000000',
        foreground: '#EDEDF1',
      },
    },
  },
  plugins: [],
}
