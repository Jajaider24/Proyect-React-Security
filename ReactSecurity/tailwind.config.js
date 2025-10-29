/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arimo: ["Arimo", "sans-serif"],
      },
      colors: {
        primary: "#071440",
        secondary: "#16275D",
        state1: "#16275D",
        state2: "#44558D",
        state3: "#6C7AA9",
        black1: "#000000",
        black2: "#1D1D1D",
        black3: "#282828",
        white: "#FFFFFF",
        gray1: "#333333",
        gray2: "#4F4F4F",
        gray3: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
      },
    },
  },
  plugins: [],
};
