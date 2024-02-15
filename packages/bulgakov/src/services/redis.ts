import { redis } from "../config/redis";

export const Redis = {
	hashes: {
		set: async (key: string, field: string | number, value: string | number) =>
			await redis.hSet(key, field, value),
		setMultiple: async (
			key: string,
			values: Record<string | number, string | number | Buffer>
		) => redis.hSet(key, values),
		fieldExists: async (key: string, field: string) => await redis.hExists(key, field),
		getSingleField: async (key: string, field: string) => await redis.hGet(key, field),
		getAllFields: async <T extends { [key in string]: string }>(key: string): Promise<T> =>
			//@ts-expect-error library does not allow to set a typed response type, so we refrain to this
			await redis.hGetAll(key),
		deleteField: async (key: string, field: string) => await redis.hDel(key, field),
		deleteHash: async (key: string) => await redis.del(key),
	},

	json: {
		set: async (key: string, path: string, json: string) =>
			await redis.json.set(key, path, json),
	},

	expire: {
		expire: async (key: string, timeInSeconds: number) =>
			await redis.expire(key, timeInSeconds),
	},

	deleteKey: async (key: string) => await redis.del(key),
};
