/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'inversify-black': '#000000',
        'inversify-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        'papaya': '#FF8000',
        'racing-black': '#0A0A0A',
      },
      
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'montserrat-bold': ['Montserrat', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 1s ease-out',
        'slide-in-right': 'slide-in-right 1s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'float-slow': 'float-slow 25s ease-in-out infinite',
        'float-medium': 'float-medium 20s ease-in-out infinite',
        'float-fast': 'float-fast 15s ease-in-out infinite',
        'particle': 'particle linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'scroll-dot': 'scroll-dot 2s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-out-down': 'fade-out-down 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'scale-out': 'scale-out 0.5s ease-out forwards',
        'rotate-3d': 'rotate-3d 20s linear infinite',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'blur(0px)' },
          '50%': { opacity: '0.8', filter: 'blur(4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 30px) scale(0.95)' },
          '75%': { transform: 'translate(25px, 25px) scale(1.05)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-30px, 20px) scale(1.08)' },
          '66%': { transform: 'translate(25px, -25px) scale(0.92)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-25px, -25px) scale(1.12)' },
        },
        'particle': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'scroll-dot': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(16px)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-down': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        'rotate-3d': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)' },
        },
      },
    },
  },
  plugins: [],
};