import { GetOnlineUsers, GetOnlineUsersCount, GetRooms } from "@glimmer/bulgakov";
import { APIResponse } from "./../../../../libs/http/src/types/index";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import { HttpHandler, HttpResponse, http } from "msw";
import { setupWorker } from "msw/browser";

export const handlers: Record<"onlineUsers" | "rooms", HttpHandler[]> = {
	onlineUsers: [
		http.get(`${API_URL}/users/online`, ({ request }) => {
			const url = new URL(request.url);
			const cursor = url.searchParams.get("cursor");

			if (cursor === "stop")
				return HttpResponse.json<APIResponse<GetOnlineUsers>>({
					status: 200,
					message: "OK",
					result: {
						users: [],
						nextCursor: "stop",
					},
				});

			return HttpResponse.json<APIResponse<GetOnlineUsers>>({
				status: 200,
				message: "OK",
				result: {
					users: Array.from({ length: 10 }).map((_, idx) => ({
						id: "3358--926a-9ec58a54452b",
						name: "Nostalgic Honeybee",
						image: `/avatars/${idx}.jpg`,
						room: null,
					})),
					nextCursor: "stop",
				},
			});
		}),
		http.get(`${API_URL}/users/online/count`, () => {
			return HttpResponse.json<APIResponse<GetOnlineUsersCount>>({
				status: 200,
				message: "OK",
				result: {
					count: 100,
				},
			});
		}),
	],
	rooms: [
		http.get(`${API_URL}/rooms`, ({ request }) => {
			const url = new URL(request.url);
			const cursor = url.searchParams.get("cursor");
			if (cursor === "stop")
				return HttpResponse.json<APIResponse<GetRooms>>({
					status: 200,
					message: "OK",
					result: {
						rooms: [],
						nextCursor: "stop",
					},
				});
			return HttpResponse.json<APIResponse<GetRooms>>({
				status: 200,
				message: "ok",
				result: {
					rooms: [
						{
							id: "1",
							name: "Talking about life",
							description:
								"Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.",
							tags: ["life", "grow"],
							numOfPeers: 123,
							speakers: [
								{
									id: "1",
									image: "/avatars/10.jpg",
									name: "Sanchez",
								},
								{
									id: "2",
									image: "/avatars/12.jpg",
									name: "Javier",
								},
							],
						},
						{
							id: "2",
							name: "Talking about some other thing",
							description:
								"Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.",
							tags: ["wherever", "aguante milei"],
							numOfPeers: 12,
							speakers: [
								{
									id: "3",
									image: "/avatars/8.jpg",
									name: "Cfk",
								},
								{
									id: "4",
									image: "/avatars/9.jpg",
									name: "Milei",
								},
							],
						},
					],
					nextCursor: "stop",
				},
			});
		}),
	],
} as const;

export const worker = setupWorker(...Object.values(handlers).flatMap((arr) => arr));
