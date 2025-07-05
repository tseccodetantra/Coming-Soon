/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      colors: {
        "neon-cyan": "#00ffff",
        "neon-green": "#00ff00",
        "neon-yellow": "#ffff00",
        "neon-pink": "#ff00ff",
        "ochre-yellow": "#DAA520",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
        tech: ["Orbitron", "monospace"],
      },
    },
  },
  plugins: [],
};
