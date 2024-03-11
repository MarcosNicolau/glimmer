"use client";
import { GetOnlineUsers } from "@glimmer/bulgakov";
import { useInfiniteQuery } from "@tanstack/react-query";
import { APIBaseFetch } from "apps/dostoevsky/src/libs/fetch";
import { useMemo } from "react";

const queryFn = ({ pageParam }: { pageParam: unknown }) =>
	APIBaseFetch<GetOnlineUsers>("get", `/users/online?size=20&cursor=${pageParam}`);

export const useOnlineUsers = () => {
	const { data, ...rest } = useInfiniteQuery<GetOnlineUsers>({
		queryKey: ["online-users"],
		queryFn,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});
	const users = useMemo(() => data?.pages.flatMap((page) => page.users), [data]);

	return {
		users,
		data,
		...rest,
	};
};
