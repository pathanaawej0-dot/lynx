/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          container: 'var(--surface-container)',
          'container-high': 'var(--surface-container-high)',
          'container-low': '#1E1F20', // Explicit low container
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          foreground: '#040C19',
        },
        'on-surface': {
          DEFAULT: 'var(--on-surface)',
          variant: 'var(--on-surface-variant)',
          dim: 'var(--on-surface-dim)',
        },
        outline: {
          DEFAULT: 'var(--outline)',
          variant: 'var(--outline-variant)',
        },
        error: 'var(--error)',
      },
      fontFamily: {
        sans: ['Open Sans', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'elevation-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        'elevation-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontSize: {
        'display-large': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
        'display-medium': ['45px', { lineHeight: '52px', letterSpacing: '0px' }],
        'display-small': ['36px', { lineHeight: '44px', letterSpacing: '0px' }],
        'headline-large': ['32px', { lineHeight: '40px', letterSpacing: '0px' }],
        'headline-medium': ['28px', { lineHeight: '36px', letterSpacing: '0px' }],
        'headline-small': ['24px', { lineHeight: '32px', letterSpacing: '0px' }],
        'title-large': ['22px', { lineHeight: '28px', letterSpacing: '0px' }],
        'title-medium': ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        'title-small': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'body-large': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-medium': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'body-small': ['12px', { lineHeight: '16px', letterSpacing: '0.4px' }],
        'label-large': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
