import { GetUser } from "@glimmer/bulgakov";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id: string) => {
	const data = useQuery<GetUser>({
		queryKey: [`/users/${id}`],
	});

	return data;
};
