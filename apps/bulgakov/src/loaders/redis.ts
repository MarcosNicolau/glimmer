import { redis } from "../config/redis";

export const loadRedis = async () => {
	try {
		await redis.connect();
		console.log("redis connected");
	} catch (err) {
		console.log("could not connect to redis", err);
		return Promise.reject(err);
	}
};
