import { SOCKET_TOPICS } from "./../../constants/socket";
import { socketHandlers } from "./handlers";
import * as uws from "uWebSockets.js";
import { authMiddleware } from "./middlewares";
import { User, IncomingActions, IncomingWsMessage } from "@glimmer/bulgakov";
import { buildSocket } from "../../utils/uws";
import { SocketData } from "apps/bulgakov/src/types/socket";
import { Users } from "apps/bulgakov/src/services/user";

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
		const user = ws.getUserData();
		ws.subscribe(SOCKET_TOPICS.USER(user.id));
		Users.createUser(user);
	},
	upgrade: async (res, req, context) => {
		const succeeded = await authMiddleware(req, res);
		if (!succeeded) return;
		const user: SocketData = res.user;
		res.upgrade<SocketData>(
			{ id: user.id },
			req.getHeader("sec-websocket-key"),
			req.getHeader("sec-websocket-protocol"),
			req.getHeader("sec-websocket-extensions"),
			context
		);
	},
	close(ws) {
		const { id } = ws.getUserData();
		ws.unsubscribe(SOCKET_TOPICS.USER(id));
		Users.removeUser(id);
	},
	sendPingsAutomatically: true,
};
