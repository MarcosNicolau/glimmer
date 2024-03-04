import { GetTokenRes } from "@glimmer/bulgakov";
import { Token } from "../../../services";
import { generateRandomId } from "../../../utils/crypto";
import { HttpHandler } from "uWebSockets.js";

export const getToken: HttpHandler = async (res) => {
	const id = generateRandomId();
	const { token } = await Token.issue({ id });
	res.send<GetTokenRes>({ status: 200, result: { token } });
};
