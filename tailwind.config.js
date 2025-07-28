/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.html"],
	theme: {
		extend: {
			fontFamily: {
				noto: ["var(--font-noto-sans)", "sans-serif"],
				open: ["var(--font-open-sans)", "sans-serif"],
			},
		},
	},
	plugins: [],
};
