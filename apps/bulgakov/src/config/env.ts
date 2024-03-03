import * as dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	RABBIT_URL: process.env.RABBIT_URL,
	PORT: Number(process.env.PORT),
	JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
	NODE_ENV: process.env.NODE_ENV,
} as const;
