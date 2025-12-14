import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E403B",
        "primary-dark": "#1A2B27",
        accent: "#D4A017",
        "neutral-light": "#F5F5F5",
        "neutral-medium": "#E0E0E0",
        "neutral-dark": "#333333",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
