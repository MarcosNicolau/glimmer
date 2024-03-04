"use client";
import { useScreenType } from "apps/dostoevsky/src/hooks/useScreenType";
import { DesktopNavContent } from "./desktop";
import { MobileNavContent } from "./mobile";

export const Nav: React.FC = () => {
	const { isMobile, isTablet } = useScreenType();

	return (
		<nav className="width-100 mb-8 flex flex-grow flex-row items-center justify-between">
			{isMobile || isTablet ? <MobileNavContent /> : <DesktopNavContent />}
		</nav>
	);
};
