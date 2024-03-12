import {
	GetOnlineUsersCount,
	GetOnlineUsers,
	GetOnlineUsersQueryParams,
	GetTokenRes,
	GetUser,
} from "@glimmer/bulgakov";
import { Token, Users } from "../../../services";
import { generateRandomId } from "../../../utils/crypto";
import { HttpHandler } from "uWebSockets.js";
import { zodParseAsync } from "../../..//utils/zod";

export const getToken: HttpHandler = async (res) => {
	const id = generateRandomId();
	const { token } = await Token.issue({ id });
	res.send<GetTokenRes>({ status: 200, result: { token } });
};

export const getUser: HttpHandler = async (res, req) => {
	const id: string = req.getParameter(0);
	if (!id) return res.send({ status: 500, message: "you need to provide an id" });

	try {
		const user = await Users.get(id, {
			name: true,
			image: true,
			description: true,
			links: true,
		});
		if (!user) return res.send({ status: 404, message: "user not found" });
		return res.send<GetUser>({ status: 200, result: user });
	} catch (err) {
		console.error("error while getting user", err);
		return res.send({ status: 500 });
	}
};

export const getOnlineUsers: HttpHandler = async (res, req) => {
	const params: GetOnlineUsersQueryParams = req.params;
	const { err } = await zodParseAsync(GetOnlineUsersQueryParams, params);
	if (err) return res.send({ status: 400, message: err.message });

	try {
		const { nextCursor, users } = await Users.getOnlineUsers(
			Number(params.size),
			params.cursor
		);

		return res.send<GetOnlineUsers>({
			status: 200,
			result: {
				users,
				nextCursor,
			},
		});
	} catch (err) {
		console.error("error while getting online users", err);
		return res.send({ status: 500 });
	}
};

export const getOnlineUsersCount: HttpHandler = async (res) => {
	try {
		const count = await Users.count();
		return res.send<GetOnlineUsersCount>({ status: 200, result: { count } });
	} catch (err) {
		console.error("err while getting online users", err);
		return res.send({ status: 500 });
	}
};
