import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0F1117',
          light: '#F8FAFC',
        },
        surface: {
          DEFAULT: '#161B27',
          light: '#FFFFFF',
        },
        border: {
          DEFAULT: '#1E2535',
          light: '#E2E8F0',
        },
        text: {
          primary: {
            DEFAULT: '#F1F5F9',
            light: '#0F172A',
          },
          secondary: '#64748B',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease',
        'slide-up': 'slideUp 300ms ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
