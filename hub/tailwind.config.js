/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060F24",
          900: "#0B1E3F",
          800: "#142A52",
          700: "#1D3866",
          600: "#2A4A82"
        },
        amber: {
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
