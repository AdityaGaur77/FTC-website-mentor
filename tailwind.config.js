/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Page + surfaces. Every value also exists as a CSS var in index.css
        ink: '#070d14', // page background
        panel: '#0b1421', // large section panels
        card: '#0d1826', // cards sitting inside panels
        raised: '#12202f', // hover / secondary buttons
        line: '#1b2c40', // default border
        'line-soft': '#152436', // quieter border
        accent: {
          DEFAULT: '#22d3ee',
          soft: '#67e8f9',
          dim: '#0e7490',
        },
        urgent: '#f5a524',
        body: '#8ea3ba', // muted paragraph text
        faint: '#64798f', // smallest labels
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        panel: '14px',
      },
      backgroundImage: {
        // The soft top-lit gradient used on hero + section panels
        hero: 'radial-gradient(120% 140% at 12% -10%, #1b3050 0%, #101d2f 42%, #0a121e 100%)',
        panel: 'linear-gradient(180deg, #0e1a29 0%, #0a121e 100%)',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
