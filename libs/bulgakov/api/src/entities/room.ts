import { z } from "zod";
import { User } from "./user";

export const UserInRoom = z
	.object({
		role: z.enum(["creator", "mod", "peer"]),
		joinedAt: z.number(),
		isDeafened: z.boolean(),
		isMuted: z.boolean().optional(),
		isSpeaker: z.boolean(),
	})
	.merge(User.pick({ id: true }));

export type UserInRoom = z.infer<typeof UserInRoom>;

export const Room = z.object({
	id: z.string(),
	ownerId: z.string(),
	voiceServerId: z.string().nullable(),
	createdAt: z.number(),
	private: z.object({
		is: z.boolean(),
		code: z.string().optional(),
	}),
	users: UserInRoom.array(),
});

export type Room = z.infer<typeof Room>;
