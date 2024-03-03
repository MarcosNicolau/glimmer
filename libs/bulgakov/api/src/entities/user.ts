import { z } from "zod";

export const User = z.object({
	id: z.string(),
	name: z.string().max(50),
	description: z.string().max(100),
	image: z.string().max(75),
	links: z.array(
		z.object({
			username: z.string(),
			media: z.enum([
				"github",
				"instagram",
				"facebook",
				"x",
				"reddit",
				"youtube",
				"tiktok",
				"snapchat",
				"quora",
				"twitch",
				"linktree",
			]),
		})
	),
});

export type User = z.infer<typeof User>;
