export const REDIS = {
	JSON_PATHS: {
		room: (id: string) => `room:${id}`,
	} as const,
} as const;
