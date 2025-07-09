/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 thêm dòng này để Tailwind quét đúng file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
