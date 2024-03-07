"use client";

import { useScreenType } from "@glimmer/hooks";
import { DesktopNavContent } from "./Desktop";
import { MobileNavContent } from "./Mobile";

export const Nav: React.FC = () => {
	const { isMobile, isTablet } = useScreenType();

	return (
		<nav className="width-100 mb-8 flex flex-grow flex-row items-center justify-between">
			{isMobile || isTablet ? <MobileNavContent /> : <DesktopNavContent />}
		</nav>
	);
};
