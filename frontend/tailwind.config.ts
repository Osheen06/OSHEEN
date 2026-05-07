import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171316",
        blush: "#F7C7D9",
        "blush-strong": "#FF73A6",
        saffron: "#F7B267",
        pistachio: "#B8D8BA",
        lilac: "#B7A4FF",
        pearl: "#FFF8F4",
        chrome: "#E9EEF3"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 70px rgba(255, 115, 166, 0.24)",
        glass: "0 20px 80px rgba(30, 24, 28, 0.12)"
      },
      backgroundImage: {
        "soft-radial": "radial-gradient(circle at top left, rgba(255,115,166,0.28), transparent 32%), radial-gradient(circle at bottom right, rgba(184,216,186,0.32), transparent 30%)",
        "mesh-warm": "linear-gradient(135deg, #fff8f4 0%, #f7c7d9 35%, #b7a4ff 70%, #171316 100%)"
      }
    }
  },
  plugins: []
};

export default config;
