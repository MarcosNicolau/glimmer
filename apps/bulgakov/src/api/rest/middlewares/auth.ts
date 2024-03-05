import { Token } from "apps/bulgakov/src/services";
import { HttpHandler } from "uWebSockets.js";
import { z } from "zod";

/**
 * @returns token payload
 */
export const auth: HttpHandler = async (res, req, next) => {
	const authorization = req.getHeader("authorization");

	const sendUnauthorized = () => {
		return res.send({ status: 401 });
	};

	const [type, token] = authorization.split(" ");
	if (type !== "Bearer" || !token) return sendUnauthorized();
	const { isValid, payload: decoded } = await Token.verify(token);
	if (!isValid) return sendUnauthorized();

	try {
		res.user = await z
			.object({
				id: z.string(),
			})
			.parseAsync(decoded);
		next();
	} catch (err) {
		return sendUnauthorized();
	}
};
