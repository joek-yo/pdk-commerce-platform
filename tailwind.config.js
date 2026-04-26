/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5F0",
        foreground: "#1C1A18",
        primary: "#3B2A23",
        accent: "#C6A75E",
        muted: "#EAE4DA",
        border: "#D8D0C5",
      },
      spacing: {
        section: "4rem",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};