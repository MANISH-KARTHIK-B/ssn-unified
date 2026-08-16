/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF3FC",
          100: "#DCE6F8",
          200: "#B7CBEF",
          500: "#2A56A6",
          600: "#1F4483",
          700: "#17356A",
          900: "#0B1E42"
        },
        gold: {
          400: "#E4BA55",
          500: "#D4A72C"
        },
        ink: {
          900: "#101827",
          700: "#374151",
          500: "#6B7280"
        }
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "gate-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
