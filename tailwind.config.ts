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
        },
        accent: {
          DEFAULT: "#D4A017", // sophisticated gold
        },
        background: {
          DEFAULT: "#F5F5F5", // off-white
          paper: "#E0E0E0",   // light-gray
        },
        text: {
          DEFAULT: "#333333", // dark gray
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
