import { useState } from "react";

export const useToggle = (initial: boolean): [boolean, () => void] => {
	const [active, setIsActive] = useState(initial);
	const toggle = () => setIsActive((prev) => !prev);
	return [active, toggle];
};
