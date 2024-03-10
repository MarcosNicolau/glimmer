import { Card, ThreeColumnLayout } from "@glimmer/ui/web/components";
import { LeftSidebar, LeftComponent } from "./OnlineUsers";

export const HomePage = () => (
	<ThreeColumnLayout
		leftComponent={<LeftComponent />}
		leftSideBar={<LeftSidebar />}
		rightComponent={
			<Card>
				<h5>Right</h5>
			</Card>
		}
	>
		<h4 className="mb-6">Welcome to glimmer</h4>
		<Card>
			<p>This is bout to get crazy</p>
		</Card>
	</ThreeColumnLayout>
);
