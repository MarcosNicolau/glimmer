import { useState } from "react";

export const useModal = (value = false) => {
	const [open, setOpen] = useState(value);

	return { open, setOpen };
};
