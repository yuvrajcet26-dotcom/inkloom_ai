import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F4FAFF",
          secondary: "#FFFFFF",
        },
        inkloom: {
          bg: "#F4FAFF",
          card: "#FFFFFF",
          blue: {
            light: "#E5F2FF",
            DEFAULT: "#2878F0",
            hover: "#1e62c9",
            dark: "#194da0",
          },
          purple: {
            light: "#F2EFFF",
            DEFAULT: "#8064F5",
            hover: "#6b4de3",
          },
          pink: {
            light: "#FFF0F5",
            DEFAULT: "#F26D8F",
          },
          mint: {
            light: "#E4F8F0",
            DEFAULT: "#159B72",
          },
          yellow: {
            light: "#FFF7DF",
            DEFAULT: "#E9A23B",
          },
          text: {
            primary: "#15265B",
            secondary: "#64748B",
            muted: "#94A3B8",
          },
          border: "#DCE9F8",
          success: "#159B72",
          warning: "#E9A23B",
          error: "#E65378",
        },
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(40, 120, 240, 0.05), 0 1px 3px 0 rgba(21, 38, 91, 0.03)",
        "card-hover": "0 8px 24px 0 rgba(40, 120, 240, 0.1), 0 2px 6px 0 rgba(21, 38, 91, 0.04)",
        glow: "0 0 20px 0 rgba(128, 100, 245, 0.2)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
