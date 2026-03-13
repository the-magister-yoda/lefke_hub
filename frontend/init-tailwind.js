// init-tailwind.js
import fs from 'fs';

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
`;

fs.writeFileSync('tailwind.config.js', tailwindConfig);
fs.writeFileSync('postcss.config.js', postcssConfig);

console.log('Tailwind config created!');