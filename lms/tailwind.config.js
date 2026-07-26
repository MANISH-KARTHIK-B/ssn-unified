/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        violet: {
          50: "#F4F2FF",
          100: "#E7E2FF",
          500: "#6C4DF0",
          600: "#5B3CDB",
          700: "#4A2FB8"
        },
        graphite: {
          900: "#1A1B23",
          700: "#3D3F4C",
          500: "#6B6E7E"
        }
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
