/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        accent: '#ff6b00',
        bg: '#f8fafc',
        text: '#222',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
