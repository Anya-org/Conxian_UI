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
        // Conxian Brand Palette
        primary: {
          DEFAULT: "#5546FF", // Hero purple (from docs/images)
          dark: "#3E31CC",
          light: "#7B6EFF"
        },
        background: {
          DEFAULT: "#0F1117", // Dark background (from docs/images)
          paper: "#1E2029",   // Card/Surface background
          darker: "#090A0E"   // Sidebar/Header background
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF", // Gray-400 equivalent
          muted: "#6B7280"      // Gray-500 equivalent
        },
        accent: {
           success: "#10B981", // Green
           warning: "#F59E0B", // Amber
           error: "#EF4444",   // Red
           info: "#3B82F6"     // Blue
        },
        // Keeping legacy for compatibility but mapping to new scheme where possible
        "primary-dark": "#3E31CC",
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
