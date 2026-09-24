/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        carbon: 'var(--carbon)',
        ink: 'var(--ink)',
        bone: 'var(--bone)',
        cobalt: 'var(--cobalt)',
        'cobalt-soft': 'var(--cobalt-soft)',
        line: 'var(--line)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
        '4xl': 'calc(var(--radius) + 16px)',
      },
      spacing: {
        '18': '4.5rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
      keyframes: {
        'card-float': {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        'signal-pulse': {
          '0%,100%': { opacity: '.3', transform: 'scale(.85)' },
          '50%': { opacity: '1', transform: 'scale(1.18)' },
        },
        'voice-wave': {
          '0%,100%': { transform: 'scaleY(.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
        ticker: {
          to: { transform: 'translateX(-50%)' },
        },
        'shimmer-sweep': {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '260% 0' },
        },
        'slow-orbit': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '.5' },
          '50%': { transform: 'translate3d(4%,-5%,0) scale(1.14)', opacity: '.85' },
        },
        'ring-out': {
          '0%': { transform: 'scale(.6)', opacity: '.55' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'card-float': 'card-float 9s ease-in-out infinite',
        'signal-pulse': 'signal-pulse 2.6s ease-in-out infinite',
        'voice-wave': 'voice-wave 1.4s ease-in-out infinite',
        'ticker-motion': 'ticker 32s linear infinite',
        'shimmer-sweep': 'shimmer-sweep 1.5s linear infinite',
        'slow-orbit': 'slow-orbit 16s ease-in-out infinite',
        'ring-out': 'ring-out 3.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
