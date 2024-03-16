import { useRouter } from "apps/dostoevsky/src/libs/navigation";

export const useRouting = () => {
	const router = useRouter();

	const pushRoute = (route: string) => () => {
		router.push(route);
	};

	const openWindowAt = (route: string) => () => {
		window.open(route);
	};

	return {
		router,
		pushRoute,
		openWindowAt,
	};
};
