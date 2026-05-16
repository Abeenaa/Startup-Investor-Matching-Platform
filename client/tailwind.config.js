/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          teal:        '#28C3BE',  // Ink Green A
          'teal-dark': '#009BAA',  // Ink Green B
          blue:        '#056EDC',  // Ink Blue A
          'blue-dark': '#0A46B4',  // Ink Blue B
          yellow:      '#FFC300',  // Ink Yellow A
          orange:      '#FF8700',  // Ink Yellow B
          black:       '#1E1E1E',  // Ink Black A
          bg:          '#F5F5F5',  // light neutral background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
