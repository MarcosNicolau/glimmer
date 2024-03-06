import "../src/styles/globals.css";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

export const decorators = [
	withThemeByDataAttribute({
		themes: {
			light: "light",
			dark: "dark",
		},
		defaultTheme: "light",
	}),
];
