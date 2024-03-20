import { useToastsStore } from "apps/dostoevsky/src/state";
import { useEffect } from "react";

export const useToastContainer = (id: number) => {
	const { setActiveToastId } = useToastsStore();

	useEffect(() => {
		setActiveToastId(id);
		return () => setActiveToastId(null);
	}, []);
};
