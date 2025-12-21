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
        primary: {
          DEFAULT: "#2E403B", // deep, calming green
          dark: "#1A2623", // darker shade for cards/hover
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#D4A017", // sophisticated gold
          foreground: "#FFFFFF",
        },
        background: {
          DEFAULT: "#F5F5F5", // off-white
          light: "#FFFFFF", // white
          paper: "#E0E0E0", // light-gray
        },
        text: {
          DEFAULT: "#333333", // dark gray
          primary: "#333333", // alias for default
          secondary: "#666666", // lighter gray
          muted: "#999999", // muted text
        },
        neutral: {
          light: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
