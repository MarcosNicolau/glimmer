import type { Meta, StoryObj } from "@storybook/react";
import Nav from "../modules/Nav/";

const meta: Meta = {
	component: Nav,
};

export default meta;

type Story = StoryObj<typeof Nav>;

export const Desktop: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
};

export const Tablet: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
export const Mobile: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "mobile2",
		},
	},
};
