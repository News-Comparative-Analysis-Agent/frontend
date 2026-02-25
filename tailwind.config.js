/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "rgba(var(--primary), <alpha-value>)",
        "primary-dark": "rgba(var(--primary-dark), <alpha-value>)",
        "primary-light": "rgba(var(--primary-light), <alpha-value>)",
        "progressive": "rgba(var(--progressive), <alpha-value>)",
        "conservative": "rgba(var(--conservative), <alpha-value>)",
        "stance-blue": "rgba(var(--progressive), <alpha-value>)",
        "stance-red": "rgba(var(--conservative), <alpha-value>)",
        "stance-gray": "rgba(var(--stance-gray), <alpha-value>)",
        "background": "rgba(var(--background), <alpha-value>)",
        "surface": "rgba(var(--surface), <alpha-value>)",
        "border-light": "rgba(var(--border-light), <alpha-value>)",
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
