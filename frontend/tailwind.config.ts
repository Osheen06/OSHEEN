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
        cocoa: "#4B3434",
        clay: "#B56E5B",
        blush: "#F7C7D9",
        "blush-strong": "#D95783",
        saffron: "#F7B267",
        sage: "#8FA98B",
        pistachio: "#B8D8BA",
        lilac: "#B7A4FF",
        pearl: "#FFF8F4",
        cream: "#FFFDF9",
        chrome: "#E9EEF3"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 70px rgba(217, 87, 131, 0.22)",
        glass: "0 22px 80px rgba(79, 56, 50, 0.11)",
        aura: "0 32px 110px rgba(181, 110, 91, 0.18)",
        panel: "0 18px 50px rgba(79, 56, 50, 0.08)"
      },
      backgroundImage: {
        "soft-radial": "radial-gradient(circle at top left, rgba(217,87,131,0.2), transparent 32%), radial-gradient(circle at bottom right, rgba(143,169,139,0.28), transparent 30%)",
        "mesh-warm": "linear-gradient(135deg, #fffdf9 0%, #f7c7d9 36%, #b8d8ba 74%, #fff8f4 100%)",
        "atelier": "linear-gradient(135deg, #fffdf9 0%, #fff8f4 35%, #f7c7d9 68%, #dfe9dc 100%)"
      }
    }
  },
  plugins: []
};

export default config;
