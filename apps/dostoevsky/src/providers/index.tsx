"use-client";

import { ReactResponsiveProvider } from "apps/dostoevsky/src/providers/responsive";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ReactResponsiveProvider>{children}</ReactResponsiveProvider>
);
