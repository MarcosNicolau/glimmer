import { HttpRequest, HttpResponse } from "uWebSockets.js";
import { Token } from "../../services";
import { z } from "zod";
import { JwtPayload } from "jsonwebtoken";

/**
 * @returns token payload
 */
export const authMiddleware = async (req: HttpRequest, res: HttpResponse): Promise<boolean> => {
	const authorization = req.getHeader("authorization");
	// Since the browser WebSocket implementation can't send other header than this one
	// We define our own protocol for passing the token
	const webSocketProtocol = req.getHeader("sec-websocket-protocol");
	const sendUnauthorized = () => {
		res.send({ status: 401 });
		return false;
	};
	let data: string | JwtPayload | undefined | null = null;
	let type: string = "";
	let token: string = "";

	if (!authorization) {
		const [_type, ..._token] =
			webSocketProtocol
				.split(",")
				.find((protocol) => protocol.includes("Bearer"))
				?.split("-") || [];
		type = _type;
		token = _token.join("-");
	} else {
		const [_type, _token] = authorization.split(" ");
		type = _type;
		token = _token;
	}
	if (type !== "Bearer" || !token) return sendUnauthorized();
	const { isValid, payload: decoded } = await Token.verify(token);
	if (!isValid) return sendUnauthorized();
	data = decoded;

	try {
		res.user = await z
			.object({
				id: z.string(),
			})
			.parseAsync(data);
		return true;
	} catch (err) {
		return sendUnauthorized();
	}
};
