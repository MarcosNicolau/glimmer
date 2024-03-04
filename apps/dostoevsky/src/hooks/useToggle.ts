import { useState } from "react";

export const useToggle = (initial = false): [boolean, () => void] => {
	const [active, setIsActive] = useState(initial);
	const toggle = () => setIsActive((prev) => !prev);

	return [active, toggle];
};
