export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  css: ['./src/**/*.css'],
  safelist: {
    standard: [
      /^btn/,
      /^toast/,
      /^modal/,
      /^dropdown/,
      /^nav/,
      /^form/,
      /^active/,
      /^show/,
    ],
  },
};
