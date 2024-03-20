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
	LOCAL_SSL_CERT_FILE_NAME: process.env.LOCAL_SSL_CERT_FILE_NAME,
	LOCAL_SSL_KEY_FILE_NAME: process.env.LOCAL_SSL_KEY_FILE_NAME,
	NODE_ENV: process.env.NODE_ENV,
} as const;
