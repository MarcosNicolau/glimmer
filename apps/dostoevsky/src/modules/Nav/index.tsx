"use client";

import { useScreenType } from "@glimmer/hooks";
import { DesktopNavContent } from "./Desktop";
import { MobileNavContent } from "./Mobile";

export default () => {
	const { isMobile, isTablet } = useScreenType();

	return (
		<nav
			className="width-100 mb-[50px] px-10 flex flex-row items-center justify-between"
			suppressHydrationWarning
		>
			{isMobile || isTablet ? <MobileNavContent /> : <DesktopNavContent />}
		</nav>
	);
};
