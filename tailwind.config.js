module.exports = {
  purge: ['./src/popup/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        violet: '#6441a5',
        pandorablue: '#3668ff',
      },
      minHeight: {
        22: '5.5rem',
      },
      maxWidth: {
        100: '25rem',
      },
      spacing: {
        100: '25rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
