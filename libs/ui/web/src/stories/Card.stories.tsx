import { Card } from "@glimmer/ui/web";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
	args: {},
};
