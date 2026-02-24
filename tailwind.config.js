/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "rgb(var(--primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        "progressive": "rgb(var(--progressive) / <alpha-value>)",
        "conservative": "rgb(var(--conservative) / <alpha-value>)",
        "stance-blue": "rgb(var(--progressive) / <alpha-value>)",
        "stance-red": "rgb(var(--conservative) / <alpha-value>)",
        "stance-gray": "rgb(var(--stance-gray) / <alpha-value>)",
        "background": "rgb(var(--background) / <alpha-value>)",
        "surface": "rgb(var(--surface) / <alpha-value>)",
        "border-light": "rgb(var(--border-light) / <alpha-value>)",
      },
      fontFamily: {
        "sans": ["Noto Sans KR", "Inter", "sans-serif"]
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'glow': '0 0 20px 5px rgba(255, 255, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
