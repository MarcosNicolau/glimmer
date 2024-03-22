import { useCallback, useEffect, useRef } from "react";

export const useElementOnView = <T extends HTMLElement>(
	onView: () => void,
	opts?: IntersectionObserverInit
): [_: (node: T) => void] => {
	const ref = useRef<T | null>(null);
	const observer = useRef(
		new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) onView();
			});
		}, opts)
	);
	const setRef = useCallback((node: T) => {
		if (!ref.current) {
			ref.current = node;
			observer.current.observe(ref.current);
		}
	}, []);

	useEffect(() => {
		return () => {
			if (ref.current) observer.current.unobserve(ref.current);
			observer.current.disconnect();
		};
	}, []);

	return [setRef];
};
