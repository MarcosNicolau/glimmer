export const REDIS = {
	JSON_PATHS: {
		room: (id: string) => `room:${id}`,
		user: (id: string) => `user:${id}`,
	} as const,
} as const;
