/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617', // Deep Obsidian Space Navy
          900: '#0b1329', // Glassmorphism Base
          850: '#111c35', // Deep Accent Navy
        },
        emerald: {
          400: '#00FF9D', // Neon Green (Nominal Baseline)
        },
        cyan: {
          400: '#00D9FF', // Neon Cyan (Telemetry Warning)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0,255,157,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0,255,157,0.8))' },
        }
      }
    },
  },
  plugins: [],
}
