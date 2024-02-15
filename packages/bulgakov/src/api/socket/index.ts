import {
	IncomingActions,
	IncomingWsMessage,
	MyWebSocket,
	OutgoingActions,
	OutgoingWsMessage,
} from "../../types/socket";
import { SOCKET_TOPICS } from "../../constants/socket";
import { socketHandlers } from "./handlers";
import uws from "uWebSockets.js";

const app = uws.App();

const _ws = app.ws("/*", {
	message(ws, message) {
		const parsedMessage: IncomingWsMessage<IncomingActions> = JSON.parse(
			new TextDecoder().decode(message)
		);

		const myWs: MyWebSocket = {
			...ws,
			sendJson: (msg: object) => ws.send(JSON.stringify(msg)),
			broadcastToRoom: <T extends OutgoingActions>(
				roomId: string,
				msg: OutgoingWsMessage<T>
			) => ws.publish(SOCKET_TOPICS.ROOM(roomId), JSON.stringify(msg)),
			broadcastToUser: <T extends OutgoingActions>(
				userId: string,
				msg: OutgoingWsMessage<T>
			) => ws.publish(SOCKET_TOPICS.USER(userId), JSON.stringify(msg)),
		};

		try {
			//@ts-expect-error payload actually matches action
			socketHandlers(myWs)[parsedMessage.action](parsedMessage.payload);
		} catch (err) {
			console.error("error while handling socket message", err);
		}
	},
	open: () => {
		console.log("opened");
	},
});

export const ws: uws.TemplatedApp & Pick<MyWebSocket, "broadcastToRoom" | "broadcastToUser"> = {
	..._ws,
	broadcastToRoom: (roomId, msg) => ws.publish(SOCKET_TOPICS.ROOM(roomId), JSON.stringify(msg)),
	broadcastToUser: (userId, msg) => ws.publish(SOCKET_TOPICS.USER(userId), JSON.stringify(msg)),
};
