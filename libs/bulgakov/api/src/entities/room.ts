import { z } from "zod";

export const UserInRoom = z.object({
	user: z.object({
		id: z.string(),
		name: z.string(),
		image: z.string().nullable(),
	}),

	role: z.enum(["creator", "mod", "member"]),
	isDeafened: z.boolean(),
	isMuted: z.boolean(),
	isSpeaker: z.boolean(),
	askedToSpeak: z.boolean(),
});

export type UserInRoom = z.infer<typeof UserInRoom>;

export const Room = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	ownerId: z.string(),
	voiceServerId: z.string().nullable(),
	createdAt: z.number(),
	private: z.object({
		is: z.boolean(),
		code: z.string().optional(),
	}),
	peers: UserInRoom.array(),
});

export type Room = z.infer<typeof Room>;
