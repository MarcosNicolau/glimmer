import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import enLocales from "../locales/en.json";
import "@glimmer/ui/web/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/libs/queryClient";
import { worker } from "../src/mocks/api";
import { LoadUser } from "../src/modules/LoadUser";

// get the mocked handlers (endpoints) and starts the service worker
if (typeof global.process === "undefined") {
	worker.start();
}

const preview: Preview = {
	decorators: [
		withThemeByDataAttribute({
			themes: {
				light: "light",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
		(Story, ctx) => {
			const {
				parameters: { msw },
			} = ctx;

			queryClient.clear();
			worker.resetHandlers();

			// load any handler the story has provided
			if (msw?.handlers) worker.use(...msw.handlers);

			return (
				<div className="app w-full max-w-[1400px]">
					<NextIntlClientProvider messages={enLocales} locale="en">
						<QueryClientProvider client={queryClient}>
							<LoadUser>
								<div className="flex items-center justify-center">
									<Story />
								</div>
							</LoadUser>
						</QueryClientProvider>
					</NextIntlClientProvider>
				</div>
			);
		},
	],
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
};

export default preview;
