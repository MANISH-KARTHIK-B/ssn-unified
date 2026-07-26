/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F4F6FB",
          100: "#E3E8F6",
          200: "#C7D1EA",
          300: "#A3B0D8",
          400: "#8492C4",
          500: "#6577AC",
          600: "#2A4A82",
          700: "#1D3866",
          800: "#142A52",
          900: "#0B1E3F",
          950: "#060F24"
        },
        amber: {
          300: "#F8C879",
          400: "#F5B24D",
          500: "#F2A340",
          600: "#DB8A24"
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
