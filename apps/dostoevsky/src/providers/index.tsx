"use client";

import { ThemeProvider } from "next-themes";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ThemeProvider storageKey="theme" themes={["dark", "light"]} enableSystem>
		{children}
	</ThemeProvider>
);
