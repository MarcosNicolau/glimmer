"use client";

import { Spinner } from "@glimmer/ui/web";
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
			<div
				ref={ref}
				className="flex flex-1 items-center justify-center"
				style={{ width: 50 }}
			>
				{isFetchingNextPage && <Spinner />}
			</div>
		</>
	);
};
