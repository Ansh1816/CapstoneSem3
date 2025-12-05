/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nomad: {
                    sand: '#f5f5f0',
                    green: '#4a5d4e',
                    brown: '#8c7b70',
                    dark: '#2c2c2c',
                    clay: '#d98e73',
                    cream: '#fdfbf7'
                }
            },
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
