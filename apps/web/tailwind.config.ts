import type { Config } from 'tailwindcss';

import relumePreset from '@relume_io/relume-tailwind';

/** Relume tokens follow semantic CSS variables so light/dark stay readable. */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [relumePreset],
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'var(--noa-ink)',
          white: 'var(--noa-surface)',
        },
        neutral: {
          black: 'var(--noa-ink)',
          white: 'var(--noa-surface)',
          lightest: 'var(--noa-surface-alt)',
          lighter: 'var(--noa-surface-alt)',
          light: 'var(--noa-sage)',
          DEFAULT: 'var(--noa-sage)',
          dark: 'var(--noa-sage)',
          darker: 'var(--noa-ink)',
          darkest: 'var(--noa-dark)',
        },
        background: {
          DEFAULT: 'var(--noa-mist)',
          primary: 'var(--noa-mist)',
          secondary: 'var(--noa-surface)',
          tertiary: 'var(--noa-surface-alt)',
          alternative: 'var(--noa-accent)',
          success: 'var(--noa-accent-soft)',
          error: 'var(--noa-surface-alt)',
        },
        border: {
          DEFAULT: 'var(--noa-sage)',
          primary: 'var(--border)',
          secondary: 'color-mix(in srgb, var(--noa-ink) 12%, transparent)',
          tertiary: 'var(--noa-sage)',
          alternative: 'var(--noa-accent)',
          success: 'var(--noa-accent)',
          error: 'var(--noa-sage)',
        },
        text: {
          DEFAULT: 'var(--noa-ink)',
          primary: 'var(--noa-ink)',
          secondary: 'var(--noa-sage)',
          alternative: 'var(--text-on-media)',
          success: 'var(--noa-accent)',
          error: 'var(--noa-sage)',
        },
        link: {
          DEFAULT: 'var(--noa-accent)',
          primary: 'var(--noa-accent)',
          secondary: 'var(--noa-sage)',
          alternative: 'var(--noa-ink)',
        },
      },
    },
  },
};

export default config;
