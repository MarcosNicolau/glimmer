import "../src/styles/globals.css";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
const preview: Preview = {
	decorators: [
		withThemeByDataAttribute({
			themes: {
				light: "light",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
	],
	parameters: {
		docs: {
			theme: themes.dark,
		},
	},
};

export default preview;
