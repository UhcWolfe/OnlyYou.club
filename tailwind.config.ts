import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: {
          DEFAULT: "#111113",
          hover: "#18181B",
          active: "#202024",
          border: "#27272A",
        },
        brand: {
          primary: "#8B5CF6",    // Violet
          secondary: "#EC4899",  // Pink
          accent: "#3B82F6",     // Blue
          purpleDark: "#581c87",
        },
        zinc: {
          925: "#131316",
          950: "#09090B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
