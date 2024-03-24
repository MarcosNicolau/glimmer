"use client";

import { ThreeColumnLayout } from "@glimmer/ui/web";
import {
	OnlineUsersLeftComponent,
	OnlineUsersLeftSidebar,
} from "apps/dostoevsky/src/modules/OnlineUsers";
import { Stream } from "apps/dostoevsky/src/modules/RoomPage/Stream";
import { useRoomStore } from "apps/dostoevsky/src/state";
import { useEffect } from "react";

export const RoomPage = ({ params: { id } }: { params: { id: string } }) => {
	const { setRoomId } = useRoomStore();

	useEffect(() => {
		setRoomId(id);
		return () => {
			setRoomId(null);
		};
	}, [setRoomId, id]);

	return (
		<ThreeColumnLayout
			leftComponent={<OnlineUsersLeftComponent />}
			leftSideBar={<OnlineUsersLeftSidebar />}
			rightComponent={
				<>
					<h5>Chat</h5>
				</>
			}
		>
			<Stream />
		</ThreeColumnLayout>
	);
};
