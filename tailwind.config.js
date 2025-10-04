/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f0ff",
          100: "#ebe4ff",
          200: "#daccff",
          300: "#bfa4ff",
          400: "#a270ff",
          500: "#8837ff",
          600: "#7e0fff",
          700: "#7100ff",
          800: "#5f00da",
          900: "#440099",
          950: "#2e007a",
          DEFAULT: "#440099",
        },
        font: "#2E2D2C",
      },
      fontFamily: {
        poppins: "Poppins",
      },
    },
  },
};
