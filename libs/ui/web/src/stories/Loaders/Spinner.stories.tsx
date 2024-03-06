import { Spinner } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Primary: Story = {
	args: {},
};
