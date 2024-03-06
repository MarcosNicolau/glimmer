import { useMediaQuery } from "react-responsive";

export const useScreenType = () => {
	const isBigDesktop = useMediaQuery({ minWidth: 1226 });
	const isDesktop = useMediaQuery({ minWidth: 1025 });
	const isTablet = useMediaQuery({ maxWidth: 1024, minWidth: 768 });
	const isMobile = useMediaQuery({ maxWidth: 767 });

	return {
		isBigDesktop,
		isDesktop,
		isTablet,
		isMobile,
	};
};
