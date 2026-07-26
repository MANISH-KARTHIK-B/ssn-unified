/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EDFBF5",
          100: "#D3F5E6",
          500: "#1F9D6E",
          600: "#1A8560",
          700: "#166D4E",
          900: "#0C3B2A"
        },
        ink: {
          900: "#101827",
          700: "#374151",
          500: "#6B7280"
        }
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        sans: ["'Sora'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
