import { WithRequired } from "@glimmer/types";
import { User } from "@glimmer/bulgakov";
import { Redis } from "./redis";
import { REDIS } from "../constants";

type GetUserFields = keyof User;

type GetUser<T extends GetUserFields> = {
	[key in T]: User[key];
};

export const Users = {
	createUser: async (user: WithRequired<User, "id">) => {
		const userExists = await Redis.json.get(REDIS.JSON_PATHS.user(user.id), "$.id");
		if (userExists) return;
		Redis.json.set(`user:${user.id}`, "$", user);
	},
	removeUser: (id: string) => {
		Redis.json.del(`user:${id}`, "$");
	},
	getUser: async <T extends GetUserFields>(id: string, fields?: GetUserFields[]) => {
		const user = await Redis.json.get<GetUser<T>>(
			REDIS.JSON_PATHS.user(id),
			fields ? fields.map((field) => `$.${field}`).join(" ") : undefined
		);
		if (!user || !user[0]) return Promise.reject("user does not exist");
		return user[0];
	},
	updateUser: (id: string, user: Partial<Omit<User, "id">>) => {
		Redis.json.set(`user:${id}`, "$", user);
	},
};
