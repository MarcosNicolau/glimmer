import { SOCKET_TOPICS } from "./../../constants/socket";
import { IncomingActions, IncomingWsMessage, MyWebSocket } from "../../types/socket";
import { socketHandlers } from "./handlers";
import uws from "uWebSockets.js";
import { authMiddleware } from "./middlewares";
import { User } from "../../types/user";

export const buildWsUtils = <T extends { publish: MyWebSocket["publish"] }>(
	ws: T
): T & Pick<MyWebSocket, "broadcastToRoom" | "broadcastToUser"> => ({
	...ws,
	broadcastToRoom: (roomId, msg) => ws.publish(SOCKET_TOPICS.ROOM(roomId), JSON.stringify(msg)),
	broadcastToUser: (userId, msg) => ws.publish(SOCKET_TOPICS.USER(userId), JSON.stringify(msg)),
});

export const wsBehaviour: uws.WebSocketBehavior<User> = {
	message(ws, message) {
		const parsedMessage: IncomingWsMessage<IncomingActions> = JSON.parse(
			new TextDecoder().decode(message)
		);
		const myWs: MyWebSocket = {
			...buildWsUtils(ws),
			sendJson: (msg: object) => ws.send(JSON.stringify(msg)),
		};

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
};
