import { ComputerIcon, Option } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: Option,
};
export default meta;

type Story = StoryObj<typeof Option>;

export const Primary: Story = {
	args: {
		value: "",
		icon: ComputerIcon,
		isSelected: false,
		text: "Computer",
	},
};
