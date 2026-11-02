/** @type {import('tailwindcss').Config} */
module.exports = {
  // js/ es obligatorio: js/projects.js crea clases que no aparecen en el HTML
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      // ink/cream/kraft salen de variables CSS (css/styles.css y css/interfaz.css):
      // así el modo oscuro cambia los colores sin tocar las clases
      colors: {
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        kraft: 'rgb(var(--c-kraft) / <alpha-value>)',
        wine: '#9E1030'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Instrument Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
