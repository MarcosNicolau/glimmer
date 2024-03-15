import { useCallback, useEffect, useRef, useState } from "react";
import { useViewport } from "./useDevice";
type ElemDim = {
	height: number;
	width: number;
};

export const useComponentDimensions = <T extends HTMLElement>(): [
	ref: (node: T) => void,
	dims: ElemDim,
] => {
	const ref = useRef<T | null>(null);
	const { width, height } = useViewport();
	const [dim, setDim] = useState<ElemDim>({
		height: -1,
		width: -1,
	});
	const setRef = useCallback((node: T) => {
		ref.current = node;
		setDim({ height: ref.current?.clientHeight, width: ref.current?.clientWidth });
	}, []);

	useEffect(() => {
		if (!ref.current) return;
		setDim({ height: ref.current.clientHeight, width: ref.current.clientWidth });
	}, [width, height]);

	return [setRef, { ...dim }];
};
