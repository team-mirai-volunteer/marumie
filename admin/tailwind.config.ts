import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/client/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          bg: "#0b1020",
          panel: "#141a2d",
          muted: "#9aa4bf",
          accent: "#5b8cff",
          hover: "#1d2745",
          input: "#0f1527",
          border: "#263258",
        },
      },
    },
  },
  plugins: [],
};

export default config;
