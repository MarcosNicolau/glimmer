export const ENV_VARS = {
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	RABBIT_URL: process.env.RABBIT_URL,
	PORT: Number(process.env.PORT),
} as const;
