import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(10, 10, 10)',
        foreground: 'rgb(250, 250, 250)',
        card: {
          DEFAULT: 'rgb(26, 26, 26)',
          foreground: 'rgb(250, 250, 250)',
        },
        border: 'rgb(38, 38, 38)',
        input: 'rgb(38, 38, 38)',
      },
    },
  },
  plugins: [],
};
export default config;
