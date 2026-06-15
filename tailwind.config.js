/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        primaryDark: "#6366F1",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#0F0F1A",
        cardLight: "#F8F7FF",
        cardDark: "#1A1A2E",
        accent: "#7C3AED",
        gold: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
