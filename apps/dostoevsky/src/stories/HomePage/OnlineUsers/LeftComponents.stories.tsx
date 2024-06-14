import { GetOnlineUsers } from "@glimmer/bulgakov";
import { APIResponse } from "@glimmer/http";
import type { Meta, StoryObj } from "@storybook/react";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import { OnlineUsersLeftComponent } from "apps/dostoevsky/src/modules/OnlineUsers";
import { HttpResponse, delay, http } from "msw";

const meta: Meta = {
	component: OnlineUsersLeftComponent,
};

export default meta;

type Story = StoryObj<typeof OnlineUsersLeftComponent>;

export const Default: Story = {
	args: {},
};

export const NoUsers: Story = {
	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(`${API_URL}/users/online`, () =>
					HttpResponse.json<APIResponse<GetOnlineUsers>>({
						status: 200,
						message: "ok",
						result: { users: [], nextCursor: "	" },
					})
				),
			],
		},
	},
};

export const LoadingState: Story = {
	args: {},
	parameters: {
		msw: {
			handlers: [http.get(`${API_URL}/users/online`, () => delay("infinite"))],
		},
	},
};
