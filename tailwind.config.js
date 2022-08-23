/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors : {
      "main" : "#000000",
      "secondary" : "#16181C",
      "bd" :"#2f3336",
      "green" : "#32cd32",
      'white': '#ffffff',
      "blue" : "#1D9BF0",
      "red" : "#b91c1c"

    },
    fontFamily:{
      poppins : ["Poppins" , "sans-serif"]
    },
    screens: {
      "semi" : "800px",
      "md" : "1200px"
    },
    extend: {},
  },
  plugins: [],
}
