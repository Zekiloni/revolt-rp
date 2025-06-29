import PrimeUI from 'tailwindcss-primeui';

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['selector', '[class~="app-dark"]'],
  plugins: [PrimeUI],
};
