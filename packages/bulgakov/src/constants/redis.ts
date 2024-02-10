export const REDIS_KEYS = {
	room: (id: string) => `room_${id}`,
} as const;
