/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2565d0',
        link: '#0066CC',
        'link-hover': '#a2c4ff',
        'bg-page': '#efefef',
        'bg-container': 'rgba(136,136,136,0.5)',
        'text-main': '#444444',
        'text-muted': '#999999',
      },
      screens: {
        'mobile': '568px',
      },
      maxWidth: {
        'container': '548px',
        'content': '468px',
      },
      spacing: {
        'line-height-body': '30px',
      },
      fontSize: {
        'site-title': '24px',
        'entry-title': '18px',
        'body': '15px',
        'meta': '11px',
      },
    },
  },
  plugins: [],
}
