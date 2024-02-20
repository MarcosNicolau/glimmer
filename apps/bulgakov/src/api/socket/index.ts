import { SOCKET_TOPICS } from "./../../constants/socket";
import { IncomingActions, IncomingWsMessage } from "../../types/socket";
import { socketHandlers } from "./handlers";
import * as uws from "uWebSockets.js";
import { authMiddleware } from "./middlewares";
import { User } from "../../types/user";
import { buildSocket } from "../../utils/uws";

export const wsBehaviour: uws.WebSocketBehavior<User> = {
	message(ws, message) {
		const myWs = buildSocket(ws);
		const parsedMessage: IncomingWsMessage<IncomingActions> = JSON.parse(
			new TextDecoder().decode(message)
		);
		try {
			//@ts-expect-error payload actually matches action
			socketHandlers(myWs)[parsedMessage.action](parsedMessage.payload);
		} catch (err) {
			console.error("error while handling socket message", err);
		}
	},
	open(ws) {
		ws.subscribe(SOCKET_TOPICS.USER(ws.getUserData().id));
	},
	upgrade: async (res, req, context) => {
		const succeeded = await authMiddleware(req, res);
		if (!succeeded) return;
		const user: User = res.user;
		res.upgrade<User>(
			{ id: user.id, name: user.name },
			req.getHeader("sec-websocket-key"),
			req.getHeader("sec-websocket-protocol"),
			req.getHeader("sec-websocket-extensions"),
			context
		);
	},
	close(ws) {
		ws.unsubscribe(SOCKET_TOPICS.USER(ws.getUserData().id));
	},
	sendPingsAutomatically: true,
};
