import { ThreeColumnLayout } from "@glimmer/ui/web";
import {
	OnlineUsersLeftSidebar,
	OnlineUsersLeftComponent,
} from "apps/dostoevsky/src/modules/OnlineUsers";
import { Profile } from "apps/dostoevsky/src/modules/HomePage/Profile";
import { Feed } from "apps/dostoevsky/src/modules/HomePage/Feed";

export const HomePage = () => (
	<ThreeColumnLayout
		leftComponent={<OnlineUsersLeftComponent />}
		leftSideBar={<OnlineUsersLeftSidebar />}
		rightComponent={<Profile />}
	>
		<Feed />
	</ThreeColumnLayout>
);
