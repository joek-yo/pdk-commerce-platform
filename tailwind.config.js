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
        background: "#0D0D0D",
        surface: "#131313",
        surface2: "#161616",
        foreground: "#EDEDED",
        subtext: "#9a9a9a",
        muted: "#6a6a6a",
        border: "#232323",
        "border-strong": "#2e2e2e",
        gold: "#D9A441",
        danger: "#e08a8a",
        whatsapp: "#5fbf8f",
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
