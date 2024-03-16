import { ThreeColumnLayout } from "@glimmer/ui/web";
import { LeftSidebar, LeftComponent } from "./OnlineUsers";
import { Profile } from "apps/dostoevsky/src/modules/HomePage/Profile";
import { Feed } from "apps/dostoevsky/src/modules/HomePage/Feed";

export const HomePage = () => (
	<ThreeColumnLayout
		leftComponent={<LeftComponent />}
		leftSideBar={<LeftSidebar />}
		rightComponent={<Profile />}
	>
		<Feed />
	</ThreeColumnLayout>
);
