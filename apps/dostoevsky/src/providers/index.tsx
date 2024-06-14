"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "apps/dostoevsky/src/libs/queryClient";
import { ThemeProvider } from "next-themes";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ThemeProvider storageKey="theme" themes={["dark", "light"]} enableSystem>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</ThemeProvider>
);
