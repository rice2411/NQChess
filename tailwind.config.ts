import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-be-vietnam-pro)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        "be-vietnam-pro": ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
