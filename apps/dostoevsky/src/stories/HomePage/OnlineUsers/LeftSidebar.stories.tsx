import type { Meta, StoryObj } from "@storybook/react";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import { OnlineUsersLeftSidebar } from "apps/dostoevsky/src/modules/OnlineUsers";
import { delay, http } from "msw";

const meta: Meta = {
	component: OnlineUsersLeftSidebar,
};
export default meta;

type Story = StoryObj<typeof OnlineUsersLeftSidebar>;

export const Default: Story = {
	args: {},
};

export const LoadingState: Story = {
	args: {},
	parameters: {
		msw: {
			handlers: [http.get(`${API_URL}/users/online`, () => delay("infinite"))],
		},
	},
};
