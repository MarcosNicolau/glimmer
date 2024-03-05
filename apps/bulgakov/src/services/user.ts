import { WithRequired } from "@glimmer/types";
import { User } from "@glimmer/bulgakov";
import { Redis } from "./redis";
import { REDIS } from "../constants";

type GetUserFields = keyof User;

type GetUser<T extends GetUserFields> = {
	[key in T]: User[key];
};

export const Users = {
	create: async (user: WithRequired<Partial<User>, "id">) => {
		const userExists = await Redis.json.get(REDIS.JSON_PATHS.user(user.id), "$.id");
		if (userExists) return;
		return Redis.json.set(`user:${user.id}`, "$", user);
	},
	remove: (id: string) => {
		return Redis.json.del(`user:${id}`, "$");
	},
	get: async <T extends GetUserFields>(id: string, fields?: GetUserFields[]) => {
		const user = await Redis.json.get<GetUser<T>>(
			REDIS.JSON_PATHS.user(id),
			fields ? fields.map((field) => `$.${field}`).join(" ") : undefined
		);
		if (!user || !user[0]) return null;
		return user[0];
	},
	update: async (id: string, _user: Partial<Omit<User, "id">>) => {
		for await (const user of Object.entries(_user)) {
			await Redis.json.set(`user:${id}`, `$.${user[0]}`, user[1]);
		}
	},
};
