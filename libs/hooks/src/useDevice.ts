import { useCallback, useEffect, useState } from "react";

export const useViewport = () => {
	const [width, setWidth] = useState(-1);
	const [height, setHeight] = useState(-1);

	const handleWindowResize = useCallback((): void => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}, [width, height]);

	useEffect(() => {
		handleWindowResize();
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	return { width, height };
};
