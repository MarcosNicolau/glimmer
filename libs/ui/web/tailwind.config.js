/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import { join } from "path";
import { createGlobPatternsForDependencies } from "@nx/react/tailwind";

export default {
	content: [
		join(__dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html}"),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		screens: {
			"only-big-desktop": { min: "1226px" },
			"max-big-desktop": { max: "1226px" },

			"only-desktop": { min: "1151px", max: "1225px" },
			"min-desktop": { min: "1151px" },
			"max-desktop": { max: "1151px" },

			"only-small-desktop": { min: "1025px", max: "1150px" },
			"max-small-desktop": { max: "1150px" },
			"min-small-desktop": { min: "1025px" },

			"only-tablet": { max: "1024px", min: "768px" },
			"max-tablet": { max: "1024px" },
			"min-tablet": { min: "768px" },

			"only-mobile": { max: "767px", min: "361px" },
			"max-mobile": { max: "767px" },
			"min-mobile": { min: "767px" },

			"only-small-mobile": { max: "360px" },
			"min-small-mobile": { min: "360px" },
		},
		colors: {
			none: "none",
			inherit: "inherit",
			current: "currentColor",
			transparent: "transparent",
			red: "rgb(var(--color-red) / <alpha-value>)",
			white: "rgb(var(--color-white) / <alpha-value>)",
			black: "rgb(var(--color-black) / <alpha-value>)",
			"modal-overlay": "var(--color-modal-overlay)",
			background: "rgb(var(--color-bg) / <alpha-value>)",
			accent: {
				100: "rgb(var(--color-accent-100) / <alpha-value>)",
				200: "rgb(var(--color-accent-200) / <alpha-value>)",
				300: "rgb(var(--color-accent-300) / <alpha-value>)",
			},
			contrast: {
				100: "rgb(var(--color-contrast-100) / <alpha-value>)",
				200: "rgb(var(--color-contrast-200) / <alpha-value>)",
				300: "rgb(var(--color-contrast-300) / <alpha-value>)",
			},
			text: {
				100: "rgb(var(--color-text-100) / <alpha-value>)",
				200: "rgb(var(--color-text-200) / <alpha-value>)",
				contrast: {
					100: "rgb(var(--color-text-contrast-100) / <alpha-value>)",
					200: "rgb(var(--color-text-contrast-200) / <alpha-value>)",
				},
				link: "rgb(var(--color-text-link) / <alpha-value>)",
			},
		},
		fontFamily: {
			headers: ["var(--font-abril)", "var(--font-inter)", ...defaultTheme.fontFamily.sans],
			common: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
		},
		fontSize: {
			xs: ["0.75rem", "1.375rem"], // 12px to rem, 22px to rem
			sm: ["0.875rem", "1.375rem"], // 14px to rem, 22px to rem
			md: ["1rem", "1.375rem"], // 16px to rem, 22px to rem
			lg: ["1.125rem", "1.375rem"], // 18px to rem, 22px to rem
			xl: ["1.25rem", "2rem"], // 20px to rem, 32px to rem
			"2xl": ["1.5rem", "2rem"], // 24px to rem, 32px to rem
			"3xl": ["1.75rem", "2.375rem"], // 28px to rem, 38px to rem
			"4xl": ["1.875rem", "2.375rem"], // 30px to rem, 38px to rem
			"5xl": ["2.5rem", "3rem"], // 40px to rem, 48px to rem
			"6xl": ["3rem", "3.625rem"], // 48px to rem, 58px to rem
			"7xl": ["3.75rem", "4.5rem"], // 60px to rem, 72px to rem
		},
		borderWidth: {
			DEFAULT: "1px",
			0: "0px",
		},
		borderRadius: {
			s: "4px",
			DEFAULT: "6px",
			l: "8px",
			full: "100%",
		},
		spacing: {
			0: "0px",
			1: "6px",
			2: "8px",
			3: "10px",
			4: "12px",
			5: "16px",
			6: "20px",
			7: "24px",
			8: "30px",
			9: "36px",
			10: "40px",
		},
	},
};
