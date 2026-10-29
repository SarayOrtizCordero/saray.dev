/** @type {import('tailwindcss').Config} */
module.exports = {
  // js/ es obligatorio: js/projects.js crea clases que no aparecen en el HTML
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: { ink: '#26262A', wine: '#9E1030', cream: '#F1E8DF' },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
