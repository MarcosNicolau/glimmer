import { GetRooms } from "@glimmer/bulgakov";
import { useInfiniteQuery } from "@tanstack/react-query";
import { APIBaseFetch } from "apps/dostoevsky/src/libs/fetch";
import { useMemo } from "react";

const queryFn = ({ pageParam }: { pageParam: unknown }) =>
	APIBaseFetch<GetRooms>("get", `/rooms/?size=15&cursor=${pageParam}`);

export const useRooms = () => {
	const { data, ...rest } = useInfiniteQuery<GetRooms>({
		queryKey: ["rooms"],
		queryFn,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
	});

	const rooms = useMemo(() => data?.pages.flatMap((page) => page?.rooms) || [], [data]);

	return {
		rooms,
		data,
		...rest,
	};
};
