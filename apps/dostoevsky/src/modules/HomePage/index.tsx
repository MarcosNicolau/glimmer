import { Card, ThreeColumnLayout } from "@glimmer/ui/web";
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
		<div>
			<Card className="p-8">
				<h5>Talkin about life</h5>
				<p className="mt-4">
					Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam
					in hendrerit urna. Pellentesque sit amet sapien.
				</p>
			</Card>
		</div>
	</ThreeColumnLayout>
);
