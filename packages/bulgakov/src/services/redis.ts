import { redisClient } from "../config/redis";

export const Redis = () => {
	return {
		hashes: {
			set: async (key: string, field: string | number, value: string | number) =>
				await redisClient.hSet(key, field, value),
			setMultiple: async (
				key: string,
				values: Record<string | number, string | number | Buffer>
			) => redisClient.hSet(key, values),
			fieldExists: async (key: string, field: string) =>
				await redisClient.hExists(key, field),
			getSingleField: async (key: string, field: string) =>
				await redisClient.hGet(key, field),
			getAllFields: async <T extends { [key in string]: string }>(key: string): Promise<T> =>
				//@ts-expect-error library does not allow to set a typed response type, so we refrain to this
				await redisClient.hGetAll(key),
			deleteField: async (key: string, field: string) => await redisClient.hDel(key, field),
			deleteHash: async (key: string) => await redisClient.del(key),
		},

		expire: {
			expire: async (key: string, timeInSeconds: number) =>
				await redisClient.expire(key, timeInSeconds),
		},

		deleteKey: async (key: string) => await redisClient.del(key),
	};
};
