/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#FFF4EA",
          100: "#FFE3C7",
          500: "#D9700F",
          600: "#B5590A",
          700: "#8C4308"
        },
        char: {
          900: "#231C14",
          700: "#4A4038",
          500: "#7A6F65"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
