import { Room, User } from "../entities";
import { z } from "zod";

const CursorPagination = z.object({ cursor: z.string(), size: z.string() });

export const GetTokenReqBody = z.object({});
export type GetTokenReqBody = z.infer<typeof GetTokenReqBody>;

export const GetTokenRes = z.object({ token: z.string() });
export type GetTokenRes = z.infer<typeof GetTokenRes>;

export const GetOnlineUsersCount = z.object({ count: z.number() });
export type GetOnlineUsersCount = z.infer<typeof GetOnlineUsersCount>;

export const GetOnlineUsersQueryParams = CursorPagination;
export type GetOnlineUsersQueryParams = z.infer<typeof GetOnlineUsersQueryParams>;

export const GetOnlineUsers = z.object({
	users: User.pick({ id: true, name: true, image: true })
		.merge(
			z.object({
				room: Room.pick({ id: true, name: true })
					.merge(z.object({ connectedUsers: z.number() }))
					.nullable(),
			})
		)
		.array(),
	nextCursor: z.string(),
});
export type GetOnlineUsers = z.infer<typeof GetOnlineUsers>;

export const GetUser = User.omit({ id: true });
export type GetUser = z.infer<typeof GetUser>;

export const GetRoom = Room.pick({ id: true, name: true, description: true, tags: true }).merge(
	z.object({
		speakers: User.pick({ id: true, name: true, image: true }).array(),
		numOfPeers: z.number(),
	})
);

export type GetRoom = z.infer<typeof GetRoom>;

export const GetRooms = z.object({ rooms: GetRoom.array(), nextCursor: z.string() });
export type GetRooms = z.infer<typeof GetRooms>;

export const GetRoomsQueryParams = CursorPagination;
export type GetRoomsQueryParams = z.infer<typeof GetOnlineUsersQueryParams>;
