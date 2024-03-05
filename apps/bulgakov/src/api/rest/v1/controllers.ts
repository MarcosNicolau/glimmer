import { GetTokenRes } from "@glimmer/bulgakov";
import { Token, Users } from "../../../services";
import { generateRandomId } from "../../../utils/crypto";
import { HttpHandler } from "uWebSockets.js";
import { REDIS } from "../../../constants";
export const getToken: HttpHandler = async (res) => {
	const id = generateRandomId();
	const { token } = await Token.issue({ id });
	res.send<GetTokenRes>({ status: 200, result: { token } });
};

export const getUser: HttpHandler = async (res, req) => {
	const { id } = req.user;

	try {
		const user = await Users.get(REDIS.JSON_PATHS.user(id), [
			"description",
			"name",
			"image",
			"links",
		]);
		if (!user) return res.send({ status: 404, message: "user not found" });
		return res.send({ status: 200, result: { user } });
	} catch (err) {
		console.error("error while getting user", err);
		return res.send({ status: 500 });
	}
};
