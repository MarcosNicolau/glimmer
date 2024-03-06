import { Button } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		variant: "accent-fill",
		isLoading: false,
		children: "Enter",
		disabled: false,
	},
};
