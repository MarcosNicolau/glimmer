import { Room, User } from "../entities";
import { z } from "zod";

export const GetTokenReqBody = z.object({});
export type GetTokenReqBody = z.infer<typeof GetTokenReqBody>;

export const GetTokenRes = z.object({ token: z.string() });
export type GetTokenRes = z.infer<typeof GetTokenRes>;

export const GetOnlineUsersCount = z.object({ count: z.number() });
export type GetOnlineUsersCount = z.infer<typeof GetOnlineUsersCount>;

export const GetOnlineUsersQueryParams = z.object({ cursor: z.string(), size: z.string() });
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
