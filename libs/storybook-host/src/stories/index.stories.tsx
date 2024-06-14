import type { Meta, StoryObj } from "@storybook/react";
import { Welcome } from "../index";

const meta: Meta = {
	component: Welcome,
};
export default meta;

type Story = StoryObj<typeof Welcome>;

export const Primary: Story = {
	args: {},
};
