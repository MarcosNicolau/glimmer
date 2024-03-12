"use client";
import { GetOnlineUsers, GetOnlineUsersCount } from "@glimmer/bulgakov";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { APIBaseFetch } from "apps/dostoevsky/src/libs/fetch";
import { useUserStore } from "apps/dostoevsky/src/state";
import { useMemo } from "react";

const queryFn = ({ pageParam }: { pageParam: unknown }) =>
	APIBaseFetch<GetOnlineUsers>("get", `/users/online?size=20&cursor=${pageParam}`);

export const useOnlineUsers = () => {
	const { id, isLoaded } = useUserStore((state) => state);
	const { data, ...rest } = useInfiniteQuery<GetOnlineUsers>({
		queryKey: ["online-users"],
		queryFn,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
	});

	const users = useMemo(
		() =>
			isLoaded
				? data?.pages.flatMap((page) => page?.users).filter((user) => user?.id !== id) || []
				: [],
		[data]
	);

	return {
		users,
		data,
		...rest,
	};
};

export const useOnlineUsersCount = () => {
	const {
		data: { count },
		...rest
	} = useQuery<GetOnlineUsersCount>({
		queryKey: ["/users/online/count"],
		initialData: { count: 0 },
	});

	return {
		count,
		...rest,
	};
};
