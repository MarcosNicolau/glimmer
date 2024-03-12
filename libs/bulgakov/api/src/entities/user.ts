import { z } from "zod";

export const User = z.object({
	id: z.string(),
	name: z.string().max(50),
	description: z.string().max(100).nullable(),
	image: z.string().max(75).nullable(),
	links: z.array(
		z.object({
			url: z.string().max(75),
		})
	),
	roomId: z.string().nullable(),
});

export type User = z.infer<typeof User>;
