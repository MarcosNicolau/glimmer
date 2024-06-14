import "redis";

declare module "redis" {
	interface RedisJSONArray extends Array<RedisJSON> {}
	interface RedisJSONObject {
		[key: string]: RedisJSON;
		[key: number]: RedisJSON;
	}
	export type RedisJSON =
		| null
		| boolean
		| number
		| string
		| Date
		| RedisJSONArray
		| RedisJSONObject;
}
