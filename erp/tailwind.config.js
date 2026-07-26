/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#FBEEF2",
          100: "#F3D3DE",
          600: "#7A1F3D",
          700: "#5F1830",
          900: "#3A0F1E"
        },
        stone: {
          900: "#221D1F",
          700: "#4A4245",
          500: "#7C7377"
        }
      },
      fontFamily: {
        display: ["'Libre Franklin'", "system-ui", "sans-serif"],
        sans: ["'Libre Franklin'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
