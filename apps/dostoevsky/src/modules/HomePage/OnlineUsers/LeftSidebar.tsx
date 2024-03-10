"use client";

import { useOnlineUsers } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { UserSideBar } from "apps/dostoevsky/src/modules/HomePage/OnlineUsers/UserSideBar";

export const LeftSidebar = () => {
	const { users } = useOnlineUsers();

	return (
		<div className="flex flex-col gap-5">
			{users?.map((user) => <UserSideBar key={user.id} {...user} />)}
		</div>
	);
};
