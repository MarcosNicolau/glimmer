import { z } from "zod";

export const USER_DESCRIPTION_MAX_LENGTH = 100;

export const User = z.object({
	id: z.string(),
	name: z.string().max(50),
	description: z.string().max(100).nullable(),
	image: z.string().max(75),
	links: z.array(
		z.object({
			url: z.string().max(75),
		})
	),
});

export type User = z.infer<typeof User>;
