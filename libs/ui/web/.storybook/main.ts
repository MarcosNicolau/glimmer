import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	stories: ["../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-themes",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	docs: {
		autodocs: true,
		defaultName: "Documentation",
	},
};

export default config;
