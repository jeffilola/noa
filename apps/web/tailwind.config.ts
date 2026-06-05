import type { Config } from 'tailwindcss';
import relumePreset from '@relume_io/relume-tailwind';

const NOA_DEEP = '#000000';
const NOA_INK = '#FFFFFF';
const NOA_SAGE = '#A3A3A3';
const NOA_MIST = '#000000';
const NOA_SURFACE = '#0A0A0A';
const NOA_SURFACE_ALT = '#141414';
const NOA_ACCENT = '#FFFFFF';
const NOA_ACCENT_SOFT = '#1F1F1F';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [relumePreset],
  theme: {
    extend: {
      colors: {
        brand: {
          black: NOA_INK,
          white: NOA_SURFACE,
        },
        neutral: {
          black: NOA_INK,
          white: NOA_SURFACE,
          lightest: NOA_SURFACE_ALT,
          lighter: NOA_SURFACE_ALT,
          light: NOA_SAGE,
          DEFAULT: NOA_SAGE,
          dark: NOA_SAGE,
          darker: NOA_INK,
          darkest: NOA_DEEP,
        },
        background: {
          DEFAULT: NOA_MIST,
          primary: NOA_MIST,
          secondary: NOA_SURFACE,
          tertiary: NOA_SURFACE_ALT,
          alternative: NOA_ACCENT,
          success: NOA_ACCENT_SOFT,
          error: '#2A2A2A',
        },
        border: {
          DEFAULT: NOA_SAGE,
          primary: 'color-mix(in srgb, #ffffff 18%, transparent)',
          secondary: 'color-mix(in srgb, #ffffff 12%, transparent)',
          tertiary: NOA_SAGE,
          alternative: NOA_ACCENT,
          success: NOA_ACCENT,
          error: '#737373',
        },
        text: {
          DEFAULT: NOA_INK,
          primary: NOA_INK,
          secondary: NOA_SAGE,
          alternative: NOA_DEEP,
          success: NOA_ACCENT,
          error: '#D4D4D4',
        },
        link: {
          DEFAULT: NOA_ACCENT,
          primary: NOA_ACCENT,
          secondary: NOA_SAGE,
          alternative: NOA_INK,
        },
      },
    },
  },
};

export default config;
