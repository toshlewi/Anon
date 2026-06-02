/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#FFDCCF",
        rose: "#F3A6C9",
        roseDark: "#E98BB7",
        beige: "#F9F0E8",
        cream: "#FFF8F3",
        skywarm: "#FFBFA3",
        ink: "#433545",
        inkLight: "#6F6271",
      },
      fontFamily: {
        body: ["Plus Jakarta Sans", "sans-serif"],
        title: ["Plus Jakarta Sans", "sans-serif"],
        card: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
