import { redis } from "../config/redis";
import { RedisJSON } from "redis";

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
	/**
	 * In redis you can use either legacy paths or json paths.
	 * The former returns a single value while the latter returns an array of json values
	 * We are going to stick to JSON paths because they allows us to do incredible stuff. See more here https://redis.io/docs/data-types/json/path/#jsonpath-syntax
	 *
	 */
	// btw, that is why we are redefining the type, it will always return an string in our app, OF provided we use json paths
	json: {
		set: async (key: string, path: string, json: RedisJSON) => redis.json.set(key, path, json),
		get: async <T extends RedisJSON>(key: string, path?: string): Promise<T[] | null> =>
			//@ts-expect-error library does not allow to set a typed response type, so we refrain to this
			redis.json.get(key, field, { path: path || "$" }),
		del: async (key: string, path: string) => await redis.json.del(key, path),
		arrAppend: async (key: string, path: string, json: RedisJSON) =>
			redis.json.arrAppend(key, path, json),
	},

	expire: {
		expire: async (key: string, timeInSeconds: number) =>
			await redis.expire(key, timeInSeconds),
	},

	deleteKey: async (key: string) => await redis.del(key),
};
