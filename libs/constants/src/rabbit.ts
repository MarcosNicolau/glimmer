export const RABBIT = {
	QUEUES: {
		GENERAL_VOICE_SERVER: "gogol_queue",
		VOICE_SERVER: (id: string) => `gogol_queue/${id}`,
		BULGAKOV_SERVER: "bulgakov_queue",
	},
	EXCHANGES: {
		INTERNAL_BULGAKOV: "internal_bulgakov_exchange",
	},
};
