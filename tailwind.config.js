/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        surface2: "var(--color-surface2)",
        foreground: "var(--color-foreground)",
        subtext: "var(--color-subtext)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        gold: "var(--color-gold)",
        "gold-strong": "var(--color-gold-strong)",
        "gold-soft": "var(--color-gold-soft)",
        danger: "var(--color-danger)",
        whatsapp: "var(--color-whatsapp)",
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
