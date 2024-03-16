"use client";

import { useScreenType } from "@glimmer/hooks";
import { DesktopNavContent } from "./Desktop";
import { MobileNavContent } from "./Mobile";

export default () => {
	const { isMobile, isTablet } = useScreenType();

	return (
		<nav
			className="width-100 max-mobile:px-6 mb-[50px] flex flex-row items-center justify-between px-10"
			suppressHydrationWarning
		>
			{isMobile || isTablet ? <MobileNavContent /> : <DesktopNavContent />}
		</nav>
	);
};
