import { GetTokenReqBody, GetTokenRes } from "@glimmer/bulgakov";
import { Token } from "../../../services";
import { generateRandomId } from "../../../utils/crypto";
import { HttpHandler } from "uWebSockets.js";

export const getToken: HttpHandler = async (res, req) => {
	const body = await req.body<GetTokenReqBody>();
	if (!body.name) return res.send({ status: 400, message: "you must provide a name" });
	const id = generateRandomId();
	const { token } = await Token.issue({ name: body.name, id });
	res.send<GetTokenRes>({ status: 200, result: { token } });
};
