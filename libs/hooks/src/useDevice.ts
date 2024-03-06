import { useCallback, useEffect, useState } from "react";

export const useViewport = () => {
	const [width, setWidth] = useState(-1);

	useEffect(() => {
		const handleWindowResize = useCallback((): void => {
			setWidth(window.innerWidth);
		}, [width]);
		handleWindowResize();
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	return { width };
};
