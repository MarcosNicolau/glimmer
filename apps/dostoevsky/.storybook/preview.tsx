import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import enLocales from "../locales/en.json";
import { inter, abrilFatface } from "../src/libs/loadFonts";
import "@glimmer/ui/web/globals.css";

const preview: Preview = {
	decorators: [
		withThemeByDataAttribute({
			themes: {
				light: "light",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
		(Story) => (
			<div className="app w-full max-w-[1400px]">
				<NextIntlClientProvider messages={enLocales} locale="en">
					<Story />
				</NextIntlClientProvider>
			</div>
		),
	],
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
};

export default preview;
