import { Card, ThreeColumnLayout } from "@glimmer/ui/web/components";
import { LeftSidebar, LeftComponent } from "./OnlineUsers";
import { Profile } from "apps/dostoevsky/src/modules/HomePage/Profile";

export const HomePage = () => (
	<ThreeColumnLayout leftComponent={<LeftComponent />} leftSideBar={<LeftSidebar />} rightComponent={<Profile />}>
		<h4 className="mb-6">Welcome to glimmer</h4>
		<Card>
			<p>This is bout to get crazy</p>
		</Card>
	</ThreeColumnLayout>
);
