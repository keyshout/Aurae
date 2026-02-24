import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../components/**/*.{js,ts,jsx,tsx}", // include root components directory!
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#4b2bee",
        "primary-hover": "#3a1dbd",
        "background-light": "#0f0e17",
        "background-dark": "#0f0e17",
        "surface": "#1e1c2e",
        "surface-highlight": "#2a273f",
        "text-main": "#fffffe",
        "text-muted": "#a7a9be",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "full": "9999px"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
