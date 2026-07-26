/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#EAF3FB",
          600: "#0F5E9C",
          700: "#0C4B7D",
          900: "#0A2E4D"
        }
      },
      fontFamily: {
        display: ["'Merriweather'", "serif"],
        sans: ["'Source Sans 3'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
