import type { Meta, StoryObj } from "@storybook/react";
import { Input as component } from "../../components/Form/Input";
import { SearchIcon } from "@glimmer/ui/web/components";

const meta: Meta = {
	component,
};
export default meta;

type Story = StoryObj<typeof component>;

export const Primary: Story = {
	args: {
		variant: "primary",
		placeholder: "Search for rooms",
		error: "",
	},
};

export const WithIcon: Story = {
	args: {
		...Primary.args,
		icon: SearchIcon,
	},
};
