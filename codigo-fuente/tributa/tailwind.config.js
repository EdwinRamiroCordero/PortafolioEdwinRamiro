/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'system-ui', 'sans-serif'] },
      colors: { ink: '#1d1d1f', mute: '#6e6e73', leaf: { 50: '#ecfdf3', 100: '#d1fadf', 500: '#12b76a', 600: '#039855', 700: '#027a48' }, sand: '#f5f5f7' },
      letterSpacing: { tightest: '-.05em' },
    },
  },
  plugins: [],
};
