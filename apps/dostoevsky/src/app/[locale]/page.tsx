import { Card, ThreeColumnLayout } from "@glimmer/ui/web/components";

export default async () => {
	return (
		<ThreeColumnLayout
			leftComponent={
				<Card>
					<h5>Left</h5>
				</Card>
			}
			rightComponent={
				<Card>
					<h5>Right</h5>
				</Card>
			}
		>
			<Card>
				<h4>Welcome to glimmer</h4>
				<p>This is bout to get crazy</p>
			</Card>
		</ThreeColumnLayout>
	);
};
