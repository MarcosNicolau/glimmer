import { z } from "zod";

export const Peer = z.object({
	user: z.object({
		id: z.string(),
		name: z.string(),
		image: z.string().nullable(),
	}),
	role: z.enum(["owner", "mod", "member"]),
	isDeafened: z.boolean(),
	isMuted: z.boolean(),
	isSpeaker: z.boolean(),
	askedToSpeak: z.boolean(),
});

export type Peer = z.infer<typeof Peer>;

export const Room = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	tags: z.string().array(),
	voiceServerId: z.string().nullable(),
	createdAt: z.number(),
	isPrivate: z.boolean(),
	peers: Peer.array(),
});

export type Room = z.infer<typeof Room>;
