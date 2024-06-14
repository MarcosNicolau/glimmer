import { KeyboardKeys } from "apps/dostoevsky/src/types/keyboard";
import { useEffect } from "react";

type OnKeyDownArgs = {
	key: KeyboardKeys;
	altKey: boolean;
	shiftKey: boolean;
	ctrlKey: boolean;
};

export const useOnKeyDown = (onKeyDown: (_: OnKeyDownArgs) => void) => {
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			onKeyDown({
				key: e.key,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				shiftKey: e.ctrlKey,
			});
		};
		document.addEventListener("keydown", listener);
		return () => document.removeEventListener("keydown", listener);
	}, []);
};
