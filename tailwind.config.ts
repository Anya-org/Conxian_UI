import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Conxian 'Earthy Finance' Brand Palette - Refined
        primary: {
          DEFAULT: "#C0A060", // A more refined, less saturated gold
          dark: "#A08040",    // A darker, richer gold
          light: "#E0C080"   // A lighter, softer gold
        },
        background: {
          DEFAULT: "#181A1B", // A very dark, near-black for high contrast
          paper: "#242627",   // A slightly lighter dark gray for surfaces
          light: "#F5F5F5"    // A soft, off-white for light mode
        },
        text: {
          primary: "#E8E6E3",   // A slightly off-white for better readability
          secondary: "#A0A0A0", // A calm, neutral gray
          muted: "#606060"     // A darker gray for less important text
        },
        accent: {
           success: "#2E8B57", // A more natural green
           warning: "#D97706", // A richer, more amber-like color
           error: "#B91C1C",   // A deep, less alarming red
           info: "#2563EB"     // A standard, accessible blue
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
