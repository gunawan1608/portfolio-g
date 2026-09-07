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
        // Previously referenced "Geist" / "Geist Mono", which are never
        // loaded anywhere (layout.tsx only loads Instrument Serif, Plus
        // Jakarta Sans, and IBM Plex Mono) — fixed to match reality.
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', '"Helvetica Neue"', "sans-serif"],
        mono: ['"IBM Plex Mono"', '"Courier New"', "monospace"]
      },
      colors: {
        bg: "#faf9f7",
        "bg-alt": "#f4efe9",
        card: "#ffffff",
        surface: "#f3ece9",
        ink: "#16130f",
        "ink-2": "#3d3632",
        "ink-3": "#6b615c",
        "ink-4": "#9b918c",
        red: "#da020e",
        "red-bg": "#fdecea",
        gold: "#f6c500",
        "gold-bg": "#fff9e0"
      },
      borderColor: {
        DEFAULT: "rgba(11,11,12,0.09)"
      }
    }
  },
  plugins: []
};

export default config;
