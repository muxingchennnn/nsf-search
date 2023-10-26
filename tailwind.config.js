/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import { skeleton } from '@skeletonlabs/tw-plugin'

export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      blue: '#3C75CF',
      'yellow-400': '#FAC515',
      'gray-100': '#F5F5F5',
      'gray-300': '#D0D5DD',
      'gray-500': '#70707B',
      'gray-700': '#242424',
    },
    extend: {},
  },
  plugins: [forms, typography, skeleton],
}
