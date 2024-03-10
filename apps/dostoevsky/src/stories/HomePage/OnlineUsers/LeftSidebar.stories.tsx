import type { Meta, StoryObj } from "@storybook/react";
import { LeftSidebar } from "apps/dostoevsky/src/modules/HomePage/OnlineUsers";

const meta: Meta = {
	component: LeftSidebar,
};
export default meta;

type Story = StoryObj<typeof LeftSidebar>;

export const Default: Story = {
	args: {},
};
