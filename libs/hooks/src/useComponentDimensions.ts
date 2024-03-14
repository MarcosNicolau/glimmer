import { useCallback, useRef, useState } from "react";

type ElemDim = {
	height: number | null;
	width: number | null;
};

export const useComponentDimensions = <T extends HTMLElement>(): [
	ref: (node: T) => void,
	dims: ElemDim,
] => {
	const ref = useRef<T | null>(null);
	const [dim, setDim] = useState<ElemDim>({
		height: null,
		width: null,
	});
	const setRef = useCallback((node: T) => {
		ref.current = node;
		setDim({ height: ref.current?.clientHeight, width: ref.current?.clientWidth });
	}, []);

	return [setRef, { ...dim }];
};
