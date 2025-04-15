const { hairlineWidth } = require('nativewind/theme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Dark Mallard Specific Colors
        'dm-midnight': '#0F1A2C',
        'dm-crimson': '#991B1B',
        'dm-gold': '#A2851D',
        'dm-success': '#065F46',
        'dm-warning': '#92400E',
        'dm-danger': '#9B1C1C',
        'dm-neutral-light': '#1F2937',
        'dm-neutral-dark': '#111827',
        'dm-neutral-inactive': '#4B5563',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        redacted: ['"Flow Block Redacted"', 'monospace'],
      },
      fontSize: {
        // Standard sizes (Tailwind defaults)
        xs: '12px',
        sm: '12px', // Overriding sm to 12px as per instructions
        base: '14px',
        lg: '16px',
        xl: '20px',
        // You can add more if needed (2xl, 3xl etc.) based on Tailwind's default scale or your needs
      },
      fontWeight: {
        // Standard weights (Tailwind defaults)
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        // Add extra bold etc. if the font supports it and you need it
      },
      lineHeight: {
        // Define specific line heights
        'body': '1.5', // For body text (14px, 12px)
        'heading': '1.2', // For headers (20px, 16px)
        // Retain Tailwind defaults if needed
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      letterSpacing: {
        // Define specific letter spacing
        'body': '0.3px',
        'heading': '0.5px',
        // Retain Tailwind defaults if needed
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
