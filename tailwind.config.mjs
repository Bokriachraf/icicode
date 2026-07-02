/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* héritage Next.js */
        background: "var(--background)",
        foreground: "var(--foreground)",
        /* palette Codalog brand */
        brand: {
          deep:  "#000D1A",
          dark:  "#001830",
          mid:   "#002966",
          blue:  "#4A90E2",
          gold:  "#FFD700",
          cyan:  "#00FFD1",
          white: "#E8F4FF",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};
