import { useEffect, useRef } from "react";

export const useOnClickOutside = <T extends HTMLElement>(cb: () => void) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!ref.current) return;
		const onClick = (e: MouseEvent) => {
			//@ts-expect-error idk tbh
			if (!ref.current?.contains(e.target)) cb();
		};
		document.addEventListener("click", onClick, { capture: true });

		return () => document.removeEventListener("click", onClick);
	}, [ref]);

	return [ref];
};
