export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: { navy: '#0C2B29', brand: '#0E9F7E', surface: '#F2F7F4', lime: '#D9F46A', mint: '#E3F3EC' },
      boxShadow: {
        soft: '0 1px 2px rgba(12,43,41,.05), 0 12px 28px -14px rgba(12,43,41,.18)',
        lift: '0 2px 4px rgba(12,43,41,.06), 0 20px 36px -16px rgba(14,159,126,.35)',
      },
      keyframes: {
        pop: { '0%': { opacity: 0, transform: 'scale(.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        rise: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        sweep: { '0%,100%': { transform: 'translateX(-30%)' }, '50%': { transform: 'translateX(30%)' } },
      },
      animation: { pop: 'pop .18s ease-out', rise: 'rise .35s ease-out both', sweep: 'sweep 6s ease-in-out infinite' },
    },
  },
  plugins: [],
}
