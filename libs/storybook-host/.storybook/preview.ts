import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { Preview } from "@storybook/react";

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
};

export default preview;
