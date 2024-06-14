import { ENV_VARS } from "./env";
import { createClient } from "redis";

export const redis = createClient({
	socket: {
		host: ENV_VARS.REDIS_HOST,
		port: Number(ENV_VARS.REDIS_PORT),
	},
	password: ENV_VARS.REDIS_PASSWORD,
	name: "Bulgakov",
});
