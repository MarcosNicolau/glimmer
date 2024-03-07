import type { StorybookConfig } from "@storybook/react-vite";

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	refs: (config, { configType }) => {
		if (configType === "DEVELOPMENT")
			return {
				"ui-web-stories": {
					title: "Web ui Stories",
					url: "http://localhost:4401",
				},
				"dostoevsky-stories": {
					title: "Dostoevsky Stories",
					url: "http://localhost:4402",
				},
			};
		return {
			"ui-web-stories": {
				title: "Web ui Stories",
				url: "",
			},
			"dostoevsky-stories": {
				title: "Dostoevsky Stories",
				url: "",
			},
		};
	},
	viteFinal: async (config) =>
		mergeConfig(config, {
			plugins: [nxViteTsPaths()],
		}),
};

export default config;
