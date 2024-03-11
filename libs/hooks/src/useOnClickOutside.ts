import { useEffect, useRef } from "react";

export const useOnClickOutside = <T extends HTMLElement>(cb: () => void) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!ref.current) return;
		const onClick = (e: MouseEvent) => {
			e.preventDefault();
			//@ts-expect-error i think this is an incorrect type from react
			if (!ref.current?.contains(e.target)) cb();
		};
		document.addEventListener("click", onClick);

		return () => document.removeEventListener("click", onClick);
	}, [ref.current]);

	return [ref];
};
