import { HttpRequest, HttpResponse } from "uWebSockets.js";
import { Token } from "../../services";
import { z } from "zod";

/**
 * @returns token payload
 */
export const authMiddleware = async (req: HttpRequest, res: HttpResponse): Promise<boolean> => {
	const authorization = req.getHeader("authorization");
	const sendUnauthorized = () => {
		res.writeStatus("401").write("invalid credentials");
		return false;
	};
	if (!authorization) return sendUnauthorized();
	const [token, type] = authorization.split(" ");
	if (type !== "Bearer") return sendUnauthorized();
	const { isValid, payload: decoded } = await Token.verify(token);
	if (!isValid) return sendUnauthorized();
	try {
		res.user = await z
			.object({
				id: z.string(),
			})
			.parseAsync(decoded);
		return true;
	} catch {
		return false;
	}
};
