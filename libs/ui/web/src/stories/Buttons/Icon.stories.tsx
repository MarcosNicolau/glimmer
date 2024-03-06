import { IconBtn, MoonIcon } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: IconBtn,
};

export default meta;

type Story = StoryObj<typeof IconBtn>;

export const Primary: Story = {
	args: {
		variant: "filled",
		icon: MoonIcon,
	},
};
