import { WebSocket, WebSocketBehavior } from "uWebSockets.js";
import {
	IncomingActions,
	IncomingActionsPayload,
	IncomingWsMessage,
	OutgoingActions,
	OutgoingWsMessage,
} from "./types/socket";
import { RoomsManager } from "./services/room";
import { TokenManager } from "./services/token";
import { SOCKET_TOPICS } from "./constants/socket";

export const auth = () => {};

export const socketBehav: WebSocketBehavior<unknown> = {
	message(ws, message) {
		const parsedMessage: IncomingWsMessage<any> = JSON.parse(new TextDecoder().decode(message));
		handleSocketMessage(parsedMessage, ws);
	},
	open: () => {
		console.log("opened");
	},
};

const send = <T extends OutgoingActions>(msg: OutgoingWsMessage<T>, ws: WebSocket<unknown>) => {
	ws.send(JSON.stringify(msg));
};

const broadcastToRoom = <T extends OutgoingActions>(
	msg: OutgoingWsMessage<T>,
	roomId: string,
	ws: WebSocket<unknown>
) => {
	ws.publish(`room/${roomId}`, JSON.stringify(msg));
};

const handleSocketMessage = <T extends IncomingActions>(
	message: IncomingWsMessage<T>,
	ws: WebSocket<unknown>
) => {
	const { action, payload } = message;
	const roomsManager = RoomsManager(ws);

	const handlers: { [key in IncomingActions]: (payload: IncomingActionsPayload[key]) => void } = {
		"@room:create": (payload) => roomsManager.createRoom(payload),
		"@room:join": async ({ roomId, user }) => {
			const id = crypto.randomUUID();
			const { token } = await TokenManager().issue({ id });
			const users = roomsManager.joinRoom();
			// Sent when getting message from rabbit
			send(
				{
					action: "@room:you-joined",
					payload: {
						token,
						room: { id: roomId, users },
						recvTransport,
						rtpCapabilities,
						sendTransport,
						consumers,
					},
				},
				ws
			);
			ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
			broadcastToRoom(
				{
					action: "@room:new-user",
					payload: {
						user: {
							id,
							name: user.name,
							role: "listener",
							isDeafened: false,
							isMuted: false,
						},
					},
				},
				roomId,
				ws
			);
		},
	};
	handlers[action](payload);
};
