import { ThreeColumnLayout } from "@glimmer/ui/web";
import {
	OnlineUsersLeftComponent,
	OnlineUsersLeftSidebar,
} from "apps/dostoevsky/src/modules/OnlineUsers";

export const RoomPage = () => {
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
			<h3>This is the room page!</h3>
		</ThreeColumnLayout>
	);
};
