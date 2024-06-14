import { useCallback, useEffect, useRef } from "react";

export const useOnClickOutside = <T extends HTMLElement>(cb: (e: MouseEvent) => void) => {
	const ref = useRef<T | null>(null);

	const onClick = (e: MouseEvent) => {
		if (!ref.current) return;
		e.preventDefault();
		//@ts-expect-error i think this is an incorrect type from react
		if (!ref.current?.contains(e.target)) cb(e);
	};

	const setRef = useCallback((node: T) => {
		ref.current = node;
		document.addEventListener("click", onClick, { capture: true });
	}, []);

	useEffect(() => {
		return () => document.removeEventListener("click", onClick, { capture: true });
	}, []);

	return [setRef];
};
