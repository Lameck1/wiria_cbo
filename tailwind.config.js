import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  // Safelist dynamic classes used in JS (deadline alerts)
  safelist: [
    'bg-red-50', 'bg-orange-50', 'bg-blue-50',
    'border-red-500', 'border-orange-500', 'border-blue-500',
    'text-red-600', 'text-orange-600', 'text-blue-600',
    'text-red-800', 'text-orange-800', 'text-blue-800',
    // Animation utilities
    'animate-float', 'animate-fade-in', 'pulse-glow',
    // Card utilities
    'card', 'card-elevated', 'card-bordered', 'card-glass',
    // Section utilities
    'section-gradient-light', 'section-gradient-green',
    // Heading utilities
    'heading-decorated', 'heading-center-decorated',
    // Impact counter
    'impact-counter', 'counter-value',
    // Divider
    'divider-gradient',
    // Icon utilities
    'icon-circle', 'icon-circle-lg',
    // Button utilities
    'btn-primary', 'btn-secondary', 'btn-outline',
    // Form utilities
    'form-input', 'form-label',
    // Link utilities
    'link-hover',
    // Stagger animation
    'stagger-children',
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'wiria-yellow': '#F5A721', // Buttercup Yellow
        'wiria-green-light': '#DFF0D8', // Peppermint Green
        'wiria-blue-dark': '#002057', // Deep Lake Blue
        'wiria-earth-brown': '#5C4033', // Earth Brown (example)
        'wiria-earth-green': '#4F7942', // Earth Green (example)
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Roboto', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: [
    forms,
  ],
}