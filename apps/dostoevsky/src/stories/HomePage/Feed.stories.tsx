import { GetRooms } from "@glimmer/bulgakov";
import { APIResponse } from "@glimmer/http";
import type { Meta, StoryObj } from "@storybook/react";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import { Rooms } from "apps/dostoevsky/src/modules/HomePage/Feed/Rooms";
import { HttpResponse, delay, http } from "msw";

const meta: Meta = {
	component: Rooms,
};
export default meta;

type Story = StoryObj<typeof Rooms>;

export const Default: Story = {
	args: {},
};

export const NoRooms: Story = {
	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(`${API_URL}/rooms`, () =>
					HttpResponse.json<APIResponse<GetRooms>>({
						status: 200,
						message: "ok",
						result: { rooms: [], nextCursor: "" },
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
			handlers: [http.get(`${API_URL}/rooms`, () => delay("infinite"))],
		},
	},
};
