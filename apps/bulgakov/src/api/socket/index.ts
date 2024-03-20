import { SOCKET_TOPICS } from "./../../constants/socket";
import { socketHandlers } from "./handlers";
import * as uws from "uWebSockets.js";
import { authMiddleware } from "./middlewares";
import { User, IncomingActions, IncomingWsMessage } from "@glimmer/bulgakov";
import { buildSocket } from "../../utils/uws";
import { SocketData } from "../../types/socket";
import { Users } from "./../../services/user";
import { buildHttpHandler } from "@glimmer/http";

export const wsBehaviour = (
	app: uws.TemplatedApp
): uws.WebSocketBehavior<Required<Pick<User, "id">>> => ({
	async message(ws, message) {
		buildSocket(ws);
		const parsedMessage: IncomingWsMessage<IncomingActions> = JSON.parse(
			new TextDecoder().decode(message)
		);
		try {
			//@ts-expect-error payload actually matches action
			await socketHandlers(myWs, app)[parsedMessage.action](parsedMessage.payload);
		} catch (err) {
			console.error("error while handling socket message", parsedMessage, err);
			ws.sendJson({
				action: "error",
				payload: {
					message: "unexpected-error",
					description: `there's been an unexpected error while handling the action: ${parsedMessage.action}`,
				},
			});
		}
	},
	async open(ws) {
		const user = ws.getUserData();
		ws.subscribe(SOCKET_TOPICS.USER(user.id));
		console.log("new connection open id", user.id);
		await Users.create({ id: user.id });
	},
	upgrade: async (res, req, context) => {
		buildHttpHandler(res, req);
		const headers = [
			req.getHeader("sec-websocket-key"),
			req.getHeader("sec-websocket-protocol"),
			req.getHeader("sec-websocket-extensions"),
		];
		const succeeded = await authMiddleware(req, res);
		if (!succeeded) return;
		const user: SocketData = res.user;
		//@ts-expect-error complains about the spread, but it is legal
		res.cork(() => res.upgrade<SocketData>(user, ...headers, context));
	},
	async close(ws) {
		const { id } = ws.getUserData();
		console.log("closed connection id", id);
		await Users.remove(id);
	},
});
