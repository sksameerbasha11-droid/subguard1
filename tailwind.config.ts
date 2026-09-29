import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FC",
        navy: {
          950: "#070D1E",
          900: "#0B132B",
          800: "#1C2541",
          700: "#3A506B",
          600: "#475569",
        },
        brand: {
          indigo: "#6366F1",
          purple: "#8B5CF6",
          blue: "#3B82F6",
          darkIndigo: "#4F46E5",
        },
      },
      borderRadius: {
        glass: "20px",
        "glass-lg": "24px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.06)",
        glassHover: "0 12px 40px 0 rgba(31, 38, 135, 0.10)",
        glassPurple: "0 8px 32px 0 rgba(99, 102, 241, 0.16)",
        glassGreen: "0 8px 32px 0 rgba(16, 185, 129, 0.18)",
        glassRed: "0 8px 32px 0 rgba(239, 68, 68, 0.18)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
