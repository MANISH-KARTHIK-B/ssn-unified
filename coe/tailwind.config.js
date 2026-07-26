/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#0D1117",
          900: "#161B22",
          800: "#1F2733",
          700: "#2B3542"
        },
        cobalt: {
          400: "#5B8DEF",
          500: "#3D6FE0",
          600: "#2F58C0"
        }
      },
      fontFamily: {
        display: ["'Manrope'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
