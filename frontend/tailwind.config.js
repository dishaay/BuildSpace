/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#12141A",
          surface: "#1A1D24",
          hover: "#22262E",
          raised: "#20232B",
        },
        border: {
          DEFAULT: "#2B2F38",
          soft: "#232730",
        },
        ink: {
          DEFAULT: "#E8E9ED",
          muted: "#8B93A1",
          faint: "#5B6270",
        },
        accent: {
          violet: "#7C6FFF",
          "violet-dim": "#5B4FD1",
          teal: "#00D9B5",
          coral: "#FF7A59",
          amber: "#FFB454",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,111,255,0.4), 0 0 24px rgba(124,111,255,0.15)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
        riseIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        riseIn: "riseIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
