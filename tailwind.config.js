/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F2FF",
          100: "#CCE5FF",
          200: "#99CCFF",
          300: "#66B2FF",
          400: "#3399FF",
          500: "#0B74FF",
          600: "#075CD8",
          700: "#0545B0",
          800: "#032E88",
          900: "#021760",
        },
        accent: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Cairo", "system-ui", "sans-serif"],
        arabic: ["Cairo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      transitionDuration: {
        200: "200ms",
      },
    },
  },
  plugins: [],
};
