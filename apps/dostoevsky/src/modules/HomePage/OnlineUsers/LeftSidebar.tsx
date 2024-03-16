"use client";

import { InfiniteQueryLoader } from "@glimmer/ui/web";
import { useElementOnView } from "apps/dostoevsky/src/hooks/useElementOnView";
import { useOnlineUsers } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { UserSideBar } from "apps/dostoevsky/src/modules/HomePage/OnlineUsers/UserSideBar";

export const LeftSidebar = () => {
	const { users, isFetchingNextPage, fetchNextPage } = useOnlineUsers();
	const [ref] = useElementOnView<HTMLDivElement>(() => {
		fetchNextPage();
	}, {});

	return (
		<>
			<div className="flex flex-col gap-5">
				{users?.map((user) => <UserSideBar key={user.id} {...user} />)}
			</div>

			<InfiniteQueryLoader ref={ref} isFetching={isFetchingNextPage} style={{ width: 50 }} />
		</>
	);
};
