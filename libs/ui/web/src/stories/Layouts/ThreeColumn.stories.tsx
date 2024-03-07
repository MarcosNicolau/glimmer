import { Card, ThreeColumnLayout } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: ThreeColumnLayout,
};
export default meta;

type Story = StoryObj<typeof ThreeColumnLayout>;

export const Desktop: Story = {
	args: {
		leftComponent: (
			<Card>
				<h5>Left</h5>
			</Card>
		),
		rightComponent: (
			<Card>
				<h5>Right</h5>
			</Card>
		),

		children: (
			<Card>
				<h4>Main</h4>
			</Card>
		),
	},
	argTypes: {
		leftComponent: {
			control: false,
		},
		rightComponent: {
			control: false,
		},
		children: {
			control: false,
		},
	},
};

export const MobileAndTablet: Story = {
	...Desktop,
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
