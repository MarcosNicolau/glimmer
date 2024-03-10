import type { Meta, StoryObj } from "@storybook/react";
import { LeftComponent } from "apps/dostoevsky/src/modules/HomePage/OnlineUsers";

const meta: Meta = {
	component: LeftComponent,
};
export default meta;

type Story = StoryObj<typeof LeftComponent>;

export const Default: Story = {
	args: {},
};
