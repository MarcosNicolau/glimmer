import { Context as ResponsiveContext } from "react-responsive";

export const ReactResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ResponsiveContext.Provider value={{}}>{children}</ResponsiveContext.Provider>
);
