import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Geist"', '"Helvetica Neue"', "sans-serif"],
        mono: ['"Geist Mono"', '"Courier New"', "monospace"]
      },
      colors: {
        bg: "#f8f6f2",
        "bg-alt": "#f0ece4",
        card: "#ffffff",
        surface: "#eceae4",
        ink: "#111110",
        "ink-2": "#3a3834",
        "ink-3": "#787470",
        "ink-4": "#aeaaa6",
        red: "#d4400f",
        "red-bg": "#fdf0eb",
        teal: "#1a7f5a",
        "teal-bg": "#e8f7f2"
      },
      borderColor: {
        DEFAULT: "rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;